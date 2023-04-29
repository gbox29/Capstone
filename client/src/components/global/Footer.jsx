//import "../../public/css/footer.css";
import "../../css/footer.css"
import { FaFacebookSquare, FaTwitter, FaInstagramSquare } from "react-icons/fa";
export default function Footer() {
  return (
    <div className="container">
      <div className="footer">
        <ul>
          <li>
            <FaFacebookSquare />
          </li>
          <li>
            <FaTwitter />
          </li>
          <li>
            <FaInstagramSquare />
          </li>
        </ul>
        <p>© Copyright 2022 Team IDK</p>
      </div>
    </div>
  );
}
