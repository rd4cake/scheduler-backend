import express, { json } from "express";
import passport from "passport";
import ScheduleController from "./scheduleController.js";

const router = express.Router();

router.get("/auth/discord", passport.authenticate("discord"));

router.get(
  "/auth/discord/callback",
  passport.authenticate("discord", {
    failureRedirect: "/", session: true
  }),
  function (req, res) {
    res.redirect("http://localhost:3000/"); // Successful auth
  }
);

router.get("/getuser", (req, res) => {
  res.send(req.user);
});

router.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("http://localhost:3000/");
});

router.get("/loggedin", (req, res) => {
  res.send(req.body.user);
});

router
  .route("/api/v1/schedules")
  .get(ScheduleController.apiGetSchedule)
  .post(ScheduleController.apiPostSchedule)
  .put(ScheduleController.apiUpdateSchedule)
  .delete(ScheduleController.apiDeleteReview);

export default router;
