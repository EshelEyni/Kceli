/* eslint-disable @typescript-eslint/no-explicit-any */
import openAIService from "./openAIService";
import { Configuration, OpenAIApi } from "openai";
import { getMockIntakeItem } from "../test/testUtilService";

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

  describe("getText", () => {
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

      const result = await openAIService.getText(prompt);
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

      const result = await openAIService.getText(prompt);
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

      await expect(openAIService.getText(prompt)).rejects.toThrow("message is falsey");
    });

    it("should throw an error if message is falsey for default model", async () => {
      const prompt = "Sample prompt";
      const response = {
        data: {
          choices: [{ text: undefined }],
        },
      };

      openai.createCompletion = jest.fn().mockResolvedValue(response);

      await expect(openAIService.getText(prompt)).rejects.toThrow("text is falsey");
    });
  });

  describe("getCaloriesForIntakeItem", () => {
    const intakeItem = getMockIntakeItem();

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should return calories for intake item from OpenAI", async () => {
      const response = {
        data: {
          choices: [{ message: { content: "100" } }],
        },
      };

      openai.createChatCompletion = jest.fn().mockResolvedValue(response);

      const result = await openAIService.getCaloriesForIntakeItem(intakeItem);

      expect(openai.createChatCompletion).toHaveBeenCalledWith({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `
  Calculate calories for ${intakeItem.quantity} ${intakeItem.unit} of ${intakeItem.name}.
  NOTE: Return the number of calories as an integer.
  `,
          },
        ],
      });

      expect(result).toEqual(100);
    });

    it("should throw an error if message is falsey", async () => {
      const response = {
        data: {
          choices: [{ message: undefined }],
        },
      };

      openai.createChatCompletion = jest.fn().mockResolvedValue(response);

      await expect(openAIService.getCaloriesForIntakeItem(intakeItem)).rejects.toThrow(
        "message is falsey"
      );
    });

    it("should throw an error if calories is NaN", async () => {
      const response = {
        data: {
          choices: [{ message: { content: "NaN" } }],
        },
      };

      openai.createChatCompletion = jest.fn().mockResolvedValue(response);

      await expect(openAIService.getCaloriesForIntakeItem(intakeItem)).rejects.toThrow(
        "calories is NaN"
      );
    });
  });

  fdescribe("getCalorieBurnForWorkoutItem", () => {
    const user = {
      birthdate: "1990-01-01",
      weight: 180,
      height: "6'0",
    } as any;

    const workoutItem = {
      name: "Bench Press",
      type: "anaerobic",
      sets: 3,
      reps: 10,
      weight: 135,
      weightUnit: "lbs",
    } as any;

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should return calories burned for workout item from OpenAI", async () => {
      const response = {
        data: {
          choices: [{ message: { content: "100" } }],
        },
      };

      openai.createChatCompletion = jest.fn().mockResolvedValue(response);

      const result = await openAIService.getCalorieBurnForWorkoutItem({ user, workoutItem });

      expect(openai.createChatCompletion).toHaveBeenCalledWith({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `
  Calculate calories burned for 33 year old 180 lb 6'0 in tall person.
  Calculate calories burned for 3 sets of 10 reps of Bench Press with 135 lbs.
  NOTE: Return the number of calories as an integer.
  `,
          },
        ],
      });

      expect(result).toEqual(100);
    });
  });
});
