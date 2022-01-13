import app from "./server.js";
import mongodb from "mongodb";
import scheduleDAO from "./dao/scheduleDAO.js"
import authDAO from "./dao/authDAO.js"

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 3000;

MongoClient.connect(process.env.DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 3000,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await authDAO.injectDB(client)
    await scheduleDAO.injectDB(client)
    app.listen(port, () => console.log(`listening on port ${port}`));
  });
