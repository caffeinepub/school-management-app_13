import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CalendarSearch,
  Clock,
  GraduationCap,
  LogOut,
  Megaphone,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Announcement, ClassAssignment } from "../backend.d";
import {
  useAllAnnouncements,
  useAllClasses,
  useAllStudents,
  useAllSubjects,
  useAllTeachers,
  useCreateAnnouncement,
  useCreateClass,
  useCreateStudent,
  useCreateSubject,
  useCreateTeacher,
  useDeleteAnnouncement,
  useDeleteClass,
  useDeleteStudent,
  useDeleteSubject,
  useDeleteTeacher,
  useUpdateAnnouncement,
} from "../hooks/useQueries";
import TeacherScheduleSearch from "./TeacherScheduleSearch";

interface Props {
  onLogout: () => void;
}

type AnnouncementForm = { title: string; content: string; date: string };

interface ClassRow {
  rowId: number;
  classId: string;
  section: string;
}

export default function PrincipalDashboard({ onLogout }: Props) {
  const { data: announcements = [] } = useAllAnnouncements();
  const { data: classes = [] } = useAllClasses();
  const { data: students = [] } = useAllStudents();
  const { data: teachers = [] } = useAllTeachers();
  const { data: subjects = [] } = useAllSubjects();

  const createAnn = useCreateAnnouncement();
  const updateAnn = useUpdateAnnouncement();
  const deleteAnn = useDeleteAnnouncement();
  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();
  const createStudent = useCreateStudent();
  const deleteStudent = useDeleteStudent();
  const createTeacher = useCreateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const createSubject = useCreateSubject();
  const deleteSubject = useDeleteSubject();

  // Announcement dialog
  const [annDialog, setAnnDialog] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState<AnnouncementForm>({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Student dialog
  const [studentDialog, setStudentDialog] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentClass, setNewStudentClass] = useState("");
  const [newStudentSection, setNewStudentSection] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");

  // Teacher dialog
  const [teacherDialog, setTeacherDialog] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherSubject, setNewTeacherSubject] = useState("");
  const [classRows, setClassRows] = useState<ClassRow[]>([
    { rowId: 0, classId: "", section: "" },
  ]);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  // Class/Subject dialog
  const [classDialog, setClassDialog] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [subjectDialog, setSubjectDialog] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectClass, setNewSubjectClass] = useState("");

  function openAddAnn() {
    setEditingAnn(null);
    setAnnForm({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    });
    setAnnDialog(true);
  }

  function openEditAnn(ann: Announcement) {
    setEditingAnn(ann);
    setAnnForm({ title: ann.title, content: ann.content, date: ann.date });
    setAnnDialog(true);
  }

  async function saveAnnouncement() {
    if (!annForm.title.trim() || !annForm.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      if (editingAnn) {
        await updateAnn.mutateAsync({ id: editingAnn.id, ...annForm });
        toast.success("Announcement updated");
      } else {
        await createAnn.mutateAsync(annForm);
        toast.success("Announcement created");
      }
      setAnnDialog(false);
    } catch {
      toast.error("Failed to save announcement");
    }
  }

  async function handleDeleteAnn(id: bigint) {
    try {
      await deleteAnn.mutateAsync(id);
      toast.success("Announcement deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function handleAddStudent() {
    if (!newStudentName.trim() || !newStudentClass) {
      toast.error("Name and class are required");
      return;
    }
    try {
      await createStudent.mutateAsync({
        name: newStudentName.trim(),
        classId: BigInt(newStudentClass),
        section: newStudentSection.trim(),
      });
      toast.success("Student added");
      setNewStudentName("");
      setNewStudentClass("");
      setNewStudentSection("");
      setStudentDialog(false);
    } catch {
      toast.error("Failed to add student");
    }
  }

  async function handleDeleteStudent(id: bigint) {
    try {
      await deleteStudent.mutateAsync(id);
      toast.success("Student removed");
    } catch {
      toast.error("Failed to remove student");
    }
  }

  function addClassRow() {
    setClassRows((prev) => [
      ...prev,
      { rowId: Date.now(), classId: "", section: "" },
    ]);
  }

  function removeClassRow(index: number) {
    setClassRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateClassRow(index: number, field: keyof ClassRow, value: string) {
    setClassRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function resetTeacherForm() {
    setNewTeacherName("");
    setNewTeacherSubject("");
    setClassRows([{ rowId: 0, classId: "", section: "" }]);
    setPeriodStart("");
    setPeriodEnd("");
  }

  async function handleAddTeacher() {
    if (!newTeacherName.trim()) {
      toast.error("Teacher name is required");
      return;
    }
    if (!newTeacherSubject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!periodStart || !periodEnd) {
      toast.error("Period start and end time are required");
      return;
    }

    const validRows = classRows.filter((r) => r.classId !== "");
    const assignments: ClassAssignment[] = validRows.map((r) => ({
      classId: BigInt(r.classId),
      section: r.section.trim(),
    }));

    try {
      await createTeacher.mutateAsync({
        name: newTeacherName.trim(),
        subject: newTeacherSubject.trim(),
        classAssignments: assignments,
        periodStart,
        periodEnd,
      });
      toast.success("Teacher added");
      resetTeacherForm();
      setTeacherDialog(false);
    } catch {
      toast.error("Failed to add teacher");
    }
  }

  async function handleDeleteTeacher(id: bigint) {
    try {
      await deleteTeacher.mutateAsync(id);
      toast.success("Teacher removed");
    } catch {
      toast.error("Failed to remove teacher");
    }
  }

  async function handleAddClass() {
    if (!newClassName.trim()) {
      toast.error("Class name is required");
      return;
    }
    try {
      await createClass.mutateAsync(newClassName.trim());
      toast.success("Class created");
      setNewClassName("");
      setClassDialog(false);
    } catch {
      toast.error("Failed to create class");
    }
  }

  async function handleAddSubject() {
    if (!newSubjectName.trim() || !newSubjectClass) {
      toast.error("Subject name and class are required");
      return;
    }
    try {
      await createSubject.mutateAsync({
        name: newSubjectName.trim(),
        classId: BigInt(newSubjectClass),
      });
      toast.success("Subject created");
      setNewSubjectName("");
      setNewSubjectClass("");
      setSubjectDialog(false);
    } catch {
      toast.error("Failed to create subject");
    }
  }

  function getClassNameById(classId: bigint) {
    return classes.find((c) => c.id === classId)?.name ?? "—";
  }

  const filteredStudents =
    filterClass === "all"
      ? students
      : students.filter((s) => s.classId.toString() === filterClass);

  return (
    <div className="min-h-screen bg-background school-pattern">
      {/* Header */}
      <header className="blue-header-gradient sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">
                Principal Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Westbrook Academy</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="announcements">
          <TabsList className="mb-6 bg-card border border-border">
            <TabsTrigger
              value="announcements"
              className="gap-2"
              data-ocid="principal.announcements_tab"
            >
              <Megaphone className="w-4 h-4" /> Announcements
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="gap-2"
              data-ocid="principal.students_tab"
            >
              <Users className="w-4 h-4" /> Students
            </TabsTrigger>
            <TabsTrigger
              value="teachers"
              className="gap-2"
              data-ocid="principal.teachers_tab"
            >
              <GraduationCap className="w-4 h-4" /> Teachers
            </TabsTrigger>
            <TabsTrigger
              value="classes"
              className="gap-2"
              data-ocid="principal.classes_tab"
            >
              <BookOpen className="w-4 h-4" /> Classes &amp; Subjects
            </TabsTrigger>
            <TabsTrigger
              value="teacher-search"
              className="gap-2"
              data-ocid="principal.teacher_search_tab"
            >
              <CalendarSearch className="w-4 h-4" /> Teacher Schedule
            </TabsTrigger>
          </TabsList>

          {/* ANNOUNCEMENTS */}
          <TabsContent value="announcements">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">
                Announcements
              </h2>
              <Button
                onClick={openAddAnn}
                size="sm"
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                data-ocid="announcement.add_button"
              >
                <Plus className="w-4 h-4" /> New Announcement
              </Button>
            </div>
            {announcements.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="announcement.empty_state"
              >
                <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No announcements yet</p>
                <p className="text-sm">Create your first announcement above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann, i) => (
                  <div
                    key={ann.id.toString()}
                    className="bg-card border border-border rounded-lg p-4 flex gap-4 items-start"
                    data-ocid={`announcement.item.${i + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{ann.title}</h3>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {ann.date}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ann.content}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditAnn(ann)}
                        data-ocid={`announcement.edit_button.${i + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteAnn(ann.id)}
                        data-ocid={`announcement.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* STUDENTS */}
          <TabsContent value="students">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h2 className="font-display text-xl font-semibold">Students</h2>
              <div className="flex gap-3 items-center">
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger
                    className="w-48"
                    data-ocid="student.class_select"
                  >
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => setStudentDialog(true)}
                  data-ocid="student.add_button"
                >
                  <Plus className="w-4 h-4" /> Add Student
                </Button>
              </div>
            </div>
            {filteredStudents.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="student.empty_state"
              >
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No students found</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s, i) => (
                      <TableRow
                        key={s.id.toString()}
                        data-ocid={`student.item.${i + 1}`}
                      >
                        <TableCell className="text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getClassNameById(s.classId)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteStudent(s.id)}
                            data-ocid={`student.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* TEACHERS */}
          <TabsContent value="teachers">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Teachers</h2>
              <Button
                size="sm"
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => {
                  resetTeacherForm();
                  setTeacherDialog(true);
                }}
                data-ocid="teacher.add_button"
              >
                <Plus className="w-4 h-4" /> Add Teacher
              </Button>
            </div>
            {teachers.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="teacher.empty_state"
              >
                <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No teachers added yet</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((t, i) => (
                      <TableRow
                        key={t.id.toString()}
                        data-ocid={`teacher.item.${i + 1}`}
                      >
                        <TableCell className="text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell>
                          {t.subject ? (
                            <Badge variant="secondary" className="text-xs">
                              {t.subject}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {t.classAssignments.length === 0 ? (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {t.classAssignments.map((ca, j) => (
                                <Badge
                                  key={`${ca.classId.toString()}-${ca.section}-${j}`}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {getClassNameById(ca.classId)}
                                  {ca.section ? ` - ${ca.section}` : ""}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {t.periodStart && t.periodEnd ? (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {t.periodStart} – {t.periodEnd}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteTeacher(t.id)}
                            data-ocid={`teacher.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* CLASSES & SUBJECTS */}
          <TabsContent value="classes">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Classes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold">
                    Classes
                  </h2>
                  <Button
                    size="sm"
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => setClassDialog(true)}
                    data-ocid="class.add_button"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
                {classes.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg"
                    data-ocid="class.empty_state"
                  >
                    <p className="text-sm">No classes yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {classes.map((c, i) => (
                      <div
                        key={c.id.toString()}
                        className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3"
                        data-ocid={`class.item.${i + 1}`}
                      >
                        <span className="font-medium">{c.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={async () => {
                            try {
                              await deleteClass.mutateAsync(c.id);
                              toast.success("Class removed");
                            } catch {
                              toast.error("Failed to remove class");
                            }
                          }}
                          data-ocid={`class.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subjects */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold">
                    Subjects
                  </h2>
                  <Button
                    size="sm"
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => setSubjectDialog(true)}
                    data-ocid="subject.add_button"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
                {subjects.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg"
                    data-ocid="subject.empty_state"
                  >
                    <p className="text-sm">No subjects yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subjects.map((s, i) => (
                      <div
                        key={s.id.toString()}
                        className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3"
                        data-ocid={`subject.item.${i + 1}`}
                      >
                        <div>
                          <span className="font-medium">{s.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({getClassNameById(s.classId)})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={async () => {
                            try {
                              await deleteSubject.mutateAsync(s.id);
                              toast.success("Subject removed");
                            } catch {
                              toast.error("Failed to remove subject");
                            }
                          }}
                          data-ocid={`subject.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          {/* TEACHER SCHEDULE SEARCH */}
          <TabsContent value="teacher-search">
            <TeacherScheduleSearch teachers={teachers} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Announcement Dialog */}
      <Dialog open={annDialog} onOpenChange={setAnnDialog}>
        <DialogContent data-ocid="announcement.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingAnn ? "Edit Announcement" : "New Announcement"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="ann-title">Title</Label>
              <Input
                id="ann-title"
                value={annForm.title}
                onChange={(e) =>
                  setAnnForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Announcement title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ann-content">Content</Label>
              <Textarea
                id="ann-content"
                value={annForm.content}
                onChange={(e) =>
                  setAnnForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder="Write the announcement..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ann-date">Date</Label>
              <Input
                id="ann-date"
                type="date"
                value={annForm.date}
                onChange={(e) =>
                  setAnnForm((f) => ({ ...f, date: e.target.value }))
                }
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAnnDialog(false)}
              data-ocid="announcement.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveAnnouncement}
              disabled={createAnn.isPending || updateAnn.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="announcement.save_button"
            >
              {editingAnn ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={studentDialog} onOpenChange={setStudentDialog}>
        <DialogContent data-ocid="student.dialog">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="s-name">Student Name</Label>
              <Input
                id="s-name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Full name"
                className="mt-1"
                data-ocid="student.input"
              />
            </div>
            <div>
              <Label>Class</Label>
              <Select
                value={newStudentClass}
                onValueChange={setNewStudentClass}
              >
                <SelectTrigger className="mt-1" data-ocid="student.select">
                  <SelectValue placeholder="Select class" />
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
            <div>
              <Label htmlFor="s-section">Section</Label>
              <Input
                id="s-section"
                value={newStudentSection}
                onChange={(e) => setNewStudentSection(e.target.value)}
                placeholder="Enter section (e.g. A, B, C)"
                className="mt-1"
                data-ocid="student.section_input"
              />
              {newStudentClass && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(() => {
                    const cls = classes.find(
                      (c) => c.id.toString() === newStudentClass,
                    );
                    if (!cls) return [];
                    const num = Number.parseInt(cls.name);
                    if (num >= 6 && num <= 10) return ["A", "B", "C"];
                    if (num >= 11 && num <= 12) return ["A", "B1", "B2", "C"];
                    return [];
                  })().map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setNewStudentSection(sec)}
                      className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${newStudentSection === sec ? "bg-accent text-accent-foreground border-accent" : "bg-muted text-muted-foreground border-border hover:bg-accent/20"}`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStudentDialog(false)}
              data-ocid="student.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStudent}
              disabled={createStudent.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="student.submit_button"
            >
              {createStudent.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full inline-block" />
                  Adding...
                </span>
              ) : (
                "Add Student"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Teacher Dialog */}
      <Dialog open={teacherDialog} onOpenChange={setTeacherDialog}>
        <DialogContent className="max-w-lg" data-ocid="teacher.dialog">
          <DialogHeader>
            <DialogTitle>Add Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2 max-h-[70vh] overflow-y-auto pr-1">
            {/* Name */}
            <div>
              <Label htmlFor="t-name">Teacher Name</Label>
              <Input
                id="t-name"
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                placeholder="Full name"
                className="mt-1"
                data-ocid="teacher.input"
              />
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="t-subject">Subject</Label>
              <Input
                id="t-subject"
                value={newTeacherSubject}
                onChange={(e) => setNewTeacherSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="mt-1"
              />
            </div>

            {/* Classes & Sections */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Classes &amp; Sections</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addClassRow}
                  className="gap-1 h-7 text-xs"
                  data-ocid="teacher.secondary_button"
                >
                  <Plus className="w-3 h-3" /> Add Class
                </Button>
              </div>
              <div className="space-y-2">
                {classRows.map((row, idx) => (
                  <div key={row.rowId} className="flex gap-2 items-center">
                    <Select
                      value={row.classId}
                      onValueChange={(val) =>
                        updateClassRow(idx, "classId", val)
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select class" />
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
                    <Input
                      value={row.section}
                      onChange={(e) =>
                        updateClassRow(idx, "section", e.target.value)
                      }
                      placeholder="Section (e.g. A)"
                      className="w-32"
                    />
                    {classRows.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive shrink-0"
                        onClick={() => removeClassRow(idx)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Period */}
            <div>
              <Label>Period Time</Label>
              <div className="flex gap-3 mt-1 items-center">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Start</p>
                  <Input
                    type="time"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    data-ocid="teacher.select"
                  />
                </div>
                <span className="text-muted-foreground mt-5">–</span>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">End</p>
                  <Input
                    type="time"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTeacherDialog(false)}
              data-ocid="teacher.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTeacher}
              disabled={createTeacher.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="teacher.submit_button"
            >
              Add Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Class Dialog */}
      <Dialog open={classDialog} onOpenChange={setClassDialog}>
        <DialogContent data-ocid="class.dialog">
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="c-name">Class Name</Label>
            <Input
              id="c-name"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g. Grade 5A"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClassDialog(false)}
              data-ocid="class.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddClass}
              disabled={createClass.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="class.submit_button"
            >
              Create Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={subjectDialog} onOpenChange={setSubjectDialog}>
        <DialogContent data-ocid="subject.dialog">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="sub-name">Subject Name</Label>
              <Input
                id="sub-name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g. Mathematics"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Assign to Class</Label>
              <Select
                value={newSubjectClass}
                onValueChange={setNewSubjectClass}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select class" />
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSubjectDialog(false)}
              data-ocid="subject.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubject}
              disabled={createSubject.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="subject.submit_button"
            >
              Create Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
