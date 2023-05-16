import * as React from 'react';
import "../../css/admin/admin.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function CreateAcc() {
    const [firstname, setFirstName] = React.useState('');
    const [lastname, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [gender, setGender] = React.useState('');

    const [modal, setModal] = React.useState(false);
    const [nextModal, setNextModal] = React.useState(false);

    //Axios.defaults.withCredentials = true;

    const handleChange = (event) => {
        setGender(event.target.value);
      };

    const toggleModal = () => {
        setModal(!modal);
    }

    const toggleNextModal = () => {
        setNextModal(!nextModal);
    }

    const skip = () => {
        setModal(false);
        setNextModal(false);
    }
    return (
        <>
            {modal && (
                <div className='createAcc-container' style={{ display }}>
                    <div className='createAcc-attrib'>
                        <h2> Create Account Form</h2>
                        <div className='createAcc-tf'>
                            <TextField required
                                id="outlined-controlled"
                                label="First Name"
                                value={firstname}
                                sx={{ width: '400px' }}
                                onChange={(event) => {
                                    setFirstName(event.target.value);
                                }}
                            />
                        </div>
                        <div className='createAcc-tf'>
                            <TextField required
                                id="outlined-controlled"
                                label="Last Name"
                                value={lastname}
                                sx={{ width: '400px' }}
                                onChange={(event) => {
                                    setLastName(event.target.value);
                                }}
                            />
                        </div>
                        <div className='createAcc-select'>
                            <FormControl required sx={{ width: '400px' }}>
                                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={gender}
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Male"}>Male</MenuItem>
                                    <MenuItem value={"Female"}>Female</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='createAcc-btn'>
                            <Button variant="contained" onClick={toggleNextModal}>Create</Button>
                        </div>
                    </div>
                    {nextModal && (
                        <div className='createAcc-attrib'>
                            <h2> Create Account Form</h2>
                            <div className='createAcc-tf'>
                                <TextField required
                                    id="outlined-controlled"
                                    label="Email"
                                    value={email}
                                    sx={{ width: '400px' }}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                />
                            </div>
                            <div className='createAcc-tf'>
                                <TextField required
                                    id="outlined-password-input"
                                    label="Password"
                                    type="password"
                                    value={password}
                                    autoComplete="current-password"
                                    sx={{ width: '400px' }}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                />
                            </div>
                            <div className='createAcc-tf'>
                                <TextField required
                                    id="outlined-password-input"
                                    label="Confirm Password"
                                    type="password"
                                    autoComplete="current-password"
                                    sx={{ width: '400px', color: 'white' }}
                                />
                            </div>
                            <div className='createAcc-btn'>
                                <Button variant="contained">Create</Button>
                            </div>
                        </div>)}
                </div>)}
        </>
    );
}

