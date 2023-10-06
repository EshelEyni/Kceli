/* eslint-disable @typescript-eslint/no-explicit-any */
import { WeightUnit, WorkoutItemSuperset } from "../../../../shared/types/workout";
import openAIService from "../../services/openAI/openAIService";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import { getMockWorkout } from "../../services/test/testUtilService";
import { UserModel } from "../user/userModel";
import { WorkoutModel } from "./workoutModel";

jest.mock("../../services/openAI/openAIService");
jest.mock("../../services/intake/intakeService");
jest.mock("../../services/ALSService");

const MOCK_CALORIES = 100;

describe("Daily Data Model", () => {
  beforeAll(async () => {
    (openAIService.getCaloriesForIntakeItem as jest.Mock).mockResolvedValue(MOCK_CALORIES);
    await connectToTestDB();
  });

  afterAll(async () => {
    await WorkoutModel.deleteMany({});
    await UserModel.deleteMany({});
    await disconnectFromTestDB();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Workout Schema", () => {
    const workout = getMockWorkout();

    afterEach(async () => {
      await WorkoutModel.deleteMany({});
    });

    it("should require a userId", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, ...workoutWithoutUserId } = workout;
      const invalidWorkout = new WorkoutModel(workoutWithoutUserId);
      await expect(invalidWorkout.save()).rejects.toThrow("Please provide a userId");
    });

    it("should have a default type of 'anaerobic'", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...workoutWithoutType } = workout;
      const validWorkout = await WorkoutModel.create(workoutWithoutType);

      expect(validWorkout.type).toBe("anaerobic");
    });

    it("should validate type enums", async () => {
      const workoutWithInvalidType = { ...workout, type: "invalidType" as any };
      const invalidWorkout = new WorkoutModel(workoutWithInvalidType);
      await expect(invalidWorkout.save()).rejects.toThrow(
        "workouts validation failed: type: type must be either aerobic or anaerobic"
      );
    });

    it("should set default type to 'anaerobic' if no type is provided", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...workoutWithoutType } = workout;
      const validWorkout = await WorkoutModel.create(workoutWithoutType);

      expect(validWorkout.type).toBe("anaerobic");
    });

    it("should have a default description of 'no description'", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { description, ...workoutWithoutDescription } = workout;
      const validWorkout = await WorkoutModel.create(workoutWithoutDescription);

      expect(validWorkout.description).toBe("no description");
    });
  });

  fdescribe("Workout Item Schema", () => {
    afterEach(async () => {
      await WorkoutModel.deleteMany({});
    });

    it("should require a name", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [{ name: "" }] as any,
      };
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(
        "Please provide a name for the workout item"
      );
    });

    it("should default isStarted to false", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            sets: [{ isCompleted: false }],
            reps: 1,
            weight: 1,
            weightUnit: "kg",
            restInSec: 1,
          },
        ] as any,
      };
      const validWorkout = await WorkoutModel.create(workout);

      expect(validWorkout.items[0].isStarted).toBe(false);
    });

    it("should default isCompleted to false", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            sets: [{ isCompleted: false }],
            reps: 1,
            weight: 1,
            weightUnit: "kg",
            restInSec: 1,
          },
        ] as any,
      };
      const validWorkout = await WorkoutModel.create(workout);

      expect(validWorkout.items[0].isCompleted).toBe(false);
    });

    it("should validate type enums", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [{ name: "name", type: "invalidType" }] as any,
      };

      const errorMsg = "items.0.type: type must be either aerobic, anaerobic or superset";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should have a default type of 'anaerobic'", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            sets: [{ isCompleted: false }],
            reps: 1,
            weight: 1,
            weightUnit: "kg",
            restInSec: 1,
          },
        ] as any,
      };
      const validWorkout = await WorkoutModel.create(workout);

      expect(validWorkout.items[0].type).toBe("anaerobic");
    });

    it("should validate durationInMin for aerobic type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [{ name: "name", type: "aerobic" }] as any,
      };

      const errorMsg = "Duration is required for aerobic type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate sets for anaerobic type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [{ name: "name", type: "anaerobic" }] as any,
      };

      const errorMsg = "Sets are required for anaerobic type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate reps for anaerobic type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [{ name: "name", type: "anaerobic", sets: [{ isCompleted: false }] }] as any,
      };

      const errorMsg = "Reps are required for anaerobic type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate weight for anaerobic type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          { name: "name", type: "anaerobic", sets: [{ isCompleted: false }], reps: 1 },
        ] as any,
      };

      const errorMsg = "Weight is required for anaerobic type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate weightUnit for anaerobic type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            type: "anaerobic",
            sets: [{ isCompleted: false }],
            reps: 1,
            weight: 1,
          },
        ] as any,
      };

      const errorMsg = "WeightUnit is required for anaerobic type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate restInSec for anaerobic type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            type: "anaerobic",
            sets: [{ isCompleted: false }],
            reps: 1,
            weight: 1,
            weightUnit: "kg",
          },
        ] as any,
      };

      const errorMsg = "RestInSec is required for anaerobic type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate sets for superset type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [{ name: "name", type: "superset" }] as any,
      };

      const errorMsg = "Sets are required for superset type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate restInSec for superset type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [{ name: "name", type: "superset", sets: [{ isCompleted: false }] }] as any,
      };

      const errorMsg = "RestInSec is required for superset type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate items for superset type", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          { name: "name", type: "superset", sets: [{ isCompleted: false }], restInSec: 1 },
        ] as any,
      };

      const errorMsg = "Items are required for superset type";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validte name for superset item", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            type: "superset",
            sets: [{ isCompleted: false }],
            restInSec: 1,
            items: [{ name: "" }],
          },
        ] as any,
      };

      const errorMsg = "Please provide a name for the superset item";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate reps for superset item", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            type: "superset",
            sets: [{ isCompleted: false }],
            restInSec: 1,
            items: [{ name: "name" }],
          },
        ] as any,
      };

      const errorMsg = "Please provide a reps for the superset item";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate weight for superset item", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            type: "superset",
            sets: [{ isCompleted: false }],
            restInSec: 1,
            items: [{ name: "name", reps: 1 }],
          },
        ] as any,
      };

      const errorMsg = "Please provide a weight for the superset item";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate weightUnit for superset item", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            type: "superset",
            sets: [{ isCompleted: false }],
            restInSec: 1,
            items: [{ name: "name", reps: 1, weight: 1 }],
          },
        ] as any,
      };

      const errorMsg = "Please provide a weightUnit for the superset item";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it("should validate weightUnit for superset item", async () => {
      const workout = {
        ...getMockWorkout(),
        items: [
          {
            name: "name",
            type: "superset",
            sets: [{ isCompleted: false }],
            restInSec: 1,
            items: [{ name: "name", reps: 1, weight: 1, weightUnit: "invalidUnit" }],
          },
        ] as any,
      };

      const errorMsg = "weightUnit must be either kg or lbs";
      const invalidWorkout = new WorkoutModel(workout);
      await expect(invalidWorkout.save()).rejects.toThrow(errorMsg);
    });

    it.each(Object.values(WeightUnit))(
      "should save superset item with valid weightUnit: %s",
      async weightUnit => {
        const workout = {
          ...getMockWorkout(),
          items: [
            {
              name: "name",
              type: "superset",
              sets: [{ isCompleted: false }],
              restInSec: 1,
              items: [{ name: "name", reps: 1, weight: 1, weightUnit }],
            },
          ] as any,
        };

        const validWorkout = await WorkoutModel.create(workout);
        expect((validWorkout.items[0] as WorkoutItemSuperset).items[0].weightUnit).toBe(weightUnit);
      }
    );
  });
});
