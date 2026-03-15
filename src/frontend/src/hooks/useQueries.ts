import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Announcement,
  AttendanceRecord,
  Class,
  ClassAssignment,
  Student,
  Subject,
  Teacher,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAllClasses() {
  const { actor, isFetching } = useActor();
  return useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: async () => (actor ? actor.getAllClasses() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useAllStudents() {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => (actor ? actor.getAllStudents() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useStudentsByClass(classId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ["students", classId?.toString()],
    queryFn: async () =>
      actor && classId !== null ? actor.getStudentsByClass(classId) : [],
    enabled: !!actor && !isFetching && classId !== null,
  });
}

export function useAllTeachers() {
  const { actor, isFetching } = useActor();
  return useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => (actor ? actor.getAllTeachers() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useAllSubjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => (actor ? actor.getAllSubjects() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useAllAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => (actor ? actor.getAllAnnouncements() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useAttendanceRecords(studentId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<AttendanceRecord[]>({
    queryKey: ["attendance", studentId?.toString()],
    queryFn: async () =>
      actor && studentId !== null ? actor.getAttendanceRecords(studentId) : [],
    enabled: !!actor && !isFetching && studentId !== null,
  });
}

// Mutations
export function useCreateAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { title: string; content: string; date: string }) =>
      actor!.createAnnouncement(v.title, v.content, v.date),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: {
      id: bigint;
      title: string;
      content: string;
      date: string;
    }) => actor!.updateAnnouncement(v.id, v.title, v.content, v.date),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteAnnouncement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useCreateClass() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => actor!.createClass(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classes"] }),
  });
}

export function useDeleteClass() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteClass(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classes"] }),
  });
}

export function useCreateStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { name: string; classId: bigint; section: string }) =>
      actor!.createStudent(v.name, v.classId, v.section),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useDeleteStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useCreateTeacher() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: {
      name: string;
      subject: string;
      classAssignments: ClassAssignment[];
      periodStart: string;
      periodEnd: string;
    }) =>
      actor!.createTeacher(
        v.name,
        v.subject,
        v.classAssignments,
        v.periodStart,
        v.periodEnd,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useUpdateTeacher() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: {
      id: bigint;
      name: string;
      subject: string;
      classAssignments: ClassAssignment[];
      periodStart: string;
      periodEnd: string;
    }) =>
      actor!.updateTeacher(
        v.id,
        v.name,
        v.subject,
        v.classAssignments,
        v.periodStart,
        v.periodEnd,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useDeleteTeacher() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteTeacher(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useCreateSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { name: string; classId: bigint }) =>
      actor!.createSubject(v.name, v.classId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });
}

export function useDeleteSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteSubject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });
}

export function useMarkAttendance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: {
      studentId: bigint;
      date: string;
      present: boolean;
    }) => actor!.markAttendance(v.studentId, v.date, v.present),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({
        queryKey: ["attendance", vars.studentId.toString()],
      }),
  });
}
