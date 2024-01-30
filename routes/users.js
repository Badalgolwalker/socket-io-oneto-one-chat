var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/chat2")
var plm = require("passport-local-mongoose")
var userSchema = mongoose.Schema({
username:{
  type:String,
  required:true
},
email:{
  type:String,
  required:true
},
password:{
  type:String,
},
is_online:{
  type:String,
default:"0"
}
},
{timestamps:true})
userSchema.plugin(plm)
module.exports =mongoose.model("user",userSchema);
