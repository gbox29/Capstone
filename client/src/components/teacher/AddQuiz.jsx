import { useEffect,useState,useRef } from "react";
import { useLocation } from "react-router-dom";
import "../../css/teacher/addQuiz.css";
import Axios from "axios"
import UserNavbar from "../global/UserNavbar";
import Button from '@mui/material/Button';
import Quiz from "./Quiz";

export default function AddQuiz() {
    Axios.defaults.withCredentials = true;
    const location = useLocation();
    const [chapterId, setChapterId] = useState(location.state.chapterId)
    const chapterIdRef = useRef(chapterId);

    
    const [number, setNumber] = useState(1);
    const [updateNum, setUpdateNum] = useState("");
    const [question, setQuestion] = useState("");
    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");
    const [optionC, setOptionC] = useState("");
    const [optionD, setOptionD] = useState("");
    const [answer, setAnswer] = useState("");

    const [quizId, setQuizId] = useState(0);


    const [clickUpdate, setClickUpdate] = useState(false);

    const [fetchQuestion, setFetchQuestion] = useState([]);
    //console.log(fetchQuestion);

    const handleNumberChange = (event) => {
        setNumber(event.target.value);
    }

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    }

    const handleOptionAChange = (event) => {
        setOptionA(event.target.value);
    }

    const handleOptionBChange = (event) => {
        setOptionB(event.target.value);
    }

    const handleOptionCChange = (event) => {
        setOptionC(event.target.value);
    }

    const handleOptionDChange = (event) => {
        setOptionD(event.target.value);
    }

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    }



    const addQuestion = () => {
        Axios.post("https://mathflix.herokuapp.com/api/user/addQuiz", {
            chapterId: location.state.chapterId,
            number : number,
            question : question,
            optionA : optionA,
            optionB  : optionB,
            optionC : optionC,
            optionD : optionD,
            answer : answer,
          }).then((response) => {
            if (response) {
                alert("Quiz Inserted Succesfully");
                setQuestion("");
                setOptionA("");
                setOptionB("");
                setOptionC("");
                setOptionD("");
                setAnswer("");
                setNumber(number+1);
                //setFetchQuestion(prevState => [...prevState, response.data]);
                setFetchQuestion(prevState => [...(prevState || []), response.data]); // update fetchQuestion state with new question
                document.location.reload(true);
            }
          });
    }

    const editQuestion = () => {
        Axios.put("https://mathflix.herokuapp.com/api/user/editQuestion", {
            id : quizId,
            question : question,
            number : updateNum,
            optionA : optionA,
            optionB  : optionB,
            optionC : optionC,
            optionD : optionD,
            answer : answer,
        }).then((response) => {
            setClickUpdate(!clickUpdate);
            setQuestion("");
            setOptionA("");
            setOptionB("");
            setOptionC("");
            setOptionD("");
            setAnswer("")
            alert(response.data.message);
            document.location.reload(true);
        }).catch((error) => {
            console.log(error);
        })
    }

    const deleteAllQuestion = () => {
        const result = window.confirm('Do you want to continue?');
        if (result) {
            Axios.delete("https://mathflix.herokuapp.com/api/user/deleteAllQuestion", {
              params: {
                chapterId : location.state.chapterId
              }
            }).then((response) => {
                alert(response.data.message);
                document.location.reload(true);
            })
        } else {
            console.log('User clicked Cancel');
        }
    }

    useEffect(() => {
        setChapterId(location.state.chapterId);
      }, [location.state.chapterId]);
    
    useEffect(() => {
        chapterIdRef.current = chapterId;
    }, [chapterId]);

    useEffect(() => {
        const getQuiz = () => {
            Axios.get("https://mathflix.herokuapp.com/api/user/fetchQuiz",{
              params: {
                chapterId: chapterIdRef.current,
              }
            }).then((response) => {
              //console.log(response.data.result);
              setFetchQuestion(response.data.result);
            }).catch((error) => {
              console.log(error.response);
            })
          }
          getQuiz();
    },[])

    const fetchQuestions = (data) => {
        return (
            <Quiz
                key = {data.id}
                id = {data.id}
                chapterId = {data.chapter_id}
                number = {data.number}
                question = {data.Question}
                optionA = {data.OptionA}
                optionB = {data.OptionB}
                optionC = {data.OptionC}
                optionD = {data.OptionD}
                answer = {data.Answer}

                setQuestion = {setQuestion}
                setOptionA = {setOptionA}
                setOptionB = {setOptionB}
                setOptionC = {setOptionC}
                setOptionD = {setOptionD}
                setAnswer = {setAnswer}

                clickUpdate = {clickUpdate}
                setClickUpdate = {setClickUpdate}

                setQuizId = {setQuizId}
                setNumber = {setNumber}
                
                setUpdateNum = {setUpdateNum}
            />
        );
    }
    
    return (
        <>
            <UserNavbar />
            <Button className="deleteAllQuestion" onClick={deleteAllQuestion}>Delete All</Button>
            <div className="quiz-question-container">
                <div className="questions-container">
                    <div className="q-container">
                        <div className="option-container">
                            <p>Number:</p>
                            <textarea value={number} readOnly={true} onChange={handleNumberChange} />
                        </div>
                        <div className="question-container">
                            <p>Question:</p>
                            <textarea value={question} onChange={handleQuestionChange} />
                        </div>
                        <div className="option-container">
                            <p>Option A:</p>
                            <textarea value={optionA} onChange={handleOptionAChange} />
                        </div>
                        <div className="option-container">
                            <p>Option B:</p>
                            <textarea value={optionB} onChange={handleOptionBChange} />
                        </div>
                        <div className="option-container">
                            <p>Option C:</p>
                            <textarea value={optionC} onChange={handleOptionCChange} />
                        </div>
                        <div className="option-container">
                            <p>Option D:</p>
                            <textarea value={optionD} onChange={handleOptionDChange} />
                        </div>
                        <div className="answer-container">
                            <p>Answer:</p>
                            <textarea value={answer} onChange={handleAnswerChange} />
                        </div>
                        <div className="submit-container">
                            {clickUpdate && (
                                <Button onClick={editQuestion}>Edit</Button>
                            )}
                            <Button onClick={addQuestion} style={clickUpdate === true ? {display:'none'} : null}>Submit</Button>
                        </div>
                    </div>
                </div>
                <div className="questions-answers">
                    {fetchQuestion?.map(fetchQuestions)}
                </div>
            </div>
        </>
    )
}