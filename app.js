const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/upload");
const mediaRoute = require("./routes/media");
const app = express();

app.use(cors());
app.use(express.json());
app.use(mediaRoute)
app.use(uploadRoute);

// const hostname = '127.0.0.1'; // Your server ip address
const port = 3001;

app.get("/", (req, res) => {
  // set response content
  res.send(
    `<html>
        <body>
            <h1>Welcome to Aaikyam Backend Server!!!!</h1>
            </div>
        </body>
    </html>`
  );
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
