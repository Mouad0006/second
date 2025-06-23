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

// صفحة الجدول العصرية مع الزر وحالة الطلب
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

  // Helper: لون الحالة
  function statusColor(status) {
    if (status == 200) return 'background:#16c784;color:#fff;font-weight:bold;';
    if (status == 302) return 'background:#facc15;color:#222;font-weight:bold;';
    if (!status) return 'background:#eee;color:#888;';
    return 'background:#dc2626;color:#fff;font-weight:bold;';
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
          background: #181818;
          color: #eee;
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 900px;
          margin: 35px auto;
          background: #23272e;
          border-radius: 16px;
          box-shadow: 0 10px 24px rgba(0,0,0,.13);
          padding: 26px 22px 30px 22px;
        }
        h1 {
          text-align: center;
          font-size: 2rem;
          color: #38bdf8;
          letter-spacing: 1px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 32px;
          font-size: 1rem;
          background: #23272e;
        }
        th, td {
          padding: 8px 12px;
          text-align: center;
        }
        th {
          background: #0f172a;
          color: #5eead4;
          font-weight: bold;
        }
        tr {
          border-bottom: 1px solid #374151;
        }
        tr:last-child { border-bottom: none; }
        .status-cell {
          border-radius: 10px;
          min-width: 62px;
          display: inline-block;
          padding: 5px 10px;
        }
        .delete-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px 36px;
          font-size: 1.1rem;
          margin-top: 16px;
          cursor: pointer;
          transition: background 0.2s;
          font-weight: 600;
          letter-spacing: 1px;
        }
        .delete-btn:hover {
          background: #991b1b;
        }
        @media (max-width: 700px) {
          .container { padding: 4px 2px; }
          table { font-size: 0.85rem;}
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Applicant Access Log</h1>
        <table>
          <tr>
            <th>Time</th>
            <th>IP</th>
            <th>Local Time</th>
            <th>Page</th>
            <th>Status</th>
            <th>User Agent</th>
          </tr>
          ${logs.map(log => `
            <tr>
              <td>${log.date || ''}</td>
              <td>${log.ip || ''}</td>
              <td>${log.localTime || ''}</td>
              <td style="font-size:0.93em;word-break:break-all">${log.href ? log.href.replace('https://www.blsspainmorocco.net/', '') : ''}</td>
              <td>
                <span class="status-cell" style="${statusColor(log.status)}">${log.status ? log.status : '-'}</span>
              </td>
              <td style="font-size:0.84em;word-break:break-all">${log.userAgent || ''}</td>
            </tr>
          `).join('')}
        </table>
        <form method="POST" action="/delete-all" onsubmit="return confirm('Delete all records?');" style="text-align:center;">
          <button class="delete-btn" type="submit">DELETE ALL</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
