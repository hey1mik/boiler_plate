const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const config = require("./config/key");
const cookieParser = require("cookie-parser");

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected ...."))
  .catch((err) => console.log(err));
//mongodb+srv://kwon5943:<password>@cluster0.og98sw5.mongodb.net/?retryWrites=true&w=majority

const { User } = require("./models/User");
const bodyParser = require("body-parser");

// application/x-www-form-urlencoded 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 으로 된 것을 분석해서 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) =>
  res.send(
    "Hello World! 안녕하세요!!! 변화가 감지되나요? 실시간으로 감지되어야 합니다. 필요한 것은 한번의 새로고침입니다."
  )
);

app.post("/register", async (req, res) => {
  // 회원 가입할때 필요한 정보들을 clinet에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);
  //mongoDB 메서드, user모델에 저장
  const result = await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

app.post("/login", async (req, res) => {
  // 요청된 이메일이 데이터 베이스에 있는지 확인한다.
  const user = await User.findOne({ email: req.body.email }).then((user) => {
    console.log(user);

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 같은지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      } else {
        //비밀번호까지 맞다면 토큰을 생성하기.
        user.generateToken(res);
      }
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
