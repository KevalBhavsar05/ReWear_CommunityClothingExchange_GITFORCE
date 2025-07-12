import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });
import connectDb from "./config/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDb();

app.use("/", (req, res) => {
  res.send("Welcome to the ReWear-CommunityClothingExchange");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
