import React, { useState } from "react";
export default function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log(currentUser);
  const [pswrd, setpswrd] = useState("");
  console.log(pswrd);

  return (
    <div>
      <h3>Name: {currentUser.name}</h3>
      <h3>Email: {currentUser.email}</h3>
      <h3>Location: {currentUser.location}</h3>
      <h4>Change your password</h4>

      <div className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">
          Enter your Password
        </label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          name="pswrd"
          value={pswrd}
          onChange={(event) => {
            setpswrd(event.target.value);
          }}
        />
      </div>
    </div>
  );
}
