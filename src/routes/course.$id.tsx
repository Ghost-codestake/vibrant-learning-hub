import { createFileRoute } from "@tanstack/react-router";
import { StudentCoursePage } from "@/components/course-builder";

export const Route = createFileRoute("/course/$id")({
  head: () => ({
    meta: [
      { title: "Course — TechHive LMS" },
      { name: "description", content: "Student view of a TechHive course curriculum, lessons, and resources." },
      { property: "og:title", content: "Course — TechHive LMS" },
      { property: "og:description", content: "Student view of a TechHive course curriculum, lessons, and resources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentCourseRoute,
});

function StudentCourseRoute() {
  const { id } = Route.useParams();
  return <StudentCoursePage courseId={id} />;
}
