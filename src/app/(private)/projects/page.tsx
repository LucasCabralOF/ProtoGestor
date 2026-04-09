import { getPrivatePageContext } from "@/lib/private-context";
import { ProjectsPage } from "@/ui/pages/privatePages/ProjectsPage";

export default async function ProjectsRoute() {
  const { org, user } = await getPrivatePageContext();

  return <ProjectsPage orgName={org.name} userName={user.name} />;
}
