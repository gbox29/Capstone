// import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Axios from "axios";
const ITEM_HEIGHT = 48;


export default function UserReactions(props){
    //console.log(props);
    const [newValue, setNewValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [updateReaction, setUpdateReaction] = useState(false);
    const [comments, setComments] = useState(props.comment);
    const [commentId] = useState(props.id);
    const open = Boolean(anchorEl);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null)
    }


    const deleteComment = () => {
        const result = window.confirm('Do you want to continue?');
        if (result) {
            setAnchorEl(null);
            Axios.delete("https://mathflix.herokuapp.com/api/user/deleteComment", {
              params: {
                ratingId : props.id,
                user_id : props.user_id
              }
            }).then((response) => {
                alert(response.data.message);
                document.location.reload(true);
            })
        } else {
            console.log('User clicked Cancel');
        }
    }

    const updateComment = () => {
        setAnchorEl(null);
        setUpdateReaction(!updateReaction)
        setComments(props.comment);
        console.log(comments);
        console.log(commentId);
        console.log("I was clicked");
    }

    const editComment = () => {
        //setUpdateReaction(!updateReaction);
        //console.log(newValue);
        Axios.put("https://mathflix.herokuapp.com/api/user/updateComment", {
            newComment : comments,
            newRating : newValue,
            commentId: commentId,
            user_id : props.user_id
        }).then((response) => {
            setUpdateReaction(!updateReaction);
            alert(response.data.message);
            document.location.reload(true);
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div className="feedback-container">
                            <div className="feedback-pic">
                                {/* <Avatar alt={props.firstname} src="/static/images/avatar/2.jpg" /> */}
                                <img src={props.pic} alt="user" />
                            </div>
                            <div className="comment">
                                <div className="input-comment">
                                    <div className="user-info">
                                        <div className="username">{props.firstname} {props.lastname}</div>
                                        <div className="comment-date">{props.month} / {props.day} / {props.year}</div>
                                        <div className="put-del-comment">
                                            <IconButton
                                                aria-label="more"
                                                id="long-button"
                                                aria-controls={open ? 'long-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={handleClick}
                                            >
                                                <MoreHorizIcon />
                                            </IconButton>
                                            <Menu
                                                id="long-menu"
                                                MenuListProps={{
                                                'aria-labelledby': 'long-button',
                                                }}
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                PaperProps={{
                                                style: {
                                                    maxHeight: ITEM_HEIGHT * 4.5,
                                                    width: '20ch',
                                                },
                                                }}
                                            >
                                                <MenuItem onClick={updateComment}>
                                                    Update
                                                </MenuItem>                                                
                                                <MenuItem onClick={deleteComment}>
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div style={updateReaction === true ? {display: 'none'} : null}>
                                        <div className="user-rating">
                                            <Rating name="read-only" 
                                                value={props.rate} 
                                                readOnly 
                                            />
                                        </div>
                                        <div className="user-feedback">
                                            {comments}
                                        </div>
                                    </div>
                                    { updateReaction && (
                                        <>
                                        <div className="user-feedback">
                                            <textarea 
                                                placeholder="Edit a feedback"
                                                value={comments}
                                                onChange={(e) => {
                                                    setComments(e.target.value);
                                            }}/>
                                        </div>
                                        <div className="user-rating">
                                            <Rating
                                                name="simple-controlled"
                                                value={newValue}
                                                onChange={(event, newValue) => {
                                                    setNewValue(newValue);
                                                }}
                                            />
                                        </div>
                                        <Button 
                                            style={{float:'right'}}
                                            onClick={editComment}
                                            >Edit</Button>
                                        </>
                                    )}                                  
                                </div>
                            </div>        
        </div>
    );
}