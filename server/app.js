const express = require('express')
const database = require("./config/database");

const app = express()
const host = '0.0.0.0';
const port = process.env.PORT || 5000;

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const saltRounds = 10;


const path = require('path');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: "dmg0ijhxv",
  api_key: "751298383814747",
  api_secret: "S-m5cPfbolRHvbCXGtaYMHlSSlE"
});

const storage = multer.diskStorage({
	filename: function (req,file,cb) {
		cb(null, file.originalname)
	}
});

const upload = multer({storage: storage});

const nodemailer = require("nodemailer");
const {EMAIL, PASSWORD} = require("./env.js");
const e = require('express');
const { error } = require('console');


app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.enable('trust proxy', 1);
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  proxy: true,
  name: 'mathflixcookiename',
  cookie: {
    sameSite: 'none',
    secure: true,
    httpOnly: false
  }
}));


let lessonId = 0;
let userId = 0;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let gmail = "";


app.post("/api/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const kindofuser = "teacher";
    const date = new Date();

    const statement = "SELECT * FROM user WHERE email = ?";
    database.query(statement,[email], (error,results) => {
      if(results.length > 0) {
        res.send({message: "Email already taken"})
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            console.log(err);
          }
          database.query(
            "insert into user (email,password,kindofuser,date_registered) VALUES (?,?,?,?)",
            [email,hash,kindofuser,date],
            (err, result) => {
              if (err){
                console.log(err);
              }else{
                res.send("1 Row Added!");
              }
            }
          );
        });
      }
    })
});


app.get("/api/login", (req,res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.setHeader('Access-Control-Allow-Origin', 'CORS_ORIGIN=http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.session.user) {
    userId = req.session.user[0].id
    //console.log("userId" + userId);
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false, user:req.session.user });
  }
});


app.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const kindofuser = 'teacher';
  const typeofuser = 'student';
  const adminuser = 'admin';

  // ...

  const login = () => {
    console.log('user email: ', email);
    console.log('user password: ', password);
    database.query(
      'SELECT * FROM user WHERE email = ? and (kindofuser = ? OR kindofuser = ? OR kindofuser = ?);',
      [email, kindofuser, typeofuser, adminuser],
      (err, result) => {
        if (err) {
          console.log(err);
        }

        if (result && result.length > 0 > 0) {
          console.log('login result: ', result);
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (error) {
              console.log(err);
            }
            if (response) {
              req.session.user = result;
              console.log('session', req.session.user);
              res.send({ result: result });
            } else {
              res.send({ message: 'Wrong username/password combination!' });
            }
          });
        } else {
          res.send({ message: "User doesn't exist" });
        }
      }
    );
  };

  try {
    login();
  } catch (error) {
    console.log('login error: ', error);
  }
});

app.post("/api/forgotPassword", (req, res) => {
  gmail = req.body.gmail;
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  });

  let mailOptions = {
    from: EMAIL,
    to: gmail,
    subject: 'Password Reset Request',
    text: 'You have requested a password reset. Please click the following link to reset your password: http://localhost:3000/resetPassword',
    html: '<p>You have requested a password reset. Please click the following link to reset your password:</p><p><a href="http://localhost:3000/auth/resetSuccess">http://localhost:3000auth/resetSuccess</a></p>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send({message: 'Error sending email'});
    } else {
      console.log('Message sent: %s', info.messageId);
      res.send({result:'Email sent successfully'});
    }
  });
});

app.put("/api/ResetPassword", (req,res) => {
  let password = 0;
  if(userId > 0) {
    password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      const statement = "UPDATE user SET password = ? WHERE id = ?";
      database.query(
        statement,
        [hash,userId],
        (err, result) => {
          if (err){
            res.send({err:err}); 
          }else{
            res.send("1 Row Updated!");
          }
        }
      );
    });
  } else {
    password = "123";
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      const statement = "UPDATE user SET password = ? WHERE email = ?";
      database.query(
        statement,
        [hash,gmail],
        (err, result) => {
          if (err){
            res.send({err:err}); 
          }else{
            res.send("1 Row Updated!");
          }
        }
      );
    });
  }
});

