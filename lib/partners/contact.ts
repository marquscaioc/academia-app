export type PartnerProfession = "nutritionist" | "sports_doctor";

export const PARTNER_PROFESSIONS: Record<PartnerProfession, string> = {
  nutritionist: "Nutricionista",
  sports_doctor: "Médico do esporte",
};

/** International number (country code + area code + subscriber), without punctuation. */
export function normalizeWhatsAppNumber(value: string): string | null {
  const input = value.trim();
  if (!/^\+?[0-9\s().-]+$/.test(input)) return null;
  const digits = input.replace(/\D/g, "");
  return /^[1-9][0-9]{7,14}$/.test(digits) ? digits : null;
}

export function whatsappContactUrl(phone: string, message: string): string | null {
  const digits = normalizeWhatsAppNumber(phone);
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

/** Only web links can be published as booking or educational content. */
export function normalizeProfessionalUrl(value: string): string | null {
  const input = value.trim();
  if (!input || input.length > 2000 || /\s/.test(input)) return null;
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname.includes(".")) return null;
    if (!/^[a-z0-9.-]+$/i.test(url.hostname) || url.hostname.startsWith(".") || url.hostname.endsWith(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export interface PartnerDraft {
  full_name: string;
  profession: PartnerProfession;
  specialty: string;
  registration: string;
  bio: string;
  whatsapp_number: string;
  booking_url: string;
  content_url: string;
  is_active: boolean;
}

export function validatePartnerDraft(draft: PartnerDraft) {
  if (!draft.full_name.trim() || draft.full_name.trim().length > 120) throw new Error("Informe um nome de até 120 caracteres.");
  if (!Object.prototype.hasOwnProperty.call(PARTNER_PROFESSIONS, draft.profession)) throw new Error("Selecione a profissão.");
  if (!draft.specialty.trim() || draft.specialty.trim().length > 160) throw new Error("Informe uma especialidade de até 160 caracteres.");
  if (draft.registration.trim().length > 80 || draft.bio.trim().length > 1200) throw new Error("Use até 80 caracteres no registro e 1.200 na apresentação.");
  const phone = draft.whatsapp_number.trim() ? normalizeWhatsAppNumber(draft.whatsapp_number) : null;
  if (draft.whatsapp_number.trim() && !phone) throw new Error("Use o WhatsApp com código do país e DDD, por exemplo +55 11 99999-9999.");
  const booking = draft.booking_url.trim() ? normalizeProfessionalUrl(draft.booking_url) : null;
  const content = draft.content_url.trim() ? normalizeProfessionalUrl(draft.content_url) : null;
  if ((draft.booking_url.trim() && !booking) || (draft.content_url.trim() && !content)) throw new Error("Informe links completos iniciando com https://.");
  if (!phone && !booking) throw new Error("Informe um WhatsApp ou link de agendamento.");
  return {
    full_name: draft.full_name.trim(), profession: draft.profession,
    specialty: draft.specialty.trim(), registration: draft.registration.trim() || null,
    bio: draft.bio.trim() || null, whatsapp_number: phone, booking_url: booking,
    content_url: content, is_active: draft.is_active,
  };
}
