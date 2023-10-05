/* eslint-disable @typescript-eslint/no-explicit-any */
require("dotenv").config();
import mongoose from "mongoose";
import { User, UserCredenitials } from "../../../../shared/types/user";
import tokenService from "../token/tokenService";
import { UserModel } from "../../models/user/userModel";
import { MeasurementUnit, NewIntake, NewIntakeItem } from "../../../../shared/types/intake";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { getLoggedInUserIdFromReq } from "../ALSService";
import { Workout, WorkoutItemAerobic } from "../../../../shared/types/workout";

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

function getMockWorkout(): Workout {
  return {
    id: getMongoId(),
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
  getMockWorkout,
  getMockWorkoutItem,
  getMongoId,
  getMockedUser,
  deleteTestUser,
  getMockDailyData,
};
