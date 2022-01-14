import express from "express";
import cors from "cors";
import strategy from "./auth/strategy.js";
import schedules from "./api/scheduleRoute.js";
import passport from "passport";
import session from "express-session";
import mongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.set("trust proxy",1)

app.use(
  session({
    secret: "sugoma",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 * 24, secure: true, sameSite: "none" },
    store: mongoStore.create({ mongoUrl: process.env.DB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

strategy(passport);

app.use("/", schedules);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
