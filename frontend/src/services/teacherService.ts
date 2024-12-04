import api from './api';
import { TeacherDTO } from '../types/teacher.types';

const BASE_URL = '/teachers';

export const teacherService = {
    getAll: async (page = 0, size = 10) => {
        const response = await api.get(`${BASE_URL}?page=${page}&size=${size}`);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    getByEmployeeId: async (employeeId: string) => {
        const response = await api.get(`${BASE_URL}/employee-id/${employeeId}`);
        return response.data;
    },

    create: async (teacher: TeacherDTO) => {
        const response = await api.post(BASE_URL, teacher);
        return response.data;
    },

    update: async (id: number, teacher: TeacherDTO) => {
        const response = await api.put(`${BASE_URL}/${id}`, teacher);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    uploadPhoto: async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('photo', file);
        const response = await api.post(`${BASE_URL}/${id}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getTeachersBySubject: async (subjectId: number) => {
        const response = await api.get(`${BASE_URL}/by-subject/${subjectId}`);
        return response.data;
    },

    getTeachersByClass: async (classId: number) => {
        const response = await api.get(`${BASE_URL}/by-class/${classId}`);
        return response.data;
    },

    exportToExcel: async (filters?: any) => {
        const response = await api.get(`${BASE_URL}/export`, {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }
};
