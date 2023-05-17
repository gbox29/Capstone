import "./css/styles.css";
import {Route,Routes} from "react-router-dom";
import LandingPage from "./components/index/LandingPage";
import Authentication from "./components/authentication/Authentication";
import TeacherIndex from "./components/teacher/TeacherIndex";
import StudentMainPage from "./components/teacher/StudentMainPage";
import AddTest from "./components/teacher/AddTest";
import Video from "./components/teacher/LessonVideo";
import TakeQuiz from "./components/teacher/TakeQuiz";

import AdminIndex from "./components/admin/AdminIndex";
import AdminPage2 from "./components/admin/AdminPage2";
import AdminPage3 from "./components/admin/adminPage3";
import GamesPage from "./components/games/GamesPage";
import AdminProfile from "./components/admin/adminProfile";
import AdminSettings from "./components/admin/adminSettings";

import Game1 from "./components/games/Game1";
import Game2 from "./components/games/Game2";


import Analytics from "./components/teacher/Analytics"
import Profile from "./components/teacher/Profile"
import Reset from "./components/authentication/Reset";
import ConfirmReset from "./components/authentication/ConfirmReset";
import Settings from "./components/teacher/Settings";


export default function app() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="auth" element={<Authentication />}/>
        <Route path="auth/resetPassword" element={<Reset />}/>
        <Route path="auth/resetSuccess" element={<ConfirmReset />}/>



        <Route path="user" element={<TeacherIndex />}/>
        <Route path="user/chapter" element={<StudentMainPage />} />
        <Route path="user/chapter/addQuiz" element={<AddTest />} />
        <Route path="user/chapter/watch" element={<Video />} />
        <Route path="user/chapter/watch/answerQuiz" element={<TakeQuiz />}/>

        <Route path="user/lesson/analytics" element={<Analytics />}/>
        <Route path="user/profile" element={<Profile />} />
        <Route path="user/settings" element={<Settings />} />


        <Route path="games/games-list" element={<GamesPage />}/>
        <Route path="games/game1" element={<Game1 />}/>
        <Route path="games/game2" element={<Game2 />}/>


        <Route path="/admin/dashboard" element={<AdminIndex />}/>
        <Route path="/admin/user-list" element={<AdminPage2 />}/>
        <Route path="/admin/course-list" element={<AdminPage3 />}/>
        <Route path="/admin/profile" element={<AdminProfile />}/>
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </>
  );
}
