import app from "./app.js";
import { connectDB } from "./config/database.js";
import Razorpay from "razorpay";

connectDB();

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
