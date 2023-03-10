import { sendEmailVerification } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/FirebaseConfig";
import firebaseContex from "../../context/FirebaseContext";
import "./Login.css";
import "../signup/Signup.css";
import CustomSnackbar from "../../components/snackbar/snackbar";

const Login = () => {
  //new const for snackbar
  const [message, setMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const { login } = useContext(firebaseContex);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSend, setIsEmailSend] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("authUser"));
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const invalid = password.length < 6 || email === "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setMessage("Login Successful");
      setShowSnackbar(true);
      const loginUser = await login(email, password);
      if (auth.currentUser.emailVerified) {
        localStorage.setItem("authUser", JSON.stringify(loginUser.user));
        setLoading(false);
        navigate("/");
      } else {
        await sendEmailVerification(auth.currentUser);
        setLoading(false);
        setIsEmailSend(true);

        // wait until email verify
        let interval = setInterval(async () => {
          if (auth.currentUser.emailVerified) {
            clearInterval(interval);
            localStorage.setItem("authUser", JSON.stringify(loginUser.user));
            navigate("/");
            setIsEmailSend(false);
          }
          await auth.currentUser.reload();
        }, 2000);
      }
    } catch (error) {
      setMessage("Account doesn't exist.");
      e.target.reset();
      setLoading(false);
      setErrorMessage(error.message.replace("Firebase:", ""));
      setTimeout(() => {
        setMessage("Your email not verified yet.");
      }, 5000);
    }

    setShowSnackbar(true);
  };

  useEffect(() => {
    if (localUser) {
      navigate("/");
    }
  }, [localUser]);

  return (
    <section>
      <div class="star star1"></div>
      <div class="star star2"></div>
      <div class="star star3"></div>
      <div className="login-container">
        <div className="login-poster">
          <img
            src="/images/logo/login-poster.png"
            alt="iphone-poster"
            className="login-poster-image"
          />
        </div>

        <div className="login-wrapper">
          <div className="login-box">
            <div className="logo-wrapper">
              <img
                src="/images/logo/dump-space-logo.png"
                alt="instagram logo"
                className="instagram-logo"
              />
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
                  <div className="input-label">
                    <input
                      type="password"
                      placeholder="Password"
                      aria-label="Enter your password"
                      aria-required="true"
                      autoComplete="off"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="button-wrapper ">
                    <button
                      disabled={invalid}
                      type="submit"
                      className="pushable"
                      style={{ opacity: (invalid || loading) && "1" }}
                    >
                      <span class="front">Log In</span>
                    </button>
                    <CustomSnackbar
                      open={showSnackbar}
                      message={message}
                      variant="success"
                      onClose={handleSnackbarClose}
                    />
                  </div>

                  <div className="forgot-pass">
                    <Link to="/forgot" className="cur-point">
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              </div>
            ) : (
              // email send confirmation
              <div className="signup-confirm-email-wrapper">
                <div className="confirm-email-image-wrapper">
                  <img
                    src="/images/logo/dump-space-logo.png"
                    alt="confirm-email"
                    className="confirm-email-image"
                  />
                </div>
                <div className="confirm-email-message">
                  Your email not verified yet, so please verify email first.
                  Verification link send to your email (check inbox or spam
                  folder).
                </div>
              </div>
            )}

            <div className="redirect-text">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="cur-point">
                  Sign up
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
      </div>
    </section>
  );
};

export default Login;
