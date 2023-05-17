import UserNavbar from "../global/UserNavbar";
import "../../css/teacher/video.css";
import { useEffect,useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate, createSearchParams} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import RatingWidth from "./RatingWidth";
import Ratings from "./Ratings";
import StarRating from "./StarRating";
// import Avatar from '@mui/material/Avatar';
import Axios from 'axios';
import UserReactions from "./UserReactions";
import LessonVideoRec from "./LessonVideoRec";


export default function LessonVideo(){
    
    const location = useLocation();
    const navigate = useNavigate();

    const [chapterId, setChapterId] = useState(location.state.chapterId);
    const chapterIdRef = useRef(chapterId);

    const [lessonIdState, setLessonIdState] = useState(location.state.lessonId)
    const lessonIdRef = useRef(lessonIdState);

    const [value, setValue] = useState(0);

    const [reaction, setReaction] = useState("");
    const [fetchReaction, setFetchReaction] = useState([]);
    //console.log(fetchReaction)
    const [stars, setStars] = useState({});
    const [starsPercentage, setStarsPercentage] = useState({});
    const [totalRate, setTotalRate] = useState(0);

    const [nextVid, setNextVid] = useState([]);
    //console.log(nextVid);

    const [queryCount, setQueryCount] = useState(0);
    const MAX_QUERIES = 10
    
    //rate or comment chapter
    const userComment = () => {
        Axios.post("https://mathflix.herokuapp.com/api/user/rateChapter", {
            chapter_id: location.state.chapterId,
            comment : reaction,
            rating : value
          }).then((response) => {
            if (response) {
                alert("Comment Inserted Succesfully");
                setReaction("");
                setValue(0);
                setFetchReaction(prevState => [...prevState, response.data]); // update fetchReaction state with new comment
                document.location.reload(true);
            }
          });
    }

    useEffect(() => {
        setChapterId(location.state.chapterId);
      }, [location.state.chapterId]);
    
      useEffect(() => {
        chapterIdRef.current = chapterId;
      }, [chapterId]);

      useEffect(() => {
        setLessonIdState(location.state.lessonId);
      }, [location.state.lessonId]);
    
      useEffect(() => {
        lessonIdRef.current = lessonIdState;
      }, [lessonIdState]);


    //fetch all user ratings and comments
    useEffect(() => {
        const fetchUserRating = () => {
            Axios.get("https://mathflix.herokuapp.com/api/user/fetchUserRatings", {
            params: {
                chapter_id : chapterIdRef.current,
              }            
            }).then((response) => {
                if(!response.data.message) {
                    setTotalRate(response.data.totalRate);
                    setStarsPercentage(response.data.ratingPercentageTwo)
                    setStars(response.data.ratingPercentages);
                    setFetchReaction(response.data.result);             
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        if (queryCount < MAX_QUERIES) {
            fetchUserRating();
            setQueryCount(queryCount + 1);
        }
    },[queryCount]);


    //fetch all chapters in lesson for next video navigation
    useEffect(()=>{
        const getChapter = () => {
          Axios.get("https://mathflix.herokuapp.com/api/user/fetchChapter",{
            params: {
              tb_lessonId : lessonIdRef.current
            }
          }).then((response) => {
            //console.log(response.data.result);
            setNextVid(response.data.result);
          }).catch((error) => {
            console.log(error.response);
          })
        }
         if (queryCount < MAX_QUERIES) {
            getChapter();
            setQueryCount(queryCount + 1);
        }
    }, [queryCount]);

      //automatic update the stars of the chapters everytime the user insert or update the comment
      const chapterRating = useCallback(() => {
        Axios.put("https://mathflix.herokuapp.com/api/user/editChapterStar", {
          rating : totalRate,
          chapter_id: location.state.chapterId
        }).then((response) => {
          //console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      }, [location.state.chapterId, totalRate]);

    useEffect(() => {
        chapterRating();
    },[chapterRating])


    const FetchDataReactions = (data) => {
        return (
            <UserReactions 
                key = {data.id}
                id = {data.id}
                user_id = {data.user_id}
                firstname = {data.firstname}
                lastname = {data.lastname}
                comment = {data.comment}
                pic = {data.pic}
                rate = {data.rate}
                month = {data.month}
                day = {data.day}
                year = {data.year}
            />
        );
    }
    
    const fetchNextVid = (data) => {
        return (
            <LessonVideoRec 
                key = {data.id}
                id = {data.id}
                chapter_name = {data.chapter_name}
                chapter_number = {data.chapter_number}
                desc = {data.description}
                vid = {data.url}
                month = {data.month}
                day = {data.day}
                year = {data.year}
                ratingValue = {data.rating}
                lessonId = {location.state.lessonId}
            />
        );
    }
    
    const takeQuiz = () => {
        navigate({
            pathname: "/user/chapter/watch/answerQuiz",
            search: `?${createSearchParams({chapterId})}`, // inject code value into template
          },{state: {
                    chapterId : chapterId, 
        }});
    }

    Axios.defaults.withCredentials = true;

    return(
        <>
            <UserNavbar />
            <div className="vid-container">
                <div className="main">
                    <iframe 
                        src={`https://www.youtube-nocookie.com/embed/${location.state.vid}`}
                        height="500px" 
                        width="95%"
                        title="React"
                    >
                    </iframe>
                    <h1 className="vid-title">
                        Chapter {location.state.chapter_number} {location.state.chapter_name}
                        {/*Chapter {location.state.chapter_number} {location.state.chapter_name}*/}
                        
                    </h1>
                    <p className="vid-title">{location.state.month} / {location.state.day} / {location.state.year}</p>
                    <p className="vid-title">{/*{location.state.desc}*/} {location.state.desc}</p>

                    <div className="vid-title feedback">
                        <div className="rating-quiz-button">
                            <h2>Student Rating</h2>
                            <Button onClick={takeQuiz}>Take A Quiz</Button>
                        </div>
                        <div className="ratings">
                            <div className="overall">
                                <h1 className="overall-rating">{totalRate.toFixed(2)}%</h1>
                                <p>Average Rating</p>
                            </div>
                            <div className="stars">
                                <div className="horizontal-div">
                                    <RatingWidth 
                                        starsRating = {stars}
                                    />                                               
                                </div>
                                <Box component="div" sx={{
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    marginTop: '5px',
                                    height:'90%',
                                    }}>
                                    <StarRating 
                                        starsRating = {stars}
                                    />
                                </Box>
                            </div>
                            <div className="percent">
                                <Ratings 
                                    starsPercentage = {starsPercentage}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="vid-title feedback">
                        <h2>Feedback</h2>
                        <div className="add-feedback">
                            <div className="feedback-pic">
                                <Avatar alt="Comment" src="/static/images/avatar/2.jpg" />

                            </div>
                            <div className="comment">
                                <div className="input-comment">
                                    <textarea placeholder="Create a feedback" 
                                    value={reaction}
                                    onChange={(e) => {
                                        setReaction(e.target.value);
                                    }}/>
                                </div>
                                <div className="add-comment">
                                    <div className="star">
                                        <Rating
                                            name="simple-controlled"
                                            value={value}
                                            onChange={(event, newValue) => {
                                                setValue(newValue);
                                            }}
                                        />
                                    </div>
                                    <div className="enter">
                                        <Button>Cancel</Button>
                                        <Button onClick={()=>{
                                                userComment();
                                            }
                                        }>Submit</Button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="add-feedback users-feedback">
                            {fetchReaction?.map(FetchDataReactions)}

                        </div>
                    </div>
                </div>
                
                <div className="next">
                    {nextVid?.map(fetchNextVid)}
                </div>
            </div>

        </>
    );
}