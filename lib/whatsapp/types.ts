// Evolution API v1.8.x type definitions

export type ConnectionState = "open" | "close" | "connecting";

export interface EvolutionInstance {
  instance: {
    instanceName: string;
    instanceId?: string;
    owner?: string;
    profileName?: string;
    profilePictureUrl?: string;
    profileStatus?: string;
    status: ConnectionState;
  };
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
  hash: { apikey: string } | string;
  qrcode?: QrCodeResponse;
}

export interface SendTextInput {
  number: string;
  textMessage: {
    text: string;
  };
  options?: {
    delay?: number;
    presence?: "composing" | "recording" | "available";
    linkPreview?: boolean;
  };
}

export interface SendMediaInput {
  number: string;
  mediaMessage: {
    mediatype: "image" | "video" | "document" | "audio";
    mimetype?: string;
    caption?: string;
    fileName?: string;
    media: string; // URL or base64
  };
  options?: {
    delay?: number;
    presence?: "composing";
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
  webhook_by_events: boolean;
  webhook_base64?: boolean;
  events: string[];
}

export interface WebhookEvent {
  event: string;
  instance: string;
  data: Record<string, unknown>;
}
