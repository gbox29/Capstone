import { useState } from "react";
import Axios from "axios";
import Button from '@mui/material/Button';
import "../../css/teacher/accordionModal.css";
//import { create } from "@mui/material/styles/createTransitions";

export default function AccordionModal(props){
    //console.log(props);
    Axios.defaults.withCredentials = true;
    const [chapterName, setChapterName] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");
    const [desc, setDesc] = useState("");
    const [urlLink, setUrlLink] = useState("");

    const createChapter = () => {
        console.log("Creating chapter...");
        props.setLoading(true)
        Axios.post("http://localhost:5000/api/user/addChapter", {
            tb_lessonId: props.tb_createLesssonId,
            chapter_name: chapterName,
            chapter_number: chapterNumber,
            description: desc,
            url: urlLink
        })
        .then((response) => {
            alert(response.data.message);
            props.setChapter(prevState => [...prevState, response.data]);
        }).finally(() => {
            props.setLoading(false);
        });
    }
    return (
        <div className="AcModal-wrap">
            <div className="exit-button">
                <button>X</button>
            </div>
            <div className="vid-url">
                <input 
                    type="text" 
                    placeholder="video url here" 
                    onChange={(e) => {
                        setUrlLink(e.target.value);
                    }}
                />
            </div>
            <div className="chapter-info">
                <input 
                    type="text" 
                    placeholder="Chapter Name" 
                    id="chapter-name"
                    onChange={(e) => {
                        setChapterName(e.target.value);
                    }}
                />
                <input 
                    type="text" 
                    placeholder="#" 
                    id="chapter-number"
                    onChange={(e) => {
                        setChapterNumber(e.target.value);
                    }}
                />
            </div>
            <div className="chapter-description">
                <textarea
                    className="input-form textarea-form"
                    id="chap-desc"
                    name="w3review"
                    rows="10"
                    placeholder="Description"
                    onChange={(e) => {
                        setDesc(e.target.value);
                    }}
                ></textarea>
            </div>
            <Button variant="contained" onClick={createChapter}> Create Chapter </Button>
        </div>
    );
}