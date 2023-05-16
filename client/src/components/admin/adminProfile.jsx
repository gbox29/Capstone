import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import AdminNav from "./adminNav";
import "../../css/teacher/profile.css";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { MenuItem } from "@mui/material";


export default function Profile(){
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const [file, setFile] = useState(null);

    const [pCheck, setPCheck] = useState(false);
    const [profCheck, setProfCheck] = useState(false);

    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [gen, setGen] = useState('');


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('fname', fName);
        formData.append('lname', lName);
        formData.append('gender', gen);
        try {
          const response = await Axios.post('https://mathflix.herokuapp.com/api/user/uploadProfile', 
          formData, 
          {
            fname: fName,
            lname: lName,
            gender: gen,
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(response) {
            navigate('/admin/settings');
          }
        } catch (error) {
          console.error(error);
        }
    };
      

    const edit = () => {
        setPCheck(!pCheck)
    }

    const handleEdit = async () => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('fname', fName);
        formData.append('lname', lName);
        formData.append('gender', gen);
        try {
          const response = await Axios.put('https://mathflix.herokuapp.com/api/user/editProfile', 
          formData, 
          {
            fname: fName,
            lname: lName,
            gender: gen,
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          alert(response.data.message);
        } catch (error) {
          console.error(error);
        }
    };

    useEffect(() => {
        Axios.get("https://mathflix.herokuapp.com/api/user/profile").then((response) => {
            //console.log(response);
            if(!response.data.message) {
                //console.log(profile);
                setProfile(response.data.result);
                setProfCheck(true);
            }
        }).catch((error) => {
            console.log(error);
        });
    },[profile])



    return (
        <>
            <AdminNav />
            <div className="profile-container">
                <div className="profile-div">
                    <div className="profile-picture">
                        <div>
                            {pCheck ? (
                                <img src="#" alt=""/>
                            ) :
                                <img src={profile[0]?.pic} alt=""/>
                            }
                        </div>
                        <div>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className="user-details">
                        <div className="user-information" >
                                    <TextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        placeholder="Enter your first name"
                                        value={pCheck === false ? profile[0]?.firstname : fName}
                                        onChange={(event)=> 
                                            setFName(event.target.value)
                                        }
                                        sx={{marginTop: '10%'}}
                                    />

                                    <TextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        placeholder="Enter your first name"
                                        value={pCheck === false ? profile[0]?.lastname : lName}
                                        onChange={(event)=> setLName(event.target.value)}
                                        sx={{marginTop: '10%'}}
                                    />
                                    
                                    <TextField 
                                    id="select" 
                                    select 
                                    placeholder="gender"
                                    value={profCheck === false ? gen : (pCheck === false ? (profile.length > 0 ? profile[0]?.gender : "") : gen)} 
                                    defaultValue={gen}
                                    onChange={(event) => setGen(event.target.value)} 
                                    sx={{marginTop: '10%'}}
                                    >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    </TextField>
                                    



                                    <TextField id="outlined-basic" 
                                    value={profile[0]?.email}
                                    placeholder="email" 
                                    variant="outlined"
                                    disabled={true}  
                                    sx={{marginTop: '10%'}}/>

                                    <TextField id="outlined-basic"
                                    value={profile[0]?.kindofuser}  
                                    placeholder="status"
                                    variant="outlined"  
                                    disabled={true}
                                    sx={{marginTop: '10%'}}/> 
                        </div>
                        {profCheck ? (
                            <>
                            <Button variant="primary" type="submit" onClick={edit}>Click Here To Edit</Button>
                            {pCheck && (<Button variant="primary" type="submit" onClick={handleEdit} style={{float:'right'}}>Edit</Button>)}
                            </>
                        ) : (
                            <Button variant="primary" type="submit" onClick={handleSubmit} style={{float:'right'}}>
                                Upload
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}