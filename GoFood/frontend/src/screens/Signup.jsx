import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const [passShow, setPassShow] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const { name, email, password, location } = credentials;
    if (!name || !email || !password || !location) {
      alert("Please fill in the form completely");
    } else {
      axios
        .post("http://localhost:5000/createuser", {
          name,
          email,
          password,
          location,
        })
        .then((result) => {
          if (result.data.Success === true) {
            toast.success("Successfully signed up");
          } else {
            toast.error("You have already signed up.\nPlease login");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setCredentials({
        name: "",
        email: "",
        password: "",
        location: "",
      });
    }
  }

  function onChange(event) {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={credentials.name}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type={!passShow ? "password" : "text"}
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={credentials.password}
              onChange={onChange}
            />
            <div className="showpass" onClick={() => setPassShow(!passShow)}>
              {!passShow ? "Show" : "Hide"}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="Address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="Address"
              name="location"
              value={credentials.location}
              onChange={onChange}
            />
          </div>

          <button type="submit" className="m-3 btn btn-success">
            Submit
          </button>

          <Link to="/login" className="m-3 btn btn-danger">
            Already A User
          </Link>
        </form>
      </div>
    </>
  );
}
