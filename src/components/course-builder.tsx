import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, BookOpen, Eye, FileText, ListChecks, Pencil, Plus, Trash2, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InstructorShell } from "@/components/instructor-dashboard";
import { cn } from "@/lib/utils";
import {
  addLesson, addSection, courseStats, createCourse, deleteCourse, deleteLesson, deleteSection,
  moveSection, renameSection, updateCourse, updateLesson, useCourse, useCourses,
  type Lesson, type LessonType,
} from "@/lib/course-store";

const panel = "rounded-xl bg-panel ring-1 ring-border";
const field = "h-9 w-full rounded-[10px] bg-muted px-3 text-sm text-foreground outline-none ring-1 ring-border focus:ring-brand/50";
const lessonTypes: LessonType[] = ["Video", "Reading", "Quiz", "Assignment"];
const typeIcon = { Video, Reading: FileText, Quiz: ListChecks, Assignment: BookOpen };

export function CoursesPage() {
  const courses = useCourses();
  const [title, setTitle] = useState("");
  return (
    <InstructorShell>
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-brand">Course library</p>
            <h1 className="mt-1 text-3xl font-semibold">My courses</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create a course, then build its curriculum for learners.</p>
          </div>
        </div>
        <form
          className={cn(panel, "mt-6 flex flex-wrap items-center gap-3 p-4")}
          onSubmit={(event) => { event.preventDefault(); if (title.trim()) { createCourse(title.trim()); setTitle(""); } }}
        >
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New course title…" aria-label="New course title" className={cn(field, "min-w-52 flex-1")} />
          <Button type="submit" variant="brand"><Plus />Create course</Button>
        </form>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const stats = courseStats(course);
            return (
              <article key={course.id} className={cn(panel, "animate-rise flex flex-col p-5")}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[17px] font-semibold leading-snug">{course.title}</h2>
                  <span className={cn("shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold", course.status === "Live" ? "bg-teal/15 text-teal" : "bg-amber/15 text-amber")}>{course.status}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{course.summary}</p>
                <p className="mt-3 text-[11px] text-muted-foreground">{stats.sections} sections · {stats.lessons} lessons · {course.learners} learners</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="animate-progress h-full rounded-full bg-brand" style={{ width: `${stats.readiness}%` }} /></div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="brand" size="sm" asChild><Link to="/instructor/course/$id/builder" params={{ id: course.id }}><Pencil />Build</Link></Button>
                  <Button variant="dashboard" size="sm" asChild><Link to="/course/$id" params={{ id: course.id }}><Eye />Student view</Link></Button>
                  <Button variant="dashboard" size="sm" aria-label={`Delete ${course.title}`} onClick={() => deleteCourse(course.id)}><Trash2 /></Button>
                </div>
              </article>
            );
          })}
          {courses.length === 0 && <p className={cn(panel, "p-10 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3")}>No courses yet — create your first one above.</p>}
        </div>
      </main>
    </InstructorShell>
  );
}

