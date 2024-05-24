"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mailerlite_nodejs_1 = __importDefault(
  require("@mailerlite/mailerlite-nodejs")
);
const fs_1 = __importDefault(require("fs"));
// import multer from "multer";
const db_1 = require("./db");
const Profile_model_1 = require("./models/Profile.model");
const helpers_1 = require("./utils/helpers");
const path_1 = __importDefault(require("path"));
const Follow_Model_1 = require("./models/followers.model");
dotenv_1.default.config();
db_1.db.connect().then((db) => {
  if (db) {
    console.log("⚡️[server]: MongoDB connected");
  } else {
    console.log("⚡️[server]: MongoDB connection failed");
  }
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const mailerlite = new mailerlite_nodejs_1.default({
  api_key: "API_KEY",
});
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(
  (0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("meme maker running");
});
app.post("/profile", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      console.log("req.body", req.body);
      const data = req.body;
      const profilePic =
        (_a = req.files) === null || _a === void 0 ? void 0 : _a.profileImage;
      const name = data.name;
      const handle = data.handle;
      const totalViews = data.totalViews;
      const totalGifs = data.totalGifs;
      const profileType = data.profileType;
      const isVerified = data.isVerified;
      const isPublic = data.isPublic;
      const bio = data.bio;
      const giphyLink = data.giphyLink;
      const isFeatured = data.isFeatured;
      const adminKey = data.adminKey;
      if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        throw new Error("Invalid admin key");
      }
      let profileImage;
      if (profilePic) {
        // create public folder if it doesn't exist
        if (!fs_1.default.existsSync("./public")) {
          fs_1.default.mkdirSync("./public");
        }
        profileImage = profilePic.md5 + "_" + profilePic.name;
        profilePic.mv(
          `./public/${profilePic.md5 + "_" + profilePic.name}`,
          (err) => {}
        );
      }
      // check if profile exists
      // if it does, update it
      // if it doesn't, create it
      let profile = yield Profile_model_1.ProfileModel.findOne({
        handle: handle,
      });
      if (!profile) {
        profile = new Profile_model_1.ProfileModel({});
      }
      if (profileImage) {
        profile.profileImage = profileImage;
      }
      console.log("name", name);
      if (name) {
        console.log("name", name);
        profile.name = name;
      }
      if (handle) {
        profile.handle = handle;
      }
      if (totalViews) {
        profile.totalViews = totalViews;
      }
      if (totalGifs) {
        profile.totalGifs = totalGifs;
      }
      if (profileType) {
        profile.profileType = profileType;
      }
      if (isPublic) {
        profile.isPublic = isPublic;
      }
      if (bio) {
        profile.bio = bio;
      }
      let giphyUsername;
      let giphyType;
      if (giphyLink) {
        // url has to start with https://giphy.com
        if (!giphyLink.startsWith("https://giphy.com")) {
          throw new Error("Invalid giphy link");
        }
        // if the link has channel in it excute code
        if (giphyLink.includes("channel")) {
          const pageSource = yield fetch(giphyLink);
          const body = yield pageSource.text();
          const channelIdMatch = body.match(/"channelId"\s*:\s*(\d+)/);
          const channelId = channelIdMatch ? channelIdMatch[1] : null;
          console.log("channelId", channelId);
          if (!channelId) {
            throw new Error("Failed to extract channel id, verify giphy link");
          }
          profile.giphyLink = giphyLink;
          profile.giphyType = "channel";
          profile.giphyUsername = channelId;
        } else {
          // profile names are like https://giphy.com/username
          giphyUsername = giphyLink.split("/")[3];
          profile.giphyUsername = giphyUsername;
          giphyType = "username";
          profile.giphyLink = `https://giphy.com/${giphyUsername}`;
          profile.giphyType = giphyType;
        }
      }
      if (isFeatured) {
        profile.isFeatured = isFeatured;
      }
      if (typeof isVerified) {
        console.log("isVerified", isVerified);
        profile.isVerified = isVerified;
      }
      yield profile.save();
      res.json({
        success: true,
        data: profile,
      });
    } catch (e) {
      res.json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.get("/profile/:handle", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      let handle = req.params.handle;
      // if handle starts with @, remove it
      if (handle.startsWith("@")) {
        handle = handle.substring(1);
      }
      console.log("handle", handle);
      const profile = yield Profile_model_1.ProfileModel.findOne({
        handle: handle,
      });
      if (!profile) {
        throw new Error("Profile not found");
      }
      res.json({
        success: true,
        data: profile,
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);

app.get("/profileById/:id", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      let id = req.params.id;

      console.log("id", id);
      const profile = yield Profile_model_1.ProfileModel.findOne({
        dyamicUserId: id,
      });
      if (!profile) {
        throw new Error("Profile not found");
      }
      res.json({
        success: true,
        data: profile,
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.put("/profile/:handle", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
      const data = req.body;
      const socialAccounts = JSON.parse(data.socialAccounts);
      data.socialAccounts = socialAccounts;
      const profilePic =
        (_b = req.files) === null || _b === void 0 ? void 0 : _b.profileImage;
      console.log(profilePic, "profileImage");
      let profileImage;
      if (profilePic) {
        // create public folder if it doesn't exist
        if (!fs_1.default.existsSync("./public")) {
          fs_1.default.mkdirSync("./public");
        }
        // Preserve the original file extension
        const fileExtension = path_1.default.extname(profilePic.name);
        const newFileName = `profile_image_${Date.now()}${fileExtension}`;
        profileImage = newFileName;
        console.log(profileImage, "profileImage");
        profilePic.mv(`./public/${newFileName}`, (err) => {});
      }
      console.log(profileImage, "profileImage");
      data.profileImage = profileImage;
      let handle = req.params.handle;
      // if handle starts with @, remove it
      if (handle.startsWith("@")) {
        handle = handle.substring(1);
      }
      console.log("handle", handle);
      const profile = yield Profile_model_1.ProfileModel.findOneAndUpdate(
        { dyamicUserId: handle },
        data,
        { new: true }
      );
      // const profile = await ProfileModel.findOneAndUpdate(
      //     { handle: handle },
      //     data
      // );
      if (!profile) {
        throw new Error("Profile not found");
      }
      res.json({
        success: true,
        data: profile,
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.get("/profile", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const profiles = yield Profile_model_1.ProfileModel.find({
        isPublic: true,
      });
      res.json({
        success: true,
        data: profiles,
      });
    } catch (e) {
      res.json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.get("/random", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      let numberOFProfiles = 10;
      const profiles = yield Profile_model_1.ProfileModel.find({
        isPublic: true,
      });
      numberOFProfiles = Math.min(numberOFProfiles, profiles.length);
      const randomProfiles = [];
      let seenNumbers = new Set();
      for (let i = 0; i < numberOFProfiles; i++) {
        let randomIndex = Math.floor(Math.random() * profiles.length);
        while (seenNumbers.has(randomIndex)) {
          randomIndex = Math.floor(Math.random() * profiles.length);
        }
        seenNumbers.add(randomIndex);
        randomProfiles.push(profiles[randomIndex]);
      }
      res.json({
        success: true,
        data: randomProfiles,
      });
    } catch (e) {
      res.json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.get("/featured", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const profiles = yield Profile_model_1.ProfileModel.find({
        isFeatured: true,
      });
      res.json({
        success: true,
        data: profiles,
      });
    } catch (e) {
      res.json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.delete("/profile/:handle", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const handle = req.params.handle;
      const adminKey = req.body.adminKey;
      console.log("adminKey", adminKey);
      if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        throw new Error("Invalid admin key");
      }
      yield Profile_model_1.ProfileModel.deleteOne({ handle: handle });
      res.json({
        success: true,
        message: "Profile deleted",
      });
    } catch (e) {
      res.json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);

// Follow a user
app.put("/follow", async (req, res) => {
  const { followId, userId } = req.body;

  if (!followId || !userId) {
    return res.status(422).json({ error: "Required parameters are missing" });
  }

  try {
    const userProfile = await Profile_model_1.ProfileModel.findById(userId);
    const followProfile = await Profile_model_1.ProfileModel.findById(followId);

    if (!userProfile || !followProfile) {
      return res.status(404).json({ error: "User or profile not found" });
    }

    if (userProfile.following.includes(followId)) {
      return res.status(400).json({ error: "Already following this profile" });
    }

    await Profile_model_1.ProfileModel.findByIdAndUpdate(
      followId,
      { $push: { followers: userId } },
      { new: true }
    );

    const result = await Profile_model_1.ProfileModel.findByIdAndUpdate(
      userId,
      { $push: { following: followId } },
      { new: true }
    );

    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});
app.put("/unFollow", async (req, res) => {
  const { followId, userId } = req.body;

  if (!followId || !userId) {
    return res.status(422).json({ error: "Required parameters are missing" });
  }

  try {
    await Profile_model_1.ProfileModel.findByIdAndUpdate(
      followId,
      { $pull: { followers: userId } },
      { new: true }
    );

    const result = await Profile_model_1.ProfileModel.findByIdAndUpdate(
      userId,
      { $pull: { following: followId } },
      { new: true }
    );

    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

app.post("/subscribe", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const body = req.body;
      const mailerlite = new mailerlite_nodejs_1.default({
        api_key: process.env.MAILERLITE_API_KEY || "",
      });
      console.log("body", body);
      const params = {
        email: body.email,
        groups: ["90429190938035292"],
        fields: {
          name: body.name,
        },
      };
      const response = yield mailerlite.subscribers.createOrUpdate(params);
      console.log("response", response);
      res.json({
        success: true,
        message: "Subscribed successfully",
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.post("/passthrough", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // just fetch the url and return the response
      const gifyUrl = req.body.url;
      const response = yield fetch(gifyUrl);
      const data = yield response.json();
      res.json(data);
    } catch (e) {
      res.status(500).json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.get("/profiles", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const profiles = yield Profile_model_1.ProfileModel.find({
        isPublic: true,
      });
      res.json({
        success: true,
        data: profiles,
      });
    } catch (e) {
      res.json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
app.post("/dynamic-webhook", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      console.log(req.body, req.body.eventName);
      switch (req.body.eventName) {
        case "user.created":
          // session
          // {
          //     messageId: '003a51dd-b0aa-4cd1-8b4a-db832b56b096',
          //     eventId: '780f93e0-a3c9-4e4c-ba02-c9b4041a756d',
          //     eventName: 'user.session.created',
          //     timestamp: '2024-05-21T11:24:57.523Z',
          //     webhookId: '040d8c19-03e3-482b-95fb-ce7e16ba4a37',
          //     userId: 'd3f8f5c1-b8d9-4759-8c13-c6edb13cc335',
          //     environmentId: 'fa77bf5d-537f-453b-a5b2-1af8ff33be4f',
          //     environmentName: 'sandbox',
          //     data: {
          //       id: '767a695a-5c4a-460a-92be-8fded8789405',
          //       projectEnvironmentId: 'fa77bf5d-537f-453b-a5b2-1af8ff33be4f',
          //       userId: 'd3f8f5c1-b8d9-4759-8c13-c6edb13cc335',
          //       walletPublicKey: null,
          //       ipAddress: null,
          //       createdAt: '2024-05-21T11:24:57.330Z',
          //       chain: null,
          //       walletName: null,
          //       provider: null,
          //       origin: null,
          //       expiresAt: null,
          //       revokedAt: null,
          //       verifiedCredentialType: 'email',
          //       verifiedCredentialId: '8fa19494-9030-4289-ab64-1e2966c026d7'
          //     }
          //   }
          //user.created
          // {
          //  messageId: 'bb3b36ed-3f19-4679-b060-74774b100f3e',
          //  eventId: 'd71524a8-0f29-4db5-843a-83d591a77b0c',
          //  eventName: 'user.created',
          //  timestamp: '2024-05-21T11:29:27.380Z',
          //  webhookId: '040d8c19-03e3-482b-95fb-ce7e16ba4a37',
          //  userId: '35573803-51a8-4bf6-8f2a-d2fcfcfa193f',
          //  environmentId: 'fa77bf5d-537f-453b-a5b2-1af8ff33be4f',
          //  environmentName: 'sandbox',
          //  data: {
          //    email: 'whatapp@mailinator.com',
          //    firstVisit: '2024-05-21T11:29:27.192Z',
          //    id: '35573803-51a8-4bf6-8f2a-d2fcfcfa193f',
          //    lastVerifiedCredentialId: '6b5ff333-1b5d-4f96-8553-38c971c4e048',
          //    lastVisit: '2024-05-21T11:29:27.192Z',
          //    lists: [],
          //    missingFields: [],
          //    newUser: true,
          //    projectEnvironmentId: 'fa77bf5d-537f-453b-a5b2-1af8ff33be4f',
          //    scope: '',
          //    sessionId: '26ba822c-84fd-433f-9b85-2e80bd664b6f',
          //    verifiedCredentials: [ [Object] ]
          //  }
          //}
          let user = yield Profile_model_1.ProfileModel.findOne({
            email: req.body.data.email,
          });
          if (!user) {
            user = yield Profile_model_1.ProfileModel.create({
              email: req.body.data.email,
              dyamicUserId: req.body.data.id,
              handle: (0, helpers_1.generateRandomUsername)(),
              // name: "name",
            });
          }
          console.log(user);
          break;
        default:
          break;
      }
      // just fetch the url and return the response
      res.json(true);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      });
    }
  })
);
// serve static files
app.use(express_1.default.static("public"));
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
