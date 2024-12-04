import localforage from 'localforage';

interface CacheConfig {
    name: string;
    version: number;
    maxAge?: number;
    maxItems?: number;
}

class CacheService {
    private store: LocalForage;
    private maxAge: number;
    private maxItems: number;
    private memoryCache: Map<string, any>;
    private keysQueue: string[];

    constructor(config: CacheConfig) {
        this.store = localforage.createInstance({
            name: config.name,
            version: config.version,
            storeName: 'cache',
            description: 'Application cache storage'
        });

        this.maxAge = config.maxAge || 30 * 60 * 1000; // 30 minutes par défaut
        this.maxItems = config.maxItems || 100;
        this.memoryCache = new Map();
        this.keysQueue = [];

        // Nettoyage périodique
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    async set(key: string, value: any, customMaxAge?: number): Promise<void> {
        const timestamp = Date.now();
        const cacheItem = {
            value,
            timestamp,
            maxAge: customMaxAge || this.maxAge
        };

        // Mise à jour du cache mémoire
        this.memoryCache.set(key, cacheItem);
        this.keysQueue.push(key);

        // Gestion de la limite d'items
        if (this.keysQueue.length > this.maxItems) {
            const oldestKey = this.keysQueue.shift();
            if (oldestKey) {
                this.memoryCache.delete(oldestKey);
                await this.store.removeItem(oldestKey);
            }
        }

        // Persistance dans IndexedDB
        try {
            await this.store.setItem(key, cacheItem);
        } catch (error) {
            console.error('Cache persistence error:', error);
            // En cas d'erreur, on garde quand même en mémoire
        }
    }

    async get<T>(key: string): Promise<T | null> {
        // Vérification du cache mémoire d'abord
        const memoryItem = this.memoryCache.get(key);
        if (memoryItem) {
            if (!this.isExpired(memoryItem)) {
                return memoryItem.value as T;
            }
            this.memoryCache.delete(key);
        }

        // Si pas en mémoire ou expiré, vérifier le stockage persistant
        try {
            const item = await this.store.getItem<{
                value: T;
                timestamp: number;
                maxAge: number;
            }>(key);

            if (item && !this.isExpired(item)) {
                // Mise en cache mémoire pour les prochains accès
                this.memoryCache.set(key, item);
                return item.value;
            }

            // Si expiré, nettoyer
            if (item) {
                await this.remove(key);
            }
        } catch (error) {
            console.error('Cache retrieval error:', error);
        }

        return null;
    }

    async remove(key: string): Promise<void> {
        this.memoryCache.delete(key);
        this.keysQueue = this.keysQueue.filter(k => k !== key);
        await this.store.removeItem(key);
    }

    async clear(): Promise<void> {
        this.memoryCache.clear();
        this.keysQueue = [];
        await this.store.clear();
    }

    private isExpired(item: { timestamp: number; maxAge: number }): boolean {
        return Date.now() - item.timestamp > item.maxAge;
    }

    private async cleanup(): Promise<void> {
        const keys = await this.store.keys();
        
        for (const key of keys) {
            const item = await this.store.getItem(key);
            if (item && this.isExpired(item)) {
                await this.remove(key);
            }
        }

        // Nettoyage du cache mémoire
        for (const [key, item] of this.memoryCache.entries()) {
            if (this.isExpired(item)) {
                this.memoryCache.delete(key);
                this.keysQueue = this.keysQueue.filter(k => k !== key);
            }
        }
    }

    // Méthodes utilitaires pour la gestion du cache
    async getCacheSize(): Promise<number> {
        const keys = await this.store.keys();
        return keys.length;
    }

    async getCacheStats(): Promise<{
        memoryItems: number;
        persistentItems: number;
        oldestItem: Date | null;
        newestItem: Date | null;
    }> {
        const keys = await this.store.keys();
        let oldestTimestamp = Date.now();
        let newestTimestamp = 0;

        for (const key of keys) {
            const item = await this.store.getItem<{ timestamp: number }>(key);
            if (item) {
                oldestTimestamp = Math.min(oldestTimestamp, item.timestamp);
                newestTimestamp = Math.max(newestTimestamp, item.timestamp);
            }
        }

        return {
            memoryItems: this.memoryCache.size,
            persistentItems: keys.length,
            oldestItem: keys.length > 0 ? new Date(oldestTimestamp) : null,
            newestItem: keys.length > 0 ? new Date(newestTimestamp) : null
        };
    }
}

// Export d'une instance configurée
export const appCache = new CacheService({
    name: 'ecole-moliere-cache',
    version: 1,
    maxAge: 30 * 60 * 1000, // 30 minutes
    maxItems: 1000
});