export function CourseBuilderPage({ courseId }: { courseId: string }) {
  const course = useCourse(courseId);
  const [sectionTitle, setSectionTitle] = useState("");
  const [saved, setSaved] = useState(false);

  if (!course) {
    return (
      <InstructorShell>
        <main className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6">
          <h1 className="text-2xl font-semibold">Course not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been deleted in this demo session.</p>
          <Button variant="brand" className="mt-5" asChild><Link to="/instructor/courses">Back to my courses</Link></Button>
        </main>
      </InstructorShell>
    );
  }

  const stats = courseStats(course);
  return (
    <InstructorShell>
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-brand">Course builder</p>
            <h1 className="mt-1 text-3xl font-semibold">{course.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{stats.sections} sections · {stats.lessons} lessons · {stats.published} published</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="dashboard" asChild><Link to="/course/$id" params={{ id: course.id }}><Eye />Preview as student</Link></Button>
            <Button variant={course.status === "Live" ? "dashboard" : "brand"} onClick={() => updateCourse(course.id, { status: course.status === "Live" ? "Draft" : "Live" })}>
              {course.status === "Live" ? "Unpublish course" : "Publish course"}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-12">
          <section className={cn(panel, "p-5 xl:col-span-4")}>
            <h2 className="text-[15px] font-semibold">Course details</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-xs text-muted-foreground">Title
                <input className={cn(field, "mt-1")} value={course.title} onChange={(e) => updateCourse(course.id, { title: e.target.value })} />
              </label>
              <label className="block text-xs text-muted-foreground">Description
                <textarea rows={4} className="mt-1 w-full rounded-[10px] bg-muted p-3 text-sm text-foreground outline-none ring-1 ring-border focus:ring-brand/50" value={course.summary} onChange={(e) => updateCourse(course.id, { summary: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs text-muted-foreground">Level
                  <select className={cn(field, "mt-1")} value={course.level} onChange={(e) => updateCourse(course.id, { level: e.target.value as typeof course.level })}>
                    {["Beginner", "Intermediate", "Advanced"].map((level) => <option key={level} value={level}>{level}</option>)}
                  </select>
                </label>
                <label className="block text-xs text-muted-foreground">Price
                  <input className={cn(field, "mt-1")} value={course.price} onChange={(e) => updateCourse(course.id, { price: e.target.value })} />
                </label>
              </div>
              <Button variant="brand" className="w-full" onClick={() => setSaved(true)}>Save details</Button>
              {saved && <p className="rounded-xl bg-teal/10 px-3 py-2 text-xs text-teal ring-1 ring-teal/20">Details saved for this demo session.</p>}
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex justify-between text-[13px]"><span className="font-medium">Publish readiness</span><span className="text-muted-foreground">{stats.readiness}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="animate-progress h-full rounded-full bg-teal" style={{ width: `${stats.readiness}%` }} /></div>
            </div>
          </section>

          <section className="xl:col-span-8">
            <form
              className={cn(panel, "flex flex-wrap items-center gap-3 p-4")}
              onSubmit={(event) => { event.preventDefault(); if (sectionTitle.trim()) { addSection(course.id, sectionTitle.trim()); setSectionTitle(""); } }}
            >
              <input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="New section title…" aria-label="New section title" className={cn(field, "min-w-52 flex-1")} />
              <Button type="submit" variant="brand"><Plus />Add section</Button>
            </form>
            <div className="mt-3 space-y-3">
              {course.sections.map((section, index) => (
                <SectionCard key={section.id} courseId={course.id} section={section} index={index} last={index === course.sections.length - 1} />
              ))}
              {course.sections.length === 0 && <p className={cn(panel, "p-10 text-center text-sm text-muted-foreground")}>No sections yet — add the first one above.</p>}
            </div>
          </section>
        </div>
      </main>
    </InstructorShell>
  );
}

function SectionCard({ courseId, section, index, last }: { courseId: string; section: { id: string; title: string; lessons: Lesson[] }; index: number; last: boolean }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("Video");
  const [duration, setDuration] = useState("");
  return (
    <article className={cn(panel, "animate-rise p-4")}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-[11px] font-semibold text-brand">{String(index + 1).padStart(2, "0")}</span>
        {editing ? (
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => { renameSection(courseId, section.id, title.trim() || section.title); setEditing(false); }} aria-label="Section title" className={cn(field, "max-w-xs flex-1")} />
        ) : (
          <h3 className="flex-1 text-[15px] font-semibold">{section.title}</h3>
        )}
        <span className="text-[11px] text-muted-foreground">{section.lessons.length} lessons</span>
        <div className="flex gap-1">
          <Button variant="dashboard" size="icon" aria-label="Rename section" onClick={() => setEditing(true)}><Pencil /></Button>
          <Button variant="dashboard" size="icon" aria-label="Move section up" disabled={index === 0} onClick={() => moveSection(courseId, section.id, -1)}><ArrowUp /></Button>
          <Button variant="dashboard" size="icon" aria-label="Move section down" disabled={last} onClick={() => moveSection(courseId, section.id, 1)}><ArrowDown /></Button>
          <Button variant="dashboard" size="icon" aria-label="Delete section" onClick={() => deleteSection(courseId, section.id)}><Trash2 /></Button>
        </div>
      </div>

      <div className="mt-3 divide-y divide-border border-t border-border">
        {section.lessons.map((lesson) => {
          const Icon = typeIcon[lesson.type];
          return (
            <div key={lesson.id} className="flex flex-wrap items-center gap-3 py-2">
              <Icon className="size-4 shrink-0 text-brand" />
              <input value={lesson.title} onChange={(e) => updateLesson(courseId, section.id, lesson.id, { title: e.target.value })} aria-label="Lesson title" className="min-w-40 flex-1 rounded-lg bg-transparent px-2 py-1 text-sm outline-none hover:bg-muted focus:bg-muted focus:ring-1 focus:ring-brand/50" />
              <select value={lesson.type} onChange={(e) => updateLesson(courseId, section.id, lesson.id, { type: e.target.value as LessonType })} aria-label="Lesson type" className="h-8 rounded-lg bg-muted px-2 text-xs outline-none ring-1 ring-border focus:ring-brand/50">
                {lessonTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <input value={lesson.duration} onChange={(e) => updateLesson(courseId, section.id, lesson.id, { duration: e.target.value })} aria-label="Lesson length" className="h-8 w-24 rounded-lg bg-muted px-2 text-xs outline-none ring-1 ring-border focus:ring-brand/50" />
              <button onClick={() => updateLesson(courseId, section.id, lesson.id, { published: !lesson.published })} className={cn("rounded-lg px-2 py-1 text-[10px] font-semibold", lesson.published ? "bg-teal/15 text-teal" : "bg-muted text-muted-foreground")}>{lesson.published ? "Published" : "Draft"}</button>
              <Button variant="dashboard" size="icon" aria-label={`Delete ${lesson.title}`} onClick={() => deleteLesson(courseId, section.id, lesson.id)}><Trash2 /></Button>
            </div>
          );
        })}
      </div>

      <form
        className="mt-3 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!lessonTitle.trim()) return;
          addLesson(courseId, section.id, { title: lessonTitle.trim(), type: lessonType, duration: duration.trim() || "—", published: false });
          setLessonTitle(""); setDuration("");
        }}
      >
        <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="New lesson title…" aria-label="New lesson title" className={cn(field, "min-w-40 flex-1")} />
        <select value={lessonType} onChange={(e) => setLessonType(e.target.value as LessonType)} aria-label="New lesson type" className={cn(field, "w-32")}>
          {lessonTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Length" aria-label="New lesson length" className={cn(field, "w-28")} />
        <Button type="submit" variant="dashboard"><Plus />Add lesson</Button>
      </form>
    </article>
  );
}

export function StudentCoursePage({ courseId }: { courseId: string }) {
  const course = useCourse(courseId);
  const [active, setActive] = useState<string | null>(null);
  if (!course) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Course unavailable</h1>
        <Button variant="brand" className="mt-5" asChild><Link to="/instructor/courses">Back to courses</Link></Button>
      </main>
    );
  }
  const visible = course.sections.map((section) => ({ ...section, lessons: section.lessons.filter((l) => l.published) })).filter((s) => s.lessons.length > 0);
  return (
    <div className="min-h-screen bg-ink text-foreground">
      <header className="border-b border-border px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <span className="font-semibold text-brand">TechHive</span>
          <Button variant="dashboard" size="sm" asChild><Link to="/instructor/course/$id/builder" params={{ id: course.id }}>Back to builder</Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <p className="text-xs font-medium uppercase text-brand">{course.level} · {course.price}</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{course.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{course.summary}</p>
        {course.status === "Draft" && <p className="mt-4 rounded-xl bg-amber/10 px-4 py-2 text-xs text-amber ring-1 ring-amber/20">This course is still a draft, so learners cannot enrol yet.</p>}
        <div className="mt-8 space-y-3">
          {visible.map((section, index) => (
            <section key={section.id} className={cn(panel, "p-5")}>
              <h2 className="text-[15px] font-semibold">{String(index + 1).padStart(2, "0")} · {section.title}</h2>
              <div className="mt-3 divide-y divide-border border-t border-border">
                {section.lessons.map((lesson) => {
                  const Icon = typeIcon[lesson.type];
                  return (
                    <button key={lesson.id} onClick={() => setActive(lesson.id)} className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-muted">
                      <Icon className="size-4 text-brand" />
                      <span className="flex-1 text-sm font-medium">{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">{lesson.type} · {lesson.duration}</span>
                    </button>
                  );
                })}
              </div>
              {section.lessons.some((l) => l.id === active) && <p className="mt-3 rounded-xl bg-brand-soft px-3 py-2 text-xs text-brand">Demo player: this lesson would open here.</p>}
            </section>
          ))}
          {visible.length === 0 && <p className={cn(panel, "p-10 text-center text-sm text-muted-foreground")}>No published lessons yet — check back soon.</p>}
        </div>
      </main>
    </div>
  );
}
