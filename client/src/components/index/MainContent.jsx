import "../../css/content.css";
import { useNavigate } from "react-router-dom";
export default function MainContent() {
  const navigate = useNavigate();
  return (
    <div className="main-content">
      <div className="content-div">
        <div className="left-side">
          <h1 id="body-title">THE ONLY WAY TO LEARN MATH IS TO DO MATH</h1>
          <div className="buttons">
              <button className="btn-body" onClick={() => navigate("/auth")}>Get Started Now</button>
          </div>
        </div>
      </div>
      <div className="content-div">
        <div className="content-img">
          <img className="m-content" src="/images/landing_pic.png" alt="pic" />
        </div>
      </div>
    </div>
  );
}
