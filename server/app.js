const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const { response } = require("express");
const saltRounds = 10;

const database = require(__dirname + '/database.js');

const app = express();
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT" ,"DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "skeet",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1200 * 1200 * 24,
    },
  })
);

let lessonId = 0;
let userId = 85;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

app.post("/api/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const kindofuser = "teacher";
    const date = new Date();
  
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      database.query(
        "insert into user (email,password,kindofuser,date_registered) VALUES (?,?,?,?)",
        [email,hash,kindofuser,date],
        (err, result) => {
          if (err){
            res.send({err:err}); 
          }else{
            res.send("1 Row Added!");
          }
        }
      );
    });
});


app.get("/api/login", (req,res) => {
  if (req.session.user) {
    userId = req.session.user[0].id
    //console.log("userId" + userId);
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const kindofuser = "teacher";
  const typeofuser = "student";


  database.query(
    "SELECT * FROM user WHERE email = ? and (kindofuser = ? OR kindofuser= ?);",
    [email,kindofuser,typeofuser], 
    (err,result) =>{
      if(err){
        res.send({ err: err });
      }

      if(result.length > 0){
        bcrypt.compare(password, result[0].password, (error, response) => {
          if(error) {
            res.send(error);
          }
          if(response) {
            req.session.user = result;
            //console.log(result);
            res.send({result : result});
          }else{
            res.send({ message: "Wrong username/password combination!" });
          }
        })
      } else {
        res.send({ message: "User doesn't exist" });
      }
  })


});

/*
  Teacher side
*/

app.post("/api/user/createLesson", (req,res) => {
  const lesson = req.body.lesson;
  const glevel = req.body.glevel;
  const date = new Date();

  if (req.session.user) {
    database.query(
      "INSERT INTO tb_lesson (lesson_name, grade_level,date_created) VALUES (?,?,?)", 
      [lesson,glevel,date], 
      (err,result) => {
        if (err){
          res.send({err:err}); 
        }else{
          database.query(
            "SELECT id from tb_lesson WHERE lesson_name = ? and grade_level = ? and date_created = ?",
            [lesson,glevel,date],
            (error,results) => {
              if(results.length > 0){
                  lessonId = results[0].id;
                  createLesson(lessonId,userId);
                  res.send({message: "Lesson Created Succesfully", lessonId});
              }
            }
          )
        }
    }); 
  } else {
      res.send({message: "User must login"});
  }
});


const createLesson = (lessonId, userId) => {
  const statement = "INSERT INTO tb_createlesson (lesson_id,user_id) VALUES (?,?)";
  database.query(statement,[lessonId,userId],(err,res)=>{
    if(err){
      console.log(err)
    }else{
      console.log("Lesson Created Succesfully")
    }
  })
}


app.get("/api/user/fetchLesson", (req,res) => {
    if(req.session.user) {
      const statement = "SELECT * FROM view_createlesson WHERE user_id = ?";
      database.query(statement, userId, (err,result) => {
        if(err){
          res.send({message: err})
        }
        if(result.length > 0){
          res.send({result : result});
          //console.log(result);
        }else{
          res.send({message: "No lesson found"});
        }
      });
    } else {
      res.send({message: "User must login"});
    }
});

app.post("/api/user/addChapter", (req,res) => {
  if(req.session.user){
    const tb_lessonId = req.body.tb_lessonId;
    const chapter_name = req.body.chapter_name;
    const chapter_number = req.body.chapter_number;
    const description = req.body.description;
    const url = req.body.url;
    const rating = 0;
    const d = new Date();

    const currentMonth = months[d.getMonth()];	// Month	[mm]	(1 - 12)
    let day = d.getDate();		// Day		[dd]	(1 - 31)
    let year =d.getFullYear();

    console.log("/api/user/addChapter")

    const statement = "INSERT INTO tb_chapter (tbLesson_id, chapter_name, chapter_number, description, url, rating ,month,day,year) VALUES (?,?,?,?,?,?,?,?,?)";

    database.query(statement, [tb_lessonId,chapter_name,chapter_number,description,url,rating,currentMonth,day,year], 
      (err, result) => {
        if(err){
          res.send({message:err});
        } else {
          res.send({message:"Chapter Inserted Succesfully"});
        }
      });
  } else {
    res.send({message: "User Must Login"});
  }
});


app.get("/api/user/fetchChapter", (req,res) => {
  const tb_lessonId = req.query.tb_lessonId;
  if(req.session.user){
    const statement = "SELECT * FROM tb_chapter WHERE tbLesson_id = ?";
    database.query(statement,tb_lessonId,(err,result)=>{
      if(err){
        res.send({message:err});
      }
      if(result.length > 0){
        res.send({result:result});
      }
    });
  } else {
    res.send({message: "User must login"});
  }
});


app.delete("/api/user/delete", (req,res) => {
  const lessonId = req.query.lessonId;
  //console.log(lessonId);
  if(req.session.user) {
    const statement = "DELETE FROM tb_lesson WHERE id = ?";
    database.query(statement,lessonId, (err,result)=>{
      if(err){
        res.send({message:err})
      } else {
        res.send({message: 'Deleted Succesfully'});
      }
      
    });
  }
});

app.delete("/logout", (req,res)=> {
  req.session.destroy()
  res.send("Session Destroy")
});

app.get("/api/user/searchStudent",(req,res) => {
  const data = req.query.student;
  const kindofuser = "student";
  //console.log(data);


  if(req.session.user){
    const statement = "SELECT * FROM user_profile WHERE (email = ? OR firstname = ? OR lastname = ? or (firstname = ? and lastname = ?)) AND kindofuser = ? ";
    database.query(statement,[data,data,data,data.split(" ")[0], data.split(" ")[1],kindofuser],(err,result)=>{
      if(err){
        res.send({message:err});
      }
      if(result.length > 0){
        res.send({result:result});
      } else {
        res.send({message: "no result found"});
      }
    });
  } else {
    res.send({message: "User must login"});
  }
});

app.post("/api/user/enrollStudent", (req,res) => {
  const studentId = req.body.studentId;
  const lessonId = req.body.lessonId;
  const date = new Date();

  if(req.session.user){
    const statementChecker = "SELECT * FROM user_enrolled WHERE user_id = ? AND lesson_id = ?";
    database.query(statementChecker, [studentId, lessonId], (error, response) => {
      if(error) {
        res.send({message: err})
      }

      if(response.length > 0) {
        res.send({checker: false});
      } else {
        const statement = "INSERT INTO tb_enroll (user_id, lesson_id, date_enrolled) VALUES (?,?,?)";
        database.query(statement,[studentId,lessonId,date],(err,result)=> {
          if(err) {
            res.send({message: err})
          } else {
            res.send({message: "User enrolled succesfully"});
            console.log("user enrolled succesfully");
          }
        })
      }

    })
  } else {
    res.send({message: "User must login"});
  }
})

app.get("/api/user/studentEnrolled", (req,res) => {
  if(req.session.user) {
    const statement = "SELECT * FROM user_enrolled WHERE user_id = ?";
    database.query(statement, userId, (err,result) => {
      if(err){
        res.send({message: err})
      }
      if(result.length > 0){
        res.send({result : result});
        //console.log(result);
      }else{
        res.send({message: "No lesson found"});
      }
    });
  } else {
    res.send({message: "User must login"});
  }
});

app.post("/api/user/rateChapter", (req,res) => {
    const chapter_id = req.body.chapter_id;
    const comment = req.body.comment;
    const rating = req.body.rating;
    const d = new Date();
    const currentMonth = months[d.getMonth()];	// Month	[mm]	(1 - 12)
    let day = d.getDate();		// Day		[dd]	(1 - 31)
    let year =d.getFullYear();

    //console.log(chapter_id, + " " + userId + " " + rating + " " + date);
    if(req.session.user){
      const statement = "INSERT INTO tb_rate (chapter_id, user_id, comment, rate, month, day, year) VALUES (?,?,?,?,?,?,?)"
      database.query(statement,[chapter_id,userId,comment,rating,currentMonth, day, year], (err, result) => {
        if(err) {
          res.send({message: err})
        } else {
          res.send({message: "Comment insert succesfully"});
          console.log("Comment Insert Succesflly");
        }       
      })
    } else {
      res.send({message: "User must login"});
    }
});

//browse here
app.delete("/api/user/deleteChapter", (req, res) => {
  const chapterId = req.query.chapterId
  //console.log(chapterId);
  if (req.session.user) {
      const statement = "DELETE FROM tb_chapter WHERE id = ?";
      database.query(statement, [chapterId], (err, result) => {
        if (err) {
          res.send({ message: err })
        } else {
          res.send({ message: 'Deleted successfully' });
        }
      });
  } else {
    res.send({ message: "User must login" });
  }
});


app.get("/api/user/fetchUserRatings", (req, res) => {
  const chapter_id = req.query.chapter_id;
  const ratings = [0, 0, 0, 0, 0, 0];
  const ratingPercentages = [];
  const ratingPercentageTwo = [];
  let sum = 0;

  //console.log(chapter_id);

  if (req.session.user) {
    const statement = "SELECT * FROM user_comments WHERE chapter_id = ?";
    database.query(statement, [chapter_id], (err, result) => {
      if (err) {
        res.send({ message: err });
      }

      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          ratings[result[i].rate] += 1;
        }


        for (let i = 0; i < ratings.length; i++) {
          const ratingPercentage = (ratings[i] / result.length) * 100 / 20;
          const ratingPercentageTwoValue = (ratings[i] / result.length) * 100;
          ratingPercentages.push(ratingPercentage.toFixed(2));
          ratingPercentageTwo.push(ratingPercentageTwoValue.toFixed(0));

        }

        for (let i=0; i<result.length; i++) {
          //console.log(result[i].rate);
          sum += result[i].rate;
        }


        const totalRate =  (sum / result.length);

        res.send({
          result: result,
          ratings: ratings,
          ratingPercentages: ratingPercentages,
          ratingPercentageTwo: ratingPercentageTwo,
          totalRate : totalRate
        });
      } else {
        res.send({ message: "No lesson found" });
      }
    });
  } else {
    res.send({ message: "User must login" });
  }
});

