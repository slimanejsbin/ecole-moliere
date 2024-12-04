export interface Teacher {
    id: number;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
    dateOfJoining: Date;
    isActive: boolean;
    isClassTeacher: boolean;
    assignedClassId?: number;
    photoUrl?: string;
    subjects: Subject[];
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TeacherDTO {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
    dateOfJoining: Date;
    isActive?: boolean;
    isClassTeacher: boolean;
    assignedClassId?: number;
    subjects: Subject[];
    address?: string;
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    description?: string;
}

export interface TeacherSubjectsResponse {
    teacherId: number;
    subjects: Subject[];
}

export interface TeacherClassesResponse {
    teacherId: number;
    classes: Class[];
}

export interface Class {
    id: number;
    name: string;
    grade: string;
    section: string;
    academicYear: string;
}
