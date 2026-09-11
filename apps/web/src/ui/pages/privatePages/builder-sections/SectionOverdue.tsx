import type { useTranslations } from "next-intl";
import type { ReportsData } from "@/lib/reports";

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
