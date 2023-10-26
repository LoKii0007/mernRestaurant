import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../store/slices/CartSlice";
import toast from "react-hot-toast";

export default function CartCard(props) {
  let options = props.options;

  const [qty, setQty] = useState(props.foodItem.qtyOrdered);
  const [size, setSize] = useState(props.foodItem.size);
  const dispatch = useDispatch();

  function deleteCartItem(item) {
    console.log(item);
    toast.success("Item deleted from cart");
    dispatch(removeFromCart(item));
  }

  let finalPrice;

  if ("half" === size) {
    finalPrice = props.options[0].half * qty;
  } else if ("full" === size) {
    finalPrice = props.options[0].full * qty;
  } else if ("large" === size) {
    finalPrice = props.options[0].large * qty;
  } else if ("regular" === size) {
    finalPrice = props.options[0].regular * qty;
  } else if ("medium" === size) {
    finalPrice = props.options[0].medium * qty;
  }

  return (
    <article className="card mt-3 food">
      <div className="img-container">
        <img src={props.foodItem.img} alt={props.foodItem.name} />
      </div>
      <div className="food-footer">
        <h4>{props.foodItem.name}</h4>
      </div>
      <div className="food-footer">
        <p>{props.foodItem.description}</p>
      </div>
      <div className="container w-100">
        <p className="text-center m-2 h-100 bg-success rounded" value={qty}>
          Quantity: {qty}
        </p>

        <p className="text-center m-2 h-100 bg-success rounded" value={size}>
          Size: {size}
        </p>

        <div className="d-inline h-100 fs-5">₹{finalPrice}/-</div>
        <hr />
        <button
          className="btn btn-success justify-center m-2"
          onClick={() => {
            deleteCartItem(props.foodItem);
          }}
        >
          Remove From Cart
        </button>
      </div>
    </article>
  );
}
