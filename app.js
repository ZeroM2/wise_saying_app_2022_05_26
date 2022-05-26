import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "ws",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateString: true,
});

const app = express();
app.use(express.json());
const port = 3000;

app.get("/ws", async (req, res) => {
  const { id } = req.params;
  const [[saying_dateRow]] = await pool.query(
    `
    SELECT *
    FROM ws
    ORDER BY RAND()
    LIMIT 1
    `,
    [id]
  );

  if (saying_dateRow === undefined) {
    res.status(404).json({
      resultCode: "F-1",
      msg: "404 not found",
    });
    return;
  }
  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: saying_dateRow,
  });
});

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
