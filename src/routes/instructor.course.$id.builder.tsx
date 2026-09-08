import { createFileRoute } from "@tanstack/react-router";
import { CourseBuilderPage } from "@/components/course-builder";

export const Route = createFileRoute("/instructor/course/$id/builder")({
  head: () => ({
    meta: [
      { title: "Course Builder — TechHive" },
      { name: "description", content: "Add sections and lessons, edit details, and publish a TechHive course." },
      { property: "og:title", content: "Course Builder — TechHive" },
      { property: "og:description", content: "Add sections and lessons, edit details, and publish a TechHive course." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuilderRoute,
});

function BuilderRoute() {
  const { id } = Route.useParams();
  return <CourseBuilderPage courseId={id} />;
}
