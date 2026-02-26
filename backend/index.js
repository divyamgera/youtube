import express from "express";
import dotenv from "dotenv";
import database from "./config/db.js";
import UserRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import VideoRouter from "./routes/video.routes.js";
import VideoReactionRouter from "./routes/videoReaction.routes.js";
import CommentRouter from "./routes/comment.routes.js";
import cors from "cors";
import PlaylistRouter from "./routes/playlist.routes.js";
import TweetRouter from "./routes/tweet.routes.js";
import helmet from 'helmet'
import rateLimit from 'express-rate-limit';
import errorMiddleware from "./middlewares/error.middleware.js";


dotenv.config();
const PORT = process.env.SERVER;

const app = express();

const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 100
})

app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173" ,
    credentials: true,
  }),
);
app.use("/users", UserRouter);
app.use("/video", VideoRouter);
app.use("/reaction", VideoReactionRouter);
app.use("/video", CommentRouter);
app.use("/playlist", PlaylistRouter);
app.use("/tweet", TweetRouter);
// app.use("/api/v1/users", UserRouter); // standard practice in industries

// app.get("/", (req, res) => {
//   res.send("hello youtube");
// });
app.use(errorMiddleware);
app.listen(PORT || 5500, () => {
  console.log("Server is Running on Port: " + PORT);
  database();
});
