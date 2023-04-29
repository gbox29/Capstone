import {useState} from "react";
import { useNavigate, createSearchParams} from "react-router-dom";
import { useLocation } from "react-router-dom";
import CourseMenu from "./CourseMenu";
import Axios from "axios";


export default function Course(props){
    const [lessonId] = useState(props.id);
    const navigate = useNavigate();
    const location = useLocation();
    //console.log(location.state.kindofuser)

    Axios.defaults.withCredentials = true;

    //console.log(props)

    const StudentAccordion = () => {
        navigate({
            pathname: "/user/chapter",
            search: `?${createSearchParams({lessonId})}`, // inject code value into template
        },{state: {lessonId : lessonId, kindofuser: location.state.kindofuser}});
    }

    return (
        <div className="course-info">
           <div className="c-info-one">
                {location.state.kindofuser === 'teacher' ? <CourseMenu 
                                                            lessonId={lessonId} 
                                                            nextModal = {props.nextModal}
                                                            setNextModal={props.setNextModal}
                                                            skip = {props.skip}
                                                            toggleModal = {props.toggleModal}
                                                            setLessonId = {props.setLessonId}
                                                            /> : null}
           </div>
            <div className="c-info-two" onClick={StudentAccordion}>
            <div className="c-info-two-img">
                <img src="https://1.bp.blogspot.com/-of6O16keO6o/YJBbqH0x6mI/AAAAAAAANHk/groNTWWTACEqnWxgefkg_umQXIKPPJR0QCLcBGAsYHQ/s1203/DepEd%2BModule%2BGrade%2B1%2B-%2BMathematics%2B%2528Quarter%2B1%2529%2BModule%2B1.JPG" alt="pic" />
            </div>
            </div>
            <div className="c-info-three">
               {props.lessonName}
            </div>  
            <div className="c-info-three">
               Grade Level {props.gradeLevel}
            </div>  
        </div>
    );
}