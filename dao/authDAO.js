let auth;
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

export default class authDAO {
  static async injectDB(conn) {
    if (auth) {
      return;
    }
    try {
      auth = await conn.db(process.env.NS).collection("auth");
    } catch (r) {
      console.error(`Unable to establish a collection handle in authDAO: ${e}`);
    }
  }

  static async getAuth({ filters = null, page = 0, authPerPage = 20 } = {}) {
    let query;

    if (filters) {
      if ("userID" in filters) {
        query = { userID: { $eq: filters["userID"] } };
      } else if ("name" in filters) {
        query = { name: { $eq: filters["name"] } };
      }
    }

    let cursor;

    try {
      cursor = await auth.find(query);
    } catch (e) {
      console.error(`${e}`);
      return { scheduleList: [], totalNumSchedule: 0 };
    }

    const displayCursor = cursor.limit(authPerPage).skip(authPerPage * page);

    try {
      const authList = await displayCursor.toArray();
      const totalNumAuth = await auth.countDocuments(query);
      return { authList, totalNumAuth };
    } catch (e) {
      console.error(`${e}`);
      return { scheduleList: [], totalNumSchedule: 0 };
    }
  }

  static async findAuth(userIDA) {
    try {
      const authList = auth.find({ userID: userIDA }).toArray();
      return authList;
    } catch (e) {
      console.error(e);
    }
  }

  static async addAuth(nameA, userIDA) {
    try {
      const reviewDoc = {
        name: nameA,
        userID: userIDA,
      };
      console.log("sucess");
      return await auth.insertOne(reviewDoc);
    } catch (e) {
      console.error(`add schedule : ${e}`);
      return { error: e };
    }
  }

  static async removeSchedule(id, fromA) {
    try {
      const deleteSchdules = await auth.deleteOne({
        _id: ObjectId(id),
        from: fromA,
      });
      return deleteSchdules;
    } catch (e) {
      console.error(`delete: ${e}`);
      return { error: e };
    }
  }
}
