import React, { useContext, useState } from "react";
import "./Signup.css";
import "../login/Login.css";
import { Link, useNavigate } from "react-router-dom";
import firebaseContex from "../../context/FirebaseContext";
import { db, auth } from "../../config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import usernameChecker from "./UsernameCheker";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import CustomSnackbar from "../../components/snackbar/snackbar";
import validator from "validator";

const Signup = () => {
  //new const for snackbar
  const [message, setMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState("");
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const { signup } = useContext(firebaseContex);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSend, setIsEmailSend] = useState(false);

  const navigate = useNavigate();

  const invalid =
    password.length < 8 || email === "" || fullName === "" || username === "";
  console.log(invalid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const usernameList = await usernameChecker(username);

    if (!usernameList.length) {
      try {
        const createUser = await signup(email, password);
        await updateProfile(auth.currentUser, {
          displayName: username.toLowerCase().trim(),
        });

        setMessage("Sign up successful. Please verify your email.");
        setShowSnackbar(true);
        await sendEmailVerification(createUser.user);
        setLoading(false);
        setIsEmailSend(true);

        // wait until email verify
        let interval = setInterval(async () => {
          if (auth.currentUser.emailVerified) {
            clearInterval(interval);

            localStorage.setItem("authUser", JSON.stringify(createUser.user));

            // add userinfo to firebase database
            const userRef = doc(db, "userinfo", createUser.user.uid);
            await setDoc(userRef, {
              userId: createUser.user.uid,
              email: email.toLowerCase(),
              fullName: fullName.trim(),
              username: username.toLowerCase().trim(),
              follower: [],
              following: [],
              authProvider: "Email and password",
              dateCreated: new Date(),
            });
            navigate("/");
            setIsEmailSend(false);
          }
          await auth.currentUser.reload();
        }, 2000);
      } catch (error) {
        setLoading(false);
        setErrorMessage("Email is already taken.");
        setTimeout(() => {
          setMessage("");
        }, 5000);
      }
    } else {
      setErrorMessage("Username already taken");
      setLoading(false);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }

    if (
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      const createUser = await signup(email, password);
      await sendEmailVerification(createUser.user);
      setLoading(false);
    } else {
      setErrorMessage("Password is not strong.");
    }
  };

  return (
    <section>
      <div className="signup-container">
        <div className="signup-poster">
          <img
            src="/images/logo/signup-poster-1.png"
            alt=""
            className="signup-poster-image"
          />
        </div>

        <div className="signup-wrapper">
          <div className="signup-box">
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
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-label">
                    <input
                      type="text"
                      placeholder="FullName"
                      aria-label="Enter your full name"
                      aria-required="true"
                      autoComplete="off"
                      name="fullName"
                      required
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="input-label">
                    <input
                      type="text"
                      placeholder="Username"
                      aria-label="Enter your username"
                      aria-required="true"
                      autoComplete="off"
                      name="username"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) =>
                        e.code === "Space" && e.preventDefault()
                      }
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
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="button-wrapper ">
                    <button
                      disabled={invalid}
                      type="submit"
                      className="pushable"
                      style={{
                        opacity: (invalid || loading) && "0.5",
                      }}
                    >
                      <span class="front">Sign Up</span>
                    </button>
                  </div>
                </form>
                {errorMessage && (
                  <p className="errorMessage">Error: {errorMessage}</p>
                )}
                <CustomSnackbar
                  open={showSnackbar}
                  message={message}
                  variant="success"
                  onClose={handleSnackbarClose}
                />

                <div className="redirect-box">
                  <div className="redirect-text">
                    <p>
                      Have an account?{" "}
                      <Link to="/login" className="cur-point">
                        Log In
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
                    src="/images/logo/confirm-img.png"
                    alt="confirm-email"
                    className="confirm-email-image"
                  />
                </div>
                <div className="confirm-email-message">
                  Verification link send to your email (check inbox or spam
                  folder). Please verify email first...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
