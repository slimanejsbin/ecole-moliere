import api from './api';
import { ClassDTO, ClassSummary } from '../types/class.types';

const BASE_URL = '/classes';

export const classService = {
    getAll: async (page = 0, size = 10) => {
        const response = await api.get(`${BASE_URL}?page=${page}&size=${size}`);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (classData: ClassDTO) => {
        const response = await api.post(BASE_URL, classData);
        return response.data;
    },

    update: async (id: number, classData: ClassDTO) => {
        const response = await api.put(`${BASE_URL}/${id}`, classData);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    getClassSummary: async (id: number) => {
        const response = await api.get<ClassSummary>(`${BASE_URL}/${id}/summary`);
        return response.data;
    },

    getClassesByTeacher: async (teacherId: number) => {
        const response = await api.get(`${BASE_URL}/by-teacher/${teacherId}`);
        return response.data;
    },

    getClassesByGrade: async (grade: string) => {
        const response = await api.get(`${BASE_URL}/by-grade/${grade}`);
        return response.data;
    },

    assignTeacher: async (classId: number, teacherId: number) => {
        const response = await api.post(`${BASE_URL}/${classId}/teacher/${teacherId}`);
        return response.data;
    },

    assignSubject: async (classId: number, subjectId: number) => {
        const response = await api.post(`${BASE_URL}/${classId}/subject/${subjectId}`);
        return response.data;
    },

    removeSubject: async (classId: number, subjectId: number) => {
        await api.delete(`${BASE_URL}/${classId}/subject/${subjectId}`);
    },

    exportToExcel: async (filters?: any) => {
        const response = await api.get(`${BASE_URL}/export`, {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }
};
