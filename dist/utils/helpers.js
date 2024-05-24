"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomUsername = void 0;
const crypto = require("crypto");
const generateRandomUsername = () => {
    // Generate a random string of 6 characters
    const randomString = crypto.randomBytes(3).toString("hex");
    // Create the username with a prefix and the random string
    const username = `user_${randomString}`;
    return username;
};
exports.generateRandomUsername = generateRandomUsername;
