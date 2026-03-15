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
import { ArrowLeft, BookOpen, GraduationCap, Search, User } from "lucide-react";
import { useState } from "react";
import type { Student } from "../backend.d";
import {
  useAllClasses,
  useAttendanceRecords,
  useStudentsByClass,
} from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

function AttendanceResults({ student }: { student: Student }) {
  const { data: records = [], isLoading } = useAttendanceRecords(student.id);

  const presentCount = records.filter((r) => r.present).length;
  const absentCount = records.filter((r) => !r.present).length;
  const pct =
    records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="text-center py-8" data-ocid="student.loading_state">
        <p className="text-muted-foreground">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold font-display">{records.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Days</p>
        </div>
        <div className="bg-card border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold font-display text-green-600">
            {presentCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Present</p>
        </div>
        <div className="bg-card border border-red-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold font-display text-destructive">
            {absentCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Absent</p>
        </div>
      </div>
      <div className="mb-4 bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-green-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Attendance rate: <strong>{pct}%</strong>
      </p>
      {records.length === 0 ? (
        <div
          className="text-center py-8 text-muted-foreground"
          data-ocid="student.empty_state"
        >
          <p>No attendance records found yet.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((r, i) => (
                  <TableRow
                    key={`${r.date}-${i}`}
                    data-ocid={`student.item.${i + 1}`}
                  >
                    <TableCell className="text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={r.present ? "default" : "destructive"}
                        className={
                          r.present ? "bg-green-600 hover:bg-green-700" : ""
                        }
                      >
                        {r.present ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function StudentView({ onBack }: Props) {
  const { data: classes = [] } = useAllClasses();
  const [selectedClass, setSelectedClass] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [submittedClassId, setSubmittedClassId] = useState<bigint | null>(null);
  const [submittedName, setSubmittedName] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);

  const classId = selectedClass ? BigInt(selectedClass) : null;
  const { data: studentsInClass = [] } = useStudentsByClass(submittedClassId);

  function handleSearch() {
    if (!selectedClass || !nameInput.trim()) return;
    const id = BigInt(selectedClass);
    setSubmittedClassId(id);
    setSubmittedName(nameInput.trim());
    setNotFound(false);
    setFoundStudent(null);
  }

  function resolveStudent() {
    if (!submittedClassId || !submittedName || studentsInClass.length === 0)
      return;
    const student = studentsInClass.find(
      (s) => s.name.toLowerCase() === submittedName.toLowerCase(),
    );
    if (student) {
      setFoundStudent(student);
      setNotFound(false);
    } else {
      setFoundStudent(null);
      setNotFound(true);
    }
  }

  if (
    submittedClassId !== null &&
    submittedName &&
    studentsInClass.length > 0 &&
    foundStudent === null &&
    !notFound
  ) {
    resolveStudent();
  }

  const canSearch = selectedClass && nameInput.trim().length > 0;
  void classId;

  const foundClassName = foundStudent
    ? (classes.find((c) => c.id === foundStudent.classId)?.name ?? "")
    : "";

  return (
    <div className="min-h-screen bg-background school-pattern">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">
                Student Attendance
              </h1>
              <p className="text-xs text-muted-foreground">
                Adarsh Inter College
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-2"
            data-ocid="student.cancel_button"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold mb-5">
            View Your Attendance
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Your Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="mt-1" data-ocid="student.select">
                  <SelectValue placeholder="Select your class" />
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
              <Label htmlFor="sname">Your Name</Label>
              <Input
                id="sname"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
                onKeyDown={(e) =>
                  e.key === "Enter" && canSearch && handleSearch()
                }
                data-ocid="student.input"
              />
            </div>
            <Button
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleSearch}
              disabled={!canSearch}
              data-ocid="student.submit_button"
            >
              <Search className="w-4 h-4" /> View Attendance
            </Button>
          </div>

          {notFound && (
            <div
              className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
              data-ocid="student.error_state"
            >
              <strong>Not found:</strong> No student named &ldquo;
              {submittedName}&rdquo; in the selected class. Please check
              spelling or select the correct class.
            </div>
          )}

          {foundStudent && (
            <>
              {/* Student info banner */}
              <div
                className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-4"
                data-ocid="student.card"
              >
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-base truncate">
                    {foundStudent.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs bg-accent/20 text-accent-foreground rounded-md px-2 py-0.5 font-medium">
                      <BookOpen className="w-3 h-3" />
                      {foundClassName}
                    </span>
                    {foundStudent.section && (
                      <span className="inline-flex items-center text-xs bg-primary/15 text-primary rounded-md px-2 py-0.5 font-medium">
                        Section {foundStudent.section}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <AttendanceResults student={foundStudent} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
