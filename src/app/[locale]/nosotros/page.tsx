import { Link } from "@/i18n/navigation";
import {
  Target, Eye, Handshake, Clock, Heart, Users,
  Phone, Mail, MapPin,
  ShieldCheck, Network, Wifi, Server, Monitor, Video, Phone as PhoneIcon, Zap,
  ArrowRight, Share2,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "CCS Sales: empresa mexicana dedicada a la comercialización de equipos de comunicación y cómputo con más de una década de trayectoria en tecnología.",
};

const values = [
  {
    icon: Eye,
    title: "Transparentes",
    desc: "Siempre enfocados en la satisfacción del cliente, con honestidad en cada proceso.",
  },
  {
    icon: Heart,
    title: "Cuidado",
    desc: "Cuidamos a nuestros clientes y hacemos nuestras sus necesidades tecnológicas.",
  },
  {
    icon: Handshake,
    title: "Relaciones",
    desc: "Las buenas relaciones comerciales han llevado a CCS al lugar en donde se encuentra hoy.",
  },
  {
    icon: Clock,
    title: "Oportunos",
    desc: "Ser oportunos y eficientes es nuestra prioridad en cada entrega y soporte.",
  },
];

const team = [
  { name: "Catalina", role: "Gerente de Operaciones · Fundadora" },
  { name: "Marie Sunderland", role: "Operaciones y Comercio Electrónico" },
  { name: "Santiago Maldonado", role: "Soporte Técnico" },
  { name: "Guarneros Tello", role: "Logística" },
];

const services = [
  {
    icon: Network,
    title: "Equipo de Telecomunicaciones",
    desc: "Networking, Switching & Routing CISCO para pequeña, mediana y gran empresa. Tecnología hasta 100 GB, PoE IEEE 802.3af/at.",
  },
  {
    icon: ShieldCheck,
    title: "Consultoría en Seguridad Informática",
    desc: "Soluciones Acronis, Hillstone y Fortinet. Protección contra ransomware, virus y ataques cibernéticos avanzados.",
  },
  {
    icon: Video,
    title: "Videovigilancia",
    desc: "Tecnología H.264/H.265 con marcas AXIS e HikVision. Software Milestone XP. Soluciones desde 1 hasta más de 1,000 cámaras.",
  },
  {
    icon: Wifi,
    title: "Redes Inalámbricas",
    desc: "Wi-Fi corporativo y redes en campus. Hasta 750 Mbps TDD, 1.2 Gbps láser. Bandas 2.4/5-6 GHz, punto a punto y multipunto.",
  },
  {
    icon: Zap,
    title: "Cableado Estructurado",
    desc: "Cobre y fibra óptica certificado EIA/TIA 568/606. Cat 5E/6/6A/7. Fibra OM3/OM4. Certificaciones PANDUIT, Belden y Fibremex.",
  },
  {
    icon: Server,
    title: "Servidores, Storage y Cómputo",
    desc: "CISCO, HPE, DELL, LENOVO. Laptops y desktops nuevos y seminuevos. Soluciones para virtualización y bases de datos.",
  },
  {
    icon: PhoneIcon,
    title: "Telefonía IP",
    desc: "Call Center, videoconferencia, WebEx y MeetingPlace. Integración con Active Directory y Microsoft Exchange.",
  },
  {
    icon: Monitor,
    title: "Cómputo Empresarial",
    desc: "Workstations, thin clients y equipos rugged para profesionales y trabajo en campo. LENOVO, DELL, ASUS, ACER.",
  },
];

const social = [
  { label: "Facebook", handle: "@CiscoAndComputersSales", href: "https://www.facebook.com/CiscoAndComputersSales" },
  { label: "Twitter / X", handle: "@_CCS_SALES", href: "https://twitter.com/_CCS_SALES" },
  { label: "LinkedIn", handle: "ccs-sales", href: "https://www.linkedin.com/company/ccs-sales/" },
  { label: "Instagram", handle: "@_ccs_sales", href: "https://www.instagram.com/_ccs_sales/" },
];

