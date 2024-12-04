import api from './api';
import { SubjectDTO, SubjectSummary } from '../types/subject.types';

const BASE_URL = '/subjects';

export const subjectService = {
    getAll: async (page = 0, size = 10) => {
        const response = await api.get(`${BASE_URL}?page=${page}&size=${size}`);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (subject: SubjectDTO) => {
        const response = await api.post(BASE_URL, subject);
        return response.data;
    },

    update: async (id: number, subject: SubjectDTO) => {
        const response = await api.put(`${BASE_URL}/${id}`, subject);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    getSubjectSummary: async (id: number) => {
        const response = await api.get<SubjectSummary>(`${BASE_URL}/${id}/summary`);
        return response.data;
    },

    getSubjectsByTeacher: async (teacherId: number) => {
        const response = await api.get(`${BASE_URL}/by-teacher/${teacherId}`);
        return response.data;
    },

    getSubjectsByClass: async (classId: number) => {
        const response = await api.get(`${BASE_URL}/by-class/${classId}`);
        return response.data;
    },

    getSubjectsByGrade: async (grade: string) => {
        const response = await api.get(`${BASE_URL}/by-grade/${grade}`);
        return response.data;
    },

    assignTeacher: async (subjectId: number, teacherId: number) => {
        const response = await api.post(`${BASE_URL}/${subjectId}/teacher/${teacherId}`);
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
