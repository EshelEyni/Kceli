import { User } from "../../../../shared/types/user";
import { DayData } from "../../../../shared/types/dayData";
import { Intake, IntakeItem, NewIntake, NewIntakeItem } from "../../../../shared/types/intake";
declare function assertUser(user: User): void;
declare function assertDailyData(dailyData: DayData): void;
declare function assertIntake(intake: NewIntake | Intake): void;
declare function assertIntakeItem(item: NewIntakeItem | IntakeItem): void;
export { assertUser, assertDailyData, assertIntake, assertIntakeItem };
