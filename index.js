require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const app = express();
const router = require("./routes/index");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const sendEmail = require("./services/email");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// socket.io
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("A user connected");
  // Join a room
  socket.on("joinRoom", (room) => {
    console.log(`${socket.id} just joined room ${room}`);

    socket.join(room);

    io.to(room).emit("roomJoined", `${socket.id} just joined the room`);
  });

  // Leave a room
  socket.on("leaveRoom", (room) => {
    console.log(`${socket.id} has left room ${room}`);

    socket.leave(room);

    io.to(room).emit("roomLeft", `${socket.id} has left the room`);
  });

  // Post a message to a specific room
  socket.on("messageToRoom", (data) => {
    console.log(
      `${socket.id} posted a message to room ${data.room}: ${data.message}`
    );

    io.to(data.room).emit("message", {
      id: socket.id,
      message: data.message,
    });
  });

  // Send a message to all connected clients
  socket.on("messageToAll", (data) => {
    console.log(`${socket.id} sent a message to all clients: ${data.message}`);

    io.emit("message", {
      id: socket.id,
      message: data.message,
    });
  });
  // Disconnect event
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

app.use(cors());
// app.use(express.static("uploads"));
// app.use("/uploads", express.static("controllers/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/api", router);
// app.use(errorHandler);
app.get("/", (_, res) => {
  return res.send("Hello World!");
});

app.post("/contact", async (req, res) => {
  const { first_name, last_name, email, message } = req.body;

  const emailTemplate = `
  <html>
    <head>
      <style>
        /* Define your inline CSS styles here */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background-color: #007BFF;
          color: #fff;
          text-align: center;
          padding: 10px;
        }
        .content {
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Best Systems</h1>
        </div>
        <div>
          <div>
            First name: ${first_name}
          </div>
          <div>
            Last name: ${last_name}
          </div>
          <div>
            Email: ${email}
          </div>
          <div>
            Message: ${message}
          </div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

  const mailOptions = {
    to: "narek.khachatryan@solicy.net",
    from: email,
    subject: "You've received a message from Best",
    text: "Custom Email Template",
    html: emailTemplate,
  };
  try {
    await sendEmail(mailOptions);
    return res.status(200).json({ message: "Successfully sent!" });
  } catch (err) {
    return res.status(400).json(err);
  }
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // app.listen(PORT, () =>
    //   console.log(`Server is running on http://localhost:${PORT}`)
    // );

    http.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
