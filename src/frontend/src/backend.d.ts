import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Class {
    id: bigint;
    name: string;
}
export interface Announcement {
    id: bigint;
    title: string;
    content: string;
    date: string;
}
export interface ClassAssignment {
    section: string;
    classId: bigint;
}
export interface AttendanceRecord {
    studentId: bigint;
    present: boolean;
    date: string;
}
export interface Teacher {
    id: bigint;
    subject: string;
    name: string;
    periodEnd: string;
    classAssignments: Array<ClassAssignment>;
    periodStart: string;
}
export interface Subject {
    id: bigint;
    name: string;
    classId: bigint;
}
export interface Student {
    id: bigint;
    name: string;
    section: string;
    classId: bigint;
}
export interface backendInterface {
    createAnnouncement(title: string, content: string, date: string): Promise<Announcement>;
    createClass(name: string): Promise<Class>;
    createStudent(name: string, classId: bigint, section: string): Promise<Student>;
    createSubject(name: string, classId: bigint): Promise<Subject>;
    createTeacher(name: string, subject: string, classAssignments: Array<ClassAssignment>, periodStart: string, periodEnd: string): Promise<Teacher>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteClass(id: bigint): Promise<void>;
    deleteStudent(id: bigint): Promise<void>;
    deleteSubject(id: bigint): Promise<void>;
    deleteTeacher(id: bigint): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllClasses(): Promise<Array<Class>>;
    getAllStudents(): Promise<Array<Student>>;
    getAllSubjects(): Promise<Array<Subject>>;
    getAllTeachers(): Promise<Array<Teacher>>;
    getAnnouncement(id: bigint): Promise<Announcement | null>;
    getAttendanceRecords(studentId: bigint): Promise<Array<AttendanceRecord>>;
    getClass(id: bigint): Promise<Class | null>;
    getStudent(id: bigint): Promise<Student | null>;
    getStudentsByClass(classId: bigint): Promise<Array<Student>>;
    getSubject(id: bigint): Promise<Subject | null>;
    getSubjectsByClass(classId: bigint): Promise<Array<Subject>>;
    getTeacher(id: bigint): Promise<Teacher | null>;
    markAttendance(studentId: bigint, date: string, present: boolean): Promise<void>;
    updateAnnouncement(id: bigint, title: string, content: string, date: string): Promise<void>;
    updateClass(id: bigint, name: string): Promise<void>;
    updateStudent(id: bigint, name: string, classId: bigint, section: string): Promise<void>;
    updateSubject(id: bigint, name: string, classId: bigint): Promise<void>;
    updateTeacher(id: bigint, name: string, subject: string, classAssignments: Array<ClassAssignment>, periodStart: string, periodEnd: string): Promise<void>;
}