export default function NosotrosPage() {
  return (
    <div className="pt-16">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-brand-navy relative overflow-hidden py-20 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-cyan rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-3">
            Quiénes somos
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Communications, Computers{" "}
            <span className="text-brand-green">&amp; Sales</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            CCS Sales es una empresa dedicada a la comercialización de equipos de comunicación
            y cómputo, resultado de una trayectoria de más de una década en el mundo de la
            tecnología y la innovación.
          </p>
        </div>
      </section>

      {/* ── Historia ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-3">
                Nuestra historia
              </p>
              <h2 className="text-3xl font-bold text-brand-navy mb-5">
                Más de una década construyendo relaciones tecnológicas
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Fundada en <strong>2020 por Catalina</strong>, CCS Sales es el resultado de más de
                  diez años de experiencia en la industria tecnológica. La historia de nuestra marca
                  se remonta a los primeros pasos en el negocio de la tecnología, cuando la empresa
                  se centraba en la venta de equipos para imprenta y computadoras.
                </p>
                <p>
                  Durante esa etapa inicial se forjó la pasión por la tecnología y la visión de
                  proporcionar soluciones tecnológicas de alta calidad a las empresas mexicanas.
                  Poco a poco, CCS evolucionó hacia las telecomunicaciones y el cómputo empresarial,
                  consolidando alianzas con los principales fabricantes del mercado.
                </p>
                <p>
                  Hoy somos distribuidores certificados de Cisco, Fortinet, Aruba, HPE, Lenovo,
                  Extreme Networks, Zebra y Meraki, atendiendo a empresas de todos los tamaños
                  en la Ciudad de México y todo el país.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-6">
              {[
                { year: "2010–", label: "Inicio en tecnología", desc: "Equipos de imprenta y cómputo. Primeros pasos en la industria." },
                { year: "2015–", label: "Telecomunicaciones", desc: "Expansión hacia networking y sistemas de seguridad empresarial." },
                { year: "2020",  label: "Fundación de CCS Sales", desc: "Constitución formal de la empresa por Catalina con enfoque B2B." },
                { year: "Hoy",   label: "Distribuidores certificados", desc: "8 marcas líderes, presencia nacional y crecimiento continuo." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-green text-[10px] font-bold">{item.year}</span>
                    </div>
                    {i < 3 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="font-bold text-brand-navy text-sm">{item.label}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Misión y Visión ────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-brand-gray">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-navy flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Misión</h3>
              <p className="text-slate-600 leading-relaxed">
                Aportar el equipo de telecomunicaciones que necesiten empresas y clientes en
                desarrollo, en las mejores condiciones y precio del mercado.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-navy flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Visión</h3>
              <p className="text-slate-600 leading-relaxed">
                Ser la comercializadora de equipo de tecnología más reconocida por la calidad
                de sus equipos, integridad y servicio a sus clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-2">
              Lo que nos define
            </p>
            <h2 className="text-3xl font-bold text-brand-navy">Nuestros valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col p-6 rounded-2xl bg-brand-gray border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-green" />
                </div>
                <h4 className="font-bold text-brand-navy mb-2">{title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Servicios ─────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-brand-navy">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-2">
              Nuestro portafolio
            </p>
            <h2 className="text-3xl font-bold text-white">Lo que ofrecemos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-green/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-green/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-green" />
                </div>
                <h4 className="font-bold text-white text-sm mb-2">{title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipo ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-2">
              Las personas detrás de CCS
            </p>
            <h2 className="text-3xl font-bold text-brand-navy">Nuestro equipo</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map(({ name, role }) => (
              <div key={name} className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-brand-gray border-2 border-slate-100 flex items-center justify-center">
                  <Users className="w-7 h-7 text-brand-navy/30" />
                </div>
                <div>
                  <p className="font-bold text-brand-navy text-sm">{name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contacto ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-brand-gray">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-navy">Encuéntranos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100">
              <h3 className="font-bold text-brand-navy mb-6">Datos de contacto</h3>
              <div className="flex flex-col gap-4">
                {[
                  { icon: MapPin, text: "Adolfo Prieto 1649 Piso 1, Col. del Valle Centro, C.P. 03100, Ciudad de México", href: "https://maps.google.com/?q=Adolfo+Prieto+1649,+Del+Valle+Centro,+CDMX" },
                  { icon: Phone, text: "55-5812-3019 / 5618-5079-97", href: "tel:+525558123019" },
                  { icon: Mail, text: "info@ccsales.com.mx", href: "mailto:info@ccsales.com.mx" },
                ].map(({ icon: Icon, text, href }) => (
                  <a key={text} href={href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-brand-navy flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-brand-green" />
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-brand-navy transition-colors mt-1.5 leading-snug">{text}</span>
                  </a>
                ))}
              </div>

              {/* Datos fiscales */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Datos fiscales</p>
                <p className="text-sm text-slate-600">Communications, Computers &amp; Sales</p>
                <p className="text-sm font-mono text-slate-600">RFC: CCC210715MS6</p>
              </div>
            </div>

            {/* Social + CTA */}
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl p-8 border border-slate-100">
                <h3 className="font-bold text-brand-navy mb-5">Síguenos</h3>
                <div className="flex flex-col gap-3">
                  {social.map(({ label, handle, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-navy transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-gray group-hover:bg-brand-navy flex items-center justify-center transition-colors">
                        <Share2 className="w-3.5 h-3.5 text-brand-navy group-hover:text-brand-green transition-colors" />
                      </div>
                      <span><span className="font-semibold">{label}</span> · {handle}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-brand-navy rounded-2xl p-8 text-center">
                <p className="text-white font-bold mb-2">¿Listo para cotizar?</p>
                <p className="text-slate-400 text-sm mb-5">Contáctanos y recibe una propuesta en menos de 24 horas.</p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green text-brand-navy font-semibold text-sm hover:bg-brand-green-light transition-colors"
                >
                  Solicitar cotización <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
