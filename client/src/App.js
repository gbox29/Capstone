import "./css/styles.css";
import {Route,Routes} from "react-router-dom";
import LandingPage from "./components/index/LandingPage";
import Authentication from "./components/authentication/Authentication";
import TeacherIndex from "./components/teacher/TeacherIndex";
import StudentMainPage from "./components/teacher/StudentMainPage";
import AddTest from "./components/teacher/AddTest";
import Video from "./components/teacher/LessonVideo";
import TakeQuiz from "./components/teacher/TakeQuiz";
import Analytics from "./components/teacher/Analytics"
import Profile from "./components/teacher/Profile"


export default function app() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="auth" element={<Authentication />}/>
        <Route path="user" element={<TeacherIndex />}/>
        <Route path="user/chapter" element={<StudentMainPage />} />
        <Route path="user/chapter/addQuiz" element={<AddTest />} />
        <Route path="user/chapter/watch" element={<Video />} />
        <Route path="user/chapter/watch/answerQuiz" element={<TakeQuiz />}/>

        <Route path="user/lesson/analytics" element={<Analytics />}/>
        <Route path="user/profile" element={<Profile />} />
      </Routes>
    </>
  );
}
