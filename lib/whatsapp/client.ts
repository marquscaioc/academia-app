import { EVOLUTION_CONFIG } from "./config";
import type {
  ConnectionState,
  ConnectionStateResponse,
  CreateInstanceResponse,
  EvolutionInstance,
  QrCodeResponse,
  SendMediaInput,
  SendMessageResponse,
  SendTextInput,
  WebhookConfig,
} from "./types";

const { url: BASE_URL, apiKey: API_KEY } = EVOLUTION_CONFIG;

const headers = {
  "Content-Type": "application/json",
  apikey: API_KEY,
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Evolution API ${res.status}: ${body}`);
  }
  return res.json();
}

// ==========================================
// Instance Management
// ==========================================

export async function createInstance(instanceName: string): Promise<CreateInstanceResponse> {
  return request("/instance/create", {
    method: "POST",
    body: JSON.stringify({
      instanceName,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
      reject_call: false,
      groups_ignore: true,
      always_online: true,
      read_messages: false,
      read_status: false,
      sync_full_history: false,
    }),
  });
}

export async function getConnectionState(instanceName: string): Promise<ConnectionState> {
  const data = await request<ConnectionStateResponse>(
    `/instance/connectionState/${instanceName}`,
  );
  return data.instance?.state ?? "close";
}

export async function getQrCode(instanceName: string): Promise<QrCodeResponse | null> {
  try {
    const data = await request<QrCodeResponse>(`/instance/connect/${instanceName}`);
    return data.base64 ? data : null;
  } catch {
    return null;
  }
}

export async function getInstances(): Promise<EvolutionInstance[]> {
  return request<EvolutionInstance[]>("/instance/fetchInstances");
}

export async function getInstance(instanceName: string): Promise<EvolutionInstance | null> {
  const instances = await getInstances();
  return instances.find((i) => i.instance.instanceName === instanceName) ?? null;
}

export async function restartInstance(instanceName: string): Promise<void> {
  await request(`/instance/restart/${instanceName}`, { method: "PUT" });
}

export async function logoutInstance(instanceName: string): Promise<void> {
  await request(`/instance/logout/${instanceName}`, { method: "DELETE" });
}

export async function deleteInstance(instanceName: string): Promise<void> {
  await request(`/instance/delete/${instanceName}`, { method: "DELETE" });
}

// ==========================================
// Messaging
// ==========================================

export function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (!cleaned.startsWith("55")) cleaned = "55" + cleaned;
  return cleaned;
}

export async function sendText(
  instanceName: string,
  phone: string,
  text: string,
  options?: { delay?: number; presence?: "composing" },
): Promise<SendMessageResponse> {
  const input: SendTextInput = {
    number: formatPhone(phone),
    textMessage: { text },
    options: {
      delay: options?.delay ?? 1200,
      presence: options?.presence ?? "composing",
    },
  };
  return request(`/message/sendText/${instanceName}`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function sendMedia(
  instanceName: string,
  phone: string,
  mediaUrl: string,
  options?: { caption?: string; mediatype?: "image" | "video" | "document" },
): Promise<SendMessageResponse> {
  const input: SendMediaInput = {
    number: formatPhone(phone),
    mediaMessage: {
      mediatype: options?.mediatype ?? "image",
      caption: options?.caption,
      media: mediaUrl,
    },
    options: { delay: 1200, presence: "composing" },
  };
  return request(`/message/sendMedia/${instanceName}`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ==========================================
// Webhooks
// ==========================================

export async function setWebhook(
  instanceName: string,
  webhookUrl: string,
  events: string[] = [
    "MESSAGES_UPSERT",
    "CONNECTION_UPDATE",
    "SEND_MESSAGE",
  ],
): Promise<void> {
  const config: WebhookConfig = {
    enabled: true,
    url: webhookUrl,
    webhook_by_events: false,
    webhook_base64: true,
    events,
  };
  await request(`/webhook/set/${instanceName}`, {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function getWebhook(instanceName: string): Promise<WebhookConfig | null> {
  try {
    return await request<WebhookConfig>(`/webhook/find/${instanceName}`);
  } catch {
    return null;
  }
}
