import * as mongoose from "mongoose";

export const db = {
  connect: async () => {
    try {
      return mongoose.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017/meme-maker-db"
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  disconnect: async () => {
    try {
      await mongoose.disconnect();
      console.log("MongoDB disconnected");
    } catch (error) {
      console.log(error);
    }
  },
};
