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
    <section className="grid gap-6 rounded-[38px] border border-slate-900/12 bg-[linear-gradient(180deg,#0f172a,#13213f)] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] lg:grid-cols-[0.82fr_1.18fr] lg:p-8">
      <div className="max-w-xl">
        <p className="text-sm font-semibold tracking-[0.16em] uppercase text-white/55">
          {t("problem.eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
          {t("problem.title")}
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/70">
          {t("problem.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-white/7 p-6 backdrop-blur"
            >
              <span className="inline-flex rounded-2xl border border-white/10 bg-white/8 p-3 text-sky-300">
                <Icon size={18} />
              </span>
              <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/68">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
