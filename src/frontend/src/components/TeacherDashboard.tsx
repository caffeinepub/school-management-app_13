import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  LogOut,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Student } from "../backend.d";
import {
  useAllClasses,
  useAllTeachers,
  useAttendanceRecords,
  useCreateStudent,
  useDeleteStudent,
  useMarkAttendance,
  useStudentsByClass,
} from "../hooks/useQueries";

interface Props {
  onLogout: () => void;
  classId: number;
}

function AttendanceRow({
  student,
  date,
  index,
}: {
  student: Student;
  date: string;
  index: number;
}) {
  const { data: records = [] } = useAttendanceRecords(student.id);
  const markAttendance = useMarkAttendance();

  const todayRecord = records.find((r) => r.date === date);
  const isPresent = todayRecord?.present;
  const isMarked = todayRecord !== undefined;

  async function mark(present: boolean) {
    try {
      await markAttendance.mutateAsync({
        studentId: student.id,
        date,
        present,
      });
      toast.success(
        `${student.name} marked as ${present ? "Present" : "Absent"}`,
      );
    } catch {
      toast.error("Failed to mark attendance");
    }
  }

  return (
    <TableRow data-ocid={`attendance.item.${index + 1}`}>
      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>
        {isMarked ? (
          <Badge
            variant={isPresent ? "default" : "destructive"}
            className={isPresent ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isPresent ? "Present" : "Absent"}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Not marked
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isPresent === true ? "default" : "outline"}
            className={`gap-1.5 h-8 ${
              isPresent === true
                ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                : "hover:border-green-500 hover:text-green-600"
            }`}
            onClick={() => mark(true)}
            disabled={markAttendance.isPending}
            data-ocid={`attendance.present_button.${index + 1}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Present
          </Button>
          <Button
            size="sm"
            variant={isPresent === false ? "destructive" : "outline"}
            className={`gap-1.5 h-8 ${
              isPresent === false
                ? ""
                : "hover:border-red-500 hover:text-red-600"
            }`}
            onClick={() => mark(false)}
            disabled={markAttendance.isPending}
            data-ocid={`attendance.absent_button.${index + 1}`}
          >
            <XCircle className="w-3.5 h-3.5" /> Absent
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function TeacherDashboard({ onLogout, classId }: Props) {
  const { data: classes = [] } = useAllClasses();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  // Student add state
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState<string>("");
  const [studentSection, setStudentSection] = useState("");
  const createStudent = useCreateStudent();
  const deleteStudent = useDeleteStudent();
  const { data: allTeachers = [] } = useAllTeachers();
  const myTeacher = allTeachers.find((t) =>
    t.classAssignments.some((ca) => Number(ca.classId) === classId),
  );

  useEffect(() => {
    if (classes.length > 0 && selectedClass === "") {
      const matched = classes.find(
        (c) =>
          c.name.includes(classId.toString()) ||
          c.id.toString() === classId.toString(),
      );
      if (matched) {
        setSelectedClass(matched.id.toString());
        setStudentClass(matched.id.toString());
      }
    }
  }, [classes, classId, selectedClass]);

  const selectedClassBigInt = selectedClass ? BigInt(selectedClass) : null;
  const { data: students = [], isLoading } =
    useStudentsByClass(selectedClassBigInt);

  const studentClassBigInt = studentClass ? BigInt(studentClass) : null;
  const { data: studentListForClass = [] } =
    useStudentsByClass(studentClassBigInt);

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!studentName.trim() || !studentClass) {
      toast.error("Please enter student name and select a class");
      return;
    }
    try {
      await createStudent.mutateAsync({
        name: studentName.trim(),
        classId: BigInt(studentClass),
        section: studentSection.trim(),
      });
      toast.success(`${studentName.trim()} added successfully!`);
      setStudentName("");
      setStudentSection("");
    } catch {
      toast.error("Failed to add student");
    }
  }

  async function handleDeleteStudent(id: bigint, name: string) {
    try {
      await deleteStudent.mutateAsync(id);
      toast.success(`${name} removed`);
    } catch {
      toast.error("Failed to remove student");
    }
  }

  return (
    <div className="min-h-screen bg-background school-pattern">
      <header className="blue-header-gradient sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/assets/uploads/image_search_1773318134008-1.jpg"
                alt="AIC Logo"
                className="w-10 h-10 rounded-full object-cover border border-accent/50"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 items-center justify-center hidden">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">
                Teacher Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Adarsh Inter College &nbsp;•&nbsp;
                <span className="text-accent font-medium">
                  Class {classId} Teacher
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2"
            data-ocid="teacher.logout_button"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 px-4 py-3 bg-accent/10 border border-accent/25 rounded-lg flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-accent shrink-0" />
          <span className="text-sm text-accent font-medium">
            Logged in as Class {classId} Teacher
          </span>
        </div>

        <Tabs defaultValue="attendance" data-ocid="teacher.tab">
          <TabsList className="mb-6">
            <TabsTrigger value="attendance" data-ocid="teacher.attendance_tab">
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger value="students" data-ocid="teacher.students_tab">
              Manage Students
            </TabsTrigger>
            <TabsTrigger value="schedule" data-ocid="teacher.schedule_tab">
              My Schedule
            </TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <div className="flex-1 min-w-48">
                <Label
                  htmlFor="class-select"
                  className="block text-sm font-medium mb-1"
                >
                  Select Class
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger
                    id="class-select"
                    data-ocid="teacher.class_select"
                  >
                    <SelectValue placeholder="Choose a class..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-48">
                <Label
                  htmlFor="att-date"
                  className="block text-sm font-medium mb-1"
                >
                  Date
                </Label>
                <input
                  id="att-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  data-ocid="attendance.date_input"
                />
              </div>
            </div>

            {!selectedClass ? (
              <div className="text-center py-20 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Select a class to mark attendance</p>
              </div>
            ) : isLoading ? (
              <div
                className="text-center py-20"
                data-ocid="attendance.loading_state"
              >
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="attendance.empty_state"
              >
                <p className="font-medium">No students in this class</p>
                <p className="text-sm mt-1">
                  Add students from the "Manage Students" tab.
                </p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold">
                    Attendance for{" "}
                    <span className="text-accent">
                      {
                        classes.find((c) => c.id.toString() === selectedClass)
                          ?.name
                      }
                    </span>
                  </h2>
                  <span className="text-sm text-muted-foreground">{date}</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s, i) => (
                      <AttendanceRow
                        key={s.id.toString()}
                        student={s}
                        date={date}
                        index={i}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Add Student Form */}
              <div className="bg-card border border-border rounded-lg p-5">
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-accent" /> Add New Student
                </h2>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="student-name"
                      className="mb-1 block text-sm"
                    >
                      Student Name
                    </Label>
                    <Input
                      id="student-name"
                      placeholder="Enter student full name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      data-ocid="student.name_input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="student-class"
                      className="mb-1 block text-sm"
                    >
                      Select Class
                    </Label>
                    <Select
                      value={studentClass}
                      onValueChange={setStudentClass}
                    >
                      <SelectTrigger
                        id="student-class"
                        data-ocid="student.class_select"
                      >
                        <SelectValue placeholder="Choose class..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem
                            key={c.id.toString()}
                            value={c.id.toString()}
                          >
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="student-section"
                      className="mb-1 block text-sm"
                    >
                      Section
                    </Label>
                    <input
                      id="student-section"
                      placeholder="Enter section (e.g. A, B, C)"
                      value={studentSection}
                      onChange={(e) => setStudentSection(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      data-ocid="student.section_input"
                    />
                    {studentClass && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(() => {
                          const cls = classes.find(
                            (c) => c.id.toString() === studentClass,
                          );
                          if (!cls) return [];
                          const num = Number.parseInt(cls.name);
                          if (num >= 6 && num <= 10) return ["A", "B", "C"];
                          if (num >= 11 && num <= 12)
                            return ["A", "B1", "B2", "C"];
                          return [];
                        })().map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => setStudentSection(sec)}
                            className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${studentSection === sec ? "bg-accent text-accent-foreground border-accent" : "bg-muted text-muted-foreground border-border hover:bg-accent/20"}`}
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={createStudent.isPending}
                    data-ocid="student.add_button"
                  >
                    <UserPlus className="w-4 h-4" />
                    {createStudent.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full inline-block" />
                        Adding...
                      </span>
                    ) : (
                      "Add Student"
                    )}
                  </Button>
                </form>
              </div>

              {/* Student List */}
              <div className="bg-card border border-border rounded-lg p-5">
                <h2 className="font-semibold text-base mb-4">
                  Students in{" "}
                  <span className="text-accent">
                    {classes.find((c) => c.id.toString() === studentClass)
                      ?.name || "Selected Class"}
                  </span>
                </h2>
                {!studentClass ? (
                  <div
                    className="text-center py-8 text-muted-foreground text-sm"
                    data-ocid="student.empty_state"
                  >
                    Select a class to view students
                  </div>
                ) : studentListForClass.length === 0 ? (
                  <div
                    className="text-center py-8 text-muted-foreground text-sm"
                    data-ocid="student.empty_state"
                  >
                    No students in this class yet
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {studentListForClass.map((s, i) => (
                      <div
                        key={s.id.toString()}
                        className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 hover:bg-muted/70 transition-colors"
                        data-ocid={`student.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-5">
                            {i + 1}.
                          </span>
                          <span className="text-sm font-medium">{s.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          disabled={deleteStudent.isPending}
                          data-ocid={`student.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* My Schedule Tab */}
          <TabsContent value="schedule">
            <div className="bg-card border border-border rounded-lg p-5">
              <h2 className="font-semibold text-base mb-5 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-accent" /> My Class
                Schedule
              </h2>
              {!myTeacher ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="schedule.empty_state"
                >
                  <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No schedule found</p>
                  <p className="text-sm mt-1">
                    Ask the Principal to add your teacher profile with schedule.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">
                      Subject:
                    </span>
                    <span className="bg-accent/15 text-accent px-2 py-0.5 rounded font-medium">
                      {myTeacher.subject}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {myTeacher.classAssignments.map((ca, i) => {
                      const cls = classes.find((c) => c.id === ca.classId);
                      return (
                        <div
                          key={`${ca.classId.toString()}-${ca.section}-${i}`}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/40 border border-border"
                          data-ocid={`schedule.item.${i + 1}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                              <GraduationCap className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {cls?.name || `Class ${ca.classId}`}
                              </p>
                              {ca.section && (
                                <p className="text-xs text-muted-foreground">
                                  Section: {ca.section}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">
                              {myTeacher.periodStart} – {myTeacher.periodEnd}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
