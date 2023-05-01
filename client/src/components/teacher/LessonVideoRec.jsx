import Rating from '@mui/material/Rating';
import { FiYoutube } from 'react-icons/fi';
import { useNavigate, createSearchParams} from "react-router-dom";
import { useState } from "react";

export default function LessonVideoRec (props) {
    const [chapterId] = useState(props.id);
    //console.log(props);
    const navigate = useNavigate();
    const goToLessonVid = () => {
        navigate({
            pathname: "/user/chapter/watch",
            search: `?${createSearchParams({chapterId})}`, // inject code value into template
          },{state: {
                    chapterId : chapterId, 
                    chapter_number : props.chapter_number,
                    chapter_name: props.chapter_name,
                    desc: props.desc,
                    vid : props.vid,
                    date : props.date,
                    lessonId : props.lessonId
                }});
    }

    return (
        <div className="recommendations" onClick={goToLessonVid}>
            <p>Chapter {props.chapter_number} {props.chapter_name}</p>
            <div className="read-only-div">
                <FiYoutube style={{paddingBottom:'2px', marginRight: '3px'}}/>
                <Rating name="read-only" 
                    value={props.ratingValue} 
                    readOnly 
                />
            </div>
        </div>
    );
}