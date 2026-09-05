import { createFileRoute } from "@tanstack/react-router";
import { DashboardHome } from "@/components/instructor-dashboard";
export const Route = createFileRoute("/instructor/dashboard")({
  head: () => ({ meta: [{ title: "Instructor Dashboard — TechHive" }, { name: "description", content: "Track courses, learners, submissions, and earnings." }, { property: "og:title", content: "Instructor Dashboard — TechHive" }, { property: "og:description", content: "Track courses, learners, submissions, and earnings." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: DashboardHome,
});