import { useEffect, useState } from "react";
import { supabase } from "./client";

// Leitura de midia em buckets PRIVADOS via signed URL.
// Aceita tanto um path puro ("userId/123.jpg") quanto uma URL completa legada
// (ex.: getPublicUrl gravado antes), extraindo o path nesse caso.

export function storagePathFromValue(bucket: string, value: string): string {
  if (!value) return value;
  if (!/^https?:\/\//i.test(value)) return value; // ja e um path
  const marker = `/${bucket}/`;
  const idx = value.indexOf(marker);
  if (idx === -1) return value;
  return value.slice(idx + marker.length).split("?")[0];
}

export async function getSignedUrl(
  bucket: string,
  value?: string | null,
  expiresIn = 3600,
): Promise<string | null> {
  if (!value) return null;
  const path = storagePathFromValue(bucket, value);
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}

// Assina varios valores de uma vez. Retorna um mapa { valorOriginal: signedUrl }.
export async function getSignedUrls(
  bucket: string,
  values: (string | null | undefined)[],
  expiresIn = 3600,
): Promise<Record<string, string>> {
  const list = Array.from(new Set(values.filter(Boolean) as string[]));
  if (!list.length) return {};
  const paths = list.map((v) => storagePathFromValue(bucket, v));
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(paths, expiresIn);
  const out: Record<string, string> = {};
  if (!error && data) {
    data.forEach((d, i) => {
      if (d.signedUrl) out[list[i]] = d.signedUrl;
    });
  }
  return out;
}

// Hook: resolve uma lista de valores -> mapa { valorOriginal: signedUrl }.
export function useSignedUrls(
  bucket: string,
  values: (string | null | undefined)[],
  expiresIn = 3600,
): Record<string, string> {
  const key = values.filter(Boolean).join("|");
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    getSignedUrls(bucket, values, expiresIn).then((m) => {
      if (active) setMap(m);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucket, key, expiresIn]);
  return map;
}
