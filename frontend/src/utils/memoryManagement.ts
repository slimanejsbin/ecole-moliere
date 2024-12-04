// Gestionnaire de mémoire pour les ressources
class MemoryManager {
    private static instance: MemoryManager;
    private disposables: Set<() => void>;
    private gcTimeout: NodeJS.Timeout | null;
    private readonly GC_INTERVAL = 60000; // 1 minute

    private constructor() {
        this.disposables = new Set();
        this.gcTimeout = null;
        this.startGCCycle();
    }

    public static getInstance(): MemoryManager {
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
        }
        return MemoryManager.instance;
    }

    private startGCCycle() {
        this.gcTimeout = setInterval(() => {
            this.runGarbageCollection();
        }, this.GC_INTERVAL);
    }

    private runGarbageCollection() {
        console.log('Running memory cleanup...');
        this.disposables.forEach(dispose => {
            try {
                dispose();
            } catch (error) {
                console.error('Error during resource cleanup:', error);
            }
        });
        this.disposables.clear();
    }

    public registerDisposable(dispose: () => void) {
        this.disposables.add(dispose);
    }

    public unregisterDisposable(dispose: () => void) {
        this.disposables.delete(dispose);
    }

    public dispose() {
        if (this.gcTimeout) {
            clearInterval(this.gcTimeout);
        }
        this.runGarbageCollection();
    }
}

// Gestionnaire de ressources
export class ResourceManager {
    private static imageCache: Map<string, HTMLImageElement> = new Map();
    private static audioCache: Map<string, HTMLAudioElement> = new Map();
    private static MAX_CACHE_SIZE = 100;

    public static preloadImage(src: string): Promise<HTMLImageElement> {
        if (this.imageCache.has(src)) {
            return Promise.resolve(this.imageCache.get(src)!);
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.addToImageCache(src, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    private static addToImageCache(src: string, img: HTMLImageElement) {
        if (this.imageCache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.imageCache.keys().next().value;
            this.imageCache.delete(firstKey);
        }
        this.imageCache.set(src, img);
    }

    public static clearImageCache() {
        this.imageCache.clear();
    }

    public static releaseImage(src: string) {
        this.imageCache.delete(src);
    }
}

// Utilitaire de surveillance de la mémoire
export const MemoryMonitor = {
    start() {
        if ('performance' in window && 'memory' in performance) {
            setInterval(() => {
                const memory = (performance as any).memory;
                console.log('Memory Usage:', {
                    usedJSHeapSize: this.formatBytes(memory.usedJSHeapSize),
                    totalJSHeapSize: this.formatBytes(memory.totalJSHeapSize),
                    jsHeapSizeLimit: this.formatBytes(memory.jsHeapSizeLimit)
                });
            }, 30000);
        }
    },

    formatBytes(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB'];
        let value = bytes;
        let unitIndex = 0;

        while (value >= 1024 && unitIndex < units.length - 1) {
            value /= 1024;
            unitIndex++;
        }

        return `${value.toFixed(2)} ${units[unitIndex]}`;
    }
};

// Hook pour la gestion automatique des ressources
export const useResourceCleanup = (cleanup: () => void) => {
    const memoryManager = MemoryManager.getInstance();

    React.useEffect(() => {
        memoryManager.registerDisposable(cleanup);
        return () => {
            memoryManager.unregisterDisposable(cleanup);
            cleanup();
        };
    }, [cleanup]);
};
