import app from "./app.js";
import { connectDB } from "./config/database.js";
import Razorpay from "razorpay";
import cloudinary from "cloudinary";
import nodeCron from "node-cron";

connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

nodeCron.schedule("0 0 0 1 * * ", async () => {
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});


export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


app.get("/", (req, res) => {
  res.send("work");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT} , in ${process.env.NODE_ENV}Mode`);
});
