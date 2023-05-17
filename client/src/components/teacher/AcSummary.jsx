import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import Box from '@mui/material/Box';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { useNavigate, createSearchParams} from "react-router-dom";
import  Axios  from 'axios';

export default function AcSummary(props={}){
    const [chapterId] = useState(props.id);
    const navigate = useNavigate();
    //console.log(props);
    const watchVideo = () => {
        navigate({
          pathname: "/user/chapter/watch",
          search: `?${createSearchParams({chapterId})}`, // inject code value into template
        },{state: {chapterId : chapterId, 
                  chapter_number : props.chapter_number,
                  chapter_name: props.chapter_name,
                  desc: props.desc,
                  vid : props.vid,
                  month : props.month,
                  day : props.day,
                  year: props.year,
                  lessonId : props.lessonId
                }});
    }

    const createQuiz = () => {
      navigate({
        pathname: "/user/chapter/addQuiz",
        search: `?${createSearchParams({chapterId})}`,
      }, {state: {
        chapterId: chapterId
      }});
    }

    const updateChapter = () => {
      props.setUpdateModal(!props.updateModal);
      props.setChapterName(props.chapter_name);
      props.setChapterNumber(props.chapter_number);
      props.setDescription(props.desc);
      props.setUrl(props.vid);
    }

    const deleteChapter = (id) => {
      const result = window.confirm('Do you want to continue?');
      if (result) {
        Axios.delete("https://mathflix.herokuapp.com/api/user/deleteChapter", {
          params: {
            chapterId : id,
          }
        }).then((response) => {
            alert(response.data.message);
            document.location.reload(true);
        })
      } else {
        console.log('User clicked Cancel');
      }
    }

    return (
      <>
        <div className='stdntContainer' key={props.id}>
          {props.lessonId}
          <Accordion sx={{backgroundColor: "grey", color: "white"}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{fontFamily: "croissant one"}}>Chapter {props.chapter_number} {props.chapter_name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {props.desc && props.desc.substring(0,250)}
                <Box component="div" sx={{ 
                    display: 'block', 
                    textAlign: { xs: "center", sm: "center", md: "right" },
                    /*backgroundColor: { xs: "blue", sm: "red", md: "yellow" }*/
                  }}>
                    <Button
                      sx={{ width: {xs: 1/2, sm: 1/4, md: 1/6},  
                            fontSize: 12,
                            marginTop: 1,
                            marginRight: 1
                          }}
                      onClick={watchVideo}
                      variant="contained" 
                      component="label">
                        Watch Video
                    </Button>
                    {props.kindofuser === "teacher" && (
                      <>
                        <Button
                          sx={{
                            width: { xs: 1 / 2, sm: 1 / 4, md: 1 / 6 },
                            fontSize: 12,
                            marginRight: 1,
                            marginTop: 1
                          }}
                          onClick={createQuiz}
                          variant="contained"
                          component="label"
                        >
                          Quiz
                      </Button>
                                            
                      <Button
                        sx={{
                          width: { xs: 1 / 2, sm: 1 / 4, md: 1 / 6 },
                          fontSize: 12,
                          marginTop: 1,
                          marginRight: 1
                        }}
                        onClick={() => {
                          updateChapter();
                        }}
                        variant="contained"
                        component="label"
                      >
                        Update
                      </Button>

                      <Button
                        sx={{
                          width: { xs: 1 / 2, sm: 1 / 4, md: 1 / 6 },
                          fontSize: 12,
                          marginTop: 1
                        }}
                        onClick={() => {
                          deleteChapter(chapterId);
                        }}
                        variant="contained"
                        component="label"
                      >
                        Delete
                      </Button>
                      </>
                    )}
                  </Box>
            </AccordionDetails>
          </Accordion>
          
        </div>
      </>
    );
}