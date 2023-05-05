import Navbar from "../global/Navbar";
import "../../css/navbar.css";
import "../../css/auth/auth.css";
export default function Reset(){
    return (
        <div className="container">  
            <Navbar />
            <div className="container auth-form">
                <h1>Please go to your gmail account to reset your password</h1>
            </div>
        </div>
    );
}