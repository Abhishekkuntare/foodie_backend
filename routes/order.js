import express from "express";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.js";
import {
  getAdminOrders,
  getMyOrders,
  getOrderDetails,
  paymentVerification,
  placeOrder,
  placeOrderOnline,
  processOrder,
} from "../controllers/order.js";

const router = express.Router();

router.post("/createorder", isAuthenticated, placeOrder);
router.get("/myorders", isAuthenticated, getMyOrders);
router.get("/order/:id", isAuthenticated, getOrderDetails);
router.post("/createorderonline", isAuthenticated, placeOrderOnline);
router.post("/paymentverification", isAuthenticated, paymentVerification);

//admin middleware
router.get("/admin/orders", isAuthenticated, authorizedAdmin, getAdminOrders);
router.get("/admin/order/:id", isAuthenticated, authorizedAdmin, processOrder);

export default router;
