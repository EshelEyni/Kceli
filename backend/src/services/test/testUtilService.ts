/* eslint-disable @typescript-eslint/no-explicit-any */
require("dotenv").config();
import mongoose from "mongoose";
import { User, UserCredenitials } from "../../../../shared/types/user";
import tokenService from "../token/tokenService";
import { UserModel } from "../../models/user/userModel";
import {
  IntakeItem,
  MeasurementUnit,
  NewIntake,
  NewIntakeItem,
} from "../../../../shared/types/intake";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { getLoggedInUserIdFromReq } from "../ALSService";
import { Workout, WorkoutItemAerobic } from "../../../../shared/types/workout";
import { NinjaAPIResData, USDAFoodObject } from "../../types/app";

type CreateTestUserOptions = {
  id?: string;
  isAdmin?: boolean;
};

async function createManyTestUsers(numOfUsers: number): Promise<User[]> {
  const ids = Array.from({ length: numOfUsers }, () => getMongoId());
  await UserModel.deleteMany({ _id: { $in: ids } });

  const userCreds = ids.map(id => createValidUserCreds(id));

  const users = await UserModel.create(userCreds).then(docs => docs.map(doc => doc.toObject()));
  return users as unknown as User[];
}

async function deleteManyTestUsers(ids: string[]) {
  await UserModel.deleteMany({ _id: { $in: ids } });
}

async function createTestUser({ id, isAdmin = false }: CreateTestUserOptions = {}): Promise<User> {
  const validId = id || getMongoId();
  await UserModel.findByIdAndDelete(validId).setOptions({ active: false });
  const user = createValidUserCreds(validId) as unknown as User;
  if (isAdmin) user.isAdmin = true;
  return (await UserModel.create(user)).toObject() as unknown as User;
}

async function deleteTestUser(id: string) {
  await UserModel.findByIdAndDelete(id).setOptions({ active: false });
}

async function createTestDailyData(userId?: string) {
  const dailyData = getMockDailyData({ userId });
  return (await DailyDataModel.create(dailyData)).toObject();
}

function getMongoId() {
  return new mongoose.Types.ObjectId().toHexString();
}

function createValidUserCreds(id?: string): UserCredenitials {
  function makeId(length = 10): string {
    let txt = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
  }
  const username = "testUser_" + makeId();
  const password = "password";
  return {
    _id: id || getMongoId(),
    username: username,
    fullname: "Test User",
    email: `${username}@testemail.com`,
    password,
    passwordConfirm: password,
    weight: 120,
    height: 180,
    gender: "male",
    birthdate: new Date("1990-01-01"),
  } as UserCredenitials;
}

function getLoginTokenStrForTest(validUserId: string) {
  const token = tokenService.signToken(validUserId);
  return `loginToken=${token}`;
}

function getMockedUser({
  id,
}: {
  id?: string | mongoose.Types.ObjectId;
} = {}) {
  return {
    _id: id?.toString() || getMongoId(),
    username: "test1",
    email: "email@email.com",
    fullname: "fullname1",
    imgUrl: "imgUrl1",
    isApprovedLocation: true,
    active: true,
    toObject: jest.fn().mockReturnThis(),
  };
}

