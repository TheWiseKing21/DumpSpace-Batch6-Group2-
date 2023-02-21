import { sendEmailVerification } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
// import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import { auth } from "../../config/FirebaseConfig";
import firebaseContex from "../../context/FirebaseContext";

// import "./Login.css";
// import "../signup/Signup.css";
import "./Forgot.css";
import "../forgot/Forgot.css";

const Forgot = () => {
  const { login, facebookLogin } = useContext(firebaseContex);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSend, setIsEmailSend] = useState(false);
  const { forgotPassword } = useContext(firebaseContex);

  const localUser = JSON.parse(localStorage.getItem("authUser"));
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const invalid = email === "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    forgotPassword(email)
      .then((Response) => {
        console.log(Response);
      })
      .catch((e) => {
        console.log(e.errorMessage);
      });
  };

  useEffect(() => {
    if (localUser) {
      navigate("/");
    }
  }, [localUser]);

  return (
    <div className="login-container">
      <div className="login-poster">
        <img src="" alt="" className="" />
      </div>
      <div className="login-wrapper">
        <div className="login-box">
          <div className="logo-wrapper">
            <img src="" alt="" className="" />
          </div>
          {!isEmailSend ? (
            <div className="login-form-wrapper">
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-label">
                  <input
                    type="email"
                    placeholder="Email address"
                    aria-label="Enter your email address"
                    aria-required="true"
                    autoComplete="off"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* <div className="input-label">
                  <input
                    type="password"
                    placeholder="Password"
                    aria-label="Enter your password"
                    aria-required="true"
                    autoComplete="off"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div> */}

                <div className="button-wrapper ">
                  <button
                    disabled={invalid}
                    type="submit"
                    className="login-button cur-point"
                    style={{ opacity: (invalid || loading) && "0.5" }}
                  >
                    Send
                  </button>
                  {/* {loading && <Loading />} */}

                  {/* <div className="redirect-text">
                    <Link to="/signup" className="cur-point">
                      Forgot Password
                    </Link>
                  </div> */}
                </div>
              </form>
              {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            </div>
          ) : (
            // email send confirmation
            <div className="signup-confirm-email-wrapper">
              <div className="confirm-email-image-wrapper">
                <img
                  src="/images/confirm-email.svg"
                  alt="confirm-email"
                  className="confirm-email-image"
                />
              </div>
              <div className="confirm-email-message">
                Your Email not Verified yet, So Please verify email first.
                Varification link send to your email (check inbox or spam
                folder).
              </div>
            </div>
          )}
        </div>
        <div className="redirect-box login-box">
          <div className="redirect-text">
            <p>
              This is Forgot Page{" "}
              <Link to="/login" className="cur-point">
                Login
              </Link>
            </p>
          </div>
        </div>
        <div
          className="guest-login-info-wrapper login-box"
          style={{ display: "none" }}
        >
          <div className="title">Create new account or login as a guest</div>
          <div className="guest-login-credential">
            <div className="guest-email">
              <p>Email: guest@gmail.com</p>
            </div>
            <div className="guest-password">
              <p>Password: guest@1234</p>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Forgot;
