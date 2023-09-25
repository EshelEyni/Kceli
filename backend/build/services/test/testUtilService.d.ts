/// <reference types="jest" />
import mongoose from "mongoose";
import { User, UserCredenitials } from "../../../../shared/types/user";
import { NewIntake, NewIntakeItem } from "../../../../shared/types/intake";
type CreateTestUserOptions = {
    id?: string;
    isAdmin?: boolean;
};
declare function createManyTestUsers(numOfUsers: number): Promise<User[]>;
declare function deleteManyTestUsers(ids: string[]): Promise<void>;
declare function createTestUser({ id, isAdmin }?: CreateTestUserOptions): Promise<User>;
declare function deleteTestUser(id: string): Promise<void>;
declare function createTestDailyData(userId?: string): Promise<import("../../types/iTypes").IDailyData & {
    _id: mongoose.Types.ObjectId;
}>;
declare function getMongoId(): string;
declare function createValidUserCreds(id?: string): UserCredenitials;
declare function getLoginTokenStrForTest(validUserId: string): string;
declare function getMockedUser({ id, }?: {
    id?: string | mongoose.Types.ObjectId;
}): {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    imgUrl: string;
    isApprovedLocation: boolean;
    active: boolean;
    toObject: jest.Mock<any, any, any>;
};
declare function getMockDailyData(): {
    userId: string;
    date: Date;
    intakes: NewIntake[];
};
declare function getNewMockIntake(): NewIntake;
declare function getMockIntakeItem(): NewIntakeItem;
declare function mockGetLoggedInUserIdFromReq(value?: string): string;
export { getLoginTokenStrForTest, mockGetLoggedInUserIdFromReq, createManyTestUsers, deleteManyTestUsers, createTestUser, createValidUserCreds, createTestDailyData, getNewMockIntake, getMockIntakeItem, getMongoId, getMockedUser, deleteTestUser, getMockDailyData, };
