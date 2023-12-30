import mongoose from "mongoose";
import { IWorkout } from "../../types/iTypes";
declare const workoutSchema: mongoose.Schema<IWorkout, mongoose.Model<IWorkout, any, any, any, mongoose.Document<unknown, any, IWorkout> & IWorkout & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IWorkout, mongoose.Document<unknown, {}, IWorkout> & IWorkout & {
    _id: mongoose.Types.ObjectId;
}>;
declare const WorkoutModel: mongoose.Model<IWorkout, {}, {}, {}, mongoose.Document<unknown, {}, IWorkout> & IWorkout & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<IWorkout, mongoose.Model<IWorkout, any, any, any, mongoose.Document<unknown, any, IWorkout> & IWorkout & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IWorkout, mongoose.Document<unknown, {}, IWorkout> & IWorkout & {
    _id: mongoose.Types.ObjectId;
}>>;
export { workoutSchema, WorkoutModel };
