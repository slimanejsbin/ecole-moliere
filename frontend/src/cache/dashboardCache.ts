import { dashboardService } from '../services/dashboardService';

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

class DashboardCache {
    private static instance: DashboardCache;
    private cache: Map<string, CacheItem<any>>;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    private constructor() {
        this.cache = new Map();
    }

    public static getInstance(): DashboardCache {
        if (!DashboardCache.instance) {
            DashboardCache.instance = new DashboardCache();
        }
        return DashboardCache.instance;
    }

    private isExpired(timestamp: number): boolean {
        return Date.now() - timestamp > this.CACHE_DURATION;
    }

    private async fetchAndCache<T>(
        key: string,
        fetchFn: () => Promise<T>
    ): Promise<T> {
        try {
            const data = await fetchFn();
            this.cache.set(key, {
                data,
                timestamp: Date.now(),
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public async getData<T>(
        key: string,
        fetchFn: () => Promise<T>
    ): Promise<T> {
        const cachedItem = this.cache.get(key);

        if (cachedItem && !this.isExpired(cachedItem.timestamp)) {
            return cachedItem.data;
        }

        return this.fetchAndCache(key, fetchFn);
    }

    public clearCache(): void {
        this.cache.clear();
    }

    public invalidateKey(key: string): void {
        this.cache.delete(key);
    }
}

// Export des méthodes de cache pour le dashboard
export const dashboardCache = {
    async getStats() {
        return DashboardCache.getInstance().getData(
            'dashboard_stats',
            () => dashboardService.getStats()
        );
    },

    async getGradeDistribution() {
        return DashboardCache.getInstance().getData(
            'grade_distribution',
            () => dashboardService.getGradeDistribution()
        );
    },

    async getAttendanceStats() {
        return DashboardCache.getInstance().getData(
            'attendance_stats',
            () => dashboardService.getAttendanceStats()
        );
    },

    async getTeacherWorkload() {
        return DashboardCache.getInstance().getData(
            'teacher_workload',
            () => dashboardService.getTeacherWorkload()
        );
    },

    async getRecentActivities() {
        return DashboardCache.getInstance().getData(
            'recent_activities',
            () => dashboardService.getRecentActivities()
        );
    },

    clearCache() {
        DashboardCache.getInstance().clearCache();
    },

    invalidateStats() {
        DashboardCache.getInstance().invalidateKey('dashboard_stats');
    },
};
