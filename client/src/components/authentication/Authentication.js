import Navbar from "../global/Navbar";
import "../../css/navbar.css";
import "../../css/auth/auth.css";
import Auth from "./Auth";
export default function Authentication() {
  return (
    <div className="container">
      <Navbar />
      <Auth isRegistered />
    </div>
  );
}
