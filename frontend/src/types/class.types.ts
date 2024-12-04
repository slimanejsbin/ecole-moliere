export interface Class {
    id: number;
    name: string;
    grade: string;
    section: string;
    academicYear: string;
    capacity: number;
    teacherId?: number;
    subjects: Subject[];
    students: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClassDTO {
    name: string;
    grade: string;
    section: string;
    academicYear: string;
    capacity: number;
    teacherId?: number;
    subjects: number[];
    isActive?: boolean;
}

export interface ClassSummary {
    totalStudents: number;
    averageAttendance: number;
    subjects: number;
    assignments: number;
}
