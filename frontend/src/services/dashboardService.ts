import axios from 'axios';
import { API_BASE_URL } from '../config';

const DASHBOARD_API = `${API_BASE_URL}/api/dashboard`;

export const dashboardService = {
    getStats: async () => {
        const response = await axios.get(`${DASHBOARD_API}/stats`);
        return response.data;
    },

    getGradeDistribution: async () => {
        const response = await axios.get(`${DASHBOARD_API}/grades/distribution`);
        return response.data;
    },

    getAttendanceStats: async () => {
        const response = await axios.get(`${DASHBOARD_API}/attendance/stats`);
        return response.data;
    },

    getTeacherWorkload: async () => {
        const response = await axios.get(`${DASHBOARD_API}/teachers/workload`);
        return response.data;
    },

    getRecentActivities: async () => {
        const response = await axios.get(`${DASHBOARD_API}/activities/recent`);
        return response.data;
    }
};

export default dashboardService;
