import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import "../../css/teacher/takeQuiz.css";
import UserNavbar from "../global/UserNavbar";
import Button from '@mui/material/Button';
import DoneAnswer from "./doneAnswer";

export default function TakeQuiz(){
  const location = useLocation();
  const [data, setData] = useState([]);
  const [overallItem, setOverAllItem] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);
  
  const [start,setStart] = useState(false);
  const [hideStart, setHideStart] = useState(false);

  const [chapterId, setChapterId] = useState(location.state.chapterId)
  const chapterIdRef = useRef(chapterId);

  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [finish, setFinish] = useState(false);

  const [userTakeQuiz, setUserTakeQuiz] = useState(false);
  const [userReview, setUserReview] = useState([]);


  useEffect(() => {
    setChapterId(location.state.chapterId);
  }, [location.state.chapterId]);

  useEffect(() => {
      chapterIdRef.current = chapterId;
  }, [chapterId]);

  useEffect(() => {
    const getQuiz = () => {
      Axios.get("https://mathflix.herokuapp.com/api/user/finishQuiz", {
        params: {
          chapterId: chapterIdRef.current,
        }        
      })
      .then((response) => {
        if(!response.data.message){
          setUserTakeQuiz(true);
          userFinishQuiz();
        }
      }).catch((error) => {
        console.log(error.response);
      })
    }

    getQuiz();
  }, [])

  const userFinishQuiz = () => {
    Axios.get("https://mathflix.herokuapp.com/api/user/fetchQuiz",{
      params: {
        chapterId: chapterIdRef.current,
      }
    }).then((response) => {
      console.log("user finsih quiz: ", response.data.result);
      setUserReview(response.data.result)
      setData(response.data.result);
    }).catch((error) => {
      console.log(error.response);
    })
  }

  const userStartQuiz = () => {
    Axios.post("https://mathflix.herokuapp.com/api/user/takeQuiz", {
        chapterId: location.state.chapterId,
      }).then((response) => {
        setStart(!start)
        setHideStart(!hideStart);
      });
  }

  useEffect(() => {
      const getQuiz = () => {
          Axios.get("https://mathflix.herokuapp.com/api/user/fetchQuiz",{
            params: {
              chapterId: chapterIdRef.current,
            }
          }).then((response) => {
            //console.log(response.data.result);
            setOverAllItem(response.data.length);
            setData(response.data.result);
          }).catch((error) => {
            console.log(error.response);
          })
        }
        getQuiz();
  },[])

  const handleNextClick = () => {
    Axios.get("https://mathflix.herokuapp.com/api/user/answerQuiz", {
      params: {
        chapterId: chapterIdRef.current,
        currentPage: currentPage,
      }
    }).then((response) => {
        if(response.data.result[0].Answer === answer) {
            setCurrentPage(currentPage + 1);
            setScore(score+1)
            setAnswer("");
            if(currentPage > Math.ceil(data.length / itemsPerPage) - 1) {
              setScore(score+1);
              setFinish(true);
            }
        } else {
          alert("Wrong answer try again!");
          setAnswer("");
        }
    });
  };

  const isData = () => {
    if (!data) {
      return <h1>No Quiz Available</h1>; 
    }
  }

  const renderData = () => {
    isData();
    const currentData = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return currentData?.map((data) => (
      <div key={data.id} className="takequiz-container">
        <div>Current Progress: {score} / {overallItem}</div>
        <div className="takequiz-question">{data.Question}</div>
        <div className="takequiz-answer">
          <div className="option-a" onClick={() => {
             setAnswer("a") 
          }}>A. {data.OptionA}</div>
          <div className="option-b" onClick={() => {
            setAnswer("b")
          }}>B. {data.OptionB}</div>
          <div className="option-c" onClick={() => {
            setAnswer("c")
          }}>C. {data.OptionC}</div>
          <div className="option-d" onClick={() => {
            setAnswer("d")
          }}>D. {data.OptionD}</div>
          <div>
            Answer: {answer}
          </div>
        </div>
      </div>
    ));
  };

  const fetchUserReview = (data) => {
      return (
        <DoneAnswer 
            number = {data.number}
            question = {data.Question}
            answerA = {data.OptionA}
            answerB = {data.OptionB}
            answerC = {data.OptionC}
            answerD = {data.OptionD}
            ans = {data.Answer}
        />
      );
  }


  return (
    <>
    <UserNavbar />

    <div className="tquiz-container">
      {userTakeQuiz ? (
        <>
          <h1>Review: </h1>
          {userReview?.map(fetchUserReview)}
        </>
      ) : (
        <>
          <div className="quiz-tips-container">
                  {data && (
                  <>
                  <div className="quiz-tips"  style={hideStart === true ? {display:'none'} : null}>
                    <h1>Review the material beforehand </h1>
                    <p>Before taking the quiz, review the material covered in the class or course. Make sure you understand the key concepts, terms, and ideas so you are better prepared to answer the questions.</p>
                    </div>
                    <div className="userStartQuiz">
                      <Button onClick={userStartQuiz}
                        style={hideStart === true ? {display:'none'} : null} 
                      >Start</Button>
                    </div>
                  </>
                  )}
                  {isData()}      
                </div>
                {start && (
                    <>
                      {renderData()}
                      {data && (
                        <div className="next-question-button">
                          {currentPage < Math.ceil(data.length / itemsPerPage) ? (
                            <Button onClick={handleNextClick}>Next</Button>
                          ) : (
                            <Button onClick={handleNextClick} style={finish === true ? {display:'none'} : null}>Submit</Button>
                          )}
                        </div>
                      )
                }
                    </>
                )}
                {finish && (
                    <>
                    <h1>Congratulations you finish the test your score is {score} / {overallItem} which is 100% good job!!!</h1>
                    </>
                )}
        </>
      )}
    </div>
    </>
  );
}