import {useState,useEffect} from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import "../../css/teacher/modal.css";
import UserNavbar from "../global/UserNavbar";
import Course from "./Course";
import Button from '@mui/material/Button';
import EnrollStudentModal from "./EnrollStudentModal";

import { useNavigate} from "react-router-dom";


export default function Courses(){

    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [nextModal, setNextModal] = useState(false);
    const location = useLocation();
    //console.log(location.state.kindofuser);
    //const [update, setUpdate] = useState(false);


    const [lesson, setLesson] = useState("");
    const [glevel, setGlevel] = useState("");


    const [fetchLesson, setFetchLesson] = useState([]);

    const [studentEnrolled, setStudentEnrolled] = useState([]);

    const [lessonId, setLessonId] = useState();



    //const [searchResult, setSearchResult] = useState();


    Axios.defaults.withCredentials = true;

    const toggleModal = () => {
        if (nextModal === true){
            toggleNextModal();
        }
        setModal(!modal);
    }

    const toggleNextModal = () => {
        setNextModal(!nextModal);
    }

    const skip = () => {
        setModal(false);
        setNextModal(false);
    }
    const createLesson = () => {
        Axios.post("https://mathflix.herokuapp.com/api/user/createLesson", {
          lesson: lesson,
          glevel: glevel,
        }).then((response) => {
            alert(response.data.message);
            setLessonId(response.data.lessonId);
            setFetchLesson(prevState => {
                if (Array.isArray(prevState)) {
                  return [...prevState, response.data];
                } else {
                  return [response.data];
                }
              });
        }).catch((error) => {
            console.log(error);
        });
    };
    
    

    useEffect(() => {
        const getResult = () => {
            Axios.get("https://mathflix.herokuapp.com/api/user/fetchLesson").then((response) => {
                    setFetchLesson(response.data.result);
                    //console.log(fetchLesson);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        getResult();
    }, []);

    useEffect(() => {
        const getStudentEnrolled = () => {
            Axios.get("https://mathflix.herokuapp.com/api/user/studentEnrolled").then((response) => {
                    setStudentEnrolled(response.data.result);
                    //console.log(fetchLesson);
            });           
        }
        getStudentEnrolled();
    },[])

    //test
    useEffect(() => {
        const checkProfile = () => {
            Axios.get("https://mathflix.herokuapp.com/api/user/profile").then((response) => {
                if(response.data.message){
                    navigate("/user/profile");
                }
            });           
        }
        checkProfile();
    },[navigate])


    const fetchData = (data) => {
        return (
            <Course 
                key = {data.id}
                id = {data.id}
                lessonName = {data.lesson_name}
                gradeLevel = {data.grade_level}
                kindofuser = {location.state.kindofuser}
                nextModal = {nextModal}
                setNextModal = {setNextModal}
                toggleModal = {toggleModal}
                setLessonId = {setLessonId}
            />
        );
    }

    const fetchStudentEnrolled = (data) => {
        return (
            <Course 
                key = {data.id}
                id = {data.lesson_id}
                lessonName = {data.lesson_name}
                gradeLevel = {data.grade_level}
                kindofuser = {location.state.kindofuser}
            />
        );
    }

    return (
        <div className="teacher-containter">
            <UserNavbar />
            {location.state.kindofuser}
            <div className="add-course" style={location.state.kindofuser === 'student' ? {display: 'none'} : null}>
                <Button variant="contained" onClick={toggleModal}>Create Lesson</Button>
            </div>
            {modal && (
            <div className="modal">
                <div onClick={() => {
                    toggleModal();
                    document.location.reload(true);
                }} className="overlay"></div>
                <div className="modal-content" >
                    <div className="modal-wrap" style={nextModal === true ? {display: 'none'} : null}>
                        <h2>Create a Lesson</h2>
                        <form className="modal-form">
                            <label>Lesson Name:</label>
                            <input 
                                type="text" 
                                onChange={(e) => {
                                    setLesson(e.target.value);
                                }}
                            />
                            <label>Grade Level:</label>
                            <input 
                                type="text"
                                onChange={(e) => {
                                    setGlevel(e.target.value);
                                }}
                            />
                        </form>

                        <button className="close-modal" onClick={(toggleModal)}>
                            CLOSE
                        </button>
                    
                        <div className="modal-next">
                            <Button variant="contained" onClick={() => {
                                createLesson();
                                toggleNextModal();
                            }}>Next</Button>
                        </div>
                    </div>
                    {nextModal && (
                        <EnrollStudentModal
                            skip = {skip}
                            lessonId = {lessonId}
                        />
                    )}
                </div>
            </div>
            )}
            <div className="course-wrap">
                {fetchLesson?.map(fetchData)}
                {studentEnrolled?.map(fetchStudentEnrolled)}
            </div>
        </div>
    );
}