//create edit chapter 
app.put("/api/user/editChapterStar", (req, res) => {
    const rating = req.body.rating;
    const chapter_id = req.body.chapter_id;
    if(req.session.user) {
      const statement = "UPDATE tb_chapter SET rating = ? WHERE id = ?";
      database.query(statement, [rating,chapter_id], (err,result) => {
        if(err) { 
          res.send({message: err})
        } else {
          res.send({message: "updated succesfully"});
        }
      })
    } else {
      res.send({ message: "User must login" });
    }

});

app.delete("/api/user/deleteComment", (req, res) => {
  const ratingId = req.query.ratingId;
  const user_id = req.query.user_id;
  
  if (req.session.user) {
    if (user_id == userId) { // using double equal sign for loose equality comparison
      const statement = "DELETE FROM tb_rate WHERE id = ? and user_id = ?";
      database.query(statement, [ratingId, userId], (err, result) => {
        if (err) {
          res.send({ message: err })
        } else {
          res.send({ message: 'Deleted successfully' });
        }
      });
    } else {
      res.send({ message: "You can't delete this comment" });
    }
  } else {
    res.send({ message: "User must login" });
  }
});

app.put("/api/user/updateComment", (req,res) => {
  const newComment = req.body.newComment;
  const newRating = req.body.newRating;
  const commentId = req.body.commentId;
  const user_id = req.body.user_id;
  //console.log(user_id);
  if(req.session.user) {
    if(user_id === userId) {
      const statement = "UPDATE tb_rate SET comment = ?, rate = ? WHERE id = ? and user_id = ?";
      database.query(statement, [newComment,newRating,commentId,userId], (err,result) => {
        if(err) { 
          res.send({message: err})
        } else {
          res.send({message: "Updated Succesfully"});
        }
      })
    } else {
        res.send({message: "You cant update this comment"});
    }
  } else {
    res.send({ message: "User must login" });
  }
});