app.put("/api/settingsResetPassword", (req,res) => {
  pass = req.body.password
  if(req.session.user) {
    bcrypt.hash(pass, saltRounds, (err, hash) => {
      console.log(hash);
      if (err) {
        console.log(err);
      }
      const statement = "UPDATE user SET password = ? WHERE id = ?";
      database.query(
        statement,
        [hash,userId],
        (err, result) => {
          if (err){
            console.log(err);
            return; 
          }else{
            res.send("1 Row Updated!");
          }
        }
      );
    });
  } else {
    res.send({message:"user must login"});
  }
})

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
      console.log(err);
    }else{
      console.log("Lesson Created Succesfully")
    }
  })
}

app.get("/api/user/fetchLesson", (req,res) => {
  const fetchLesson = (cb, database) => {
    const statement = "SELECT * FROM view_createlesson WHERE user_id = ?";
    database.query(statement, userId, (err,result) => {
      if(err){
        cb(err);
      } else {
        cb(null, result);
      }
    });
  };
  
      // execute your query here
      fetchLesson((err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send({ message: 'An error occurred while fetching lesson data.' });
        } else if (result && result.length > 0) {
          res.send({ result: result });
        } else {
          res.send({ message: 'No lessons found.' });
        }
      }, database);
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

    const currentMonth = d.getMonth();	// Month	[mm]	(1 - 12)
    let day = d.getDate();		// Day		[dd]	(1 - 31)
    let year =d.getFullYear();

    console.log("/api/user/addChapter")

    const statement = "INSERT INTO tb_chapter (tbLesson_id, chapter_name, chapter_number, description, url, rating ,month,day,year) VALUES (?,?,?,?,?,?,?,?,?)";

    database.query(statement, [tb_lessonId,chapter_name,chapter_number,description,url,rating,currentMonth,day,year], 
      (err, result) => {
        if(err){
          console.log(err);;
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
  let currentMonth = 0;
  let chapterCount = [0,0,0,0,0,0,0,0,0,0,0,0]
  let year = new Date().getFullYear();

  if(req.session.user){
    const statement = "SELECT * FROM tb_chapter WHERE tbLesson_id = ?";
    database.query(statement,tb_lessonId,(err,result)=>{
      if(err){
        console.log(err);;
      }
      if(result.length > 0){
        if(year == result[0].year) {
          for(let i=0; i<result.length; i++) {
            currentMonth = months[result[i].month];
            for(let j=0; j<months.length; j++){
              switch(currentMonth) {
                case months[j] : 
                    chapterCount[j] += 1;
                    break;
                default:
                    break;              
              }
            }
          }
        }
        res.send({result:result, chapterCount:chapterCount});
      }
    })
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
        console.log(err);
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
        console.log(err);;
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
        console.log(err);
      }

      if(response.length > 0) {
        res.send({checker: false});
      } else {
        const statement = "INSERT INTO tb_enroll (user_id, lesson_id, date_enrolled) VALUES (?,?,?)";
        database.query(statement,[studentId,lessonId,date],(err,result)=> {
          if(err) {
            console.log(err);
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
        console.log(err);
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
    const currentMonth = d.getMonth();	// Month	[mm]	(1 - 12)
    let day = d.getDate();		// Day		[dd]	(1 - 31)
    let year =d.getFullYear();

    //console.log(chapter_id, + " " + userId + " " + rating + " " + date);
    if(req.session.user){
      const statement = "INSERT INTO tb_rate (chapter_id, user_id, comment, rate, month, day, year) VALUES (?,?,?,?,?,?,?)"
      database.query(statement,[chapter_id,userId,comment,rating,currentMonth, day, year], (err, result) => {
        if(err) {
          console.log(err);
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
        console.log(err);
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
          console.log(err);
        } else {
          res.send({message: "updated succesfully"});
        }
      })
    } else {
      res.send({ message: "User must login" });
    }

});

app.put("/api/user/editChapter", (req,res) => {
  const tb_lessonId = req.body.tb_lessonId;
  const chapter_name = req.body.chapter_name;
  const chapter_number = req.body.chapter_number;
  const description = req.body.description;
  const url = req.body.url;

  if(req.session.user) {
    const statement = "UPDATE tb_chapter SET chapter_name = ?, chapter_number = ?, description = ?, url = ? WHERE tbLesson_id = ?";
    database.query(statement, [chapter_name,chapter_number, description, url, tb_lessonId], (err,result) => {
      if(err) { 
        console.log(err);
      } else {
        res.send({result: "updated succesfully"});
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
          console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
      }
      if(result.length > 0){
        for(let i = 0; i<result.length; i++){
            if(result[i].gender === "Male") {
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
        console.log(err);
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

  if(req.session.user) {
    const statement = "DELETE FROM tb_enroll WHERE user_id = ? and lesson_id = ?";
    database.query(statement,[user_id,lessonId], (err,result)=>{
      if(err){
        console.log(err);
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
        console.log(err);
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
  let currentMonth = 0;
  let ratingCount = [0,0,0,0,0,0,0,0,0,0,0,0]
  let year = new Date().getFullYear();

  if(req.session.user){
    const statement = "SELECT * FROM user_comments WHERE lesson_id = ?";
    database.query(statement,[lessonId],(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result.length > 0){
        if(year == result[0].year) {
          for(let i=0; i<result.length; i++) {
            currentMonth = months[result[i].month];
            for(let j=0; j<months.length; j++){
              switch(currentMonth) {
                case months[j] : 
                    ratingCount[j] += 1;
                    break;
                default:
                    break;              
              }
            }
          }
        }
        res.send({result:result, ratingCount:ratingCount});
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
  let year = new Date().getFullYear();

  if(req.session.user){
    const statement = "SELECT * FROM user_quizzes WHERE lesson_id = ?";
    database.query(statement,[lessonId],(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result.length > 0){
        if(year == result[0].year) {
          for(let i=0; i<result.length; i++) {
            currentMonth = months[result[i].month];
            for(let j=0; j<months.length; j++){
              switch(currentMonth) {
                case months[j] : 
                    quizCount[j] += 1;
                    break;
                default:
                    break;              
              }
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


//profile
app.get("/api/user/profile", (req,res) => {
  if(req.session.user){
    const statement = "SELECT * FROM user_profile WHERE id = ?";
    database.query(statement,[userId], (err, result) => {
      if(err) {
        console.log(err);
      }
      if(result.length > 0){
        res.send({result: result});
      } else {
        res.send({message: "no result found"});
      }
    })
  } else {
    res.send({message: "User must login"});
  }
});

app.post("/api/user/uploadProfile", upload.single('image'), (req,res)=>{ //done
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const gender = req.body.gender;

    if(req.session.user) {
      cloudinary.uploader.upload(req.file.path, (error, result) => {
        try{
          if (error) {
            console.log(error);
          } else {
            const file = result.secure_url;
              const statement = "INSERT into profile (user_id,firstname,lastname,gender,pic) VALUES (?,?,?,?,?)";
              database.query(statement,[userId,firstname,lastname,gender,file], (err,result) => {
                try {
                  if(err){
                    console.log(err);
                  } else {
                    res.send({message: "Insert succesfully Please Refresh"})
                  }
                } catch (err) {
                  console.log(err);
                  res.status(500).send({ message: "Error inserting data into the database." });
                }
              })
          }
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Error in cloudinary." });
        }
      });
    } else {
      res.send({message: "User must login"});
    }
});



app.put("/api/user/editProfile", upload.single('image'), (req,res)=>{ //done
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const gender = req.body.gender;

  if(req.session.user){
    cloudinary.uploader.upload(req.file.path, (error, result) => { 
      try {
        if(error) {
          console.log(error);
        } else {
          const file = result.secure_url;
          const statement = "UPDATE profile SET firstname = ? , lastname = ?, gender = ?, pic = ? WHERE user_id = ?";
          database.query(statement,[firstname,lastname,gender,file,userId], (err,result) => {
            try {
              if(err){
                console.log(err);
              } else {
                res.send({message: "Updated succesfully Please Refresh"})
              }
            } catch (err) {
              console.log(err);
              res.status(500).send({ message: "Error updating data into the database." });
            }
          })
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in cloudinary." });
      }
    });
  } else {
    res.send({message: "User must login"});
  }
});


//new additional
app.get("/api/user/finishQuiz", (req,res) => {
  const chapterId = req.query.chapterId;

  if(req.session.user) {
    const statement = "SELECT * FROM tb_takequiz WHERE user_id = ? AND chapter_id = ?";
    database.query(statement, [userId,chapterId], (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        res.send({ result: result });
      } else {
        res.send({ message: "Record not found" });
      }
    })
  }
});


// ADMIN BACKEND
app.get("/api/admin/user_records", (req, res) => {
  if(req.session.user){
    const statement = "SELECT * FROM profile JOIN user ON profile.user_id = user.id";
      database.query(statement, userId, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send({ result: result });
        } else {
          res.send({ message: "Record not found" });
        }
      });
  } else {
    res.send({message: "User must login"});    
  }
});

app.post("/api/admin/create_records", (req, res) => {
  if(req.session.user) {
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const gender = req.body.gender;
  const password = "123";
  const email = req.body.email;
  const userType = req.body.userType;
  const date = new Date();

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    const stmt = "SELECT * FROM profile JOIN user ON profile.user_id = user.id WHERE profile.firstname = ? AND profile.lastname = ? AND " +
      "user.email = ? AND user.kindofuser = ?";
    database.query(stmt, [fname, lname, email, userType], (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length > 0) {
        res.send({ message: "Account Already Exists" });
      } else {
        const statement = "INSERT INTO user (email, password, kindofuser, date_registered) VALUES (?,?,?,?)";
        database.query(statement, [email, hash, userType, date], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const statement2 = "SELECT id FROM user WHERE email = ?"
            database.query(statement2, [email], (err, results) => {
              if (err) {
                console.log(err);
              } else {
                const user_id = results[0].id;
                const statement3 = "INSERT INTO profile (user_id, firstname, lastname, gender)VALUES (?,?,?,?)";
                database.query(statement3, [user_id, fname, lname, gender], (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send({ message: "Successfully Created!" });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
  } else {
    res.send({message: "User must login"});
  }
});


app.delete("/api/admin/delete_records", (req, res) => {
  if(req.session.user) {
    const the_id = req.query.id;
      const statement = "DELETE FROM user WHERE id = ?";
      database.query(statement, [the_id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ message: "Successfully Deleted!" });
        }
      });
  } else {
    res.send({message: "user must login"})
  }
});


app.put("/api/admin/edit_records", (req, res) => {
  if(req.session.user) {
    const the_id = req.body.id;
      const fname = req.body.firstname;
      const lname = req.body.lastname;
      const gender = req.body.gender;
      const email = req.body.email;
      const statement = "UPDATE profile JOIN user ON profile.user_id = user.id SET profile.firstname = ?, profile.lastname = ?, profile.gender = ?, user.email = ? WHERE profile.user_id = ?";
      database.query(statement, [fname, lname, gender, email, the_id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ message: "Successfully Updated!" });
        }
      });
  } else {
    res.send({message: "user must login"});
  }
});

app.put("/api/admin/resetPW_records", (req, res) => {
  if(req.session.user) {
  const the_id = req.body.id;
    //const lastname = req.body.lastname;
    const email = req.body.email;
    const password = "123";

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
        alert(err);
      }

      const statement = "UPDATE user SET user.password = ? WHERE user.id = ? AND user.email = ?";
      database.query(statement, [hash, the_id, email], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ message: "Password has been reset!" });
        }
      });
    });
  } else {
    res.send({message: "user must login"});
  }
});

app.get("/api/admin/total_users_data", (req, res) => {

  if(req.session.user) {
    const statement = "SELECT COUNT(*) AS num_users FROM user";
      database.query(statement, (err, result) => {
        if (err) {
          res.send({ message: err })
        }
        if (result.length > 0) {
          res.send({ result: result[0].num_users });
          console.log(result);
        } else {
          res.send({ message: "Record not found" });
        }
      });
  } else {
    res.send({message:"user must login first"});
  }
});

app.get("/api/admin/reg_users_data", (req, res) => {
    if(req.session.user) {
      const statement = "SELECT COUNT(date_registered) AS reg_users FROM user WHERE kindofuser = 'student'";
    database.query(statement, (err, result) => {
      if (err) {
        res.send({ message: err })
      }
      if (result.length > 0) {
        res.send({ result: result[0].reg_users });
        console.log(result);
      } else {
        res.send({ message: "Record not found" });
      }
    });
  } else {
    res.send({message:"user must login first"});
  }
});

app.get("/api/admin/enrolled_users_data", (req, res) => {

  const statement = "SELECT COUNT(date_enrolled) AS enrolled_users FROM tb_enroll";
  database.query(statement, (err, result) => {
    if (err) {
      res.send({ message: err })
    }
    if (result.length > 0) {
      res.send({ result: result[0].enrolled_users });
      console.log(result);
    } else {
      v
    }
  });

});

app.get("/api/admin/users_rate_data", (req, res) => {
  
  if(req.session.user) {
    const statement = "SELECT ROUND(AVG(rate), 2) as avg_rate FROM tb_rate";
      database.query(statement, (err, result) => {
        if (err) {
          res.send({ message: err })
        }
        if (result.length > 0) {
          res.send({ result: result[0].avg_rate });
          console.log(result);
        } else {
          res.send({ message: "Record not found" });
        }
      });
  } else {
    res.send({ message: "Record not found" });
  }
});

app.get("/api/admin/pie_data", (req, res) => {

  const statement = "SELECT user.kindofuser, COUNT(*) AS student_count FROM profile JOIN user ON profile.user_id = user.id WHERE user.kindofuser IN ('student', 'teacher') GROUP BY  user.kindofuser";
  database.query(statement, (err, result) => {
    if (err) {
      res.send({ message: err })
    }
    if (result.length > 0) {
      res.send({ result: result });
      console.log(result);
    } else {
      res.send({ message: "Record not found" });
    }
  });

});

app.get("/api/admin/linegraph_data", (req, res) => {

  const statement = "SELECT MONTHNAME(date_registered) AS month, COUNT(*) AS num_users FROM user GROUP BY MONTH(date_registered)";
  database.query(statement, (err, result) => {
    if (err) {
      res.send({ message: err })
    }
    if (result.length > 0) {
      res.send({ result: result });
      console.log(result);
    } else {
      res.send({ message: "Record not found" });
    }
  });

});

app.get("/api/admin/lesson_records", (req, res) => {
  if(req.session.user) {
    const statement = "SELECT * FROM tb_lesson";
      database.query(statement, (err, result) => {
        if (err) {
          res.send({ message: err })
        }
        if (result.length > 0) {
          res.send({ result: result });
          console.log(result);
        } else {
          res.send({ message: "Record not found" });
        }
      });
  } else {
    res.send({message: "user must login"})
  }
});

app.get("/api/admin/chapter_records", (req, res) => {
  if(req.session.user) {
    const the_id = req.query.id;
      const statement = "SELECT * FROM tb_chapter WHERE tbLesson_id = ?";
      database.query(statement, the_id, (err, result) => {
        if (err) {
          res.send({ message: err })
        }
        if (result.length > 0) {
          res.send({ result: result });
          console.log(result);
        } else {
          res.send({ message: "Record not found" });
        }
      });
  } else {
    res.send({message: "user must login"})
  }

});

app.get("/api/admin/student_list", (req, res) => {
  if(req.session.user) {
    const the_id = req.query.id;
      const usertype = 'student';
      const statement =
        "SELECT *,(SELECT COUNT(*) FROM profile " +
        "JOIN tb_enroll ON tb_enroll.user_id = profile.user_id " +
        "JOIN user ON profile.user_id = user.id " +
        "WHERE user.kindofuser = (?) AND tb_enroll.lesson_id = ?) as count_data " +
        "FROM profile JOIN tb_enroll ON  tb_enroll.user_id = profile.user_id " +
        "JOIN user ON profile.user_id = user.id  WHERE user.kindofuser = (?) AND tb_enroll.lesson_id = ? "
      database.query(statement, [usertype, the_id, usertype, the_id], (err, result) => {
        if (err) {
          res.send({ message: err })
        }
        if (result) {
          res.send({ result: result });
          console.log(result);
        }
      });
  } else {
    res.send({message: "user must login"})
  }

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, host, () => {
  console.log(`Example app listening on port ${port}`)
})