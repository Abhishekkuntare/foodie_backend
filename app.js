import express, { urlencoded } from "express";
import { config } from "dotenv";
import userRoute from "./routes/user.js";
import orderRoute from "./routes/order.js";
import { connectPassport } from "./utils/Provider.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorMiddleWare } from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();
export default app;
config({ path: "./config/config.env" });

//using middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

const corsOrigin = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionSuccessStatus: 200,
  "Content-Type": "text/plain",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
};
app.use(cors(corsOrigin));

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");

connectPassport();

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);

//using error middleware
app.use(errorMiddleWare);
