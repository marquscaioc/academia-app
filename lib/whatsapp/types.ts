// Evolution API v2.x type definitions

export type ConnectionState = "open" | "close" | "connecting";

// v2 returns a flat object directly in fetchInstances
export interface EvolutionInstance {
  id: string;
  name: string;
  connectionStatus: ConnectionState;
  ownerJid: string | null;
  profileName: string | null;
  profilePicUrl: string | null;
  integration: string;
  number: string | null;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface QrCodeResponse {
  pairingCode: string | null;
  code: string;
  base64: string;
  count: number;
}

export interface ConnectionStateResponse {
  instance: {
    instanceName: string;
    state: ConnectionState;
  };
}

export interface CreateInstanceResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    status: string;
  };
  hash: string;
  qrcode?: QrCodeResponse;
}

// v1.8.1 nested format (textMessage/mediaMessage + options)
export interface SendTextInput {
  number: string;
  options?: {
    delay?: number;
    presence?: "composing" | "recording" | "available";
    linkPreview?: boolean;
  };
  textMessage: { text: string };
}

export interface SendMediaInput {
  number: string;
  options?: { delay?: number };
  mediaMessage: {
    mediatype: "image" | "video" | "document" | "audio";
    mimetype?: string;
    caption?: string;
    fileName?: string;
    media: string; // URL or base64
  };
}

export interface SendMessageResponse {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: Record<string, unknown>;
  messageTimestamp: string;
  status: string;
}

export interface WebhookConfig {
  enabled: boolean;
  url: string;
  webhookByEvents?: boolean;
  webhookBase64?: boolean;
  events: string[];
}

export interface WebhookEvent {
  event: string;
  instance: string;
  data: Record<string, unknown>;
}
