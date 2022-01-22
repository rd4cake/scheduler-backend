import scheduleDAO from "../dao/scheduleDAO.js";

export default class ScheduleController {
  static async apiGetSchedule(req, res, next) {
    const schedulesPerPage = req.query.schedulesPerPage
      ? parseInt(req.query.schedulesPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.text) {
      filters.text = req.query.text;
    } else if (req.query.from) {
      filters.from = req.query.from;
    } else if (req.query.to) {
      filters.to = req.query.to;
    }

    const { schedulesList, totalNumschedules } = await scheduleDAO.getSchedules(
      {
        filters,
        page,
        schedulesPerPage,
      }
    );

    let response = {
      schedules: schedulesList,
      page: page,
      filters: filters,
      entries_per_page: schedulesPerPage,
      total_results: totalNumschedules,
    };
    res.json(response);
  }

  static async apiPostSchedule(req, res, next) {
    try {
      const text = req.body.text;
      const from = req.body.from;
      const to = req.body.to;
      const date = new Date();
      const setDate = req.body.setDate;

      const respose = await scheduleDAO.addSchedule(
        text,
        from,
        to,
        date,
        setDate
      );
      res.json({
        status: "success",
        text: text,
        from: from,
        to: to,
        date: date,
        setDate: setDate,
      });
    } catch (e) {
      console.error(`post: ${e}`);
    }
  }

  static async apiUpdateSchedule(req, res, next) {
    try {
      const id = req.body.id;
      const from = req.body.from;
      const text = req.body.text;
      const date = new Date(2000, 0, 1);

      const response = await scheduleDAO.updateSchedule(from, id, text, date);

      var { error } = response;
      if (error) {
        res.status(400).json({ error });
      }

      if (response.modifiedCount === 0) {
        throw new Error(
          "unable to update review - user may not be original poster"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      console.error(`${e}`);
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const id = req.body.id;
      const from = req.body.from;
      const response = await scheduleDAO.removeSchedule(id, from);
      res.json({ status: "sucess" });
    } catch (e) {
      console.error(`${e}`);
    }
  }
}
