import { useEffect, useState } from 'react';

interface PreloadConfig {
    images?: string[];
    fonts?: string[];
    scripts?: string[];
    styles?: string[];
}

export const usePreloadResources = (config: PreloadConfig) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const preloadResources = async () => {
            try {
                const tasks: Promise<void>[] = [];

                // Préchargement des images
                if (config.images) {
                    const imagePromises = config.images.map(src => {
                        return new Promise<void>((resolve, reject) => {
                            const img = new Image();
                            img.onload = () => resolve();
                            img.onerror = () => reject(`Failed to load image: ${src}`);
                            img.src = src;
                        });
                    });
                    tasks.push(...imagePromises);
                }

                // Préchargement des polices
                if (config.fonts) {
                    const fontPromises = config.fonts.map(async fontFamily => {
                        try {
                            // @ts-ignore
                            await document.fonts.load(`1em ${fontFamily}`);
                        } catch (err) {
                            console.warn(`Failed to preload font: ${fontFamily}`);
                        }
                    });
                    tasks.push(...fontPromises);
                }

                // Préchargement des scripts
                if (config.scripts) {
                    const scriptPromises = config.scripts.map(src => {
                        return new Promise<void>((resolve, reject) => {
                            const script = document.createElement('script');
                            script.src = src;
                            script.async = true;
                            script.onload = () => resolve();
                            script.onerror = () => reject(`Failed to load script: ${src}`);
                            document.head.appendChild(script);
                        });
                    });
                    tasks.push(...scriptPromises);
                }

                // Préchargement des styles
                if (config.styles) {
                    const stylePromises = config.styles.map(href => {
                        return new Promise<void>((resolve, reject) => {
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = href;
                            link.onload = () => resolve();
                            link.onerror = () => reject(`Failed to load stylesheet: ${href}`);
                            document.head.appendChild(link);
                        });
                    });
                    tasks.push(...stylePromises);
                }

                await Promise.all(tasks);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to preload resources');
                setLoading(false);
            }
        };

        preloadResources();
    }, [config]);

    return { loading, error };
};
