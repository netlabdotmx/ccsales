import type { Brand, Solution } from "@/types";

export const brands: Brand[] = [
  {
    slug: "cisco",
    name: "Cisco",
    logo: "/brands/cisco.svg",
    logoDark: "/brands/cisco-white.svg",
    description:
      "Líder global en redes, switches, routers, seguridad y colaboración empresarial con más de 35 años en la industria.",
    partnerLevel: "Cisco Certified Reseller",
    solutionSlugs: ["redes", "seguridad", "wifi", "colaboracion"],
    featured: true,
    color: "#00BCEB",
  },
  {
    slug: "meraki",
    name: "Cisco Meraki",
    logo: "/brands/meraki.svg",
    logoDark: "/brands/meraki-white.svg",
    description:
      "La plataforma cloud de Cisco para redes gestionadas de forma centralizada: switches, APs, cámaras y seguridad.",
    partnerLevel: "Meraki Authorized Reseller",
    solutionSlugs: ["redes", "wifi", "seguridad"],
    featured: true,
    color: "#00BCEB",
  },
  {
    slug: "fortinet",
    name: "Fortinet",
    logo: "/brands/fortinet.svg",
    logoDark: "/brands/fortinet-white.svg",
    description:
      "La plataforma de ciberseguridad más amplia del mercado: firewalls, SASE, SD-WAN, gestión de amenazas y más.",
    partnerLevel: "Fortinet Authorized Partner",
    solutionSlugs: ["seguridad", "redes"],
    featured: true,
    color: "#EE3124",
  },
  {
    slug: "aruba",
    name: "Aruba Networks",
    logo: "/brands/aruba.svg",
    logoDark: "/brands/aruba-white.svg",
    description:
      "Soluciones inteligentes de redes inalámbricas y acceso seguro para campus, sucursales y trabajo remoto.",
    partnerLevel: "Aruba Authorized Reseller",
    solutionSlugs: ["wifi", "redes", "seguridad"],
    featured: true,
    color: "#FF6800",
  },
  {
    slug: "hpe",
    name: "HPE",
    logo: "/brands/hpe.svg",
    logoDark: "/brands/hpe-white.svg",
    description:
      "Servidores, almacenamiento, networking y soluciones edge-to-cloud para infraestructura crítica empresarial.",
    partnerLevel: "HPE Authorized Reseller",
    solutionSlugs: ["servidores", "almacenamiento", "redes"],
    featured: true,
    color: "#01A982",
  },
  {
    slug: "lenovo",
    name: "Lenovo",
    logo: "/brands/lenovo.svg",
    logoDark: "/brands/lenovo-white.svg",
    description:
      "Estaciones de trabajo, servidores ThinkSystem y PCs comerciales para entornos corporativos exigentes.",
    partnerLevel: "Lenovo Business Partner",
    solutionSlugs: ["computo", "servidores"],
    featured: false,
    color: "#E2231A",
  },
  {
    slug: "extreme",
    name: "Extreme Networks",
    logo: "/brands/extreme.svg",
    logoDark: "/brands/extreme-white.svg",
    description:
      "Redes cloud-driven de alto rendimiento para campus, centros de datos y ambientes industriales.",
    partnerLevel: "Extreme Authorized Reseller",
    solutionSlugs: ["redes", "wifi"],
    featured: false,
    color: "#7B2D8B",
  },
  {
    slug: "zebra",
    name: "Zebra Technologies",
    logo: "/brands/zebra.svg",
    logoDark: "/brands/zebra-white.svg",
    description:
      "Impresoras de etiquetas, lectores de código de barras, RFID y tablets rugged para operaciones de campo y almacén.",
    partnerLevel: "Zebra Authorized Partner",
    solutionSlugs: ["computo", "redes"],
    featured: false,
    color: "#000000",
  },
];

export const solutions: Solution[] = [
  {
    slug: "seguridad",
    icon: "ShieldCheck",
    name: { es: "Seguridad", en: "Security" },
    description: {
      es: "Firewalls, UTM, VPN, SASE y gestión de amenazas avanzadas para proteger tu organización.",
      en: "Firewalls, UTM, VPN, SASE and advanced threat management to protect your organization.",
    },
    brandSlugs: ["fortinet", "cisco", "meraki", "aruba"],
  },
  {
    slug: "redes",
    icon: "Network",
    name: { es: "Redes LAN/WAN", en: "LAN/WAN Networks" },
    description: {
      es: "Switches, routers y SD-WAN de nivel enterprise para conectividad de alto rendimiento.",
      en: "Enterprise-grade switches, routers and SD-WAN for high-performance connectivity.",
    },
    brandSlugs: ["cisco", "meraki", "aruba", "hpe", "extreme"],
  },
  {
    slug: "wifi",
    icon: "Wifi",
    name: { es: "WiFi Empresarial", en: "Enterprise WiFi" },
    description: {
      es: "Access Points Wi-Fi 6/6E para campus, hoteles, hospitales y espacios de alta densidad.",
      en: "Wi-Fi 6/6E Access Points for campuses, hotels, hospitals and high-density spaces.",
    },
    brandSlugs: ["aruba", "cisco", "meraki", "extreme", "zebra"],
  },
  {
    slug: "servidores",
    icon: "Server",
    name: { es: "Servidores", en: "Servers" },
    description: {
      es: "Servidores rack, blade y tower para cargas de trabajo críticas, virtualización y bases de datos.",
      en: "Rack, blade and tower servers for critical workloads, virtualization and databases.",
    },
    brandSlugs: ["hpe", "lenovo", "cisco"],
  },
  {
    slug: "almacenamiento",
    icon: "HardDrive",
    name: { es: "Almacenamiento", en: "Storage" },
    description: {
      es: "Soluciones SAN, NAS y flash storage para entornos que requieren alta disponibilidad y velocidad.",
      en: "SAN, NAS and flash storage solutions for high-availability and high-speed environments.",
    },
    brandSlugs: ["hpe", "cisco"],
  },
  {
    slug: "computo",
    icon: "Monitor",
    name: { es: "Cómputo Empresarial", en: "Business Computing" },
    description: {
      es: "Laptops, workstations y equipos rugged para profesionales y trabajo en campo.",
      en: "Laptops, workstations and rugged devices for professionals and field work.",
    },
    brandSlugs: ["lenovo", "zebra", "hpe"],
  },
];
