import * as React from 'react';
import Axios from "axios";
import "../../css/teacher/modal.css";
import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import AccordionModal from './AccordionModal';
import Button from '@mui/material/Button';
import AcSummary from "./AcSummary";
import UserNavbar from "../global/UserNavbar";

export default function StudentAccordion() {
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chapter, setChapter] = useState([]);
  const [lessonIdState, setLessonIdState] = useState(location.state.lessonId)
  const lessonIdRef = useRef(lessonIdState);

  const toggleModal = () => {
    setModal(!modal);
  }

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    setLessonIdState(location.state.lessonId)
  },[location.state.lessonId]);

  useEffect(() => {
    lessonIdRef.current = lessonIdState
  },[lessonIdState]);

  //Fetch the lesson chapters
  useEffect(()=>{
    const getChapter = () => {
      Axios.get("http://localhost:5000/api/user/fetchChapter",{
        params: {
          tb_lessonId : lessonIdRef.current
        }
      }).then((response) => {
        setChapter(response.data.result)
      }).catch((error) => {
        console.log(error.response);
      })
    }
    getChapter();
  }, [lessonIdRef,chapter]);

  //map data
  const fetchData = (data) => {
    return (
      <AcSummary 
        key = {data.id}
        id = {data.id}
        chapter_name = {data.chapter_name}
        chapter_number = {data.chapter_number}
        desc = {data.description}
        vid = {data.url}
        date = {data.date_uploaded}
        lessonId = {location.state.lessonId}
        kindofuser = {location.state.kindofuser}
      />
    );
  }

  return (
    <>
    <UserNavbar/>
    <div className="student-wrap-accord">
      <div className="add-chapter" style={location.state.kindofuser === 'student' ? {display: 'none'} : null}>
        <Button 
          variant="contained"
          onClick={toggleModal}
        >
          Create Chapter
        </Button>
      </div>
      {modal && (
        <div className="modal" id="student-modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <AccordionModal 
              tb_createLesssonId = {location.state.lessonId}
              setChapter = {setChapter}
              setLoading = {setLoading}
            />
          </div>
        </div>
      )}
      <div className="studentAccord">
          {loading && <div>Loading... might take a few seconds</div>}
          {chapter?.map(fetchData)}
      </div>
    </div>
    </>
  );
}
