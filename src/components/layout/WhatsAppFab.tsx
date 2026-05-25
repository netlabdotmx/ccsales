"use client";

import { MessageCircle } from "lucide-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525618507997";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola, me interesa conocer más sobre sus productos.")}`;

export default function WhatsAppFab() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
    >
      <MessageCircle className="w-6 h-6 fill-white stroke-none" />
    </a>
  );
}
