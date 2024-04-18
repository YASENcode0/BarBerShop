const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3001 || 5000;
const user = require("./Schema/user");
const turn = require("./Schema/turn");
const bCrypt = require("bcrypt");

app.use(express.json());
timer();

mongoose
  .connect("mongodb://127.0.0.1:27017/barbusers")
  .then(() => {
    app.listen(port, () => {
      console.log("connect on port ", port);
    });
  })
  .catch((err) => {
    console.log("err connect db ", err);
  });

app.get("/getuser", (req, res) => {
  user.find().then((response) => {
    res.json({ data: response });
  });
});

app.post("/adduser", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    user.findOne({ email }).then(async (response) => {
      if (response) {
        res.json({ message: "email is wrong" });
      } else {
        const newUser = user();
        newUser.name = name;
        newUser.email = email.toLowerCase();
        newUser.password = await bCrypt.hash(password, 5);
        newUser.phone = phone;
        newUser.id = Date().slice(0, 24);

        console.log(newUser);
        await newUser.save();
        res.json(newUser);
      }
    });
  } catch (err) {
    res.json({ err }).status(500);
    console.log("err ", err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const getUser = await user.findOne({ email });
    console.log(getUser);
    if (getUser) {
      //get user ok
      if (await bCrypt.compare(password.toLowerCase(), getUser.password)) {
        res.json(getUser);
      } else {
        res.json({ message: "password or email wrong" });
      }
    } else {
      //get user not ok
      res.json({ message: "password or email wrong" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ err });
  }
});

app.get("/allturns", async (req, res) => {
  // abc();
  try {
    const data = await turn.find();
    res.json({ data });
  } catch (err) {
    console.log("err" + err);
  }
});

app.get("/getfreeturn", async (req, res) => {
  try {
    const data = await turn.find({ isFree: false });
    res.json(data);
  } catch (err) {
    console.log("err" + err);
    res.json({ err }).status(500);
  }
});

app.post("/addturn", async (req, res) => {
  try {
    const data = await turn.findOne({ isFree: false });

    if (!data) {
      res.send("no turns");
    } else {
      const { user } = req.body;

      data.isFree = true;
      data.user = user;
      data.save();
      res.json(data.date);
    }
  } catch (err) {
    console.log("err" + err);
    res.json({ err }).status(500);
  }
});

async function abc() {
  for (let i = 0; i <= 20; i += 5) {
    console.log(i);
    const newTurn = new turn();
    newTurn.isFree = false;
    newTurn.date = `10 : ${i}`;
    newTurn.user = null;
    await newTurn.save();
  }
}

async function timer() {
  setTimeout(async () => {
    await turn.deleteMany({});
    console.log(Date());
    abc();
    timer();
  }, 480000);
}

app.post("/getuserturns", async (req, res) => {
  try {
    const { id } = req.body;
    const turns = await turn.find({ user: id });

    console.log(turns);

    if (turns.length > 0) {
      res.json(turns);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.log("err" + err);
    res.json({ err }).status(500);
  }
});
