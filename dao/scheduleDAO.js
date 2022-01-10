let schedules;
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

export default class scheduleDAO {
  static async injectDB(conn) {
    if (schedules) {
      return;
    }
    try {
      schedules = await conn.db(process.env.NS).collection("schedule");
    } catch (r) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${e}`
      );
    }
  }

  static async getSchedules({
    filters = null,
    page = 0,
    schedulesPerPage = 20,
  } = {}) {
    let query;

    if (filters) {
      if ("text" in filters) {
        query = { text: { $eq: filters["text"] } };
      } else if ("from" in filters) {
        query = { from: { $eq: filters["from"] } };
      } else if ("to" in filters) {
        query = { to: { $eq: filters["to"] } };
      }
    }

    let cursor;

    try {
      cursor = await schedules.find(query);
    } catch (e) {
      console.error(`${e}`);
      return { scheduleList: [], totalNumSchedule: 0 };
    }

    const displayCursor = cursor
      .limit(schedulesPerPage)
      .skip(schedulesPerPage * page);

    try {
      const schedulesList = await displayCursor.toArray();
      const totalNumschedules = await schedules.countDocuments(query);
      return { schedulesList, totalNumschedules };
    } catch (e) {
      console.error(`${e}`);
      return { scheduleList: [], totalNumSchedule: 0 };
    }
  }

  static async addSchedule(textA, fromA, toA, dateA, setDateA) {
    try {
      const reviewDoc = {
        text: textA,
        from: fromA,
        to: toA,
        date: dateA,
        setDate: setDateA,
      };
      return await schedules.insertOne(reviewDoc);
    } catch (e) {
      console.error(`add schedule : ${e}`);
      return { error: e };
    }
  }
  static async updateSchedule(fromA, id, textA, setDateA) {
    try {
      const updateResponse = await schedules.updateOne(
        { from: fromA, _id: ObjectId(id) },
        { $set: { text: textA, setDate: setDateA } }
      );

      return updateResponse;
    } catch (e) {
      console.error(`update: ${e}`);
      return { error: e };
    }
  }
  static async removeSchedule(id, fromA) {
    try {
      const deleteSchdules = await schedules.deleteOne({
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
