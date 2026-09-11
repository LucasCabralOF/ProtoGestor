import { redirect } from "next/navigation";
import { getFinancePageData } from "@/lib/finance";
import type {
  FinanceFilters,
  TransactionStatus,
  TransactionType,
} from "@/lib/finance-utils";
import { getPrivatePageContext } from "@/lib/private-context";
import { FinancePage } from "@/ui/pages/privatePages/FinancePage";
import { resolveLocale } from "@/utils/i18n";

export default async function FinanceRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { org } = await getPrivatePageContext();
  if (org.role === "member") {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;

  const q = typeof params?.q === "string" ? params.q : "";
  const periodRaw =
    typeof params?.period === "string" ? params.period : "this_month";
  const typeRaw = typeof params?.type === "string" ? params.type : "all";
  const statusRaw = typeof params?.status === "string" ? params.status : "all";

  const period =
    periodRaw === "last_month" || periodRaw === "all"
      ? periodRaw
      : "this_month";

  const type: "all" | TransactionType =
    typeRaw === "income" || typeRaw === "expense" ? typeRaw : "all";

  const status: "all" | TransactionStatus | "overdue" =
    statusRaw === "pending" ||
    statusRaw === "paid" ||
    statusRaw === "canceled" ||
    statusRaw === "overdue"
      ? statusRaw
      : "all";

  const filters: FinanceFilters = {
    q,
    period,
    type,
    status,
  };

  const locale = await resolveLocale();
  const data = await getFinancePageData(filters, locale);

  return <FinancePage data={data} filters={filters} />;
}
