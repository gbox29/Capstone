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
  const [updateModal, setUpdateModal] = useState(false);
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
      Axios.get("https://mathflix.herokuapp.com/api/user/fetchChapter",{
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
  }, []);

  const [chapterName, setChapterName] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  
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
        month = {data.month}
        day = {data.day}
        year = {data.year}
        lessonId = {location.state.lessonId}
        kindofuser = {location.state.kindofuser}
        updateModal = {updateModal}
        setUpdateModal = {setUpdateModal}

        setChapterName = {setChapterName}
        setChapterNumber = {setChapterNumber}
        setDescription = {setDescription}
        setUrl = {setUrl}
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
              modal = {modal}
              setModal = {setModal}
            />
          </div>
        </div>
      )}
      {updateModal && (
          <div className="modal" id="student-modal">
            <div onClick={()=>{setUpdateModal(!updateModal)}} className="overlay"></div>
             <div className="modal-content">
              <AccordionModal 
                tb_createLesssonId = {location.state.lessonId}
                setChapter = {setChapter}
                setLoading = {setLoading}
                clickUpdate = {true}
                updateModal = {updateModal}
                setUpdateModal = {setUpdateModal}

                chapterName = {chapterName}
                chapterNumber = {chapterNumber}
                description = {description}
                url = {url}
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
