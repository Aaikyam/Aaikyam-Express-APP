const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/upload");
const mediaRoute = require("./routes/media");
const userRoute = require("./routes/user")
const app = express();

app.use(cors());
app.use(express.json());
app.use(mediaRoute)
app.use(uploadRoute)
app.use(userRoute)
// const hostname = '127.0.0.1'; // Your server ip address
const port = 3000;

app.get("/", (req, res) => {
  // set response content
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
