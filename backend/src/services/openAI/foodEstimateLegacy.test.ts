import axios from "axios";
import openAIService from "./openAIService";
jest.mock("axios");
beforeEach(() => { process.env.OPENAI_API_KEY = "test-key"; });
test("legacy food calculation uses structured estimates on Responses", async () => {
  (axios.post as jest.Mock).mockResolvedValue({ data: { status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ isFood: true, items: [{ name: "banana", calories: 105 }], assumptions: "medium banana" }) }] }] } });
  expect(await openAIService.getCaloriesForIntakeItem({ name: "banana", quantity: 1, unit: "unit" } as any)).toBe(105);
  expect((axios.post as jest.Mock).mock.calls[0][0]).toBe("https://api.openai.com/v1/responses");
});
test("existing nutrition questions also use the accessible configured model", async () => {
  (axios.post as jest.Mock).mockResolvedValue({ data: { status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: "About 105 kcal for a medium banana." }] }] } });
  expect(await openAIService.getText("Calories in a banana?")).toContain("105");
  expect((axios.post as jest.Mock).mock.calls[0][1].model).toBe("gpt-4.1-mini");
});
