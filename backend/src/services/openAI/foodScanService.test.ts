import axios from "axios";
import { analyzeFoodPhoto, validateScanInput, validateScanResult } from "./foodScanService";
jest.mock("axios");
const post = axios.post as jest.Mock;
const photo = "data:image/jpeg;base64,/9j/2Q==";
const estimate = { items: [{ name: "Rice", unit: "g", quantity: 150, calories: 195 }], assumptions: "Portion estimated" };
beforeEach(() => { process.env.OPENAI_API_KEY = "test-only"; });
afterEach(() => { delete process.env.OPENAI_API_KEY; });

test("rejects URLs, invalid image bytes, oversized data and long context before API access", async () => {
  for (const image of ["https://example.com/photo.jpg", "data:image/jpeg;base64,YWJjZA==", photo.repeat(500000)])
    expect(() => validateScanInput(image, "")).toThrow();
  expect(() => validateScanInput(photo, "x".repeat(501))).toThrow();
  expect(() => validateScanInput(photo, "150g rice")).not.toThrow();
  expect(post).not.toHaveBeenCalled();
});
test("sends inline image with store false and returns only validated nutrition data", async () => {
  post.mockResolvedValue({ data: { status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(estimate) }] }] } });
  expect(await analyzeFoodPhoto(photo, "150g rice")).toEqual(estimate);
  const [url, body, config] = post.mock.calls[0];
  expect(url).toBe("https://api.openai.com/v1/responses");
  expect(body.store).toBe(false);
  expect(body.input[0].content[1].image_url).toBe(photo);
  expect(config.headers).toEqual({ Authorization: "Bearer test-only" });
  expect(config.timeout).toBe(45000);
});
test("rejects impossible portions and incomplete results, accepts no-food result", () => {
  expect(() => validateScanResult({ ...estimate, items: [{ ...estimate.items[0], quantity: -1 }] })).toThrow();
  expect(() => validateScanResult({ ...estimate, items: [{ ...estimate.items[0], calories: "195" }] })).toThrow();
  expect(validateScanResult({ items: [], assumptions: "No food" }).items).toEqual([]);
});
test("does not expose credentials, photo or provider error text", async () => {
  post.mockRejectedValue({ config: { image: photo, key: "secret" }, message: "sensitive provider message" });
  await expect(analyzeFoodPhoto(photo, "")).rejects.toThrow("Could not analyze the photo. Please try again.");
});
test("does not call API when no key is configured", async () => {
  delete process.env.OPENAI_API_KEY;
  await expect(analyzeFoodPhoto(photo, "")).rejects.toThrow("not configured");
  expect(post).not.toHaveBeenCalled();
});
