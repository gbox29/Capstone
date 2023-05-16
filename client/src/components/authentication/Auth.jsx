import {useState} from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import Axios from "axios";

export default function Auth() {
  const navigate = useNavigate();
  const [userIsRegistered, setUserIsRegistered] = useState([
    {regState: true},
    {regState: false}
  ]);
  const [flag,setFlag] = useState(0)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPaswword,setConfirmPassword] = useState("")

  const [forgotPassword, setForgotPassword] = useState(false);

  const [loginStatus, setLoginStatus] = useState("");
  const [kindofuser] = useState("user");

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("https://mathflix.herokuapp.com/api/register",{
      email:email,
      password:password
    }).then((response) => {
        if(response.data.message){
          alert(response.data.message);
        }
    }).catch((error) => {
      console.log(error);
    });
  };

  const login = () => {
    Axios.post("https://mathflix.herokuapp.com/api/login", {
      email: email,
      password:password
    }).then((response) => {
      if (response.data.message) {
        //console.log(response) 
      } else {
        //console.log(response);
        setLoginStatus(response.data.result[0].email);
        UserLoggedIn();
        //console.log(response.data.result[0].email);
      }
    });
  };



  const UserLoggedIn = () => {
      Axios.get("https://mathflix.herokuapp.com/api/login").then((response) => {
        if(response.data.loggedIn === true){
          console.log(response.data.user[0].kindofuser);
          if(response.data.user[0].kindofuser === 'admin') {
            navigate("/admin/dashboard");
          } else {
            navigate({
              pathname: "/user",
              search: `?${createSearchParams({kindofuser})}`, // inject code value into template
            },{state: {kindofuser : response.data.user[0].kindofuser}});
          }
        }
      });
  }
  

  const submit = (state) =>{
    if(email.length === 0 || password.length === 0) {
      setLoginStatus("Please Input First")
    } else {
      if(state){
        login();
      }else{
        if(password === confirmPaswword){
          setUserIsRegistered(1);
          register();
        } else {
          setLoginStatus("Make sure that password and confirm password is the same")
        }
      }
    }
  }

  const forgotPass = () => {
    setLoginStatus("");
    setForgotPassword(!forgotPassword);
  }

  const submitEmail = () => {
    if(email.length === 0){
      setLoginStatus("Please dont forget to input your email")
    } else {
      Axios.post("https://mathflix.herokuapp.com/api/forgotPassword", {
        gmail: email,
      }).then((response) => {
        if(response.data.result){
          navigate("/auth/resetPassword");
        } else {
          setLoginStatus(response.data.message);
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  return (
    <div className="container auth-form">
      {forgotPassword ? (
        <>
        <h4>Input your email and we will send a link to reset your password</h4>
          <input 
            type="text" 
            placeholder="email" 
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button onClick={submitEmail}>Submit</button>
        </>
      ): (
        <>
        <h1>{!userIsRegistered ? "Register" : "Login"}</h1>
      <input 
        type="text" 
        placeholder="email" 
        onChange={(e) => {
          setEmail(e.target.value);
        }}/>
      <input 
        type="password" 
        placeholder="Password" 
        onChange={(e) => {
          setPassword(e.target.value);
        }}  
      />
      {!userIsRegistered && (
        <input type="password" placeholder="Confirm Password" onChange={(e) => {setConfirmPassword(e.target.value)}}/>
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
        </>
      )}
      <p onClick={forgotPass} style={{cursor:'pointer'}}>Forgot password?</p>
      <p>{loginStatus}</p>
    </div>
  );
}
