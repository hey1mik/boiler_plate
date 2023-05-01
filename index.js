const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://kwon5943:gpdnjsdlek2^@cluster0.og98sw5.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected ...."))
  .catch((err) => console.log(err));
//mongodb+srv://kwon5943:<password>@cluster0.og98sw5.mongodb.net/?retryWrites=true&w=majority

const { User } = require("./models/User");
const bodyParser = require("body-parser");

// application/x-www-form-urlencoded 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 으로 된 것을 분석해서 가져옴
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World! 안녕하세요!!!"));

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
