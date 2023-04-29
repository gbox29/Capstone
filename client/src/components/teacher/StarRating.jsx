import Rating from '@mui/material/Rating';


export default function StarRating(props){

    //console.log(props)

    return (
        <>
            <Rating 
                name="read-only" 
                value={Number(props.starsRating[5])} 
                readOnly
                sx={{
                    marginBottom: '2px'
                }} 
            />
            <Rating 
                name="read-only" 
                value={Number(props.starsRating[4])} 
                readOnly
                sx={{
                    marginBottom: '2px'
                }}  
            />  
            <Rating 
                name="read-only" 
                value={Number(props.starsRating[3])} 
                readOnly 
                sx={{
                    marginBottom: '2px'
                }} 
            />   
            <Rating 
                name="read-only" 
                value={Number(props.starsRating[2])} 
                readOnly
                sx={{
                    marginBottom: '2px'
                }}  
            />   
            <Rating 
                name="read-only" 
                value={Number(props.starsRating[1])} 
                readOnly 
                sx={{
                    marginBottom: '2px'
                }} 
            />   
            <Rating 
                name="read-only" 
                value={Number(props.starsRating[0])} 
                readOnly 
                sx={{
                    marginBottom: '2px'
                }} 
            />                       
        </>
    );
}