import { normalizeProfessionalUrl, normalizeWhatsAppNumber, validatePartnerDraft, whatsappContactUrl, PartnerDraft } from "../lib/partners/contact";

it("normalizes international WhatsApp numbers and safely encodes a contextual message", () => {
  expect(normalizeWhatsAppNumber("+55 (11) 99999-1234")).toBe("5511999991234");
  const message = "Olá, Ana & equipe! Quero agendar?";
  const url = whatsappContactUrl("+55 (11) 99999-1234", message)!;
  expect(url).toBe(`https://wa.me/5511999991234?text=${encodeURIComponent(message)}`);
  expect(new URL(url).searchParams.get("text")).toBe(message);
});

it.each(["", "123", "05511999991234", "+5511999991234567", "55119999ramal2", "https://wa.me/5511999991234", "55+11999991234"])("rejects malformed phone %p", (phone) => {
  expect(normalizeWhatsAppNumber(phone)).toBeNull();
  expect(whatsappContactUrl(phone, "Olá")).toBeNull();
});

it.each(["javascript:alert(1)", "data:text/html,hello", "http://example.com", "https://user:password@example.com", "https://example.com/x y", "https://localhost", "//example.com"])("rejects unsafe/non-HTTPS professional link %p", (url) => {
  expect(normalizeProfessionalUrl(url)).toBeNull();
});

it("preserves valid HTTPS scheduling and content URLs", () => {
  expect(normalizeProfessionalUrl(" https://agenda.example.com/consulta?origem=app#horarios ")).toBe("https://agenda.example.com/consulta?origem=app#horarios");
});

const draft = (): PartnerDraft => ({
  full_name: " Ana Silva ", profession: "nutritionist", specialty: "Nutrição esportiva",
  registration: " CRN 1234 ", bio: "", whatsapp_number: "+55 (11) 99999-1234",
  booking_url: "", content_url: "https://example.com/conteudos", is_active: true,
});

it("validates a referral without adding sensitive student data to published fields", () => {
  expect(validatePartnerDraft(draft())).toEqual({
    full_name: "Ana Silva", profession: "nutritionist", specialty: "Nutrição esportiva",
    registration: "CRN 1234", bio: null, whatsapp_number: "5511999991234",
    booking_url: null, content_url: "https://example.com/conteudos", is_active: true,
  });
});

it("requires a usable contact and rejects invalid optional fields", () => {
  expect(() => validatePartnerDraft({ ...draft(), whatsapp_number: "" })).toThrow("WhatsApp ou link");
  expect(() => validatePartnerDraft({ ...draft(), booking_url: "javascript:alert(1)" })).toThrow("https://");
  expect(() => validatePartnerDraft({ ...draft(), specialty: " " })).toThrow("especialidade");
  expect(() => validatePartnerDraft({ ...draft(), profession: "toString" as PartnerDraft["profession"] })).toThrow("profissão");
  expect(validatePartnerDraft({ ...draft(), whatsapp_number: "", booking_url: "https://agenda.example.com" }).booking_url).toBe("https://agenda.example.com/");
});
