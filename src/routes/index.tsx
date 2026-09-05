import { createFileRoute, redirect } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/instructor/dashboard" }); },
  head: () => ({ meta: [
    { title: "TechHive Instructor Dashboard" },
    { name: "description", content: "Instructor teaching overview in TechHive LMS." },
    { property: "og:title", content: "TechHive Instructor Dashboard" },
    { property: "og:description", content: "Instructor teaching overview in TechHive LMS." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
