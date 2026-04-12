import { getPrivatePageContext } from "@/lib/private-context";
import { getProjectsPageData, type ProjectStage } from "@/lib/projects";
import { ProjectsPage } from "@/ui/pages/privatePages/ProjectsPage";
import { resolveLocale } from "@/utils/i18n";

export default async function ProjectsRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : undefined;

  const q = typeof params?.q === "string" ? params.q : "";
  const stageRaw = typeof params?.stage === "string" ? params.stage : "all";
  const stage =
    stageRaw === "scoping" ||
    stageRaw === "planned" ||
    stageRaw === "execution" ||
    stageRaw === "delivery" ||
    stageRaw === "archived"
      ? (stageRaw as ProjectStage)
      : "all";

  const [{ org, user }, locale] = await Promise.all([
    getPrivatePageContext(),
    resolveLocale(),
  ]);
  const data = await getProjectsPageData({ q, stage }, locale);

  return (
    <ProjectsPage
      data={data}
      filters={{ q, stage }}
      orgName={org.name}
      userName={user.name}
    />
  );
}
