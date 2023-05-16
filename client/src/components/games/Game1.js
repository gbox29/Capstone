import React from 'react';
import ReactDOM from 'react-dom';
import MainBoard from './2048/mainBoard';
import UserNavbar from '../global/UserNavbar';


export default function Game1() {
    return (
        <>
        <UserNavbar/>
        
            
        
            <div id='boardDiv'>
                <div className='theinstructions'>
                <center><h1>2048 game</h1></center>
                    <h3>Instructions:</h3>
                    <p>1. Use Arrow Keys(left, right, up, down) to move blocks</p>
                    <p>2. Add tiles Until you can reach 2048</p>
                    <p>3. Try again if stuck</p>    
                </div>
                <MainBoard />
            </div>

        </>
    )
}

