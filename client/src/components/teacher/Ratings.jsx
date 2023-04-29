export default function Ratings(props){
    //console.log(props.starsPercentage)
    return (
        <>
            <div className="rating-width rate-border">
                {props.starsPercentage[5]}%
            </div>
            <div className="rating-width rate-border">
                {props.starsPercentage[4]}%
            </div>
            <div className="rating-width rate-border">
                {props.starsPercentage[3]}%
            </div>
            <div className="rating-width rate-border">
                {props.starsPercentage[2]}%
            </div>
            <div className="rating-width rate-border">
                {props.starsPercentage[1]}%
            </div>  
            <div className="rating-width rate-border">
                {props.starsPercentage[0]}%
            </div>           
        </>
    );
}