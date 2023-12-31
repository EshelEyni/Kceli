"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const errorService_1 = require("../error/errorService");
require("dotenv").config();
const configuration = new openai_1.Configuration({
    organization: process.env.OPEN_AI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
function getText(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const completion = yield openai.createChatCompletion({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        const { message } = completion.data.choices[0];
        if (!message)
            throw new errorService_1.AppError("message is falsey", 500);
        return message.content;
    });
}
function getCaloriesForIntakeItem(intakeItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, quantity, unit } = intakeItem;
        const prompt = `
  Calculate calories for ${quantity} ${unit} of ${name}.
  NOTE: Return the number of calories as an integer.
  `;
        const completion = yield openai.createChatCompletion({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        const { message } = completion.data.choices[0];
        if (!message)
            throw new errorService_1.AppError("message is falsey", 500);
        const text = message.content;
        const calories = parseInt(text);
        if (isNaN(calories))
            throw new errorService_1.AppError("calories is NaN", 500);
        return Math.round(calories);
    });
}
function getCalorieBurnForWorkoutItem({ user, workoutItem, weight }) {
    return __awaiter(this, void 0, void 0, function* () {
        function getWorkoutItemPromptStr(workoutItem) {
            switch (workoutItem.type) {
                case "aerobic":
                    return `Calculate calories burned for ${workoutItem.durationInMin} minutes of ${workoutItem.name}.`;
                case "anaerobic":
                    return `Calculate calories burned for ${workoutItem.sets} sets of ${workoutItem.reps} reps of ${workoutItem.name} with ${workoutItem.weight} ${workoutItem.weightUnit}.`;
                case "superset":
                    return `Calculate calories burned for ${workoutItem.sets} sets of ${workoutItem.items.length} reps of ${workoutItem.name} with ${workoutItem.items[0].weight} ${workoutItem.items[0].weightUnit}.`;
                default:
                    throw new errorService_1.AppError("Invalid workoutItem type", 500);
            }
        }
        const { birthdate, weight: weightFromUser, height } = user;
        const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
        const prompt = `
  Calculate calories burned for ${age} year old ${weight || weightFromUser} lb ${height} in tall person.
  ${getWorkoutItemPromptStr(workoutItem)}
  NOTE: Return the number of calories as an integer.
  `;
        const completion = yield openai.createChatCompletion({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        const { message } = completion.data.choices[0];
        if (!message)
            throw new errorService_1.AppError("message is falsey", 500);
        const text = message.content;
        const calories = parseInt(text);
        if (isNaN(calories))
            throw new errorService_1.AppError("calories is NaN", 500);
        return Math.round(calories);
    });
}
exports.default = {
    getText,
    getCaloriesForIntakeItem,
    getCalorieBurnForWorkoutItem,
};
//# sourceMappingURL=openAIService.js.map