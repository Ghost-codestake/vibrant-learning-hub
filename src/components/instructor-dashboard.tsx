import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award, BarChart3, Bell, BookOpen, ChevronRight, ClipboardCheck, DollarSign,
  FileText, LayoutDashboard, Menu, Plus, Search, Sparkles, TrendingUp, Users,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InstructorNavItem = { label: string; to: string; icon: typeof LayoutDashboard; badge?: string };
export const instructorNav: InstructorNavItem[] = [
  { label: "Dashboard", to: "/instructor/dashboard", icon: LayoutDashboard },
  { label: "My Courses", to: "/instructor/courses", icon: BookOpen },
  { label: "Course Builder", to: "/instructor/course/1/builder", icon: Sparkles },
  { label: "Section Content", to: "/instructor/section/1", icon: FileText },
  { label: "Assignments", to: "/instructor/assignments", icon: ClipboardCheck, badge: "14" },
  { label: "Results", to: "/instructor/results", icon: BarChart3 },
  { label: "Leaderboard", to: "/instructor/leaderboard", icon: Award },
  { label: "Students", to: "/instructor/students", icon: Users },
] as const;

const courseProgress = [
  { name: "Advanced Data Structures", value: 94, students: 312, tone: "bg-brand" },
  { name: "Cloud Architecture 101", value: 78, students: 208, tone: "bg-teal" },
  { name: "Intro to Machine Learning", value: 61, students: 176, tone: "bg-amber" },
  { name: "API Design Patterns", value: 44, students: 96, tone: "bg-rose" },
];

const submissions = [
  { initials: "MN", name: "Maria N.", work: "ML Project 3", course: "Intro to ML", time: "3h ago", state: "Overdue", tone: "rose" },
  { initials: "JT", name: "James T.", work: "Assignment 7", course: "Data Structures", time: "6h ago", state: "Due today", tone: "amber" },
  { initials: "AP", name: "Aisha P.", work: "Lab 4 Report", course: "Cloud Architecture", time: "1d ago", state: "Queued", tone: "muted" },
  { initials: "LK", name: "Liam K.", work: "Quiz 5", course: "API Design", time: "1d ago", state: "Queued", tone: "muted" },
];

const panel = "rounded-xl bg-panel ring-1 ring-border";

export function InstructorShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  return (
    <div className="min-h-screen bg-ink text-foreground antialiased">
      {mobileOpen && <button aria-label="Close menu" className="fixed inset-0 z-40 bg-ink/80 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-ink px-3 py-5 transition-transform lg:w-[76px] lg:translate-x-0 lg:items-center", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <Link to="/instructor/dashboard" aria-label="TechHive dashboard" className="mb-7 flex h-10 items-center gap-3 self-start rounded-[10px] bg-brand-soft px-3 text-brand ring-1 ring-brand/30 lg:w-10 lg:justify-center lg:self-auto lg:px-0">
          <span className="font-bold">H</span><span className="font-semibold lg:hidden">TechHive</span>
        </Link>
        <nav className="flex w-full flex-col gap-1.5" aria-label="Instructor navigation">
          {instructorNav.map((item) => {
            const active = pathname === item.to || (item.label === "Course Builder" && pathname.includes("/builder")) || (item.label === "Section Content" && pathname.includes("/section/"));
            const Icon = item.icon;
            const destination = item.to.replace("$id", "1");
            return <Link key={item.label} to={destination} onClick={() => setMobileOpen(false)} title={item.label} className={cn("group relative flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm text-muted-foreground transition hover:-translate-y-0.5 hover:bg-panel-raised hover:text-foreground lg:w-10 lg:justify-center lg:px-0", active && "bg-panel-raised text-brand ring-1 ring-brand/30")}>
              <Icon className="size-4" /><span className="lg:hidden">{item.label}</span>{item.badge && <span className="ml-auto rounded-md bg-rose/15 px-1.5 py-0.5 text-[10px] font-semibold text-rose lg:absolute lg:-right-1 lg:-top-1">{item.badge}</span>}
              <span className="pointer-events-none absolute left-12 hidden whitespace-nowrap rounded-md bg-panel-raised px-2 py-1 text-[11px] text-foreground ring-1 ring-border group-hover:lg:block">{item.label}</span>
            </Link>;
          })}
        </nav>
        <div className="mt-auto flex w-full items-center gap-3 rounded-[10px] bg-panel px-2 py-2 ring-1 ring-border lg:size-10 lg:justify-center lg:p-0"><span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-[11px] font-semibold text-brand">DR</span><span className="text-sm lg:hidden">Dr. Reyes</span></div>
      </aside>
      <div className="lg:pl-[76px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-ink/90 px-4 backdrop-blur md:px-5">
          <Button variant="dashboard" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button>
          <div className="relative hidden max-w-[360px] flex-1 sm:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input aria-label="Search" placeholder="Search courses, learners, submissions…" className="h-9 w-full rounded-[10px] bg-panel py-2 pl-9 pr-3 text-[13px] text-foreground outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-brand/50" /></div>
          <span className="ml-auto hidden text-xs text-muted-foreground md:block">Sat, 5 September</span>
          <div className="relative"><Button variant="dashboard" size="icon" aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)}><Bell /><span className="absolute right-2 top-2 size-2 rounded-full bg-rose ring-2 ring-ink" /></Button>{notificationsOpen && <div className="absolute right-0 top-12 w-72 rounded-xl bg-panel-raised p-3 text-sm shadow-2xl ring-1 ring-border"><p className="font-semibold">Notifications</p><p className="mt-2 text-xs leading-5 text-muted-foreground">6 overdue submissions and 8 new assignments are waiting for review.</p></div>}</div>
          <div className="flex items-center gap-2 rounded-[10px] bg-panel py-1 pl-1 pr-3 ring-1 ring-border"><div className="grid size-7 place-items-center rounded-lg bg-brand-soft text-[11px] font-semibold text-brand">DR</div><span className="hidden text-[13px] font-medium sm:inline">Dr. Reyes</span></div>
        </header>
        {children}
      </div>
    </div>
  );
}

