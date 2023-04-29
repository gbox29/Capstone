import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Axios from 'axios';
import UserNavBar from "../../components/global/UserNavbar"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TableMaterial from "./TableMaterial";
import LineChart from "./LineChart";
import "../../css/teacher/Analytics.css";

export default function Analytics(){
    const location = useLocation();
    const [lessonId, setLessonId] = useState(location.state.lessonId);
    const lessonIdRef = useRef(lessonId);

    const [showStudent, setShowStudent] = useState(true);
    const [analyticsShow, setShowAnlytics] = useState(false);

    const [expandOwnerDiv, setExpandOwnerDiv] = useState(false)
    const [expandStudentListDiv, setExpandStudentListDiv] = useState(false)

    const [fetchStudentList, setFetchStudentList] = useState([]);
    const [fetchOwner, setFetchOwner] = useState([]);

    
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
        Axios.get("http://localhost:5000/api/user/userEnrolled", {
            params: {
                lessonId: lessonIdRef.current,
                kindofuser : "student"
              }            
        }).then((response) => {
            if(!response.data.message) {
                setFetchStudentList(response.data.result)         
            }
        }).catch((error) => {
            console.log(error);
        });
    },[fetchStudentList])

    useEffect(() => {
        Axios.get("http://localhost:5000/api/user/lessonOwner", {
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
    },[fetchStudentList])



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
                                <TextField id="outlined-basic" label="Search" variant="outlined" />
                            </div>
                            <div className="analytics-enroll-student">
                                <Button>Add a member</Button>
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
                                <p onClick={expandStudentList}>Student's Lists ({fetchStudentList.length})</p>
                                    {expandStudentListDiv && (
                                        <TableMaterial 
                                            fetchStudentList={fetchStudentList}
                                            lessonId = {location.state.lessonId}
                                            setExpandStudentListDiv = {setExpandStudentListDiv}
                                            boolExpandStudent = {true}
                                        />
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
                                            <p>6</p>
                                            Total users
                                        </div>
                                        <div className="user-teacher">
                                            <p>1</p>
                                            Total teacher
                                        </div>
                                        <div className="user-student">
                                            <p>2</p>
                                            Total student
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="user-engagement">
                                    <h3 style={{marginLeft: 10}}>Engagement</h3>
                                        <div className="user-type-demo-sub-container">
                                            <div className="total-demographics">
                                                <p>3</p>
                                                Chapters
                                            </div>
                                            <div className="user-teacher">
                                                <p>10</p>
                                                Reactions
                                            </div>
                                            <div className="user-student">
                                                <p>3</p>
                                                Quiz
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <LineChart/>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}