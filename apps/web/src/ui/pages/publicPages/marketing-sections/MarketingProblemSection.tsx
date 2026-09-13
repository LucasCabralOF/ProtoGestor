import { getTranslations } from "next-intl/server";
import { FiClock, FiDollarSign, FiFileText } from "react-icons/fi";

export async function MarketingProblemSection() {
  const t = await getTranslations("marketing");

  const cards = [
    {
      title: t("problem.cards.recurring.title"),
      body: t("problem.cards.recurring.body"),
      icon: FiClock,
    },
    {
      title: t("problem.cards.orders.title"),
      body: t("problem.cards.orders.body"),
      icon: FiFileText,
    },
    {
      title: t("problem.cards.collections.title"),
      body: t("problem.cards.collections.body"),
      icon: FiDollarSign,
    },
  ];

  return (
    <section className="grid gap-6 rounded-xl border border-emerald-900/60 bg-[#0c1f16] p-4 sm:p-6 text-white shadow-md lg:grid-cols-[0.82fr_1.18fr] lg:p-8">
      <div className="max-w-xl">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-white/55">
          {t("problem.eyebrow")}
        </p>
        <h2 className="mt-1.5 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
          {t("problem.title")}
        </h2>
        <p className="mt-2 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-white/70">
          {t("problem.subtitle")}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-lg border border-emerald-800/40 bg-[#12281d] p-4 sm:p-6"
            >
              <span className="inline-flex rounded-md border border-white/10 bg-white/8 p-2.5 sm:p-3 text-emerald-400">
                <Icon size={18} />
              </span>
              <h2 className="mt-3 sm:mt-5 text-lg sm:text-xl font-bold">
                {item.title}
              </h2>
              <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-7 text-white/68">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
