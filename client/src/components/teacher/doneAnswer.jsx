import "../../css/teacher/review.css";
export default function DoneAnswer(props){
    return (
    <>
        <div className="reviews-container">
            <div className="review-question">
                {props.number}) {props.question}
            </div>
            <div className="review-ans">
                <ul>
                    <li>A. {props.answerA}</li>
                    <li>B. {props.answerB}</li>
                    <li>C. {props.answerC}</li>
                    <li>D. {props.answerD}</li>
                    <li>Ans: {props.ans}</li>
                </ul>
            </div>
        </div>
    </>
    );
}