function getMockDailyData({ userId }: { userId?: string }): any {
  return {
    userId: userId || getMongoId(),
    date: new Date(),
    intakes: [getNewMockIntake()],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function getNewMockIntake(): NewIntake {
  return {
    id: getMongoId(),
    items: [getMockNewIntakeItem()],
    isRecorded: true,
    recordedAt: null,
  };
}

function getMockNewIntakeItem(): NewIntakeItem {
  return {
    id: getMongoId(),
    name: "test",
    unit: MeasurementUnit.UNIT,
    quantity: 1,
  };
}

function getMockIntake(): NewIntake {
  return {
    id: getMongoId(),
    items: [getMockIntakeItem()],
    isRecorded: true,
    recordedAt: null,
  };
}

function getMockIntakeItem(): IntakeItem {
  return {
    id: getMongoId(),
    name: "test",
    unit: MeasurementUnit.UNIT,
    quantity: 1,
    calories: 1,
  };
}

function getMockWorkout(): Workout {
  return {
    id: getMongoId(),
    userId: getMongoId(),
    description: "test",
    type: "aerobic",
    items: [getMockWorkoutItem()],
  };
}

function getMockWorkoutItem(): WorkoutItemAerobic {
  return {
    id: getMongoId(),
    name: "test",
    isStarted: false,
    isCompleted: false,
    type: "aerobic",
    durationInMin: 1,
  };
}

function mockGetLoggedInUserIdFromReq(value?: string): string {
  const userId: string = value !== undefined ? value : getMongoId();
  (getLoggedInUserIdFromReq as jest.Mock).mockReturnValue(userId);
  return userId;
}

function getMockNinjaApiResponse(): { data: NinjaAPIResData } {
  return {
    data: [
      {
        name: "hamburger",
        calories: 242.5,
        serving_size_g: 100,
        fat_total_g: 11.8,
        fat_saturated_g: 4.7,
        protein_g: 15.2,
        sodium_mg: 349,
        potassium_mg: 138,
        cholesterol_mg: 54,
        carbohydrates_total_g: 17.9,
        fiber_g: 0,
        sugar_g: 0,
      },
      {
        name: "french fries",
        calories: 312.5,
        serving_size_g: 100,
        fat_total_g: 14.4,
        fat_saturated_g: 2.3,
        protein_g: 3.4,
        sodium_mg: 209,
        potassium_mg: 123,
        cholesterol_mg: 0,
        carbohydrates_total_g: 42.1,
        fiber_g: 3.8,
        sugar_g: 0.3,
      },
    ],
  };
}

function getMockUSDAApiResponse(): { data: { foods: USDAFoodObject[] } } {
  const foods = [
    {
      fdcId: 454004,
      description: "APPLE",
      dataType: "Branded",
      gtinUpc: "867824000001",
      publishedDate: "2019-04-01",
      brandOwner: "TREECRISP 2 GO",
      ingredients: "CRISP APPLE.",
      marketCountry: "United States",
      foodCategory: "Pre-Packaged Fruit & Vegetables",
      modifiedDate: "2017-07-14",
      dataSource: "LI",
      servingSizeUnit: "g",
      servingSize: 154,
      householdServingFullText: "5.5 ONZ",
      tradeChannels: ["NO_TRADE_CHANNEL"],
      allHighlightFields: "<b>Ingredients</b>: CRISP <em>APPLE</em>.",
      score: 1066.8406,
      microbes: [],
      foodNutrients: [
        {
          nutrientId: 1087,
          nutrientName: "Calcium, Ca",
          nutrientNumber: "301",
          unitName: "MG",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 0,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 5300,
          indentLevel: 1,
          foodNutrientId: 3145990,
          percentDailyValue: 0,
        },
        {
          nutrientId: 1089,
          nutrientName: "Iron, Fe",
          nutrientNumber: "303",
          unitName: "MG",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 0.23,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 5400,
          indentLevel: 1,
          foodNutrientId: 3145991,
          percentDailyValue: 2,
        },
        {
          nutrientId: 1093,
          nutrientName: "Sodium, Na",
          nutrientNumber: "307",
          unitName: "MG",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 0,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 5800,
          indentLevel: 1,
          foodNutrientId: 3145992,
          percentDailyValue: 0,
        },
        {
          nutrientId: 1104,
          nutrientName: "Vitamin A, IU",
          nutrientNumber: "318",
          unitName: "IU",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 65,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 7500,
          indentLevel: 1,
          foodNutrientId: 3145993,
          percentDailyValue: 2,
        },
        {
          nutrientId: 1162,
          nutrientName: "Vitamin C, total ascorbic acid",
          nutrientNumber: "401",
          unitName: "MG",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 3.1,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 6300,
          indentLevel: 1,
          foodNutrientId: 3145994,
          percentDailyValue: 8,
        },
        {
          nutrientId: 1253,
          nutrientName: "Cholesterol",
          nutrientNumber: "601",
          unitName: "MG",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 0,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 15700,
          indentLevel: 1,
          foodNutrientId: 3145995,
          percentDailyValue: 0,
        },
        {
          nutrientId: 1258,
          nutrientName: "Fatty acids, total saturated",
          nutrientNumber: "606",
          unitName: "G",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 0,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 9700,
          indentLevel: 1,
          foodNutrientId: 3145996,
          percentDailyValue: 0,
        },
        {
          nutrientId: 1003,
          nutrientName: "Protein",
          nutrientNumber: "203",
          unitName: "G",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 0,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 600,
          indentLevel: 1,
          foodNutrientId: 4587770,
          percentDailyValue: 0,
        },
        {
          nutrientId: 1005,
          nutrientName: "Carbohydrate, by difference",
          nutrientNumber: "205",
          unitName: "G",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 14.3,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 1110,
          indentLevel: 2,
          foodNutrientId: 4587771,
          percentDailyValue: 7,
        },
        {
          nutrientId: 1008,
          nutrientName: "Energy",
          nutrientNumber: "208",
          unitName: "KCAL",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 52,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 300,
          indentLevel: 1,
          foodNutrientId: 4587772,
          percentDailyValue: 0,
        },
        {
          nutrientId: 2000,
          nutrientName: "Sugars, total including NLEA",
          nutrientNumber: "269",
          unitName: "G",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 10.4,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 1510,
          indentLevel: 3,
          foodNutrientId: 4587773,
          percentDailyValue: 0,
        },
        {
          nutrientId: 1079,
          nutrientName: "Fiber, total dietary",
          nutrientNumber: "291",
          unitName: "G",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 3.2,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 1200,
          indentLevel: 3,
          foodNutrientId: 4587774,
          percentDailyValue: 20,
        },
        {
          nutrientId: 1092,
          nutrientName: "Potassium, K",
          nutrientNumber: "306",
          unitName: "MG",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 110,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 5700,
          indentLevel: 1,
          foodNutrientId: 4587775,
          percentDailyValue: 5,
        },
        {
          nutrientId: 1257,
          nutrientName: "Fatty acids, total trans",
          nutrientNumber: "605",
          unitName: "G",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 0,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 15400,
          indentLevel: 1,
          foodNutrientId: 4587776,
          percentDailyValue: 0,
        },
        {
          nutrientId: 1004,
          nutrientName: "Total lipid (fat)",
          nutrientNumber: "204",
          unitName: "G",
          derivationCode: "LCSL",
          derivationDescription: "Calculated from a less than value per serving size measure",
          derivationId: 73,
          value: 0.65,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 800,
          indentLevel: 1,
          foodNutrientId: 6376585,
          percentDailyValue: 0,
        },
      ],
      finalFoodInputFoods: [],
      foodMeasures: [],
      foodAttributes: [],
      foodAttributeTypes: [],
      foodVersionIds: [],
    },
    {
      fdcId: 2117388,
      description: "APPLE",
      dataType: "Branded",
      gtinUpc: "070038322238",
      publishedDate: "2021-10-28",
      brandOwner: "Associated Wholesale Grocers, Inc.",
      brandName: "BEST CHOICE",
      ingredients: "FILTERED WATER, APPLE JUICE CONCENTRATE, ASCORBIC ACID (VITAMIN C).",
      marketCountry: "United States",
      foodCategory: "Fruit & Vegetable Juice, Nectars & Fruit Drinks",
      modifiedDate: "2019-12-17",
      dataSource: "LI",
      packageWeight: "64 fl oz/2 Quart/1.89 L",
      servingSizeUnit: "ml",
      servingSize: 240,
      tradeChannels: ["NO_TRADE_CHANNEL"],
      allHighlightFields:
        "<b>Ingredients</b>: FILTERED WATER, <em>APPLE</em> JUICE CONCENTRATE, ASCORBIC ACID (VITAMIN C).",
      score: 1066.8406,
      microbes: [],
      foodNutrients: [
        {
          nutrientId: 1003,
          nutrientName: "Protein",
          nutrientNumber: "203",
          unitName: "G",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 0,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 600,
          indentLevel: 1,
          foodNutrientId: 25213844,
        },
        {
          nutrientId: 1004,
          nutrientName: "Total lipid (fat)",
          nutrientNumber: "204",
          unitName: "G",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 0,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 800,
          indentLevel: 1,
          foodNutrientId: 25213845,
          percentDailyValue: 0,
        },
        {
          nutrientId: 1005,
          nutrientName: "Carbohydrate, by difference",
          nutrientNumber: "205",
          unitName: "G",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 11.7,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 1110,
          indentLevel: 2,
          foodNutrientId: 25213846,
          percentDailyValue: 9,
        },
        {
          nutrientId: 1008,
          nutrientName: "Energy",
          nutrientNumber: "208",
          unitName: "KCAL",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 46,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 300,
          indentLevel: 1,
          foodNutrientId: 25213847,
        },
        {
          nutrientId: 2000,
          nutrientName: "Sugars, total including NLEA",
          nutrientNumber: "269",
          unitName: "G",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 11.7,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 1510,
          indentLevel: 3,
          foodNutrientId: 25213848,
        },
        {
          nutrientId: 1093,
          nutrientName: "Sodium, Na",
          nutrientNumber: "307",
          unitName: "MG",
          derivationCode: "LCCS",
          derivationDescription: "Calculated from value per serving size measure",
          derivationId: 70,
          value: 15,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 5800,
          indentLevel: 1,
          foodNutrientId: 25213849,
          percentDailyValue: 1,
        },
        {
          nutrientId: 1162,
          nutrientName: "Vitamin C, total ascorbic acid",
          nutrientNumber: "401",
          unitName: "MG",
          derivationCode: "LCCD",
          derivationDescription:
            "Calculated from a daily value percentage per serving size measure",
          derivationId: 75,
          value: 32.5,
          foodNutrientSourceId: 9,
          foodNutrientSourceCode: "12",
          foodNutrientSourceDescription: "Manufacturer's analytical; partial documentation",
          rank: 6300,
          indentLevel: 1,
          foodNutrientId: 25213850,
          percentDailyValue: 130,
        },
      ],
      finalFoodInputFoods: [],
      foodMeasures: [],
      foodAttributes: [],
      foodAttributeTypes: [],
      foodVersionIds: [],
    },
  ];

  return { data: { foods } };
}

export {
  getLoginTokenStrForTest,
  mockGetLoggedInUserIdFromReq,
  createManyTestUsers,
  deleteManyTestUsers,
  createTestUser,
  createValidUserCreds,
  createTestDailyData,
  getNewMockIntake,
  getMockNewIntakeItem,
  getMockIntake,
  getMockIntakeItem,
  getMockWorkout,
  getMockWorkoutItem,
  getMongoId,
  getMockedUser,
  deleteTestUser,
  getMockDailyData,
  getMockNinjaApiResponse,
  getMockUSDAApiResponse,
};
