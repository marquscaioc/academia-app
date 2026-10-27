import { Platform } from "react-native";
import { File } from "expo-file-system";
import { readUploadBody } from "../lib/supabase/uploadBody";

const mockArrayBuffer = jest.fn();
jest.mock("expo-file-system", () => ({
  File: jest.fn().mockImplementation(() => ({ arrayBuffer: mockArrayBuffer })),
}));

describe("Storage binary upload bodies", () => {
  const originalOS = Platform.OS;
  const originalFetch = global.fetch;
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => { Platform.OS = originalOS; global.fetch = originalFetch; });

  it("reads native file URIs without fetch or Blob, preserving binary bytes", async () => {
    Platform.OS = "ios";
    const bytes = Uint8Array.from([0, 255, 128, 1]).buffer;
    mockArrayBuffer.mockResolvedValue(bytes);
    global.fetch = jest.fn();
    expect(await readUploadBody("file:///cache/book.pdf")).toBe(bytes);
    expect(File).toHaveBeenCalledWith("file:///cache/book.pdf");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("uses browser fetch ArrayBuffer for blob URLs without native filesystem", async () => {
    Platform.OS = "web";
    const bytes = Uint8Array.from([137, 80, 78, 71]).buffer;
    global.fetch = jest.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => bytes });
    expect(await readUploadBody("blob:https://example.test/file")).toBe(bytes);
    expect(File).not.toHaveBeenCalled();
  });

  it("surfaces unreadable browser/native files before an upload can be sent", async () => {
    Platform.OS = "web";
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    await expect(readUploadBody("blob:missing")).rejects.toThrow("Não foi possível ler");
    Platform.OS = "android";
    mockArrayBuffer.mockRejectedValue(new Error("Permission denied"));
    await expect(readUploadBody("file:///missing.pdf")).rejects.toThrow("Permission denied");
  });
});
