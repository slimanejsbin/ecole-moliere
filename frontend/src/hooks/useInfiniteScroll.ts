import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '../utils/performance';

interface UseInfiniteScrollOptions {
    threshold?: number;
    debounceMs?: number;
    enabled?: boolean;
}

interface UseInfiniteScrollReturn {
    loading: boolean;
    error: Error | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    containerRef: React.RefObject<HTMLElement>;
}

export const useInfiniteScroll = <T>(
    fetchItems: (page: number) => Promise<{ items: T[]; hasMore: boolean }>,
    options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
    const {
        threshold = 100,
        debounceMs = 100,
        enabled = true
    } = options;

    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef<HTMLElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            setError(null);
            const { items: newItems, hasMore: more } = await fetchItems(page);
            
            setItems(prev => [...prev, ...newItems]);
            setHasMore(more);
            setPage(prev => prev + 1);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load items'));
        } finally {
            setLoading(false);
        }
    }, [fetchItems, page, loading, hasMore]);

    const debouncedLoadMore = debounce(loadMore, debounceMs);

    const handleScroll = useCallback(() => {
        if (!containerRef.current || loading || !hasMore || !enabled) return;

        const container = containerRef.current;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < threshold) {
            debouncedLoadMore();
        }
    }, [loading, hasMore, enabled, threshold, debouncedLoadMore]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;

        // Configuration de l'Intersection Observer
        observer.current = new IntersectionObserver(
            entries => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: `${threshold}px`,
                threshold: 0.1
            }
        );

        // Ajout d'un élément sentinel
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        container.appendChild(sentinel);
        observer.current.observe(sentinel);

        // Nettoyage
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
            container.removeChild(sentinel);
        };
    }, [enabled, hasMore, loading, threshold, loadMore]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [enabled, handleScroll]);

    return {
        loading,
        error,
        hasMore,
        loadMore,
        containerRef
    };
};
