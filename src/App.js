import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FirebaseState from "./context/FirebaseState";
import Load from "./components/loading/Load";

const Login = lazy(() => import("./pages/login/Login"));
const Signup = lazy(() => import("./pages/signup/Signup"));
const Home = lazy(() => import("./pages/home/Home"));
// const Explore = lazy(() => import("./pages/explore/Explore"));
// const Profile = lazy(() => import("./pages/profile/Profile"));
const Forgot = lazy(() => import("./pages/forgot/Forgot"));
const PageNotFound = lazy(() => import("./pages/pagenotfound/PageNotFound"));

function App() {
  return (
    <>
      <FirebaseState>
        <BrowserRouter>
          <Suspense fallback={<Load />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* <Route path="/explore" element={<Explore />} /> */}
              {/* <Route path="/profile/:username" element={<Profile />} /> */}
              <Route path="/forgot" element={<Forgot />} />
              <Route exact path="/*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </FirebaseState>
    </>
  );
}

export default App;
