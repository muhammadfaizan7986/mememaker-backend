"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = exports.Profile = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importDefault(require("mongoose"));
let Profile = class Profile {
};
exports.Profile = Profile;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Profile.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", String)
], Profile.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Profile.prototype, "handle", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", Number)
], Profile.prototype, "totalViews", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", Number)
], Profile.prototype, "totalGifs", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", String)
], Profile.prototype, "profileType", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Profile.prototype, "isVerified", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Profile.prototype, "isPublic", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", Boolean)
], Profile.prototype, "isFeatured", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", String)
], Profile.prototype, "profileImage", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", String)
], Profile.prototype, "bio", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", String)
], Profile.prototype, "giphyLink", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", String)
], Profile.prototype, "giphyType", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", String)
], Profile.prototype, "giphyUsername", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", String)
], Profile.prototype, "dyamicUserId", void 0);
__decorate([
    (0, typegoose_1.prop)( /* { required: true } */),
    __metadata("design:type", Array)
], Profile.prototype, "socialAccounts", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [mongoose_1.default.Schema.Types.ObjectId], ref: () => Profile }),
    __metadata("design:type", Array)
], Profile.prototype, "followers", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [mongoose_1.default.Schema.Types.ObjectId], ref: () => Profile }),
    __metadata("design:type", Array)
], Profile.prototype, "following", void 0);
exports.Profile = Profile = __decorate([
    (0, typegoose_1.modelOptions)({
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
], Profile);
exports.ProfileModel = (0, typegoose_1.getModelForClass)(Profile);
