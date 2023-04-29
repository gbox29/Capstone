import "../../css/features.css";
import Feature from "./Feature";
export default function Features() {
  return (
    <div className="container web-features">
      <Feature
        picture="/images/skill.png"
        header="Gain Real Skill"
        paragraph="Watch highly prepared videos based on DEPED curriciculum to gain skill
                  in mathematics for grades 1 to 3"
      />
      <Feature
        picture="/images/games.png"
        header="Get Entertain"
        paragraph="Play games to gain skills not just wasting your time on boring lectures"
      />
      <Feature
        picture="/images/computer.png"
        header="Access Anytime"
        paragraph="Take lessons on your desktop or laptop anytime and anywhere. Our course materials are available 24/7."
      />
    </div>
  );
}
