import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebaseContex from "../../context/FirebaseContext";

import "./Forgot.css";
import "../forgot/Forgot.css";
import CustomSnackbar from "../../components/snackbar/snackbar";
import "../login/Login.css";

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

  // new const for snackbar
  const [showSnackbar, setShowSnackbar] = useState(false);
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowSnackbar(true);

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
    <section>
      <div className="login-container">
        <div className="login-wrapper">
          <div className="forgotpwd-box">
            <div className="logo-wrapper">
              <img src="/images/logo/dump-space-logo.png" alt="" className="" />
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

                  <div className="button-wrapper ">
                    <button
                      disabled={invalid}
                      type="submit"
                      className="login-button cur-point"
                      style={{ opacity: (invalid || loading) && "0.5" }}
                    >
                      Send
                    </button>
                    <CustomSnackbar
                      open={showSnackbar}
                      message="Please check your email."
                      variant="success"
                      onClose={handleSnackbarClose}
                    />
                  </div>
                </form>

                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                <div className="redirect-box">
                  <div className="redirect-text">
                    <p>
                      Go back to{" "}
                      <Link to="/login" className="cur-point">
                        Login Page
                      </Link>
                    </p>
                  </div>
                </div>
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
                  Please make sure your email is verified. Verification link
                  will be sent to your email, please check inbox or spam folder.
                </div>
              </div>
            )}
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
      </div>
    </section>
  );
};

export default Forgot;
