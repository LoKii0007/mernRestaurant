require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const user = require("../models/User");

const saltRounds = 10;

const uri = process.env.mongoURL;

mongoose
  .connect(uri)
  .then(console.log("connection successful"))
  .catch((err) => {
    console.log("some error in db connection");
    console.log(err);
  });

const client = new MongoClient(uri);

const dbName = "gofoodmern";
const users_collection = "users";
const food_items_collection = "food_items";
const food_category_collection = "food_category";

const database = client.db(dbName);
const usersCollection = database.collection(users_collection);
const foodItemsCollection = database.collection(food_items_collection);
const foodCategoryCollection = database.collection(food_category_collection);

async function getFoodItems() {
  try {
    const foodItemArray = await foodItemsCollection.find({}).toArray();
    return foodItemArray;
  } catch (err) {
    console.log("Something went wrong trying to find the documents:" + err);
  }
}

async function getFoodCategory() {
  try {
    const foodCategoryArray = await foodCategoryCollection.find({}).toArray();
    return foodCategoryArray;
  } catch (err) {
    console.log("Something went wrong trying to find the documents:" + err);
  }
}

async function findUser(query) {
  try {
    const userFound = await user.findOne(query);
    return userFound;
  } catch (err) {
    console.log("Something went wrong trying to find the documents:" + err);
  }
}

async function insertUser(newUser) {
  try {
    await user.create(newUser);
    console.log("documents successfully inserted.");
  } catch (err) {
    console.log("Error while inserting" + err);
  }
}

async function updateUserCart(cartData, currentUserAuthToken) {
  const findUpdatingQuery = { tokens: { token: currentUserAuthToken } };

  let updatedUser = await user.updateOne(findUpdatingQuery, {
    $set: { cart: cartData },
  });
  if (updatedUser) {
    return true;
  } else {
    return true;
  }
}

async function findUserCart(query) {
  try {
    const userFound = await user.findOne(query);
    return userFound;
  } catch (err) {
    console.error("Something went wrong trying to update one document: " + err);
    return;
  }
}

async function updateUserOrder(orderData, currentUserAuthToken) {
  const findUpdatingQuery = { tokens: { token: currentUserAuthToken } };

  let updatedUser = await user.updateOne(findUpdatingQuery, {
    $push: { order: orderData },
  });
  console.log(updatedUser);
  if (updatedUser) {
    return true;
  } else {
    return false;
  }
}

async function findUserOrder(query) {
  try {
    const userFound = await user.findOne(query);
    return userFound;
  } catch (err) {
    console.error("Something went wrong trying to update one document: " + err);
    return;
  }
}

async function generateAuthToken(newuser) {
  try {
    const token = await jwt.sign(
      {
        _id: newuser._id,
      },
      process.env.HASH_KEY
    );
    return token;
  } catch (error) {
    console.log(error);
  }
}

router.route("/createuser").post(async (req, res) => {
  var encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = new user({
    name: req.body.name,
    password: encryptedPassword,
    email: req.body.email,
    location: req.body.location,
  });

  const token = await generateAuthToken(newUser);
  const query = { email: req.body.email };

  const duplicateUser = await findUser(query);

  if (duplicateUser !== null) {
    res.send({ Success: false });
  } else {
    const userSave = {
      name: req.body.name,
      password: encryptedPassword,
      email: req.body.email,
      location: req.body.location,
      tokens: { token: token },
    };

    await insertUser(userSave);
    res.send({ Success: true });
  }
});

router.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;
  const findQuery = { email: email };
  const emailFind = await findUser(findQuery);

  if (emailFind) {
    var checkEncryptedPassword = await bcrypt.compare(
      password,
      emailFind.password
    );
    if (checkEncryptedPassword) {
      res.json({
        Success: "true",
        AuthToken: emailFind.tokens.token,
        user: emailFind,
      });
    } else {
      console.log("Match not found");
      res.json({ Success: "false" });
    }
  } else {
    console.log("Match not found");
    res.json({ Success: "false" });
  }
});

router.get("/foodItems", async (req, res) => {
  const foodItems = await getFoodItems();

  if (foodItems.length !== 0) {
    res.send({
      Success: "true",
      foodItem: foodItems,
    });
  } else {
    console.log("foodItems not found");
    res.json({ Success: "false" });
  }
});

router.get("/foodCategory", async (req, res) => {
  const foodCategory = await getFoodCategory();

  if (foodCategory.length !== 0) {
    console.log("foodCategory found");
    res.send({
      Success: "true",
      foodCategory: foodCategory,
    });
  } else {
    console.log("foodCategory not found");
    res.json({ Success: "false" });
  }
});

router.post("/cartItems", async (req, res) => {
  const { data, currentUserAuthToken } = req.body;

  const findUpdatingQuery = { tokens: { token: currentUserAuthToken } };
  const isEmailUpdated = await updateUserCart(data, currentUserAuthToken);

  if (isEmailUpdated) {
    res.send({ Success: "true" });
  } else {
    res.send({ Success: "false" });
  }
});

router.post("/cartUser", async (req, res) => {
  const { currentUserAuthToken } = req.body;

  const findQuery = { tokens: { token: currentUserAuthToken } };
  const FoundEmail = await findUserCart(findQuery);

  if (FoundEmail) {
    res.send({ Success: "true", cartData: FoundEmail.cart });
  } else {
    res.send({ Success: "false", cart: [] });
  }
});

router.post("/api/create-checkout-session", async (req, res) => {
  const { data } = req.body;
  const lineItems = data.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.name,
      },
      unit_amount: (product.price / product.qtyOrdered) * 100,
    },
    quantity: product.qtyOrdered,
  }));
  console.log(data);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });

  res.send({ Success: "true", sessionId: session.id });
});

router.post("/order-Items", async (req, res) => {
  const { dataWithTime, currentUserAuthToken } = req.body;
  console.log(dataWithTime);
  const isEmailUpdated = await updateUserOrder(
    dataWithTime,
    currentUserAuthToken
  );
  console.log(isEmailUpdated);
  if (isEmailUpdated) {
    res.send({ Success: "true" });
  } else {
    res.send({ Success: "false" });
  }
});

router.post("/orderedItems", async (req, res) => {
  const { currentUserAuthToken } = req.body;

  const findQuery = { tokens: { token: currentUserAuthToken } };
  const FoundEmail = await findUserOrder(findQuery);
  if (FoundEmail) {
    res.send({ Success: "true", orders: FoundEmail.order.reverse() });
  } else {
    res.send({ Success: "false", orders: [] });
  }
});

module.exports = router;
