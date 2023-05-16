import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Axios from "axios";
import "../../css/admin/admin.css";


function isOverflown(element) {
    return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
    );
}

const GridCellExpand = React.memo(function GridCellExpand(props) {
    const { width, value } = props;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
    };

    const handleMouseLeave = () => {
        setShowFullCell(false);
    };

    React.useEffect(() => {
        if (!showFullCell) {
            return undefined;
        }

        function handleKeyDown(nativeEvent) {
            // IE11, Edge (prior to using Bink?) use 'Esc'
            if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
                setShowFullCell(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowFullCell, showFullCell]);

    return (
        <Box
            ref={wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                alignItems: 'center',
                lineHeight: '24px',
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
            }}
        >
            <Box
                ref={cellDiv}
                sx={{
                    height: '100%',
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                }}
            />
            <Box
                ref={cellValue}
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
                {value}
            </Box>
            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    anchorEl={anchorEl}
                    style={{ width, marginLeft: -17, zIndex: 15 }}
                >
                    <Paper
                        elevation={1}
                        style={{ minHeight: wrapper.current.offsetHeight - 3 }}
                    >
                        <Typography variant="body2" style={{ padding: 8 }}>
                            {value}
                        </Typography>
                    </Paper>
                </Popper>
            )}
        </Box>
    );
});

GridCellExpand.propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
};

function renderCellExpand(params) {
    return (
        <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
    );
}

renderCellExpand.propTypes = {
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: PropTypes.object.isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.string,
};

export default function AdminCourses() {
    const [lessonRecords, setLessonRecords] = useState([]);
    const [chapterRecords, setChapterRecords] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [flag, setFlag] = useState(false);

    const [modal, setModal] = React.useState(false);
    const [modal2, setModal2] = React.useState(false);

    Axios.defaults.withCredentials = true;

    useEffect(() => {
            const getResult = () => {
                Axios.get("https://mathflix.herokuapp.com/api/admin/lesson_records").then((response) => {
                    if (response.data.message) {
                        console.log(response.data.message)
                    }else{
                        setLessonRecords(response.data.result);
                    }
                });
            }
            const interval = setInterval(() => {
                getResult();
            }, 1000);
            return () => clearInterval(interval);

    }, []);

    const getChapters = (row) => {
        Axios.get("https://mathflix.herokuapp.com/api/admin/chapter_records", {
            params: {
                id: row.id
            }
        }).then(response => {
            if(response.data.message){
                console.log(response.data.message);
            }else{
                setChapterRecords(response.data.result);
            }
        }).catch(error => {
            console.log(error);
            alert(error);
        });
        setChapterRecords(chapterRecords);
        setFlag(!flag);
        toggleModal()
    }

    const getStudents = (row) => {
        Axios.get("https://mathflix.herokuapp.com/api/admin/student_list", {
            params: {
                id: row.id
            }
        }).then(response => {
            setStudentList(response.data.result);
        }).catch(error => {
            console.log(error);
            alert(error);
        });
        setStudentList(studentList);
        setFlag(!flag);
        toggleModal2()
    }


    const renderViewButton = (params) => {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => getChapters(params.row)}
                >
                    View Chapters
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => getStudents(params.row)}
                >
                    View Students
                </Button>
            </strong>

        )
    }

    const toggleModal = () => {
        setModal(!modal);
    }
    const toggleModal2 = () => {
        setModal2(!modal2);
    }

    const columns1 = [
        {
            field: 'id',
            key: 'id',
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
            field: 'grade_level',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'Grade Level'}
                </strong>
            ),
            width: 200,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'lesson_name',
            // headerName: 'First name',
            renderHeader: () => (
                <strong>
                    {'Lesson Name '}
                </strong>
            ),
            width: 300,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'date_created',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'Date Created'}
                </strong>
            ),
            width: 200,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            // headerName: 'Action',
            renderHeader: () => (
                <strong>
                    {'Action '}
                </strong>
            ),
            width: 500,
            renderCell: renderViewButton,
            disableClickEventBubbling: true,
            sortable: false,
            editable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
        },
    ];

    const columns2 = [
        {
            field: 'chapter_number',
            // headerName: 'First name',
            renderHeader: () => (
                <strong>
                    {'Chapter No'}
                </strong>
            ),
            width: 100,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'chapter_name',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'Chapter Name'}
                </strong>
            ),
            width: 150,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'description',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'Description'}
                </strong>
            ),
            width: 500,
            editable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderCellExpand,
        },
    ];
    const columns3 = [
        {
            field: 'count_data',
            // headerName: 'First name',
            renderHeader: () => (
                <strong>
                    {'No.'}
                </strong>
            ),
            width: 50,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'firstname',
            // headerName: 'First name',
            renderHeader: () => (
                <strong>
                    {'Firstname'}
                </strong>
            ),
            width: 220,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'lastname',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'Lastname'}
                </strong>
            ),
            width: 220,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'gender',
            // headerName: 'Last name',
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
            field: 'kindofuser',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'User Type'}
                </strong>
            ),
            width: 150,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'date_registered',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'Date Registered'}
                </strong>
            ),
            width: 220,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'date_enrolled',
            // headerName: 'Last name',
            renderHeader: () => (
                <strong>
                    {'Date Enrolled'}
                </strong>
            ),
            width: 250,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
    ];

    return (
        <>
            <Box sx={{ height: 600, width: '100%', zIndex: -1 }}>
                <div className='user-container'>
                    <div className='user-title'>
                        <h1>Course Section</h1>
                    </div>
                </div>
                <DataGrid
                    rows={lessonRecords}
                    columns={columns1}
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
            {/* Create Course Modal */}
            {modal && (
                <div className='modal'>
                    <div className="modal-content2">
                        <div className="modal-wrap">
                            <h2>View Chapters</h2>
                            <Box sx={{ height: 400, width: '100%', zIndex: -2 }}>
                                <DataGrid
                                    rows={chapterRecords}
                                    columns={columns2}
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
                            <div className='createCourse-btn'>
                                <div className='create-cancel-btns'>
                                    <div className='cancel-btn'>
                                        <Button variant='outlined' color='error' onClick={toggleModal}>Close</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
            {modal2 && (
                <div className='modal'>
                    <div className="modal-content3">
                        <div className="modal-wrap">
                            <h2>View Students</h2>
                            <Box sx={{ height: 400, width: '100%', zIndex: -5 }}>
                                <DataGrid
                                    rows={studentList}
                                    columns={columns3}
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
                            <div className='createCourse-btn'>
                                <div className='create-cancel-btns'>
                                    <div className='cancel-btn'>
                                        <Button variant='outlined' color='error' onClick={toggleModal2}>Close</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
        </>
    );
}