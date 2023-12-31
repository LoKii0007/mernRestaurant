import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import CartCard from "../components/CartCard";
import "../index.css";
import axios from "axios";
import { setCart } from "../store/slices/CartSlice";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

export default function Cart() {
  const dispatch = useDispatch();
  const currentUserAuthToken = localStorage.getItem("authToken");
  const data = useSelector((state) => state.cart);
  console.log(data);

  function deleteCart() {
    toast.success("Cart Emptied");
    dispatch(setCart([]));
    axios
      .post("http://localhost:5000/cartItems", {
        data: [],
        currentUserAuthToken,
      })
      .then((result) => {
        if (result.data.Success === "true") {
          console.log("Cart posted to backend");
        } else {
          console.log("error occured while placing order");
        }
      });
  }

  async function makePayment() {
    const stripe = await loadStripe(
      "pk_test_51O16qiSBdH4uYdkWOeS0zS4REySu3MmnRpO4gD7Uycx23DPPqQe04DwcZ3o5lTRDq5W6fiL6mINwoVjJI1xTKG5s00kiiGDAYq"
    );
    axios
      .post("http://localhost:5000/api/create-checkout-session", { data })
      .then((result) => {
        if (result.data.Success === "true") {
          const { sessionId } = result.data;
          const results = stripe.redirectToCheckout({
            sessionId: sessionId,
          });
        } else {
          console.log("An error occured");
        }
      });
  }
  if (data.length !== 0) {
    axios
      .post("http://localhost:5000/cartItems", { data, currentUserAuthToken })
      .then((result) => {
        if (result.data.Success === "true") {
          console.log("Cart posted to backend");
        } else {
          console.log("error occured while placing order");
        }
      });
  }
  React.useEffect(() => {
    axios
      .post("http://localhost:5000/cartUser", { currentUserAuthToken })
      .then((result) => {
        if (result.data.Success === "true") {
          dispatch(setCart(result.data.cartData));
        }
      });
  }, []);

  if (data.length !== 0) {
    return (
      <div>
        <div>
          <Navbar length={data.length} />
        </div>
        <h3>Cart</h3>
        <div className="container">
          <div className="row mb-3">
            {data.length !== 0 &&
              data.map((foodItem) => {
                return (
                  <div className="col-12 col-md-6 col-lg-3" key={foodItem._id}>
                    <CartCard
                      foodItem={foodItem}
                      key={foodItem.id}
                      options={foodItem.options}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <button className="btn btn-success " onClick={deleteCart}>
          Empty Your Cart
        </button>
        <button className="btn btn-success " onClick={makePayment}>
          Checkout
        </button>
      </div>
    );
  }
  return (
    <div>
      <div>
        <Navbar length={0} />
      </div>
      <h3>Your Cart Is Empty</h3>
    </div>
  );
}
