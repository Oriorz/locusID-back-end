const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
const { MONGOURI } = require("./config/key");

require("./models/user");
require("./models/post");
//require('./models/link')

app.use(express.json({ limit: "1000kb" }));
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
//app.use(require('./routes/link'))

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongoe yeah");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

/* if(process.env.NODE_ENV == "production"){
  app.use(express.static('client/build'))
  const path = require('path') 
  app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname,"client", 'build', 'index.html'))
  })
} */

app.listen(PORT, () => {
  const path = require("path");
  console.log("this programme  is running on ", PORT);
  console.log(path.resolve(__dirname));
});
