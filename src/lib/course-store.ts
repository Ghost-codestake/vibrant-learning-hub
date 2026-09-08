import { useSyncExternalStore } from "react";

export type LessonType = "Video" | "Reading" | "Quiz" | "Assignment";
export type Lesson = { id: string; title: string; type: LessonType; duration: string; published: boolean };
export type Section = { id: string; title: string; lessons: Lesson[] };
export type Course = {
  id: string;
  title: string;
  summary: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: string;
  learners: number;
  status: "Draft" | "Live";
  sections: Section[];
};

let nextId = 100;
const id = () => `x${++nextId}`;

let courses: Course[] = [
  {
    id: "1",
    title: "Advanced Data Structures",
    summary: "Master trees, graphs, and algorithm design with hands-on labs and weekly projects.",
    level: "Advanced",
    price: "₦85,000",
    learners: 312,
    status: "Live",
    sections: [
      { id: "s1", title: "Foundations", lessons: [
        { id: "l1", title: "Complexity refresher", type: "Video", duration: "12:40", published: true },
        { id: "l2", title: "Arrays and hashing", type: "Reading", duration: "9 min", published: true },
      ] },
      { id: "s2", title: "Trees & graphs", lessons: [
        { id: "l3", title: "Binary search trees", type: "Video", duration: "14:20", published: true },
        { id: "l4", title: "Traversal techniques", type: "Reading", duration: "8 min", published: true },
        { id: "l5", title: "Practice lab", type: "Assignment", duration: "20 points", published: false },
      ] },
      { id: "s3", title: "Algorithm design", lessons: [
        { id: "l6", title: "Greedy vs dynamic", type: "Video", duration: "18:05", published: true },
        { id: "l7", title: "Checkpoint quiz", type: "Quiz", duration: "10 questions", published: false },
      ] },
    ],
  },
  {
    id: "2",
    title: "Cloud Architecture 101",
    summary: "Design resilient, multi-region cloud systems from first principles.",
    level: "Intermediate",
    price: "₦65,000",
    learners: 208,
    status: "Live",
    sections: [
      { id: "s4", title: "Cloud building blocks", lessons: [
        { id: "l8", title: "Compute and storage", type: "Video", duration: "16:10", published: true },
        { id: "l9", title: "Networking basics", type: "Reading", duration: "11 min", published: true },
      ] },
      { id: "s5", title: "Reliability", lessons: [
        { id: "l10", title: "Failover strategies", type: "Video", duration: "13:35", published: true },
        { id: "l11", title: "Lab 4 · Multi-region deploy", type: "Assignment", duration: "40 points", published: true },
      ] },
    ],
  },
  {
    id: "3",
    title: "API Design Patterns",
    summary: "Versioning, pagination, idempotency, and error contracts that scale.",
    level: "Beginner",
    price: "₦40,000",
    learners: 96,
    status: "Draft",
    sections: [
      { id: "s6", title: "Contracts", lessons: [
        { id: "l12", title: "Resource modelling", type: "Video", duration: "10:15", published: false },
      ] },
    ],
  },
];

const listeners = new Set<() => void>();
const emit = () => { courses = [...courses]; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const snapshot = () => courses;

export function useCourses() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
export function useCourse(courseId: string) {
  return useCourses().find((course) => course.id === courseId);
}

const withCourse = (courseId: string, update: (course: Course) => void) => {
  const course = courses.find((item) => item.id === courseId);
  if (course) update(course);
  emit();
};

export const createCourse = (title: string): string => {
  const newId = id();
  courses = [
    { id: newId, title, summary: "Add a short description of what learners will achieve.", level: "Beginner", price: "₦0", learners: 0, status: "Draft", sections: [] },
    ...courses,
  ];
  emit();
  return newId;
};

export const updateCourse = (courseId: string, patch: Partial<Omit<Course, "id" | "sections">>) =>
  withCourse(courseId, (course) => Object.assign(course, patch));

export const deleteCourse = (courseId: string) => { courses = courses.filter((c) => c.id !== courseId); emit(); };

export const addSection = (courseId: string, title: string) =>
  withCourse(courseId, (course) => { course.sections = [...course.sections, { id: id(), title, lessons: [] }]; });

export const renameSection = (courseId: string, sectionId: string, title: string) =>
  withCourse(courseId, (course) => { course.sections = course.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)); });

export const deleteSection = (courseId: string, sectionId: string) =>
  withCourse(courseId, (course) => { course.sections = course.sections.filter((s) => s.id !== sectionId); });

export const moveSection = (courseId: string, sectionId: string, direction: -1 | 1) =>
  withCourse(courseId, (course) => {
    const list = [...course.sections];
    const from = list.findIndex((s) => s.id === sectionId);
    const to = from + direction;
    const a = list[from];
    const b = list[to];
    if (!a || !b) return;
    list[from] = b;
    list[to] = a;
    course.sections = list;
  });

export const addLesson = (courseId: string, sectionId: string, lesson: Omit<Lesson, "id">) =>
  withCourse(courseId, (course) => {
    course.sections = course.sections.map((s) => (s.id === sectionId ? { ...s, lessons: [...s.lessons, { ...lesson, id: id() }] } : s));
  });

export const updateLesson = (courseId: string, sectionId: string, lessonId: string, patch: Partial<Omit<Lesson, "id">>) =>
  withCourse(courseId, (course) => {
    course.sections = course.sections.map((s) =>
      s.id === sectionId ? { ...s, lessons: s.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) } : s,
    );
  });

export const deleteLesson = (courseId: string, sectionId: string, lessonId: string) =>
  withCourse(courseId, (course) => {
    course.sections = course.sections.map((s) => (s.id === sectionId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s));
  });

export const courseStats = (course: Course) => {
  const lessons = course.sections.flatMap((s) => s.lessons);
  const published = lessons.filter((l) => l.published).length;
  return { sections: course.sections.length, lessons: lessons.length, published, readiness: lessons.length ? Math.round((published / lessons.length) * 100) : 0 };
};
