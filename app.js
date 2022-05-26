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
  const [[saying_dateRow]] = await pool.query(
    `
    SELECT *
    FROM ws
    ORDER BY RAND()
    LIMIT 1
    `
  );

  if (saying_dateRow === undefined) {
    res.status(404).json({
      resultCode: "F-1",
      msg: "404 not found",
    });
    return;
  }

  saying_dateRow.hit++;
  await pool.query(
    `
    UPDATE ws
    SET hit = ?
    WHERE id = ?
    `,
    [saying_dateRow.hit, saying_dateRow.id]
  );

  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: saying_dateRow,
  });
});

app.patch("/ws/:id", async (req, res) => {
  const { id } = req.params;
  const [[saying_dateRow]] = await pool.query(
    `
    SELECT *
    FROM ws
    WHERE id = ?
    `,
    [id]
  );

  if (Saying_dateRow === undefined) {
    res.status(404).json({
      resultCode: "F-1",
      msg: "404 not found",
    });
    return;
  }

  const {
    content = Saying_dateRow.content,
    human = Saying_dateRow.human,
    likeCount = Saying_dateRow.likeCount,
    badCount = Saying_dateRow.badCount,
  } = req.body;

  await pool.query(
    `
    UPDATE ws
    SET content = ?,
    human = ?,
    likeCount = ?,
    badCount = ?
    WHERE id = ?
    `,
    [content, human, likeCount, badCount, id]
  );

  const [[justModifiedWiseSayingRow]] = await pool.query(
    `
    SELECT *
    FROM ws
    WHERE id = ?
    `,
    [id]
  );

  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: justModifiedWiseSayingRow,
  });
});

app.listen(port, () => {
  console.log(`wise_saying app listening on port ${port}`);
});
