import Axios from "axios";

export default function StudentFound(props){
    Axios.defaults.withCredentials = true;
    const addStudent = () => {
        console.log("The id of the student is " + props.id + " and the lesson id is " + props.lessonId);
        Axios.post("http://localhost:5000/api/user/enrollStudent",{
            studentId : props.id,
            lessonId : props.lessonId
        }).then((response) => {
            if(response) {
                alert("Stdeunt Enrolled Succesfully");
            }
        }).catch((error) => {
            console.log(error);
        })
    }
    return (
        <>
            <div className="student-found" onClick={addStudent}>
                <div className="student-found-img">

                </div>
                <div className="student-found-desc">
                    <div className="student-found-name">
                        {props.firstname} {props.lastname}
                    </div>
                    <div className="student-found-email">
                        molinmillares78@gmail.com
                    </div>
                </div>
            </div>
        </>
    );
}