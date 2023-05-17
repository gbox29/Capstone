import { useState } from 'react';
import Axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

export default function BasicTable(props) {
  const [rows] = useState(props.fetchStudentList)
  const [ownerRows] = useState(props.fetchOwner);

  const removeUser = (studentId) => {
    const result = window.confirm('Do you want to continue?');
    if (result) {
      Axios.delete("https://mathflix.herokuapp.com/api/user/userRemove", {
        params: {
          user_id : studentId,
          lessonId : props.lessonId
        }
      }).then((response) => {
          alert(response.data.message);
          props.setExpandStudentListDiv(false);
          document.location.reload(true);
      })
    } else {
      console.log('User clicked Cancel');
    }
  }



  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">Status</TableCell>
            {props.boolExpandOwner && (<TableCell align="right">Email</TableCell>)}
            {props.boolExpandOwner && (<TableCell align="right">Date Created</TableCell>)}
            {props.boolExpandStudent && (<TableCell align="right">Date Enrolled</TableCell>)}
            {props.boolExpandStudent && (<TableCell align="right">Action</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.boolExpandOwner && (
            <>
              {ownerRows.map((row) => (
                <TableRow
                  key={row.user_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.firstname} {row.lastname}
                  </TableCell>
                  <TableCell align="right">{row.gender}</TableCell>
                  <TableCell align="right">{row.kindofuser}</TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.date_created}</TableCell>
                  
                </TableRow>
                ))}
            </>
          )}
          {props.boolExpandStudent && (
            <>
                  {rows.map((row) => (
                    <TableRow
                      key={row.user_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.firstname} {row.lastname}
                      </TableCell>
                      <TableCell align="right">{row.gender}</TableCell>
                      <TableCell align="right">{row.kindofuser}</TableCell>
                      <TableCell align="right">{row.date_enrolled}</TableCell>
                      <TableCell align="right"><Button onClick={()=>{
                        removeUser(row.user_id);
                      }}>Remove</Button></TableCell>
                    </TableRow>
                  ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
