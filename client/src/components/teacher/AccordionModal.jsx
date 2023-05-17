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

    const [chapName, setChapName] = useState(props.chapterName);
    const [chapNum, setChapNum] = useState(props.chapterNumber);
    const [descrip, setDescrip] = useState(props.description);
    const [link, setLink] = useState(props.url);

    const createChapter = () => {
        if(chapterName === "" || chapterNumber === "" || desc === "" || urlLink === "") {
            alert("Dont leave a blank input");
        } else {
            props.setLoading(true)
            Axios.post("https://mathflix.herokuapp.com/api/user/addChapter", {
                tb_lessonId: props.tb_createLesssonId,
                chapter_name: chapterName,
                chapter_number: chapterNumber,
                description: desc,
                url: urlLink
            })
            .then((response) => {
                alert(response.data.message);
                props.setChapter(prevState => [...prevState, response.data]);
                document.location.reload(true);
            }).finally(() => {
                props.setLoading(false);
            });
        }
    }

    const editChapter = () => {
            Axios.put("https://mathflix.herokuapp.com/api/user/editChapter", {
                tb_lessonId: props.tb_createLesssonId,
                chapter_name: chapName,
                chapter_number: chapNum,
                description: descrip,
                url: link
            })
            .then((response) => {
                if(response.data.result) {
                    alert(response.data.result);
                    document.location.reload(true);
                }
            }).catch((error) => {
                console.log(error);
            })
        
    } 

    return (
        <div className="AcModal-wrap">
            <div className="exit-button">
                {props.clickUpdate ? (
                    <button onClick={() => {
                        props.setUpdateModal(false);
                    }}>close</button>
                ) : 
                    <button onClick={() => {
                        props.setModal(false);
                    }}>close</button>
                }
            </div>


            {props.clickUpdate ? (
                <>
            <div className="vid-url">
                <input 
                    type="text"
                    value={link} 
                    placeholder="copy and paste the highlighted part here" 
                    onChange={(e) => {
                        setLink(e.target.value);
                    }}
                />
            </div>                
            <div className="chapter-info">
                <input 
                    type="text" 
                    value={chapName}
                    placeholder="Chapter Name" 
                    id="chapter-name"
                    onChange={(e) => {
                        setChapName(e.target.value);
                    }}
                />
                <input 
                    type="text" 
                    placeholder="#"
                    value={chapNum} 
                    id="chapter-number"
                    onChange={(e) => {
                        setChapNum(e.target.value);
                    }}
                />
            </div>
            <div className="chapter-description">
                <textarea
                    className="input-form textarea-form"
                    value={descrip}
                    id="chap-desc"
                    name="w3review"
                    rows="10"
                    placeholder="Brief Description"
                    onChange={(e) => {
                        setDescrip(e.target.value);
                    }}
                ></textarea>
            </div>
            <Button variant="contained" onClick={editChapter}> Edit Chapter </Button>                
                </>

            ) : (


                <>
                <div className="vid-url">
                    <input 
                        type="text" 
                        placeholder="copy and paste the highlighted part here" 
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
                    placeholder="Brief Description"
                    onChange={(e) => {
                        setDesc(e.target.value);
                    }}
                ></textarea>
            </div>
            <Button variant="contained" onClick={createChapter}> Create Chapter </Button>                
                </>
            )}
        </div>
    );
}