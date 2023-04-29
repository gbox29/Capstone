import "../../css/devProfile.css";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
export default function Developers() {
  return (
    <div className="dev-prof">
      <Slide>
        <div className="each-slide-effect">
          <div className="slide-div">
            <div className="dev-pic">
              <img
                className="profile-pic"
                src= "/images/molin.jpg"
                alt="profile-pic"
              />
              <div className="dev-name">John Mac Molin Millares</div>
              <div className="dev-role">Developer</div>
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
}
