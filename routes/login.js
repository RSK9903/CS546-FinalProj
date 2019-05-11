const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const userData = data.users;

// router.use("/myprofile", function(req, res, next) {
//   if(req.session.authent) {
//     next();
//   } else {
//     res.status(403).send("Error: User is not Logged in.");
//   }
// });

router.get("/", (req,res) => {
  if(req.session.authent){
    res.redirect("/myProfile");
  } else {
    res.render("templates/login",{verified: false, title: "RMC | Login"});
  }
});

// router.get("/", (req,res) => {
//   if(req.session.authent) {
//     res.render("templates/index", {
//       verified: true
//     });
//   } else {
//     res.render("templates/index", {
//       verified: false
//     });
//   }
// });

//Once Login is implemented with backend, need to change variable verified to true so that the myprofile page pops up in place of Login.
router.post("/",  async (req,res) => {
  let form = req.body;
  try{
  if(!form.inputEmail || !form.inputPassword){
    res.render("templates/login" , {
          errors: true
        });
  } else {
    let match = false;
    let users = await userData.getAllUsers();
    for(let i=0;i<users.length;i++){
        let user = users[i];
        if(user.email == form.inputEmail){
            match = await bcrypt.compare(form.inputPassword, user.hashedPassword);
            if(match){
                req.session.authent = true;
                req.session.user = user;
                delete req.session.user.hashedPassword
                res.redirect("/myProfile");
                break;
            }
        }
    }
    if(!match){
      res.render("templates/login" , {
        errors: true
      });
    }
}} catch(e){
  res.render("templates/login" , {
    errors: true
  });
}
});

// router.post("/newAccount", async(req,res) => {
//     let form = req.body;
//     try {
//       const newUser = await userData.createUser(form.firstName, form.lastName, form.emailInput, form.passwordInput, form.Gender, form.yearInput, form.ageInput);
//       res.redirect("/");
//     } catch(e){
//       console.log(e);
//       res.redirect("/");
//     }   
// });

module.exports = router;