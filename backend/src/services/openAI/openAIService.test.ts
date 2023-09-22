/* eslint-disable @typescript-eslint/no-explicit-any */
import openAIService from "./openAIService";
import { Configuration, OpenAIApi } from "openai";

jest.mock("openai", () => {
  const mockOpenAIConfiguration = {
    organization: process.env.OPEN_AI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
  };
  const mockOpenAIApi = {
    createChatCompletion: jest.fn(),
    createCompletion: jest.fn(),
    createImage: jest.fn(),
  };

  return {
    Configuration: jest.fn().mockImplementation(() => mockOpenAIConfiguration),
    OpenAIApi: jest.fn().mockImplementation(() => mockOpenAIApi),
  };
});

describe("Open AI Service", () => {
  const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  describe("getTextFromOpenAI", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should return text from OpenAI using gpt-4 model", async () => {
      const prompt = "Sample prompt";
      const response = {
        data: {
          choices: [{ message: { content: "Sample response from gpt-4" } }],
        },
      };

      openai.createChatCompletion = jest.fn().mockResolvedValue(response);

      const result = await openAIService.getTextFromOpenAI(prompt, "gpt-4");
      expect(openai.createChatCompletion).toHaveBeenCalledWith({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      });
      expect(result).toEqual("Sample response from gpt-4");
    });

    it("should return text from OpenAI using default model", async () => {
      const prompt = "Sample prompt";
      const response = {
        data: {
          choices: [{ text: "Sample response from default model" }],
        },
      };

      openai.createCompletion = jest.fn().mockResolvedValue(response);

      const result = await openAIService.getTextFromOpenAI(prompt);
      expect(openai.createCompletion).toHaveBeenCalledWith({
        model: "text-davinci-003",
        prompt,
        max_tokens: 4000,
      });
      expect(result).toEqual("Sample response from default model");
    });

    it("should throw an error if message is falsey for gpt-4 model", async () => {
      const prompt = "Sample prompt";
      const response = {
        data: {
          choices: [{ message: undefined }],
        },
      };

      openai.createChatCompletion = jest.fn().mockResolvedValue(response);

      await expect(openAIService.getTextFromOpenAI(prompt, "gpt-4")).rejects.toThrow(
        "message is falsey"
      );
    });

    it("should throw an error if message is falsey for default model", async () => {
      const prompt = "Sample prompt";
      const response = {
        data: {
          choices: [{ text: undefined }],
        },
      };

      openai.createCompletion = jest.fn().mockResolvedValue(response);

      await expect(openAIService.getTextFromOpenAI(prompt)).rejects.toThrow("text is falsey");
    });
  });
});
