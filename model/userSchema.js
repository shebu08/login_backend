const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt =  require("bcryptjs")
const jwt = require("jsonwebtoken")
const keysecret = "sharikkhanshebukhanjhansinoidapunebangalore"


const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trime: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("not valid email");
      }
    },
  },
  password :{
    type: String,
    required: true,
    minlength :6,
  },
  cpassword :{
    type: String,
    required: true,
    minlength :6,
  },
  tokens : [{
    token : {
      type : String,
      require : true,

    }
  }]
});


// hash password 
userSchema.pre("save", async  function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,12)
  this.cpassword = await bcrypt.hash(this.cpassword,12);
  }
  
  next()
});

// Token generate 

userSchema.methods.generateAuthtoken = async function(){
  try {
    let token = jwt.sign({_id:this._id}, keysecret,{
      expiresIn : "1day"

    });
    this.tokens = this.tokens.concat({token : token});
    await this.save();
    return token
    
  } catch (error) {
    res.status(422).json(error)
    
  }
}


// Creating Model

const User = mongoose.model("User",userSchema);
module.exports = User

