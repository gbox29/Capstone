export default function Feature(props) {
  return (
    <div className="feature-wrap">
      <div className="features feature-pic">
        <img src={props.picture} alt="pic" />
      </div>
      <div className="features feature-content">
        <h2>{props.header}</h2>
        <p>{props.paragraph}</p>
      </div>
    </div>
  );
}
