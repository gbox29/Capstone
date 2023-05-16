import UserNavbar from "../global/UserNavbar";
import "../../css/games/games.css";    
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";

export default function Gameslist() {
    const navigate = useNavigate();

    return (
        <>
        <UserNavbar/>
            <div className="gameslist-container">
                <div className="gamebox-container">
                    <div className="gamebox">
                        Game 1
                        <div>
                            Game Pic
                        </div>
                        <div>
                        <Button variant="contained" onClick={() => {navigate('/games/game1')}}>
                          PLAY GAME
                        </Button>
                        </div>
                       
                    </div>
                    <div className="gamebox">
                        Game 2
                        <div>
                            Game Pic
                        </div>
                        <div>
                        <Button variant="contained" onClick={() => {navigate('/games/game2')}}>
                          PLAY GAME
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}