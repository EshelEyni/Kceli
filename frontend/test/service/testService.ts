import { User } from "../../../shared/types/user";
import { act } from "@testing-library/react";

function createTestUser(): User {
  return {
    id: "userId1",
    username: "username1",
    fullname: "fullname1",
    email: "email1",
    imgUrl: "profilePicUrl1",
    isAdmin: false,
    createdAt: "2021-01-01T00:00:00.000Z",
    weight: 120,
    height: 180,
    gender: "male",
    birthdate: new Date("1990-01-01"),
    totalDailyEnergyExpenditure: 2000,
    targetCaloricIntakePerDay: 1500,
  };
}

function createTestLoggedInUserActionState() {
  return {
    isLiked: false,
    isReposted: false,
    isViewed: false,
    isDetailedViewed: false,
    isProfileViewed: false,
    isHashTagClicked: false,
    isLinkClicked: false,
    isBookmarked: false,
    isPostLinkCopied: false,
    isPostShared: false,
    isPostSendInMessage: false,
    isPostBookmarked: false,
  };
}

async function waitForTick() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

export default {
  createTestUser,
  createTestLoggedInUserActionState,
  waitForTick,
};
