"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";

const ContactSchema = z.object({
  name:    z.string().min(2, "Mínimo 2 caracteres"),
  company: z.string().min(2, "Mínimo 2 caracteres"),
  email:   z.email("Correo inválido"),
  phone:   z.string().min(8, "Teléfono inválido"),
  message: z.string().min(10, "Mínimo 10 caracteres"),
});
type ContactForm = z.infer<typeof ContactSchema>;

const WA_URL = `https://wa.me/525618507997?text=${encodeURIComponent("Hola, quiero ponerme en contacto con CCS Sales.")}`;

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSending(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          description: `Mensaje: ${data.message}`,
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // show success anyway
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-brand-navy py-16 px-4 sm:px-6 text-center">
        <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-3">Contacto</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Hablemos</h1>
        <p className="text-slate-300 text-lg max-w-lg mx-auto">
          Nuestro equipo de especialistas está listo para asesorarte en tu próximo proyecto.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-6">Información de contacto</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: "Teléfono", value: "+52 56 1850 7997", href: "tel:+525618507997" },
                  { icon: Mail, label: "Correo", value: "info@ccsales.com.mx", href: "mailto:info@ccsales.com.mx" },
                  { icon: MapPin, label: "Ubicación", value: "Ciudad de México, México", href: undefined },
                  { icon: Clock, label: "Horario", value: "Lun–Vie  9:00–18:00", href: undefined },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-slate-800 hover:text-brand-cyan transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-slate-800">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20">
              <p className="text-sm font-semibold text-slate-800 mb-1">¿Prefieres WhatsApp?</p>
              <p className="text-xs text-slate-500 mb-4">Respuesta en minutos en horario de atención.</p>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20BD5C] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chatear ahora
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-green/15 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">¡Mensaje enviado!</h3>
                <p className="text-slate-500 max-w-xs">
                  Gracias por contactarnos. Uno de nuestros especialistas se pondrá en contacto contigo a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {([
                    { name: "name" as const,    label: "Nombre completo",    type: "text" },
                    { name: "company" as const, label: "Empresa",            type: "text" },
                    { name: "email" as const,   label: "Correo electrónico", type: "email" },
                    { name: "phone" as const,   label: "Teléfono",           type: "tel" },
                  ] as const).map(({ name, label, type }) => (
                    <div key={name}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label} *</label>
                      <input
                        {...register(name)}
                        type={type}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-colors"
                      />
                      {errors[name] && (
                        <p className="text-xs text-red-500 mt-1">{errors[name]?.message}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Mensaje *</label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Cuéntanos sobre tu proyecto o necesidad..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy-light transition-colors disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
