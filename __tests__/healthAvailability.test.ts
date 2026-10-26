import { isHealthAvailable, readHealthData, requestHealthPermissions } from "../lib/health/healthConnect";

it("does not report unsupported health sync as measured zero activity", async () => {
  expect(isHealthAvailable()).toBe(false);
  await expect(requestHealthPermissions()).resolves.toBe(false);
  await expect(readHealthData(new Date())).rejects.toThrow("ainda não está disponível");
});