app.post("/api/user/addQuiz", (req,res) => {
  const chapterId = req.body.chapterId;
  const question = req.body.question;
  const number = req.body.number;
  const optionA = req.body.optionA;
  const optionB = req.body.optionB;
  const optionC = req.body.optionC;
  const optionD = req.body.optionD;
  const answer = req.body.answer;
  const ans = answer.toLowerCase();

  if(req.session.user) {
    const statement = "INSERT INTO tb_quiz (chapter_id,Question,number,OptionA,OptionB, OptionC, OptionD, Answer) VALUES (?,?,?,?,?,?,?,?)";
    database.query(statement, [chapterId,question,number,optionA,optionB,optionC,optionD,ans], (err,result) => {
      if(err) {
        res.send({message: err})
      } else {
        res.send({message: "Quiz insert succesfully"});
        console.log("Quiz Insert Succesflly");
      } 
    })
  } else {
    res.send({ message: "User must login" });
  }
});

app.get("/api/user/fetchQuiz", (req,res) => {
  const chapterId = req.query.chapterId;
  //console.log(chapterId)
  if(req.session.user) {
    const statement = "SELECT * FROM tb_quiz WHERE chapter_id = ? ORDER BY number";
    database.query(statement, [chapterId], (err, result) => {
      if(err) {
        res.send({message: err})
      }
      
      if(result.length > 0) {
        res.send({result:result, length: result.length})
      } else {
        res.send({message: "no quiz found"});
        //console.log("no quiz found");
      }
    })
  } else {
    res.send({message: "User must login"});
  }
});


