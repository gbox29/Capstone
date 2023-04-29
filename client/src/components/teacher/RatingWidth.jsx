export default function RatingWidth(props){
    return (
        <>
                                    <div className="rating-width">
                                        <div className="rate-div" style={{width: `${Number(props.starsRating[5]) * 20}%`}}></div>
                                    </div>
                                    <div className="rating-width">
                                        <div className="rate-div" style={{width: `${Number(props.starsRating[4]) * 20}%`}}></div>
                                    </div>
                                    <div className="rating-width">
                                        <div className="rate-div" style={{width: `${Number(props.starsRating[3] * 20)}%`}}></div>
                                    </div>
                                    <div className="rating-width">
                                        <div className="rate-div" style={{width: `${Number(props.starsRating[2]) * 20}%`}}></div>
                                    </div>
                                    <div className="rating-width">
                                        <div className="rate-div" style={{width: `${Number(props.starsRating[1]) * 20}%`}}></div>
                                    </div>
                                    <div className="rating-width">
                                        <div className="rate-div" style={{width: `${Number(props.starsRating[0]) * 20}%`}}></div>
                                    </div>
        
        </>
    )
}