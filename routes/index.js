var express = require('express');
var router = express.Router();
var userModel = require("../routes/users")
var chatModel = require("../routes/chat")
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/register',async function(req, res, next) {
  var newUser = new userModel({
  username: req.body.username,
email:req.body.email
  })
 await userModel.register(newUser, req.body.password)
  .then(function(u){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/chatpage")
    })
  })
});

router.get('/chatpage',isLoggedIn, async function(req, res, next) {
  const Users = await userModel.find({ _id: { $nin: [req.user] } });
  res.render('chatpage', { user: req.user, Users });
    
});
router.post("/savechat", async (req,res,next)=>{
let chat = await chatModel.create({
  sender_id:req.body.sender_id,
  receiver_id: req.body.receiver_id,
  message:req.body.message
})
var newChat = await chat.save()
res.status(200).send({success:true,msg:'chat inserted',data:newChat})

})

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',passport.authenticate("local",{
  successRedirect: "/chatpage",
  failureRedirect: "/login"
}), function(req, res, next) {});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect("/login");
  }
}

module.exports = router;
