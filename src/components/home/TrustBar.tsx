import { useTranslations } from "next-intl";
import { Award, Truck, Headphones, Clock } from "lucide-react";

const icons = [Award, Award, Truck, Headphones];

export default function TrustBar() {
  const t = useTranslations("trust");

  const items = [
    { icon: Clock,      title: t("years"),     desc: t("yearsDesc") },
    { icon: Award,      title: t("certified"),  desc: t("certifiedDesc") },
    { icon: Truck,      title: t("delivery"),   desc: t("deliveryDesc") },
    { icon: Headphones, title: t("support"),    desc: t("supportDesc") },
  ];

  return (
    <section className="bg-brand-navy py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-brand-green/15 border border-brand-green/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
