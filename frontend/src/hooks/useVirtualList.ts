import { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualListOptions {
    itemHeight: number;
    overscan?: number;
    containerHeight: number;
}

export const useVirtualList = <T>(
    items: T[],
    options: VirtualListOptions
) => {
    const { itemHeight, overscan = 3, containerHeight } = options;
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalHeight = items.length * itemHeight;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalVisibleCount = visibleCount + 2 * overscan;

    const visibleRange = useMemo(() => {
        const start = Math.floor(scrollTop / itemHeight) - overscan;
        const end = start + totalVisibleCount;

        return {
            start: Math.max(0, start),
            end: Math.min(items.length, end)
        };
    }, [scrollTop, itemHeight, totalVisibleCount, items.length]);

    const visibleItems = useMemo(() => {
        return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
            item,
            index: visibleRange.start + index
        }));
    }, [items, visibleRange]);

    const offsetY = visibleRange.start * itemHeight;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setScrollTop(container.scrollTop);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return {
        containerProps: {
            ref: containerRef,
            style: {
                height: containerHeight,
                overflow: 'auto',
                position: 'relative' as const
            }
        },
        wrapperProps: {
            style: {
                height: totalHeight,
                position: 'relative' as const
            }
        },
        getItemProps: (index: number) => ({
            style: {
                height: itemHeight,
                position: 'absolute' as const,
                top: index * itemHeight,
                width: '100%'
            }
        }),
        visibleItems,
        scrollTo: (index: number) => {
            if (containerRef.current) {
                containerRef.current.scrollTop = index * itemHeight;
            }
        }
    };
};
