import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  Eye,
  EyeOff,
  GraduationCap,
  Quote,
  Shield,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import PrincipalDashboard from "./components/PrincipalDashboard";
import PublicTeacherSchedule from "./components/PublicTeacherSchedule";
import StudentView from "./components/StudentView";
import TeacherDashboard from "./components/TeacherDashboard";

type Role = "principal" | "teacher" | "student" | "teacher-schedule" | null;

const PRINCIPAL_PASSWORD = "1122";
const VALID_CLASS_PASSWORDS = ["6", "7", "8", "9", "10", "11", "12"];

export default function App() {
  const [activeRole, setActiveRole] = useState<Role>(null);
  const [teacherClassId, setTeacherClassId] = useState<number>(6);
  const [pendingRole, setPendingRole] = useState<
    "principal" | "teacher" | null
  >(null);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState(false);

  function selectRole(role: Role) {
    if (role === "student") {
      setActiveRole("student");
    } else if (role === "teacher-schedule") {
      setActiveRole("teacher-schedule");
    } else if (role === "principal" || role === "teacher") {
      setPendingRole(role);
      setPassword("");
      setPwError(false);
    }
  }

  function handlePasswordSubmit() {
    if (!pendingRole) return;
    if (pendingRole === "principal") {
      if (password === PRINCIPAL_PASSWORD) {
        setActiveRole("principal");
        setPendingRole(null);
        setPassword("");
        setPwError(false);
      } else {
        setPwError(true);
      }
    } else {
      if (VALID_CLASS_PASSWORDS.includes(password)) {
        setTeacherClassId(Number.parseInt(password, 10));
        setActiveRole("teacher");
        setPendingRole(null);
        setPassword("");
        setPwError(false);
      } else {
        setPwError(true);
      }
    }
  }

  function handleLogout() {
    setActiveRole(null);
  }

  if (activeRole === "principal")
    return <PrincipalDashboard onLogout={handleLogout} />;
  if (activeRole === "teacher")
    return (
      <TeacherDashboard onLogout={handleLogout} classId={teacherClassId} />
    );
  if (activeRole === "student") return <StudentView onBack={handleLogout} />;
  if (activeRole === "teacher-schedule")
    return <PublicTeacherSchedule onBack={handleLogout} />;

  const roles = [
    {
      key: "principal" as const,
      label: "Principal",
      subtitle: "School Administration",
      icon: Shield,
      desc: "Manage announcements, students, teachers, classes and subjects.",
      ocid: "role.principal_button",
      badge: "Password Required",
      hint: "Enter principal password",
    },
    {
      key: "teacher" as const,
      label: "Teacher",
      subtitle: "Classroom Management",
      icon: GraduationCap,
      desc: "View class rosters and mark daily student attendance.",
      ocid: "role.teacher_button",
      badge: "Class Number",
      hint: "Enter your class number",
    },
    {
      key: "student" as const,
      label: "Student",
      subtitle: "Attendance Viewer",
      icon: Users,
      desc: "Enter your class and name to view your attendance records.",
      ocid: "role.student_button",
      badge: "Open Access",
      hint: "No password needed",
    },
    {
      key: "teacher-schedule" as const,
      label: "Teacher Schedule",
      subtitle: "View Period Timetable",
      icon: CalendarDays,
      desc: "Enter your name to view your class schedule and period timetable.",
      ocid: "role.teacher_schedule_button",
      badge: "Name Required",
      hint: "No login needed",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background school-pattern flex flex-col">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
            <div className="relative">
              <img
                src="/assets/uploads/image_search_1773318134008-1.jpg"
                alt="AIC Logo"
                className="w-14 h-14 rounded-full object-cover border-2 border-accent/60 shadow-lg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="w-14 h-14 rounded-full border-2 border-accent/60 items-center justify-center bg-primary/20 hidden">
                <GraduationCap className="w-7 h-7 text-accent" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl md:text-2xl leading-tight">
                <span className="gold-shimmer">Adarsh Inter College</span>
              </h1>
              <p className="text-xs text-muted-foreground tracking-wider">
                Adalhat, Mirzapur (UP) &nbsp;|&nbsp; Est. 1951
              </p>
            </div>
            <div className="ml-auto hidden sm:block">
              <span className="text-xs font-bold tracking-widest text-accent border border-accent/40 rounded px-2 py-0.5 uppercase">
                AIC
              </span>
            </div>
          </div>
        </header>

        <div className="rule-line" />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <p className="text-sm font-medium tracking-widest uppercase text-accent mb-3">
                School Management System
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Select Your Role
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose your role to access the appropriate management panel.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {roles.map((role, i) => (
                <motion.div
                  key={role.key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.45 }}
                >
                  <button
                    type="button"
                    className="w-full text-left group cursor-pointer"
                    onClick={() => selectRole(role.key)}
                    data-ocid={role.ocid}
                  >
                    <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg transition-all duration-200 hover:border-accent/60 hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-b-[40px] border-l-transparent border-b-accent/15 group-hover:border-b-accent/30 transition-colors" />
                      </div>
                      <div className="mb-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors">
                          <role.icon className="w-6 h-6 text-accent/70 group-hover:text-accent transition-colors" />
                        </div>
                        <div className="rule-line mb-3 w-12" />
                        <h3 className="font-display text-xl font-bold">
                          {role.label}
                        </h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                          {role.subtitle}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {role.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-accent border border-accent/30 rounded-full px-3 py-0.5">
                          {role.badge}
                        </span>
                        <span className="text-xs text-muted-foreground group-hover:text-accent transition-colors">
                          {role.hint} →
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Motivational Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="w-full max-w-4xl mt-16"
          >
            <div className="text-center mb-8">
              <div className="rule-line mb-6" />
              <p className="font-display text-lg md:text-xl font-bold gold-shimmer inline-block">
                हम आगे थे • आगे हैं • आगे रहेंगे
              </p>
              <div className="rule-line mt-6" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-accent/20 rounded-xl p-6 relative overflow-hidden">
                <Quote className="absolute top-3 right-4 w-10 h-10 text-accent/10" />
                <div className="w-8 h-1 rounded-full bg-accent/60 mb-4" />
                <p className="font-display text-lg font-semibold text-foreground leading-relaxed mb-4">
                  “शिक्षा वो शस्त्र है जिससे आप दुनिया बदल सकते हैं।”
                </p>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent/60" />
                  <p className="text-sm text-accent font-medium">
                    — महात्मा गांधी
                  </p>
                </div>
              </div>
              <div className="bg-card border border-accent/20 rounded-xl p-6 relative overflow-hidden">
                <Quote className="absolute top-3 right-4 w-10 h-10 text-accent/10" />
                <div className="w-8 h-1 rounded-full bg-accent/60 mb-4" />
                <p className="font-display text-lg font-semibold text-foreground leading-relaxed mb-4">
                  “Education is the most powerful weapon which you can use to
                  change the world.”
                </p>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent/60" />
                  <p className="text-sm text-accent font-medium">
                    — Nelson Mandela
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        <footer className="border-t border-border py-5 text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Adarsh Inter College, Adalhat,
            Mirzapur. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <AnimatePresence>
        {pendingRole && (
          <Dialog
            open={!!pendingRole}
            onOpenChange={(open) => {
              if (!open) setPendingRole(null);
            }}
          >
            <DialogContent className="max-w-sm" data-ocid="auth.dialog">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {pendingRole === "principal" ? "Principal" : "Teacher"} Login
                </DialogTitle>
              </DialogHeader>
              <div className="py-2 space-y-4">
                <p className="text-sm text-muted-foreground">
                  {pendingRole === "principal"
                    ? "Enter the principal password to continue."
                    : "Enter your class number (6–12) to login."}
                </p>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder={
                      pendingRole === "principal"
                        ? "Enter password"
                        : "Enter class number (e.g. 8)"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPwError(false);
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handlePasswordSubmit()
                    }
                    className={pwError ? "border-destructive pr-10" : "pr-10"}
                    autoFocus
                    data-ocid="auth.password_input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {pwError && (
                  <div
                    className="flex items-center gap-2 text-sm text-destructive"
                    data-ocid="auth.error_state"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {pendingRole === "teacher"
                      ? "Invalid class number. Enter 6 to 12."
                      : "Incorrect password. Please try again."}
                  </div>
                )}
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handlePasswordSubmit}
                  data-ocid="auth.submit_button"
                >
                  Login
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Toaster richColors />
    </>
  );
}
