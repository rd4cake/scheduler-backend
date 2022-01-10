import dotenv from "dotenv";
import GoogleStrategy from "passport-google-oauth20";
import DiscordStrategy from "passport-discord";
import authDAO from "../dao/authDAO.js";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

export default function discordStrategy(passport) {
  passport.use(
    new DiscordStrategy.Strategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/discord/callback",
        scope: ["identify", "email", "guilds", "guilds.join"],
      },
      async function (accessToken, refreshToken, profile, done) {
        let user = await authDAO.findAuth(profile.id);
        if (user.length != 0) {
          done(null, user);
        } else {
          authDAO.addAuth(profile.username, profile.id);
          done(null, user);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    console.log(user[0].userID);
    done(null, user[0].userID);
  });

  passport.deserializeUser(async function (user, done) {
    let userInfo = await authDAO.findAuth(user);
    done(null, userInfo[0]);
  });
}
