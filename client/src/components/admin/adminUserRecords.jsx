import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useState, useEffect } from "react";
import Axios from "axios";
import "../../css/admin/admin.css"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// function CustomToolbar() {
//     return (
//       <GridToolbarContainer>
//         <GridToolbarExport />
//       </GridToolbarContainer>
//     );
//   }
  

export default function AdminUserRecords() {
    const [userRecords, setUserRecords] = useState([]);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
            const getResult = () => {
                Axios.get("https://mathflix.herokuapp.com/api/admin/user_records").then((response) => {
                    if (response.data.message) {
                        console.log(response.data.message);
                    }else{
                        setUserRecords(response.data.result);
                    }
                });
            }
            const interval = setInterval(() => {
                getResult();
              }, 1000);
              return () => clearInterval(interval);
    }, );

    const renderDetailsButton = (params) => {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => {
                        Axios.delete("https://mathflix.herokuapp.com/api/admin/delete_records", {
                            params: {
                                id: params.row.id
                            }
                            
                        }).then(response => {
                            console.log(response);
                            alert(response.data.message);
                        }).catch(error => {
                            console.log(error);
                            alert(error);
                        });
                        setFlag(!flag);
                    }}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => toggleModal2(params.row)}
                >
                    Update
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => handleReset(params.row)}
                >
                    Reset
                </Button>
            </strong>
        )
    }

    const columns = [
        {
            field: 'id',
            // headerName: 'ID',
            renderHeader: () => (
                <strong>
                    {'ID '}
                </strong>
            ),
            width: 100,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'firstname',
            // headerName: 'First name',
            renderHeader: () => (
                <strong>
                    {'FirstName '}
                </strong>
            ),
            width: 200,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'lastname',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'LastName'}
                </strong>
            ),
            width: 200,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'gender',
            // headerName: 'Gender',
            renderHeader: () => (
                <strong>
                    {'Gender'}
                </strong>
            ),
            width: 100,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'email',
            // headerName: 'Email',
            renderHeader: () => (
                <strong>
                    {'Email '}
                </strong>
            ),
            width: 250,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'kindofuser',
            // headerName: 'Type of User',
            renderHeader: () => (
                <strong>
                    {'Type of User'}
                </strong>
            ),
            width: 150,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'action',
            // headerName: 'Action',
            renderHeader: () => (
                <strong>
                    {'Action '}
                </strong>
            ),
            width: 300,
            renderCell: renderDetailsButton,
            disableClickEventBubbling: true,
            sortable: false,
            editable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
        },
    ];

    
    const handleEdit = () => {
        Axios.put("https://mathflix.herokuapp.com/api/admin/edit_records", {
            id: id,
            firstname: firstname,
            lastname: lastname,
            gender: gender,
            email: email,
        })
            .then((response) => {
                console.log(response);
                alert(response.data.message);
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
        setModal2(!modal2);
        setFlag(!flag);
    };

    const handleReset = (row) => {
        // alert(row.lastname)
        const id = row.id;
        const lastname = row.lastname;
        const email = row.email;
        Axios.put("https://mathflix.herokuapp.com/api/admin/resetPW_records", {
            id: id,
            lastname: lastname,
            email: email,
        })
            .then((response) => {
                console.log(response);
                alert(response.data.message);
            })
            .catch((error) => {
                console.log(error);
                alert(error+id+lastname+email);
            });
    };

    const reset = () => {
        setId();
        setFirstName('');
        setLastName('');
        setEmail('');
        setGender('');
        setUserType('');

    };

    const handleCreate = () => {
        if (email !== "" && userType !== "") {
            Axios.post("https://mathflix.herokuapp.com/api/admin/create_records", {
                firstname: firstname,
                lastname: lastname,
                gender: gender,
                email: email,
                userType: userType,
            })
                .then((response) => {
                    console.log(response);
                    alert(response.data.message);
                })
                .catch((error) => {
                    console.log(error);
                    alert(error);
                });
            setNextModal(!nextModal);
            setModal(!modal);
            reset();
            setFlag(!flag);
        } else {
            alert("Please Complete the fields")
        }
    };





    const [id, setId] = React.useState();
    const [firstname, setFirstName] = React.useState('');
    const [lastname, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    // const [password, setPassword] = React.useState('');
    // const [password2, setPassword2] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [userType, setUserType] = React.useState('');

    const [modal, setModal] = React.useState(false);
    const [modal2, setModal2] = React.useState(false);
    const [nextModal, setNextModal] = React.useState(false);
    // const [nextModal2, setNextModal2] = React.useState(false);

    Axios.defaults.withCredentials = true;

    const handleChange = (event) => {
        setGender(event.target.value);
    };

    const handleChange2 = (event) => {
        setUserType(event.target.value);
    };

    const toggleModal = () => {
        setModal(!modal);
    }

    const toggleModal2 = (row) => {
        setModal2(!modal2);
        setId(row.id);
        setFirstName(row.firstname);
        setLastName(row.lastname);
        setEmail(row.email);
    }

    const toggleNextModal = () => {
        if ((firstname && lastname && gender) !== '') {
            setNextModal(!nextModal);
        } else {
            alert('Please Fill in the details');
        }

    }

    // const toggleNextModal2 = () => {
    //     setNextModal2(!nextModal2);
    // }

    return (
        <>
            {modal && (
                <div className='modal'>
                    <div className="modal-content">
                        <div className="modal-wrap" style={nextModal === true ? { display: 'none' } : null}>
                            <div className='createAcc-tf'>
                                <h2>Create Account</h2>
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
                                        <MenuItem disabled>Select Gender</MenuItem>
                                        <MenuItem value={"Male"}>Male</MenuItem>
                                        <MenuItem value={"Female"}>Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='createAcc-btn'>
                                <div className='create-cancel-btns'>
                                    <div className='cancel-btn'>
                                        <Button variant='outlined' color='error' onClick={toggleModal}>Cancel</Button>
                                    </div>
                                    <div className='create-btn'>
                                        <Button variant="contained" onClick={toggleNextModal}>Next</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {nextModal && (
                        <div className='modal-content'>
                            <h2> Create Account</h2>
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
                            <div className='createAcc-select'>
                                <FormControl required sx={{ width: '400px' }}>
                                    <InputLabel id="demo-simple-select-label">Type Of User</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={userType}
                                        label="Age"
                                        onChange={handleChange2}
                                    >
                                        <MenuItem value={"student"}>student</MenuItem>
                                        <MenuItem value={"teacher"}>teacher</MenuItem>
                                        <MenuItem value={"admin"}>admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='createAcc-btn'>
                                <div className='create-cancel-btns'>
                                    <div className='back-btn'>
                                        <Button variant='outlined' color='error' onClick={toggleNextModal}>Back</Button>
                                    </div>
                                    <div className='create-btn'>
                                        <Button variant="contained" onClick={handleCreate}>Create</Button>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                </div>)}

            <Box sx={{ height: 600, width: '100%', zIndex: -1 }}>
                <div className='user-container'>
                    <div className='user-title'>
                        <h1>User Records Section</h1>
                    </div>
                    <div className='createNewAcc-btn'>
                        <Button variant='contained' onClick={toggleModal}>Create New Account</Button>
                    </div>
                </div>
                <DataGrid
                    rows={userRecords}
                    columns={columns}
                    slots={{
                        toolbar: GridToolbar,
                      }}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                />
            </Box>
            {modal2 && (
                <div className='modal'>
                    <div className="modal-content">
                        <div className="modal-wrap">
                            <div className='createAcc-tf'>
                                <h2>Create Account</h2>
                                <TextField required
                                    id="outlined-controlled"
                                    label="First Name"
                                    defaultValue={firstname}
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
                                    defaultValue={lastname}
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
                                        defaultValue={gender}
                                        label="Age"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"Male"}>Male</MenuItem>
                                        <MenuItem value={"Female"}>Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='createAcc-btn'>
                                <div className='create-cancel-btns'>
                                    <div className='cancel-btn2'>
                                        <Button variant='outlined' color='error' onClick={toggleModal2}>Cancel</Button>
                                    </div>
                                    <div className='update-btn'>
                                        <Button variant="contained" onClick={handleEdit}>Update</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
        </>
    );
}