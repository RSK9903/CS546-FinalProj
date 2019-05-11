const courseRoutes = require("./courses");
const ratingRoutes = require("./ratings")
const loginRoutes = require("./login")
const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const router = express.Router();
const bcrypt = require("bcrypt");
const app = express();
const userData = require("../data/users.js");
const courseData = require("../data/courses.js")
const saltRounds = 16;

const constructorMethod = app => {
  app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
  }));

  app.use(function(req, res, next) {
    let date = new Date().toUTCString();
    let method = req.method;
    let route = req.originalUrl;
    let authent = (req.session.authent)? "(Authenticated User)" : "(Non-authenticated User)";
    console.log(`${date} ${method}  ${route} ${authent}`);
    next();
  });

  app.use("/courses", courseRoutes);
  app.use("/review", ratingRoutes);
  app.use("/login", loginRoutes)
  app.use("/", router);
  // app.use("*", (req, res) => {
  //   res.render("./templates/index");
  // });
};

router.get("/",(req, res) => {
  if(req.session.authent) {
    res.render("templates/index", {
      verified: true, title: "RateMyCourse"
    });
  } else {
    res.render("templates/index", {
      verified: false, title: "RateMyCourse"
    });
  }
  // res.render('templates/index',{title: "RateMyCourse"});
});

//Once Login is implemented with backend, need to change variable verified to true so that the myprofile page pops up in place of Login.
// router.get("/login", (req,res) => {
//   console.log("Login");
//   res.render("templates/login",{title: "RMC | Login"
// });


// router.get("/comment", (req,res) => {
//   console.log("Comments");
//   res.render("./templates/comment",{title: "RMC | "});
// });

router.get("/createAccount", (req,res) => {
  res.render("./templates/createAcc",{title: "RMC | Account Creation"});
});

router.get("/about", (req,res) => {
  res.render("./templates/about",{title: "RMC | About Us"});
});

// router.get("/coursePage", async(req,res) => {
//   try {
//     console.log("CoursePage");
//     const courseCollection = await courseData.getAllCourses();
//     res.render("./templates/coursePage",{title: "RMC | Courses"});
//   } catch(e) {
//     console.log(e);
//   }
// });

router.get("/myProfile", (req,res) => {
  if(req.session.authent){
      res.render("templates/myprofile",{title: "RMC | Profile", user: req.session.user});
  } else {
    res.redirect("/");
  }
});

router.get("/logout", (req,res) => {
  //  req.session.destroy();
    res.render("templates/logout",{title: "RMC | Logout"});
    return;
})

router.get("/courseInfo", (req,res) => {
  try {
    res.render("./templates/courseInfo",{title: "RMC | Course Info"});
  } catch(e) {
    console.log(e);
  }
});

router.post("/search", async (req, res) => {
  try{
    const courseCollection = await courseData.getAllCourses();
    const body = req.body.searchInput;
    for(let i = 0; i < courseCollection.length; i++){
      if(courseCollection[i].courseName == body || courseCollection[i].courseCode == body){
        const foundCourse = courseCollection[i];
        res.status(200).render("./templates/courseInfo", {
          name: foundCourse.courseName,
          code: foundCourse.courseCode,
          credits: foundCourse.credits,
          professors: foundCourse.professors,
          level: foundCourse.classLevel,
          rating: foundCourse.avgRating,
          description: foundCourse.description,
          web: foundCourse.webSection
        });
      }
      }
      // res.render("./templates/index", {
      //   errors2: true
      // });
    }
  catch(e){
      res.status(400);
  }
});


module.exports = constructorMethod;
