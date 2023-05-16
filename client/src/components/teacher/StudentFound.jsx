import { useState } from "react";
import Axios from "axios";
import CheckIcon from '@mui/icons-material/Check';

export default function StudentFound(props){
    Axios.defaults.withCredentials = true;
    const [enrolledChecker, setEnrolledChecker] = useState(false)

    const addStudent = () => {
        //console.log("The id of the student is " + props.id + " and the lesson id is " + props.lessonId);
        Axios.post("https://mathflix.herokuapp.com/api/user/enrollStudent",{
            studentId : props.id,
            lessonId : props.lessonId
        }).then((response) => {
            console.log(response.data.checker);
            if(response.data.checker === false) {
                setEnrolledChecker(!enrolledChecker)
                alert("Already Enrolled");
            } else {
                setEnrolledChecker(!enrolledChecker)
                alert("Student Enrolled Succesfully")
            }
        }).catch((error) => {
            console.log(error);
        })
    }
    return (
        <>
            <div className="student-found" onClick={addStudent} key={props.id}>
                <div className="student-found-img">
                    <img src={props.pic} alt="user pic"></img>
                </div>
                <div className="student-found-desc">
                    <div className="student-found-name">
                        {props.firstname} {props.lastname}
                    </div>
                    <div className="student-found-email">
                        {props.email}
                    </div>
                </div>
                {enrolledChecker && (
                    <div className="check-icon">
                        <CheckIcon sx={{ marginTop: 1 }} />
                    </div>                    
                )}
            </div>
        </>
    );
}