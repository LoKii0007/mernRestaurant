import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const { email, password } = loginCredentials;
    if (!email || !password) {
      alert("Please fill in the form completely");
    } else {
      const toCheckLogin = {
        email: loginCredentials.email,
        password: loginCredentials.password,
      };

      axios
        .post("http://localhost:5000/loginuser", { email, password })
        .then((result) => {
          if (result.data.Success === "true") {
            navigate("/");
            localStorage.setItem(
              "currentUser",
              JSON.stringify(result.data.user)
            );
            console.log(JSON.parse(localStorage.getItem("currentUser")));
            localStorage.setItem("authToken", result.data.AuthToken);
            console.log(localStorage.getItem("authToken"));
          } else {
            alert("Register First");
          }
        });

      setLoginCredentials({
        email: "",
        password: "",
      });
    }
  }

  function onChange(event) {
    setLoginCredentials({
      ...loginCredentials,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              name="email"
              value={loginCredentials.email}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={loginCredentials.password}
              onChange={onChange}
            />
          </div>

          <button type="submit" className="m-3 btn btn-success">
            Submit
          </button>

          <Link to="/createuser" className="m-3 btn btn-danger">
            Have Not Registered
          </Link>
        </form>
      </div>
    </>
  );
}
