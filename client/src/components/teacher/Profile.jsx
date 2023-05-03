import { useState,useEffect } from "react";
import Axios from 'axios';
import UserNavBar from "../../components/global/UserNavbar";
import "../../css/teacher/profile.css";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { MenuItem } from "@mui/material";


export default function Profile(){
    const [file, setFile] = useState(null);
    const [profile, setProfile] = useState([]);

    const [textCLick, setTextClick] = useState(false);

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
          const response = await Axios.post('http://localhost:5000/api/user/uploadProfile', 
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
        Axios.get("http://localhost:5000/api/user/profile").then((response) => {
            //console.log(response);
            if(!response.data.message) {
                //console.log(profile);
                setProfile(response.data.result);
            }
        }).catch((error) => {
            console.log(error);
        });
    },[profile])



    return (
        <>
            <UserNavBar />
            <div className="profile-container">
                <div className="profile-div">
                    <div className="profile-picture">
                        <div>
                            <img src={`data:image/jpeg;base64,${profile[0]?.pic}`} alt=""/>
                        </div>
                        <div>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className="user-details">
                        <div className="user-information" >
                                    <TextField
                                        id="outlined-basic"
                                        label="First Name"
                                        variant="outlined"
                                        placeholder="Enter your first name"
                                        onClick={() => setTextClick(true)}
                                        value={textCLick ? fName : profile[0]?.firstname || ''}
                                        onChange={(event)=> setFName(event.target.value)}
                                        sx={{marginTop: '10%'}}
                                    />

                                    <TextField
                                        id="outlined-basic"
                                        label="Last Name"
                                        variant="outlined"
                                        placeholder="Enter your first name"
                                        onClick={() => setTextClick(true)}
                                        value={textCLick ? lName : profile[0]?.lastname || ''}
                                        onChange={(event)=> setLName(event.target.value)}
                                        sx={{marginTop: '10%'}}
                                    />

                                    <TextField 
                                    id="select" 
                                    select 
                                    value={profile[0]?.gender || gen} 
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
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Upload
                        </Button>
                    </div>
                </div>
            </div>
            {fName}
            {lName}
            {gen}
        </>
    );
}