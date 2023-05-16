import Navbar from "../global/Navbar";
import { useNavigate } from "react-router-dom";
import "../../css/navbar.css";
import "../../css/auth/auth.css";
import Axios from "axios";

export default function Reset(){
    const navigate = useNavigate();
    const confirmReset = () =>{
        Axios.put("https://mathflix.herokuapp.com/api/ResetPassword")
            .then((response) => {
                if(!response.data.err){
                    navigate("/auth");
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                console.log(error);
            })

    }

    return (
        <div className="container">  
            <Navbar />
            <div className="container auth-form">
                <h1>Congratulations for succesfully reseting your password</h1>
                <p style={{cursor:'pointer'}} onClick={confirmReset}>Click here to login</p>
            </div>
        </div>
    );
}