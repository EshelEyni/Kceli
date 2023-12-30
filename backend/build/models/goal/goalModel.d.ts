import mongoose from "mongoose";
import { IGoal } from "../../types/iTypes";
declare const GoalModel: mongoose.Model<IGoal, {}, {}, {}, mongoose.Document<unknown, {}, IGoal> & IGoal & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default GoalModel;
