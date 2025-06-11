const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

// ✅ Enable CORS for all requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

// سجل كل دخول جديد
app.post('/log', (req, res) => {
  const now = new Date();
  const time = now.toISOString();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "";
  const extra = JSON.stringify(req.body || {});
  const logLine = `${time},${ip},${extra}\n`;
  fs.appendFileSync(path.join(__dirname, 'applicant_log.csv'), logLine);
  res.json({ status: "ok", logged: now });
});

app.get('/log', (req, res) => {
  const now = new Date();
  const time = now.toISOString();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "";
  const logLine = `${time},${ip},GET\n`;
  fs.appendFileSync(path.join(__dirname, 'applicant_log.csv'), logLine);
  res.json({ status: "ok", logged: now });
});

// زر حذف الكل
app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

// صفحة الجدول العصرية مع الزر
app.get('/', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    const lines = fs.readFileSync(pathLog, 'utf8').split('\n').filter(Boolean);
    logs = lines.map(line => {
      const [date, ip, data] = line.split(/,(.+?),({.*})$/).filter(Boolean);
      let info = {};
      try { info = JSON.parse(data); } catch {}
      return { date, ip, ...info };
    }).reverse();
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Applicant Access Log</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          background: linear-gradient(135deg, #232526 0%, #393e46 100%);
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #fff; margin: 0; padding: 0;
        }
        .container {
          max-width: 900px;
          margin: 38px auto 0 auto;
          background: rgba(44,51,63,0.92);
          border-radius: 20px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.25);
          padding: 38px 30px 30px 30px;
        }
        h1 {
          text-align: center;
          margin-top: 0;
          letter-spacing: 2px;
          color: #4ade80;
        }
        .delete-btn {
          display: block;
          margin: 0 auto 20px auto;
          background: linear-gradient(90deg,#ef4444 30%,#f59e42 100%);
          color: #fff;
          font-weight: bold;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          padding: 11px 32px;
          cursor: pointer;
          box-shadow: 0 2px 10px #2224;
          transition: 0.18s;
        }
        .delete-btn:hover { opacity: 0.85; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 22px;
          font-size: 15px;
        }
        th, td {
          padding: 9px 8px;
          text-align: center;
        }
        th {
          background: #0891b2;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 1px;
        }
        tr:nth-child(even) {
          background: rgba(72,85,99,0.38);
        }
        tr:nth-child(odd) {
          background: rgba(20,23,32,0.28);
        }
        .date {
          color: #fbbf24;
          font-weight: bold;
        }
        .time {
          color: #38bdf8;
          font-size: 17px;
          font-weight: bold;
          letter-spacing: 1.3px;
        }
        .localtime {
          color: #06d6a0;
          font-size: 16px;
          font-weight: bold;
        }
        .ip { color: #d1d5db; font-size: 12px; }
        @media (max-width: 700px) {
          .container { padding: 8px; }
          table, th, td { font-size: 13px; }
          .delete-btn { font-size: 14px; padding: 9px 10px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Applicant Access Log</h1>
        <button class="delete-btn" onclick="deleteAllLogs()">DELETE ALL</button>
        <table>
          <tr>
            <th>#</th>
            <th>Date (UTC)</th>
            <th>Time (UTC)</th>
            <th>Local Time</th>
            <th>IP</th>
            <th>User Agent</th>
          </tr>
          ${
            logs.length === 0 ? `<tr><td colspan="6">No entries yet</td></tr>` :
            logs.map((e,i) => {
              let d = new Date(e.isoTime || e.ts || e.date || "");
              let date = d.toLocaleDateString();
              let time = d.toLocaleTimeString();
              let localTime = e.localTime || "-";
              return `<tr>
                <td>${logs.length-i}</td>
                <td class="date">${date}</td>
                <td class="time">${time}</td>
                <td class="localtime">${localTime}</td>
                <td class="ip">${e.ip || ""}</td>
                <td style="max-width:230px;overflow-wrap:anywhere;">${(e.userAgent||"").replace(/</g,"&lt;")}</td>
              </tr>`;
            }).join("")
          }
        </table>
        <div style="margin-top:28px;font-size:13px; color:#94a3b8;text-align:center;">
          &copy; ${new Date().getFullYear()} | MILANO Log Dashboard
        </div>
      </div>
      <script>
        function deleteAllLogs() {
          if(confirm("Are you sure you want to delete all logs?")) {
            fetch('/delete-all', {method:'POST'})
              .then(() => window.location.reload());
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Applicant Log Server listening at http://localhost:${port}`);
});