app.post("/api/user/takeQuiz", (req,res) => {
    const chapterId = req.body.chapterId;
    const d = new Date();
    const currentMonth = d.getMonth();	// Month	[mm]	(1 - 12)
    let day = d.getDate();		// Day		[dd]	(1 - 31)
    let year =d.getFullYear();


    if(req.session.user) {
      const statement = "INSERT INTO tb_takequiz (user_id,chapter_id,month,day,year) VALUES (?,?,?,?,?)";
      database.query(statement,[userId,chapterId,currentMonth,day,year],(err,result)=>{
        if(err){
          console.log(err)
        }else{
          res.send({message: "You may now start the quiz"})
          console.log("You may now start the quiz");
        }
      });
    } else {
      res.send({message: "User must login"});
    }
})

//answer quiz
app.get("/api/user/answerQuiz", (req,res) => {
  const chapterId = req.query.chapterId;
  const currentPage = req.query.currentPage; 
  
  if(req.session.user) {
    const statement = "SELECT * FROM tb_quiz WHERE number = ? and chapter_id = ?";
    database.query(statement, [currentPage,chapterId], (err, result) => {
      if(err) {
        res.send({message: err})
      }
      
      if(result.length > 0) {
        res.send({result:result})
      } else {
        res.send({message: "no quiz found"});
        //console.log("no quiz found");
      }
    })
  } else {
    res.send({message: "User must login"});
  }
});


app.delete("/api/user/deleteQuestion", (req, res) => {
  const id = req.query.id;
  const chapterId = req.query.chapterId;
  //console.log("id = " + id);
  //console.log("chapterId = " + chapterId);
  if (req.session.user) {
// using double equal sign for loose equality comparison
      const statement = "DELETE FROM tb_quiz WHERE id = ? and chapter_id = ?";
      database.query(statement, [id, chapterId], (err, result) => {
        if (err) {
          res.send({ message: err })
        } else {
          res.send({ message: 'Deleted successfully' });
        }
      });
  } else {
    res.send({ message: "User must login" });
  }
});

app.delete("/api/user/deleteAllQuestion", (req, res) => {
  const chapterId = req.query.chapterId;
  if (req.session.user) {
      const statement = "DELETE FROM tb_quiz WHERE chapter_id = ?";
      database.query(statement, [chapterId], (err, result) => {
        if (err) {
          res.send({ message: err })
        } else {
          res.send({ message: 'Deleted successfully' });
        }
      });
  } else {
    res.send({ message: "User must login" });
  }
});

app.put("/api/user/editQuestion", (req, res) => {
  const id = req.body.id;
  const question = req.body.question;
  const number = req.body.number;
  const optionA = req.body.optionA;
  const optionB = req.body.optionB;
  const optionC = req.body.optionC;
  const optionD = req.body.optionD;
  const answer = req.body.answer;

  if(req.session.user) {
    const statement = "UPDATE tb_quiz SET Question = ?, number = ? ,OptionA = ?, OptionB = ?, OptionC = ?, OptionD = ?, Answer = ?  WHERE id = ?";
    database.query(statement, [question,number,optionA,optionB,optionC,optionD,answer,id], (err,result) => {
      if(err) { 
        res.send({message: err})
      } else {
        res.send({message: "updated succesfully"});
      }
    })
  } else {
    res.send({ message: "User must login" });
  }

});





