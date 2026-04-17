import type { ReportsData } from "@/lib/reports";
import type { useTranslations } from "next-intl";
import { ServiceStatusChart, TopCustomersChart } from "@/ui/pages/privatePages/PrintableReportCharts";

export function SectionAttention({ data, t }: { data: ReportsData; t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">{t("attention.title")}</h3>
      <div className="mt-4 grid gap-3">
        {data.attentionItems.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            {t("attention.empty")}
          </p>
        ) : (
          data.attentionItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function SectionServiceStatus({ data, t }: { data: ReportsData; t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">{t("operations.statusTitle")}</h3>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <ServiceStatusChart data={data.serviceStatus} />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">{t("print.statusTable.status")}</th>
              <th className="px-4 py-3 font-medium">{t("print.statusTable.count")}</th>
            </tr>
          </thead>
          <tbody>
            {data.serviceStatus.map((item) => (
              <tr key={item.key} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-900">{item.label}</td>
                <td className="px-4 py-3 text-slate-700">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SectionUpcoming({ data, t }: { data: ReportsData; t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">{t("operations.upcomingTitle")}</h3>
      <div className="mt-4 grid gap-3">
        {data.upcomingAppointments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            {t("operations.emptyUpcoming")}
          </p>
        ) : (
          data.upcomingAppointments.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">
                {item.customerName
                  ? t("operations.customerLine", { customer: item.customerName, startsAt: item.startsAtLabel })
                  : item.startsAtLabel}
              </p>
              {item.locationText ? <p className="mt-1 text-xs text-slate-500">{item.locationText}</p> : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function SectionTopCustomers({ data, t }: { data: ReportsData; t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">{t("operations.topCustomersTitle")}</h3>
      {data.topCustomers.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <TopCustomersChart data={data.topCustomers} />
        </div>
      ) : null}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        {data.topCustomers.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">{t("operations.emptyCustomers")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">{t("operations.customer")}</th>
                <th className="px-4 py-3 font-medium">{t("operations.services")}</th>
                <th className="px-4 py-3 font-medium">{t("operations.revenue")}</th>
                <th className="px-4 py-3 font-medium">{t("operations.lastService")}</th>
              </tr>
            </thead>
            <tbody>
              {data.topCustomers.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-slate-700">{item.servicesCount}</td>
                  <td className="px-4 py-3 text-slate-700">{item.revenueLabel}</td>
                  <td className="px-4 py-3 text-slate-700">{item.lastServiceLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
