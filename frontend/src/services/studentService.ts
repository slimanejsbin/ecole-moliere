import api from './api';
import { StudentDTO } from '../types/student.types';

const BASE_URL = '/students';

export const studentService = {
    getAll: async (page = 0, size = 10) => {
        const response = await api.get(`${BASE_URL}?page=${page}&size=${size}`);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    getByStudentId: async (studentId: string) => {
        const response = await api.get(`${BASE_URL}/student-id/${studentId}`);
        return response.data;
    },

    create: async (student: StudentDTO) => {
        const response = await api.post(BASE_URL, student);
        return response.data;
    },

    update: async (id: number, student: StudentDTO) => {
        const response = await api.put(`${BASE_URL}/${id}`, student);
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

    exportToExcel: async (filters?: any) => {
        const response = await api.get(`${BASE_URL}/export`, {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }
};
