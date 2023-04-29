import {useEffect, useState} from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import Axios from "axios";

export default function Auth() {
  const navigate = useNavigate();
  const [userIsRegistered, setUserIsRegistered] = useState([
    {regState: true},
    {regState: false}
  ]);
  const [flag,setFlag] = useState(0)

  const[email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("asd");
  const [kindofuser] = useState("user");

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("http://localhost:5000/api/register",{
      email:email,
      password:password
    }).then((response) => {
      alert(response);
    });
  };

  const login = () => {
    Axios.post("http://localhost:5000/api/login", {
      email: email,
      password:password
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data.result[0].email);
        //console.log(response.data.result[0].email);
      }
    });
  };


  useEffect(() => {
    Axios.get("http://localhost:5000/api/login").then((response) => {
      if(response.data.loggedIn === true){

        //console.log(response.data.user[0].kindofuser);
        //console.log(response.data.user[0].id);
        navigate({
          pathname: "/user",
          search: `?${createSearchParams({kindofuser})}`, // inject code value into template
        },{state: {kindofuser : response.data.user[0].kindofuser}});
      }
    });
  });
  

  const submit = (state) =>{
    if(state){
      login();
    }else{
      register();
    }
  }

  return (
    <div className="container auth-form">
      <h1>{!userIsRegistered ? "Register" : "Login"}</h1>
      <input 
        type="text" 
        placeholder="email" 
        onChange={(e) => {
          setEmail(e.target.value);
        }}/>
      <input 
        type="text" 
        placeholder="Password" 
        onChange={(e) => {
          setPassword(e.target.value);
        }}  
      />
      {!userIsRegistered && (
        <input type="password" placeholder="Confirm Password" />
      )}

      <button type="submit" onClick={() => {
        submit(userIsRegistered);
      }}>
        {userIsRegistered ? "Login" : "Register"}
      </button>
      <p className="click-register" 
          onClick={() => {
            setUserIsRegistered(flag);
            setFlag(flag === 0 ? 1 : 0);
            }}>
          {!userIsRegistered ? "Already have an account?" : "Register here!"}
      </p>
      <p>{loginStatus}</p>
    </div>
  );
}
