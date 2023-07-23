import express, { urlencoded } from "express";
import { config } from "dotenv";

import { connectPassport } from "./utils/Provider.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorMiddleWare } from "./middlewares/errorMiddleware.js";
import cors from "cors";

config({ path: "./config/config.env" });
const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

const corsOrigin = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionSuccessStatus: 200,
  // "Content-Type": "text/plain",
  // "Access-Control-Allow-Origin": "*",
  // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
};
app.use(cors(corsOrigin));

import userRoute from "./routes/user.js";
import orderRoute from "./routes/order.js";
import loginRegisterUser from "./routes/loginRegister.js";

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", loginRegisterUser);

export default app;

app.get("/", (req, res) => {
  res.send(
    `<h1>Site is working click front on <a href=${process.env.FRONTEND_URL}>here</a></h1>`
  );
});

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "development" ? true : true,
//       httpOnly: process.env.NODE_ENV === "development" ? true : true,
//       sameSite: process.env.NODE_ENV === "development" ? false : "none",
//     },
//   })
// );

// app.use(passport.authenticate("session"));
// app.use(passport.initialize());
// app.use(passport.session());
// app.enable("trust proxy");

// connectPassport();
//using error middleware
app.use(errorMiddleWare);
