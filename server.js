const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// تسجيل الدخولات
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

// صفحة الجدول العصرية
app.get('/', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    const lines = fs.readFileSync(pathLog, 'utf8').split('\n').filter(Boolean);
    logs = lines.map(line => {
      // date, ip, data
      const [date, ip, data] = line.split(/,(.+?),({.*})$/).filter(Boolean);
      let info = {};
      try { info = JSON.parse(data); } catch {}
      return { date, ip, ...info };
    }).reverse(); // آخر سجل بالأعلى
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
          color: #fff;
          margin: 0; padding: 0;
        }
        .container {
          max-width: 800px;
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
        .ip { color: #d1d5db; font-size: 12px; }
        @media (max-width: 700px) {
          .container { padding: 8px; }
          table, th, td { font-size: 13px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Applicant Access Log</h1>
        <table>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Time</th>
            <th>IP</th>
            <th>User Agent</th>
          </tr>
          ${
            logs.length === 0 ? `<tr><td colspan="5">No entries yet</td></tr>` :
            logs.map((e,i) => {
              let d = new Date(e.ts || e.date || "");
              let date = d.toLocaleDateString();
              let time = d.toLocaleTimeString();
              return `<tr>
                <td>${logs.length-i}</td>
                <td class="date">${date}</td>
                <td class="time">${time}</td>
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
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Applicant Log Server listening at http://localhost:${port}`);
});
