import { useState, useEffect } from 'react';

interface ImageOptimizationOptions {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: 'webp' | 'jpeg' | 'png';
}

export const useImageOptimization = (
    file: File | null,
    options: ImageOptimizationOptions = {}
) => {
    const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        quality = 0.8,
        maxWidth = 800,
        maxHeight = 800,
        format = 'webp'
    } = options;

    useEffect(() => {
        const optimizeImage = async () => {
            if (!file) {
                setOptimizedImage(null);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Create image element
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);

                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = objectUrl;
                });

                // Calculate new dimensions
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                // Create canvas for resizing
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                // Draw and resize image
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Failed to get canvas context');

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to desired format
                const optimized = canvas.toDataURL(`image/${format}`, quality);
                setOptimizedImage(optimized);

                // Cleanup
                URL.revokeObjectURL(objectUrl);
            } catch (err) {
                setError('Failed to optimize image');
                console.error('Image optimization error:', err);
            } finally {
                setLoading(false);
            }
        };

        optimizeImage();
    }, [file, quality, maxWidth, maxHeight, format]);

    return { optimizedImage, loading, error };
};

// Utility function to convert base64 to Blob
export const base64toBlob = (base64: string): Blob => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
};
