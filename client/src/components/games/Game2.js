import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Tenzies/Main';
import UserNavbar from '../global/UserNavbar';
import "../../css/games/Tenzies/App.css";


export default function Game2() {
    return (
        <>
        <UserNavbar/>
        <div className='Tenzies'>
            <Main/>  
        </div>
        
        </>
    )
}

