import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  GraduationCap,
  Search,
  UserX,
} from "lucide-react";
import { useRef, useState } from "react";
import { useAllClasses, useAllTeachers } from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

export default function PublicTeacherSchedule({ onBack }: Props) {
  const { data: teachers = [] } = useAllTeachers();
  const { data: classes = [] } = useAllClasses();
  const [nameInput, setNameInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<
    (typeof teachers)[0] | null
  >(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions =
    nameInput.trim().length > 0
      ? teachers.filter((t) =>
          t.name.toLowerCase().includes(nameInput.trim().toLowerCase()),
        )
      : [];

  function handleSelect(teacher: (typeof teachers)[0]) {
    setNameInput(teacher.name);
    setSelectedTeacher(teacher);
    setShowSuggestions(false);
    setSearched(true);
  }

  function handleSearch() {
    const match = teachers.find(
      (t) => t.name.toLowerCase() === nameInput.trim().toLowerCase(),
    );
    setSelectedTeacher(match ?? null);
    setSearched(true);
    setShowSuggestions(false);
  }

  function handleInputChange(value: string) {
    setNameInput(value);
    setShowSuggestions(true);
    setSearched(false);
    setSelectedTeacher(null);
  }

  return (
    <div className="min-h-screen bg-background school-pattern flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 shrink-0"
            data-ocid="public_schedule.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/image_search_1773318134008-1.jpg"
              alt="AIC Logo"
              className="w-10 h-10 rounded-full object-cover border border-accent/50"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">
                Teacher Schedule
              </h1>
              <p className="text-xs text-muted-foreground">
                Adarsh Inter College &nbsp;•&nbsp; Period Timetable
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 border border-accent/30 mb-4">
            <CalendarDays className="w-7 h-7 text-accent" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            View Your Schedule
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Enter your name to view your allocated class periods and timetable.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                placeholder="Enter teacher name..."
                value={nameInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => nameInput.trim() && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoFocus
                data-ocid="public_schedule.name_input"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                  {suggestions.map((t) => (
                    <button
                      key={t.id.toString()}
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors flex items-center gap-2"
                      onMouseDown={() => handleSelect(t)}
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{t.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {t.subject}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleSearch}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="public_schedule.search_button"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>

        {searched && !selectedTeacher && (
          <div
            className="max-w-md mx-auto text-center py-12 bg-card border border-border rounded-xl"
            data-ocid="public_schedule.error_state"
          >
            <UserX className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-semibold text-foreground">Teacher not found</p>
            <p className="text-sm text-muted-foreground mt-1">
              No teacher matched "{nameInput}". Please check the spelling.
            </p>
          </div>
        )}

        {selectedTeacher && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-accent/25 rounded-xl p-5 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">
                    {selectedTeacher.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Subject:{" "}
                    <span className="text-accent font-medium">
                      {selectedTeacher.subject}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Period time: {selectedTeacher.periodStart} –{" "}
                  {selectedTeacher.periodEnd}
                </span>
              </div>
            </div>

            {selectedTeacher.classAssignments.length === 0 ? (
              <div
                className="text-center py-10 text-muted-foreground bg-card border border-border rounded-xl"
                data-ocid="public_schedule.empty_state"
              >
                <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="font-medium">No periods assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedTeacher.classAssignments.map((ca, i) => {
                  const cls = classes.find((c) => c.id === ca.classId);
                  return (
                    <div
                      key={`${ca.classId.toString()}-${ca.section}-${i}`}
                      className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 hover:border-accent/40 transition-colors"
                      data-ocid={`public_schedule.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0 text-accent font-bold text-xs">
                          P{i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {cls?.name || `Class ${ca.classId}`}
                            {ca.section ? ` – Section ${ca.section}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedTeacher.subject}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        <Clock className="w-3 h-3" />
                        {selectedTeacher.periodStart} –{" "}
                        {selectedTeacher.periodEnd}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!searched && !selectedTeacher && (
          <div
            className="max-w-md mx-auto text-center py-12 text-muted-foreground"
            data-ocid="public_schedule.empty_state"
          >
            <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">
              Type your name above to view your schedule
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-5 text-center mt-auto">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Adarsh Inter College, Adalhat, Mirzapur.
          Built with ❤️ using{" "}
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
  );
}
