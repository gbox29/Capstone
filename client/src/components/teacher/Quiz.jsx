//import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
import Axios from "axios";
import HorizontalIcon from './HorizontalIcon';

export default function Quiz(props){
    //console.log(props);
    const [question] = useState(props.question)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(()=>{
        props.setNumber(props.number+1)
    },[props])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null)
    }

    
    const deleteQuestion = () => {
        const result = window.confirm('Do you want to continue?');
        if (result) {
            setAnchorEl(null);
            Axios.delete("https://mathflix.herokuapp.com/api/user/deleteQuestion", {
              params: {
                id : props.id,
                chapterId : props.chapterId
              }
            }).then((response) => {
                alert(response.data.message);
                props.setQuestion("");
                props.setOptionA("");
                props.setOptionB("");
                props.setOptionC("");
                props.setOptionD("");
                props.setAnswer("");
                props.setQuizId("");
                props.setClickUpdate(!props.clickUpdate);
                document.location.reload(true);
            })
        } else {
            console.log('User clicked Cancel');
        }
    }

    const updateQuestion = () => {
        setAnchorEl(null);
        props.setClickUpdate(!props.clickUpdate);
        props.setUpdateNum(props.number);
        props.setQuestion(props.question);
        props.setOptionA(props.optionA);
        props.setOptionB(props.optionB);
        props.setOptionC(props.optionC);
        props.setOptionD(props.optionD);
        props.setAnswer(props.answer)
        props.setQuizId(props.id)
    }



    return (
        <>
            <div className="questions-answers-container" key={props.id}>
                <div className="question-dropdown-container">
                    <div className="question-container-ans">
                       {props.number}. Question: {question}
                    </div>
                    <div className="questions-dropdown">
                        <HorizontalIcon 
                            open = {open}
                            anchorEl = {anchorEl}
                            handleClick = {handleClick}
                            handleClose = {handleClose}
                            delete = {deleteQuestion}
                            update = {updateQuestion}
                        />
                    </div>
                </div>
                <div className="questions-ans">
                    <ul>
                        <li>A. {props.optionA} </li>
                        <li>B. {props.optionB} </li>
                        <li>C. {props.optionC} </li>
                        <li>D. {props.optionD} </li>
                        <li>Ans. {props.answer} </li>
                    </ul>
                </div>
            </div>                
        </>
    );
}