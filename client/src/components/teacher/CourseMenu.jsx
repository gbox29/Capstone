import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, createSearchParams} from "react-router-dom";
import Axios from "axios"

const ITEM_HEIGHT = 48;
export default function CourseMenu(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const [lessonId] = React.useState(props.lessonId)

    //console.log(props.lessonId);

    Axios.defaults.withCredentials = true;

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null)
    }

    const addStudent = () => {
      setAnchorEl(null);
      props.setNextModal(true);
      props.toggleModal();
      props.setLessonId(props.lessonId)
      //console.log("I was clicked");
    };
    
    
    const analytics = () => {
      setAnchorEl(null);
      navigate({
        pathname: "/user/lesson/analytics",
        search: `?${createSearchParams({lessonId})}`, // inject code value into template
      },{state: {lessonId : props.lessonId}});
    };

    const deleteLesson = () => {
      const result = window.confirm('Do you want to continue?');
      if (result) {
        setAnchorEl(null);
        Axios.delete("https://mathflix.herokuapp.com/api/user/delete", {
          params: {
            lessonId : props.lessonId
          }
        }).then((response) => {
          if(response) {
            alert("Deleted Succesfully");
            document.location.reload(true);
          }
        }).catch((error) => {
          console.log(error);
        })
      }
    };    
    
    return (
    <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
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

          <MenuItem onClick={addStudent}>
            Add Student
          </MenuItem>

          <MenuItem onClick={analytics}>
            Analytics
          </MenuItem>

          <MenuItem onClick={deleteLesson}>
            Delete
          </MenuItem>
        </Menu>
      </div>
      );
}