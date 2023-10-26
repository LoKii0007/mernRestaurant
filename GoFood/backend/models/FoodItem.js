const mongoose = require("mongoose");

const foodItemsSchema = new mongoose.Schema({
  CategoryName: {
    type: String,
    required: [true, "Enter the category name"],
  },
  name: {
    type: String,
    required: [true, "You have not entered any food name"],
  },
  img: {
    type: String,
    required: [true, "You have not entered any img url"],
  },
  options: {
    type: Array,
    required: [true, "You have not entered any options"],
  },
  description: {
    type: String,
    required: [true, "You have not entered any description"],
  },
});

module.exports = mongoose.model("food_items", foodItemsSchema);
