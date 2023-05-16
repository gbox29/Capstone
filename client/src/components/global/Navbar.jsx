import {useEffect, useState} from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import Axios from "axios";
//import "../../public/css/navbar.css";
import "../../css/navbar.css"
import ExpandNavbar from "./ExpandNavbar";

export default function Navbar() {
  const navigate = useNavigate();
  const [kindofuser] = useState("user");
  const [captions, setCaptions] = useState([
    { buttonText: "+", text: "+" },
    { buttonText: "-", text: "-" }
  ]);
  const [flag, setFlag] = useState(0);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("https://mathflix.herokuapp.com/api/login").then((response) => {
      if(response.data.loggedIn === true){

        console.log(response.data.user[0].kindofuser);
        navigate({
          pathname: "/user",
          search: `?${createSearchParams({kindofuser})}`, // inject code value into template
        },{state: {kindofuser : response.data.user[0].kindofuser}});
      }
    });
  }, [kindofuser, navigate]);

  return (
    <div
      className="navigation-bar"
      style={
        captions[flag].buttonText === "-" ? { paddingBottom: "1px" } : null
      }
    >
      <ul>
        <li id="logo">
          <a href="/#">
            <span>Math</span>
            <span id="red-span">Flix</span>
          </a>
        </li>
        <li className="nav-link" id="list-hide">
          <div
            className="toggle"
            onClick={() => {
              setCaptions(captions);
              setFlag(flag === 0 ? 1 : 0);
            }}
          >
            {captions[flag].buttonText}
          </div>
        </li>
        <li className="nav-link nav-link-right">
          <a href="/#">Home</a>
        </li>
        <li className="nav-link nav-link-right">
          <a href="/#">Features</a>
        </li>
        <li className="nav-link nav-link-right">
          <a href="/#">Contact Us</a>
        </li>
      </ul>
      {captions[flag].buttonText === "-" ? <ExpandNavbar /> : null}
    </div>
  );
}
