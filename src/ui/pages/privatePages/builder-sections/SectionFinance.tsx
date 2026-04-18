import type { useTranslations } from "next-intl";
import type { ReportsData } from "@/lib/reports";
import {
  CategoriesChart,
  MonthlySeriesChart,
} from "@/ui/pages/privatePages/PrintableReportCharts";
import { trendToneClass } from "./utils";

export function SectionSummary({
  data,
  t,
}: {
  data: ReportsData;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">
        {t("print.summary.title")}
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">{t("kpis.receivedRevenue")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {data.kpis.receivedRevenueLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">{t("kpis.paidExpenses")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {data.kpis.paidExpensesLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">{t("kpis.netResult")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {data.kpis.netResultLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">{t("kpis.avgTicket")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {data.kpis.avgTicketLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">{t("kpis.activeCustomers")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {data.kpis.activeCustomers}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">{t("kpis.completionRate")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {data.kpis.completionRateLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

export function SectionTrends({
  data,
  t,
}: {
  data: ReportsData;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">
        {t("print.trends.title")}
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          {
            id: "revenue",
            label: t("trends.revenue"),
            trend: data.trends.revenue,
          },
          {
            id: "expenses",
            label: t("trends.expenses"),
            trend: data.trends.expenses,
          },
          { id: "net", label: t("trends.net"), trend: data.trends.net },
          {
            id: "customers",
            label: t("trends.customers"),
            trend: data.trends.customers,
          },
        ].map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {item.trend.currentLabel}
            </p>
            <p
              className={`mt-2 text-sm font-semibold ${trendToneClass(item.trend.direction)}`}
            >
              {item.trend.deltaPct >= 0
                ? `+${item.trend.deltaPct}`
                : item.trend.deltaPct}
              %
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {t("print.trends.previous")}: {item.trend.previousLabel}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SectionMonthlySeries({
  data,
  t,
}: {
  data: ReportsData;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">
        {t("finance.monthlyTitle")}
      </h3>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <MonthlySeriesChart data={data.monthlySeries} />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("print.monthlyTable.month")}
              </th>
              <th className="px-4 py-3 font-medium">{t("finance.income")}</th>
              <th className="px-4 py-3 font-medium">{t("finance.expense")}</th>
              <th className="px-4 py-3 font-medium">
                {t("print.monthlyTable.balance")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.monthlySeries.map((item) => (
              <tr key={item.label} className="border-t border-slate-200">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {item.label}
                </td>
                <td className="px-4 py-3 text-slate-700">{item.incomeLabel}</td>
                <td className="px-4 py-3 text-slate-700">
                  {item.expenseLabel}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {item.balanceLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SectionCategories({
  data,
  t,
}: {
  data: ReportsData;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">
        {t("print.categories.title")}
      </h3>
      {data.categories.income.length > 0 ||
      data.categories.expense.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <CategoriesChart
            expense={data.categories.expense}
            income={data.categories.income}
          />
        </div>
      ) : null}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {t("finance.incomeCategories")}
          </p>
          <div className="mt-3 grid gap-3">
            {data.categories.income.length === 0 ? (
              <p className="text-sm text-slate-500">
                {t("finance.emptyCategories")}
              </p>
            ) : (
              data.categories.income.map((item) => (
                <div key={item.name} className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="font-semibold text-slate-900">
                      {item.amountLabel}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.shareLabel}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {t("finance.expenseCategories")}
          </p>
          <div className="mt-3 grid gap-3">
            {data.categories.expense.length === 0 ? (
              <p className="text-sm text-slate-500">
                {t("finance.emptyCategories")}
              </p>
            ) : (
              data.categories.expense.map((item) => (
                <div key={item.name} className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="font-semibold text-slate-900">
                      {item.amountLabel}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.shareLabel}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionOverdue({
  data,
  t,
}: {
  data: ReportsData;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">
        {t("finance.overdueTitle")}
      </h3>
      <div className="mt-4 grid gap-3">
        {data.overdueTransactions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            {t("finance.emptyOverdue")}
          </p>
        ) : (
          data.overdueTransactions.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.description}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.contactName
                      ? t("finance.overdueLine", {
                          type: item.typeLabel,
                          contact: item.contactName,
                          dueAt: item.dueAtLabel,
                        })
                      : t("finance.overdueLineNoContact", {
                          type: item.typeLabel,
                          dueAt: item.dueAtLabel,
                        })}
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {item.amountLabel}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
