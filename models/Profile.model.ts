import {
  DocumentType,
  Ref,
  getModelForClass,
  index,
  modelOptions,
  plugin,
  pre,
  prop,
} from "@typegoose/typegoose";
import mongoose, { Mixed } from "mongoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
})
export class Profile {
  @prop({ required: true })
  public email!: string;

  @prop(/* { required: true } */)
  public name!: string;

  @prop({ required: true, unique: true })
  public handle!: string;

  @prop(/* { required: true } */)
  public totalViews!: number;

  @prop(/* { required: true } */)
  public totalGifs!: number;

  @prop(/* { required: true } */)
  public profileType!: string;

  @prop({ required: true, default: false })
  public isVerified!: boolean;

  @prop({ required: true, default: false })
  public isPublic!: boolean;

  @prop(/* { required: true } */)
  public isFeatured!: boolean;

  @prop(/* { required: true } */)
  public profileImage!: string;

  @prop(/* { required: true } */)
  public bio!: string;

  @prop(/* { required: true } */)
  public giphyLink!: string;

  @prop(/* { required: true } */)
  public giphyType!: string;

  @prop(/* { required: true } */)
  public giphyUsername!: string;

  @prop(/* { required: true } */)
  public dyamicUserId!: string;

  @prop(/* { required: true } */)
  public socialAccounts!: [object];

  @prop({ type: () => [mongoose.Schema.Types.ObjectId], ref: () => Profile })
  public followers!: Ref<Profile>[];

  @prop({ type: () => [mongoose.Schema.Types.ObjectId], ref: () => Profile })
  public following!: Ref<Profile>[];
}

export const ProfileModel = getModelForClass(Profile);