//analytics
app.get("/api/user/userEnrolled",(req,res) => {
  lessonId = req.query.lessonId;
  kindofuser = req.query.kindofuser;

  let male = 0;
  let female = 0;
  if(req.session.user) {
    const statement = "SELECT * FROM user_enrolled WHERE lesson_id = ? AND kindofuser = ?";
    database.query(statement,[lessonId, kindofuser], (err,result) => {
      if(err){
        res.send({message: err})
      }
      if(result.length > 0){
        for(let i = 0; i<result.length; i++){
            if(result[0].gender === "Male") {
              male+=1;
            } else {
              female+=1;
            }
        }
        res.send({result : result, maleCount : male, femaleCount : female});
      }else{
        res.send({message: "No lesson found"});
      }
    })
  } else {
    res.send({message: "User must login"});
  }
});

app.get("/api/user/lessonOwner",(req,res) => {
  lessonId = req.query.lessonId;
  if(req.session.user) {
    const statement = "SELECT * FROM view_createlesson WHERE id = ? ";
    database.query(statement,[lessonId], (err,result) => {
      if(err){
        res.send({message: err})
      }
      if(result.length > 0){
        res.send({result : result});
      }else{
        res.send({message: "No lesson found"});
      }
    })
  } else {
    res.send({message: "User must login"});
  }
});

app.delete("/api/user/userRemove", (req,res)=> {
  const user_id = req.query.user_id;
  const lessonId = req.query.lessonId;

  console.log(lessonId)
  if(req.session.user) {
    const statement = "DELETE FROM tb_enroll WHERE user_id = ? and lesson_id = ?";
    database.query(statement,[user_id,lessonId], (err,result)=>{
      if(err){
        res.send({message:err})
      } else {
        res.send({message: 'Deleted Succesfully'});
      }
      
    });
  }
});


app.get("/api/user/searchEnrolledStudent",(req,res) => {
  const data = req.query.data;
  const kindofuser = "student";
  const lessonId = req.query.lessonId;
  console.log(data);


  if(req.session.user){
    const statement = "SELECT * FROM user_enrolled WHERE (firstname = ? OR lastname = ? or (firstname = ? and lastname = ?)) AND kindofuser = ? AND lesson_id = ?";
    database.query(statement,[data,data,data.split(" ")[0], data.split(" ")[1],kindofuser,lessonId],(err,result)=>{
      if(err){
        res.send({message:err});
      }
      if(result.length > 0){
        res.send({result:result});
      } else {
        res.send({message: "no result found"});
      }
    });
  } else {
    res.send({message: "User must login"});
  }
});


app.get("/api/user/fetchUserComments",(req,res) => {
  const lessonId = req.query.lessonId;

  if(req.session.user){
    const statement = "SELECT * FROM user_comments WHERE lesson_id = ?";
    database.query(statement,[lessonId],(err,result)=>{
      if(err){
        res.send({message:err});
      }
      if(result.length > 0){
        res.send({result:result});
      } else {
        res.send({message: "no result found"});
      }
    });
  } else {
    res.send({message: "User must login"});
  }
});

app.get("/api/user/fetchUserAllQuizzes",(req,res) => {
  const lessonId = req.query.lessonId;
  let currentMonth = 0;
  let quizCount = [0,0,0,0,0,0,0,0,0,0,0,0]
  if(req.session.user){
    const statement = "SELECT * FROM user_quizzes WHERE lesson_id = ?";
    database.query(statement,[lessonId],(err,result)=>{
      if(err){
        res.send({message:err});
      }
      if(result.length > 0){
        for(let i=0; i<result.length; i++) {
          currentMonth = months[result[i].month];
          for(let j=0; j<months.length; j++){
            switch(currentMonth) {
              case months[j] : 
                  quizCount[j] += 1;
                  break;
              default:
                  // Do something if the month is not recognized
                  console.log("Current month is not recognized");
                  break;              
            }
          }
        }
        res.send({result:result, quizCount:quizCount});
      } else {
        res.send({message: "no result found"});
      }
    });
  } else {
    res.send({message: "User must login"});
  }
});

app.listen(port, () => {
  console.log("running server");
});

