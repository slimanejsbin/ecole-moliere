export interface Subject {
    id: number;
    name: string;
    code: string;
    description?: string;
    credits: number;
    grade: string;
    teacherId?: number;
    isCore: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SubjectDTO {
    name: string;
    code: string;
    description?: string;
    credits: number;
    grade: string;
    teacherId?: number;
    isCore: boolean;
    isActive?: boolean;
}

export interface SubjectSummary {
    totalStudents: number;
    averageScore: number;
    assignments: number;
    teacherName: string;
}
