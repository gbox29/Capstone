import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Axios from 'axios';
import UserNavBar from "../../components/global/UserNavbar"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TableMaterial from "./TableMaterial";
import LineChart from "./LineChart";
import EnrollStudentModal from "./EnrollStudentModal";
import "../../css/teacher/Analytics.css";
import "../../css/teacher/modal.css";

export default function Analytics(){
    const location = useLocation();
    const [lessonId, setLessonId] = useState(location.state.lessonId);
    const lessonIdRef = useRef(lessonId);

    const [showStudent, setShowStudent] = useState(true);
    const [analyticsShow, setShowAnlytics] = useState(false);

    const [expandOwnerDiv, setExpandOwnerDiv] = useState(false)
    const [expandStudentListDiv, setExpandStudentListDiv] = useState(false)

    const [fetchStudentList, setFetchStudentList] = useState([]);
    const [genderCount, setGenderCount] = useState({ maleCount: 0, femaleCount: 0 });
    const [fetchOwner, setFetchOwner] = useState([]);

    const [chapter, setChapter] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [quiz, setQuiz] = useState([]);

    const [chapterCount, setChapterCount] = useState([]);
    const [ratingCount, setRatingCount] = useState([]);
    const [quizCount, setQuizCount] = useState([]);

    const [modal, setModal] = useState(false)

    const [search, setSearch] = useState("");
    const [stopSearch, setStopSearch] = useState(false);
    const [studentFound, searchStudentFound] = useState([]);



    Axios.defaults.withCredentials = true;

    const showStudentList = () => {
        setShowStudent(!showStudent);
        if(analyticsShow === true) {
            setShowAnlytics(false);
        }
    }

    const showAnalytics = () => {
        setShowAnlytics(!analyticsShow);
        if(showStudent === true){
            setShowStudent(false);
        }
    }

    const showModal = () => {
        setModal(!modal);
    }

    const skip = () => {
        setModal(false);
    }

    const expandOwner = () => {
        setExpandOwnerDiv(!expandOwnerDiv);
    }
    const expandStudentList = () => {
        setExpandStudentListDiv(!expandStudentListDiv);
    }

    useEffect(() => {
        setLessonId(location.state.lessonId);
      }, [location.state.lessonId]);
    
      useEffect(() => {
        lessonIdRef.current = lessonId;
      }, [lessonId]);

    useEffect(() => {
        Axios.get("https://mathflix.herokuapp.com/api/user/userEnrolled", {
            params: {
                lessonId: lessonIdRef.current,
                kindofuser : "student"
              }            
        }).then((response) => {
            if(!response.data.message) {
                setGenderCount({ maleCount: response.data.maleCount, femaleCount: response.data.femaleCount });
                setFetchStudentList(response.data.result)         
            }
        }).catch((error) => {
            console.log(error);
        });
    },[])

    useEffect(() => {
        Axios.get("https://mathflix.herokuapp.com/api/user/lessonOwner", {
            params: {
                lessonId: lessonIdRef.current,
              }            
        }).then((response) => {
            if(!response.data.message) {
                setFetchOwner(response.data.result)         
            }
        }).catch((error) => {
            console.log(error);
        });
    },[])

    const HandleSearch = (event) => {
        setSearch(event.target.value);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Perform action when user stops typing
            Axios.get("https://mathflix.herokuapp.com/api/user/searchEnrolledStudent", {
            params: {
                data : search,
                lessonId: lessonIdRef.current,
              }            
            }).then((response) => {
                if(!response.data.message) {
                    searchStudentFound(response.data.result)
                    setStopSearch(true)      
                } else {
                    setStopSearch(false);
                }
            }).catch((error) => {
                console.log(error);
            });
            console.log("User stopped typing.");
        }, 500); // Wait for 500ms before triggering action
      
        return () => clearTimeout(timeout);
    }, [search]);
    

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Perform action when user stops typing
            Axios.get("https://mathflix.herokuapp.com/api/user/fetchChapter", {
            params: {
                tb_lessonId: lessonIdRef.current,
              }            
            }).then((response) => {
                if(!response.data.message) {
                    setChapterCount(response.data.chapterCount)
                    setChapter(response.data.result)  
                } 
            }).catch((error) => {
                console.log(error);
            });
        }, 500); // Wait for 500ms before triggering action
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Perform action when user stops typing
            Axios.get("https://mathflix.herokuapp.com/api/user/fetchUserComments", {
            params: {
                lessonId: lessonIdRef.current,
              }            
            }).then((response) => {
                if(!response.data.message) {
                    setRatingCount(response.data.ratingCount)
                    setRatings(response.data.result)  
                } 
            }).catch((error) => {
                console.log(error);
            });
        }, 500); // Wait for 500ms before triggering action
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Perform action when user stops typing
            Axios.get("https://mathflix.herokuapp.com/api/user/fetchUserAllQuizzes", {
            params: {
                lessonId: lessonIdRef.current,
              }            
            }).then((response) => {
                if(!response.data.message) {
                    setQuizCount(response.data.quizCount)
                    setQuiz(response.data.result)  
                } 
            }).catch((error) => {
                console.log(error);
            });
        }, 500); // Wait for 500ms before triggering action
        return () => clearTimeout(timeout);
    }, []);

    return(
        <>
            <UserNavBar />
            <div className="analytics-main-container">
                <div className="analytics-container">

                    <div className="analytics-header-navigation">
                        <div onClick={showStudentList}>
                            members
                        </div>
                        <div onClick={showAnalytics}>
                            analytics
                        </div>
                    </div>

                    {showStudent &&(
                        <>
                        <div className="list-of-students-action">
                            <div className="analytics-search-student">
                                <TextField id="outlined-basic" label="Search Student" variant="outlined" onChange={HandleSearch} />
                            </div>
                            <div className="analytics-enroll-student">
                                <Button onClick={showModal}>Add a member</Button>
                            </div>
                        </div>

                        <div className="list-of-students">
                            <div className="Owner">
                                <p onClick={expandOwner}>Owner</p>
                                {expandOwnerDiv && (
                                    <TableMaterial
                                        fetchOwner = {fetchOwner} 
                                        boolExpandOwner = {true}
                                    />
                                )}
                            </div>
                            <div className="Owner">
                                {stopSearch ? (
                                    // code to execute if true
                                    <>

                                        <TableMaterial 
                                                fetchStudentList={studentFound}
                                                lessonId = {location.state.lessonId}
                                                setExpandStudentListDiv = {setExpandStudentListDiv}
                                                boolExpandStudent = {true}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p onClick={expandStudentList}>Student's Lists ({fetchStudentList.length})</p>
                                        {expandStudentListDiv && (
                                            <TableMaterial 
                                                fetchStudentList={fetchStudentList}
                                                lessonId = {location.state.lessonId}
                                                setExpandStudentListDiv = {setExpandStudentListDiv}
                                                boolExpandStudent = {true}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        </>
                    )}
                    
                    {analyticsShow && (
                        <>
                            <div className="data-analytics-container">

                                <div className="user-type-demographics">
                                    <h3>Summary</h3>
                                    <div className="user-type-demo-sub-container">
                                        <div className="total-demographics">
                                            <p>{genderCount.maleCount + genderCount.femaleCount}</p>
                                            Total Users
                                        </div>
                                        <div className="user-teacher">
                                            <p>{genderCount.maleCount}</p>
                                            Male
                                        </div>
                                        <div className="user-student">
                                            <p>{genderCount.femaleCount}</p>
                                            Female
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="user-engagement">
                                    <h3 style={{marginLeft: 10}}>Engagement</h3>
                                        <div className="user-type-demo-sub-container">
                                            <div className="total-demographics">
                                                <p>{chapter.length}</p>
                                                Chapters
                                            </div>
                                            <div className="user-teacher">
                                                <p>{ratings.length}</p>
                                                Reactions
                                            </div>
                                            <div className="user-student">
                                                <p>{quiz.length}</p>
                                                Quiz
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <LineChart 
                                    lessonId = {lessonIdRef.current}
                                    chapterCount = {chapterCount}
                                    ratingCount = {ratingCount}
                                    quizCount = {quizCount} 
                                />
                        </>
                    )}
                </div>
                {modal && (
                    <div className="modal">
                        <div className="overlay">
                            <div className="modal-content">
                                <EnrollStudentModal
                                    skip = {skip} 
                                    lessonId = {lessonId}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}