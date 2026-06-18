import { Shield, Award, Truck, Headphones } from "lucide-react";

const items = [
  { icon: Award,      title: "+15 años",          desc: "Experiencia en tecnología enterprise B2B" },
  { icon: Shield,     title: "Distribuidor oficial", desc: "Cisco, Fortinet, Aruba HPE y más marcas líderes" },
  { icon: Truck,      title: "Entrega CDMX",       desc: "Envío express el mismo día en zona metropolitana" },
  { icon: Headphones, title: "Soporte técnico",    desc: "Pre y post venta con ingenieros certificados" },
];

export default function TrustBar() {
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
