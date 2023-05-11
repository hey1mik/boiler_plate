const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxlength: 70,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    // 비밀번호를 암호화 시킨다.
    console.log("들어왔음!!");
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  console.log("들어왔음!");
  // plainPassword 123456789, 암호화된 비밀번호 $2b$10$buTKYux7iHoAcO6fIB3G0eo2KWyIbtBJgTKYzBrPYgJxCoH4SNLNS
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) {
      return err;
    } else {
      console.log("isMatch?" + isMatch);
      cb(null, isMatch);
    }
  });
};

// userSchema.methods.generateToken = async function (cb) {
//   // jsonwebtoken을 이용해서 token을 생성하기
//   var user = this;
//   var token = jwt.sign(user.toString(), "secretToken");

//   user.token = token;
//   await user.save(user);
// };

const User = mongoose.model("User", userSchema);
module.exports = { User };
