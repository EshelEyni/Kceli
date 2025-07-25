import { Document, Query, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { IUser } from "../../types/iTypes";
import { User, WorkoutDay } from "../../../../shared/types/user";
import calorieService from "../../services/calorie/calorieService";
import { workoutSchema } from "../workout/workoutModel";

export const defaultWorkoutSchedule: WorkoutDay[] = [
  {
    name: "sun",
    value: 0,
    workouts: [],
  },
  {
    name: "mon",
    value: 1,
    workouts: [],
  },
  {
    name: "tue",
    value: 2,
    workouts: [],
  },
  {
    name: "wed",
    value: 3,
    workouts: [],
  },
  {
    name: "thu",
    value: 4,
    workouts: [],
  },
  {
    name: "fri",
    value: 5,
    workouts: [],
  },
  {
    name: "sat",
    value: 6,
    workouts: [],
  },
];

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return v.length >= 3 && v.length <= 20;
        },
        message: "username must be between 3 and 20 characters",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      validate: {
        validator: function (v: string): boolean {
          return v.length >= 8 && v.length <= 20;
        },
        message: "password must be between 8 and 20 characters",
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (this: IUser, v: string): boolean {
          return v === this.password;
        },
        message: "passwords must match",
      },
    },
    fullname: { type: String, required: [true, "Please provide your full name"] },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      validate: {
        validator: function (v: string): boolean {
          return /\S+@\S+\.\S+/.test(v);
        },
        message: "Please provide a valid email",
      },
    },
    imgUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dng9sfzqt/image/upload/v1681677382/user-chirper_ozii7u.png",
    },
    weight: { type: Number, required: [true, "Please provide your weight"] },
    height: { type: Number, required: [true, "Please provide your height"] },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "Gender must be either male or female",
      },
      required: [true, "Please provide your gender"],
    },
    birthdate: { type: Date, required: [true, "Please provide your birthdate"] },
    totalDailyEnergyExpenditure: { type: Number, default: 0 },
    targetCaloricIntakePerDay: { type: Number, default: 0 },
    targetCaloricDeficitPerDay: { type: Number, default: 0 },
    workoutSchedule: {
      type: [
        {
          name: {
            type: String,
            enum: {
              values: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
              message: "workoutSchedule name must be a valid day of the week",
            },
            required: [true, "Please provide a name for the workoutSchedule item"],
          },
          value: {
            type: Number,
            enum: {
              values: [0, 1, 2, 3, 4, 5, 6],
              message: "workoutSchedule value must be between 0 and 6",
            },
            required: [true, "Please provide a value for the workoutSchedule item"],
          },
          workouts: [workoutSchema],
        },
      ],
      default: defaultWorkoutSchedule,
    },
    isAdmin: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Number, default: 0 },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toObject: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        _removePrivateFields(ret);
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (_: Document, ret: Record<string, unknown>) => {
        _removePrivateFields(ret);
        return ret;
      },
    },
    timestamps: true,
  }
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre(/^find/, function (this: Query<User[], User & Document>, next) {
  const options = this.getOptions();
  if (options.active === false) return next();
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  // Password is only modified when creating a new user or updating the password after a reset
  const isPasswordModified = this.isModified("password");
  if (!isPasswordModified) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = "";
  next();
});

userSchema.pre("save", async function (next) {
  const [weight, height, gender, birthdate, targetCaloricDeficitPerDay] = [
    this.weight,
    this.height,
    this.gender,
    this.birthdate,
    this.targetCaloricDeficitPerDay,
  ];
  const age = new Date().getFullYear() - birthdate.getFullYear();
  const TDEE = calorieService.calcTotalDailyEnergyExpenditure({
    weight,
    height,
    gender,
    age,
  });
  this.totalDailyEnergyExpenditure = TDEE;
  this.targetCaloricIntakePerDay = calorieService.calcTargetCaloricIntakePerDay({
    TDEE,
    targetCaloricDeficitPerDay,
  });
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return JWTTimestamp < changedTimestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const TEN_MINUTES = 10 * 60 * 1000;
  this.passwordResetExpires = Date.now() + TEN_MINUTES;
  return resetToken;
};

function _removePrivateFields(doc: Record<string, unknown>) {
  delete doc._id;
  delete doc.password;
  delete doc.passwordConfirm;
  delete doc.active;
  delete doc.loginAttempts;
  delete doc.lockedUntil;
}

const UserModel = model<IUser>("User", userSchema);

export { userSchema, UserModel };
