import {useState} from "react";
import Axios from "axios";
import Button from '@mui/material/Button';
import StudentFound from "./StudentFound";

export default function EnrollStudentModal(props){

    const [student, setStudent] = useState();
    const [fetchStudent, setFetchStudent] = useState([]);

    const searchStudents = (e) => {
        setStudent(e.target.value);
      };

    const search = () => {
        const fetchStudents = async () => {
            try {
              const response = await Axios.get(
                "https://mathflix.herokuapp.com/api/user/searchStudent",
                {
                  params: {
                    student: student,
                  },
                }
              );
              if(response.data.message) {
                setFetchStudent("");
              } else {
                setFetchStudent(response.data.result);
              }
  
            } catch (error) {
              console.log(error);
            }
        };
        fetchStudents();
    }

    const fetch = (data) => {
        //console.log("function is called");
        return (
            <StudentFound 
                key = {data.id}
                id = {data.id}
                lessonId = {props.lessonId}
                email = {data.email}
                firstname = {data.firstname}
                lastname = {data.lastname}
                pic = {data.pic}
            />
        )
    }

    return (
        <>
            <div className="add-student-modal">
                {props.lessonId}
                <h2>Add a student</h2>
                <div className="search-student-wrap-modal">
                    <input 
                        type="text" 
                        placeholder="Search here"
                        onChange={searchStudents}
                    />
                    <Button variant="contained" onClick={search}>Search</Button>
                </div>
                <div className="student-list-modal">
                    {fetchStudent.length > 0 && fetchStudent.map(fetch)}
                </div>
                <div className="student-list-btn-modal">
                    <Button variant="outlined"
                    onClick={() => {
                      // props.skip
                      document.location.reload(true);
                    }}
                    >
                        Skip
                    </Button>
                </div>
            </div>
        </>
    );
}