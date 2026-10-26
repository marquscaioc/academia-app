import { Platform } from "react-native";
import { File } from "expo-file-system";

/** Supabase Storage needs binary ArrayBuffer bodies on React Native. Local
 * picker/camera URIs are read by SDK 54 File, without a Blob or base64 copy. */
export async function readUploadBody(uri: string): Promise<ArrayBuffer> {
  if (Platform.OS !== "web") return new File(uri).arrayBuffer();
  const response = await fetch(uri);
  if (!response.ok) throw new Error("Não foi possível ler o arquivo selecionado.");
  return response.arrayBuffer();
}
