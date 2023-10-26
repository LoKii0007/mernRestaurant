const express = require("express");
const router = express.Router();

const foodItem = require("../models/FoodItem");

async function InsertFoodItem(req, res) {
  let item = new foodItem({
    name: req.body.name,
    CategoryName: req.body.categoryname,
    img: req.body.img,
    options: req.body.option,
    description: req.body.description,
  });
  const inserting = await item.save();
}

async function FindFoodItem(req, res) {
  var finding = await foodItem.find();
  console.log(finding);
}

router.post("/createfood", async (req, res) => {
  try {
    await InsertFoodItem(req, res);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// router.get("/createfood", async (req, res) => {
//   try {
//     await FindFoodItem(req, res);
//     res.json({ success: true });
//   } catch (err) {
//     console.log(err);
//     res.json({ success: false });
//   }
// });

module.exports = router;
