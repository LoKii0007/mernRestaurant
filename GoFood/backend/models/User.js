const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not Valid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    date: {
      type: String,
      default: new Date(),
    },
    tokens: {
      token: {
        type: String,
        required: true,
      },
    },
    cart: {
      type: Array,
    },
    order: {
      type: Array,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
