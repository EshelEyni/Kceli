import mongoose from "mongoose";
import { IFavoriteIntake, IIntake } from "../../types/iTypes";
declare const intakeSchema: mongoose.Schema<IIntake, mongoose.Model<IIntake, any, any, any, mongoose.Document<unknown, any, IIntake> & IIntake & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IIntake, mongoose.Document<unknown, {}, IIntake> & IIntake & {
    _id: mongoose.Types.ObjectId;
}>;
declare const FavoriteIntakeModel: mongoose.Model<IFavoriteIntake, {}, {}, {}, mongoose.Document<unknown, {}, IFavoriteIntake> & IFavoriteIntake & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<IFavoriteIntake, mongoose.Model<IFavoriteIntake, any, any, any, mongoose.Document<unknown, any, IFavoriteIntake> & IFavoriteIntake & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IFavoriteIntake, mongoose.Document<unknown, {}, IFavoriteIntake> & IFavoriteIntake & {
    _id: mongoose.Types.ObjectId;
}>>;
export { FavoriteIntakeModel, intakeSchema };
