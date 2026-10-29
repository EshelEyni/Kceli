import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createFixtures } from "./fixtures";

// Never passes through requests: review/test actions cannot reach a real account.
export function installReviewApi() {
  const mock = new MockAdapter(axios, { onNoMatch: "throwException" });
  const fixtures = createFixtures();
  const success = (data: unknown) => [200, { status: "success", data }] as [number, object];
  mock.onPost(/auth\/login\/with-token$/).reply(() => success(fixtures.user));
  mock
    .onGet(/user\/dailyStats$/)
    .reply(() =>
      success({
        stats: fixtures.history.map(({ date, weight, waist }) => ({ date, weight, waist })),
        count: 24,
      })
    );
  mock.onGet(/user\/review-user$/).reply(() => success(fixtures.user));
  mock.onPatch(/user\/loggedInUser$/).reply(config => {
    fixtures.user = { ...fixtures.user, ...JSON.parse(config.data) };
    return success(fixtures.user);
  });
  mock.onGet(/day\/today$/).reply(() => success(fixtures.today));
  mock.onPatch(/day\/today$/).reply(config => {
    fixtures.today = { ...fixtures.today, ...JSON.parse(config.data) };
    fixtures.history[fixtures.history.length - 1] = fixtures.today;
    return success(fixtures.today);
  });
  mock.onGet(/day\/calenderData\?/).reply(() => success(fixtures.history));
  mock.onGet(/workout$/).reply(() => success(fixtures.workouts));
  mock
    .onGet(/workout\/[^/?]+$/)
    .reply(config => success(fixtures.workouts.find(w => config.url?.endsWith(w.id))));
  mock.onGet(/intake\/favorite$/).reply(() => success([]));
  mock
    .onGet(/goal\/user$/)
    .reply(() =>
      success({
        id: "goal",
        userId: fixtures.user.id,
        type: "user",
        date: new Date(),
        description: "Feel stronger, at my own pace",
        isCompleted: false,
        userWeightLossGoal: { startingWeight: 84, weightGoal: 75 },
      })
    );
  mock.onGet(/goal\?/).reply(() => success([]));
  return { mock, fixtures };
}