export function DashboardHome() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => submissions.filter((item) => `${item.name} ${item.work}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <InstructorShell><main className="mx-auto max-w-[1500px] px-4 py-6 md:px-6">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 animate-rise"><div><p className="text-xs font-medium uppercase text-brand">Instructor workspace</p><h1 className="mt-1 max-w-2xl text-2xl font-semibold leading-tight text-foreground md:text-[26px]">Good morning, Dr. Reyes — 14 items need your attention.</h1></div><div className="flex gap-2"><Button variant="dashboard">Export report</Button><Button variant="brand"><Plus />New course</Button></div></div>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Metric label="Active learners" value="1,284" note="↑ 8.2% this week" icon={<Users />} tone="brand" />
      <Metric label="Pending grading" value="14" note="6 overdue" icon={<ClipboardCheck />} tone="amber" />
      <Metric label="Avg. completion" value="72%" note="↑ 3 pts vs last term" icon={<TrendingUp />} tone="teal" />
      <Metric label="Gross earnings" value="₦18.4m" note="↑ 12% month over month" icon={<DollarSign />} tone="rose" />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
      <section className={cn(panel, "p-5 xl:col-span-5")}><SectionTitle title="Active course progress" action="View all" /><p className="mt-1 text-xs text-muted-foreground">Enrollment and completion across your live courses</p><div className="mt-5 space-y-5">{courseProgress.map((course) => <div key={course.name}><div className="flex justify-between gap-3 text-[13px]"><span className="truncate font-medium">{course.name}</span><span className="shrink-0 text-muted-foreground">{course.value}% · {course.students}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full animate-progress", course.tone)} style={{ width: `${course.value}%` }} /></div></div>)}</div></section>
      <section className={cn(panel, "p-5 xl:col-span-4")}><div className="flex items-center justify-between"><h2 className="text-[15px] font-semibold">Pending grading</h2><span className="rounded-lg bg-amber/15 px-2 py-1 text-[11px] font-semibold text-amber">14 open</span></div><div className="relative mt-3"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter submissions" className="h-8 w-full rounded-lg bg-muted pl-8 pr-3 text-xs outline-none ring-1 ring-border focus:ring-brand/50" /></div><div className="mt-2 space-y-1">{filtered.map((item) => <Submission key={item.name} {...item} />)}</div></section>
      <section className={cn(panel, "p-5 xl:col-span-3")}><h2 className="text-[15px] font-semibold">Earnings</h2><p className="mt-1 text-xs text-muted-foreground">Last 6 weeks</p><p className="mt-3 text-2xl font-semibold">₦18.4m</p><p className="mt-1 text-xs font-medium text-teal">↑ 12% vs prior period</p><MiniBars values={[42,58,50,72,86,100]} tone="bg-brand" /></section>
      <section className={cn(panel, "p-5 xl:col-span-7")}><SectionTitle title="Learner activity" action="Today" muted /><MiniBars values={[38,62,54,74,68,92,100]} labels={["M","T","W","T","F","S","S"]} tone="bg-teal" tall /><div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4"><QuickStat value="524" label="Sessions today"/><QuickStat value="63" label="New signups"/><QuickStat value="31" label="Reviews left"/></div></section>
      <section className={cn(panel, "p-5 xl:col-span-5")}><SectionTitle title="Top performers" action="Leaderboard" /><div className="mt-4 space-y-1">{[["SR","Sofia R.",98],["DO","Daniel O.",95],["CW","Chen W.",93],["EM","Elena M.",91]].map(([initials,name,score], index) => <div key={String(name)} className="flex items-center gap-3 rounded-[10px] px-2 py-2 hover:bg-muted"><span className={cn("w-5 text-xs font-semibold", index === 0 ? "text-amber" : "text-muted-foreground")}>{index + 1}</span><Avatar initials={String(initials)} /><p className="flex-1 text-[13px] font-medium">{name}</p><span className="text-xs font-semibold text-teal">{score}</span></div>)}</div></section>
    </div>
  </main></InstructorShell>;
}

function Metric({ label, value, note, icon, tone }: { label: string; value: string; note: string; icon: ReactNode; tone: "brand" | "amber" | "teal" | "rose" }) {
  const colors = { brand: "bg-brand-soft text-brand", amber: "bg-amber/15 text-amber", teal: "bg-teal/15 text-teal", rose: "bg-rose/15 text-rose" };
  return <div className={cn(panel, "p-4 animate-rise")}><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><span className={cn("grid size-8 place-items-center rounded-lg [&>svg]:size-4", colors[tone])}>{icon}</span></div><p className="mt-3 text-2xl font-semibold md:text-[28px]">{value}</p><p className={cn("mt-2 text-xs font-medium", tone === "amber" ? "text-rose" : "text-teal")}>{note}</p></div>;
}

function SectionTitle({ title, action, muted }: { title: string; action: string; muted?: boolean }) { return <div className="flex items-center justify-between"><h2 className="text-[15px] font-semibold">{title}</h2><span className={cn("text-xs font-medium", muted ? "text-muted-foreground" : "text-brand")}>{action}</span></div>; }
function Avatar({ initials }: { initials: string }) { return <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-[11px] font-semibold ring-1 ring-border">{initials}</div>; }
function Submission({ initials, name, work, course, time, state, tone }: (typeof submissions)[number]) { const style = tone === "rose" ? "bg-rose/15 text-rose" : tone === "amber" ? "bg-amber/15 text-amber" : "bg-muted text-muted-foreground"; return <button className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left transition hover:translate-x-0.5 hover:bg-muted"><Avatar initials={initials}/><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{name} — {work}</p><p className="text-[11px] text-muted-foreground">{course} · {time}</p></div><span className={cn("rounded-lg px-2 py-1 text-[10px] font-semibold", style)}>{state}</span></button>; }
function MiniBars({ values, labels, tone, tall }: { values: number[]; labels?: string[]; tone: string; tall?: boolean }) { return <div><div className={cn("mt-5 flex items-end gap-2", tall ? "h-[150px]" : "h-[120px]")}>{values.map((value,index) => <div key={index} className="flex h-full flex-1 flex-col justify-end gap-1.5"><div className={cn("w-full rounded-t-md opacity-80 transition hover:opacity-100", tone)} style={{height:`${value}%`}} />{labels && <span className="text-center text-[10px] text-muted-foreground">{labels[index]}</span>}</div>)}</div>{!labels && <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">{values.map((_,i)=><span key={i}>W{i+1}</span>)}</div>}</div>; }
function QuickStat({ value, label }: { value: string; label: string }) { return <div><p className="text-xl font-semibold">{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{label}</p></div>; }

type CollectionKind = "courses" | "builder" | "section" | "assignments" | "results" | "leaderboard" | "students";
const pageData: Record<CollectionKind, { eyebrow: string; title: string; description: string; rows: Array<[string,string,string,string]> }> = {
  courses: { eyebrow: "Course library", title: "My courses", description: "Manage your live, draft, and archived learning experiences.", rows: [["Advanced Data Structures","312 learners","94% complete","Live"],["Cloud Architecture 101","208 learners","78% complete","Live"],["Intro to Machine Learning","176 learners","61% complete","Live"],["API Design Patterns","96 learners","44% complete","Draft"]]},
  builder: { eyebrow: "Course builder", title: "Advanced Data Structures", description: "Structure the curriculum, add learning material, and prepare assessments.", rows: [["01 · Foundations","6 lessons","42 min","Published"],["02 · Trees & graphs","8 lessons","1 hr 12 min","Published"],["03 · Algorithm design","7 lessons","58 min","Review"],["04 · Final project","4 lessons","2 assignments","Draft"]]},
  section: { eyebrow: "Section content", title: "Trees & graphs", description: "Review every lesson, resource, and assessment in this section.", rows: [["Binary search trees","Video lesson","14:20","Published"],["Traversal techniques","Reading","8 min","Published"],["Graph representation","Video lesson","18:45","Published"],["Practice lab","Assignment","20 points","Draft"]]},
  assignments: { eyebrow: "Assessment desk", title: "Assignments", description: "Review submissions and keep grading on schedule.", rows: [["ML Project 3","48 submissions","6 overdue","Grade now"],["Data Structures · Assignment 7","32 submissions","Due today","Review"],["Cloud Architecture · Lab 4","27 submissions","Due Friday","Review"],["API Design · Quiz 5","44 submissions","Next week","Scheduled"]]},
  results: { eyebrow: "Learner outcomes", title: "Results", description: "Compare class performance across active courses and assessments.", rows: [["Advanced Data Structures","88.4 avg","92% pass rate","Excellent"],["Cloud Architecture 101","84.1 avg","87% pass rate","Strong"],["Intro to Machine Learning","79.8 avg","81% pass rate","On track"],["API Design Patterns","76.2 avg","74% pass rate","Monitor"]]},
  leaderboard: { eyebrow: "Top performers", title: "Leaderboard", description: "Celebrate the learners leading your courses this term.", rows: [["1 · Sofia Reyes","Advanced Data Structures","98 points","12 badges"],["2 · Daniel Okafor","Cloud Architecture","95 points","10 badges"],["3 · Chen Wei","Intro to Machine Learning","93 points","9 badges"],["4 · Elena Martins","API Design Patterns","91 points","8 badges"]]},
  students: { eyebrow: "Learner directory", title: "Students", description: "View participation, progress, and engagement across your courses.", rows: [["Sofia Reyes","4 courses","96% progress","Active now"],["Daniel Okafor","3 courses","91% progress","12 min ago"],["Chen Wei","4 courses","89% progress","1 hr ago"],["Elena Martins","2 courses","87% progress","Yesterday"]]},
};

export function CollectionPage({ kind }: { kind: CollectionKind }) {
  const data = pageData[kind]; const [query,setQuery] = useState(""); const [created,setCreated] = useState(false);
  const rows = data.rows.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase()));
  return <InstructorShell><main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase text-brand">{data.eyebrow}</p><h1 className="mt-1 text-3xl font-semibold">{data.title}</h1><p className="mt-2 text-sm text-muted-foreground">{data.description}</p></div><Button variant="brand" onClick={() => setCreated(true)}><Plus />{kind === "courses" ? "New course" : kind === "assignments" ? "New assignment" : "Add item"}</Button></div>{created && <div className="mt-5 flex items-center justify-between rounded-xl bg-teal/10 px-4 py-3 text-sm text-teal ring-1 ring-teal/20"><span>Demo item added to this view.</span><button aria-label="Dismiss" onClick={() => setCreated(false)}>×</button></div>}<div className={cn(panel,"mt-6 overflow-hidden")}><div className="flex flex-wrap items-center gap-3 border-b border-border p-4"><div className="relative min-w-52 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={`Search ${data.title.toLowerCase()}…`} className="h-9 w-full rounded-[10px] bg-muted pl-9 pr-3 text-sm outline-none ring-1 ring-border focus:ring-brand/50"/></div><Button variant="dashboard">Filter</Button><Button variant="dashboard">Export</Button></div><div className="divide-y divide-border">{rows.map((row,index)=><button key={row[0]} className="grid w-full grid-cols-[1fr_auto] items-center gap-4 p-4 text-left transition hover:bg-muted md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]"><div className="flex items-center gap-3"><Avatar initials={String(index+1).padStart(2,"0")}/><span className="text-sm font-semibold">{row[0]}</span></div>{row.slice(1).map((cell)=><span key={cell} className="hidden text-sm text-muted-foreground md:block">{cell}</span>)}<ChevronRight className="size-4 text-muted-foreground"/></button>)}{rows.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No matching items found.</div>}</div></div></main></InstructorShell>;
}