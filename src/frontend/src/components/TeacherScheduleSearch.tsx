import { Input } from "@/components/ui/input";
import { CalendarDays, Clock, GraduationCap, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Teacher } from "../backend.d";

interface Props {
  teachers: Teacher[];
}

export default function TeacherScheduleSearch({ teachers }: Props) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<Teacher | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.trim().length > 0
      ? teachers.filter((t) =>
          t.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(teacher: Teacher) {
    setSelected(teacher);
    setQuery(teacher.name);
    setShowDropdown(false);
  }

  function handleInputChange(value: string) {
    setQuery(value);
    setShowDropdown(true);
    if (selected && selected.name !== value) {
      setSelected(null);
    }
  }

  return (
    <div
      className="bg-card border border-border rounded-lg p-5"
      data-ocid="schedule_search.panel"
    >
      <h2 className="font-semibold text-base mb-5 flex items-center gap-2">
        <Search className="w-4 h-4 text-accent" /> Teacher Schedule Search
      </h2>

      {/* Search Input */}
      <div className="relative mb-5" ref={containerRef}>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="schedule_search.input"
            className="pl-9"
            placeholder="Type teacher name..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => query.trim().length > 0 && setShowDropdown(true)}
            autoComplete="off"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && filtered.length > 0 && (
          <div
            data-ocid="schedule_search.dropdown_menu"
            className="absolute z-50 top-full mt-1 left-0 right-0 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {filtered.map((t, i) => (
              <button
                type="button"
                key={t.id.toString()}
                data-ocid={`schedule_search.item.${i + 1}`}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/10 flex items-center gap-2 transition-colors"
                onMouseDown={() => handleSelect(t)}
              >
                <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium">{t.name}</span>
                <span className="text-muted-foreground ml-auto text-xs">
                  {t.subject}
                </span>
              </button>
            ))}
          </div>
        )}

        {showDropdown && query.trim().length > 0 && filtered.length === 0 && (
          <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-popover border border-border rounded-lg shadow-lg px-4 py-3 text-sm text-muted-foreground">
            No teacher found matching &ldquo;{query}&rdquo;
          </div>
        )}
      </div>

      {/* Results */}
      {!selected && !query.trim() && (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="schedule_search.empty_state"
        >
          <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">Search for a teacher</p>
          <p className="text-sm mt-1">
            Type a teacher&apos;s name above to see their schedule
          </p>
        </div>
      )}

      {selected && (
        <div className="space-y-4">
          {/* Teacher Info */}
          <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{selected.name}</p>
              <p className="text-xs text-muted-foreground">
                Subject:{" "}
                <span className="text-accent font-medium">
                  {selected.subject}
                </span>
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">
                {selected.periodStart} – {selected.periodEnd}
              </span>
            </div>
          </div>

          {selected.classAssignments.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="schedule_search.empty_state"
            >
              <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No class assignments found</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {selected.classAssignments.map((ca, i) => (
                <div
                  key={`${ca.classId.toString()}-${ca.section}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg bg-muted/40 border border-border"
                  data-ocid={`schedule_search.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0 font-bold text-accent text-xs">
                      P{i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Period {i + 1} &nbsp;·&nbsp; Class{" "}
                        {ca.classId.toString()}
                        {ca.section}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selected.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">
                      {selected.periodStart} – {selected.periodEnd}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
