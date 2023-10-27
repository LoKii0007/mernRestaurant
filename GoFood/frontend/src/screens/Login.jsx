import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });
  const [otp, setOTP] = useState("");
  const [loginViaOTP, setLoginViaOTP] = useState(false);
  const [loginViaPassword, setLoginViaPassword] = useState(true);
  const [enterOTP, setEnterOTP] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [authToken, setAuthToken] = useState();

  async function handlePasswordSubmit(event) {
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
          if (result.data.Success === true) {
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

  function onOTPChange(event) {
    setOTP(event.target.value);
  }

  function sendOTP(event) {
    const { email } = loginCredentials;
    if (!email) {
      alert("Please fill in the email address");
    } else {
      axios
        .post("http://localhost:5000/user/sendotp", { email })
        .then((result) => {
          if (result.data.Success === true) {
            localStorage.setItem("OTP", JSON.stringify(result.data.otp));
            setCurrentUser(result.data.user);
            setAuthToken(result.data.AuthToken);
          } else {
            alert("Register First");
          }
        });
    }
    setLoginViaPassword(false);
    setLoginViaOTP(false);
    setEnterOTP(true);
  }

  function verifyOTP(event) {
    event.preventDefault();
    if (otp === localStorage.getItem("OTP")) {
      navigate("/");
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("authToken", JSON.stringify(authToken));
    } else {
      alert("wrong otp");
    }
  }

  if (loginViaPassword) {
    return (
      <div className="container">
        <form onSubmit={handlePasswordSubmit}>
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
          <div>
            <small
              onClick={() => {
                setLoginViaPassword(false);
                setLoginViaOTP(true);
              }}
            >
              Forgot Password
            </small>
          </div>
          <button type="submit" className="m-3 btn btn-success">
            Login
          </button>
          <Link to="/createuser" className="m-3 btn btn-danger">
            Have Not Registered
          </Link>
        </form>
      </div>
    );
  } else if (loginViaOTP) {
    return (
      <div className="container">
        <form>
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
          <button
            type="button"
            onClick={sendOTP}
            className="m-3 btn btn-success"
          >
            Send OTP
          </button>
          <Link to="/createuser" className="m-3 btn btn-danger">
            Have Not Registered
          </Link>
        </form>
      </div>
    );
  } else if (enterOTP) {
    return (
      <div className="container">
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputOTP" className="form-label">
              OTP
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputOTP"
              name="otp"
              value={otp}
              onChange={onOTPChange}
            />
          </div>
          <button
            type="button"
            onClick={verifyOTP}
            className="m-3 btn btn-success"
          >
            Verify OTP
          </button>
          <button
            type="button"
            onClick={sendOTP}
            className="m-3 btn btn-success"
          >
            Resend OTP
          </button>
        </form>
      </div>
    );
  }
}
