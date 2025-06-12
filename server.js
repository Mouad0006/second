const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());

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

app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

app.get('/', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    const lines = fs.readFileSync(pathLog, 'utf8').split('\n').filter(Boolean);
    logs = lines.map(line => {
      const [date, ip, data] = line.split(/,(.+?),({.*})$/).filter(Boolean);
      let info = {};
      try { info = JSON.parse(data); } catch {}
      // تقسيم الوقت: اليوم و الساعة
      let localTime = info.localTime || '';
      let isoDate = '';
      if (info.isoTime) {
        try {
          const d = new Date(info.isoTime);
          isoDate = d.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        } catch {}
      }
      return { date, ip, ...info, localDate: isoDate, localHour: localTime };
    }).reverse();
  }

  // 🟢 فلترة: أول 200 فقط لكل clientId كل 5 دقائق
  const lastSeen = {}; // clientId => آخر وقت ms
  const result = [];
  logs.forEach(log => {
    if (log.status == 200 && log.clientId) {
      const nowTime = new Date(log.date).getTime();
      if (!lastSeen[log.clientId] || nowTime - lastSeen[log.clientId] > 5 * 60 * 1000) { // 5 دقائق
        lastSeen[log.clientId] = nowTime;
        result.push(log);
      }
    }
  });

  function statusColor(status) {
    if (status == 200) return 'background:#21d19f;color:#fff;font-weight:600;';
    if (status == 302) return 'background:#ffe066;color:#2a2a2a;font-weight:600;';
    if (!status) return 'background:#282b34;color:#bbb;';
    return 'background:#e74c3c;color:#fff;font-weight:600;';
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Applicant Access Log</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://fonts.googleapis.com/css?family=Cairo:wght@600;800&display=swap" rel="stylesheet">
      <style>
        body {
          background: linear-gradient(135deg, #1e2239 0%, #29397a 100%);
          color: #e7eef7;
          font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
        .container {
          max-width: 950px;
          margin: 38px auto 0 auto;
          background: rgba(40,42,73, 0.97);
          border-radius: 28px;
          box-shadow: 0 18px 36px rgba(25, 28, 65, .22);
          padding: 38px 16px 32px 16px;
          backdrop-filter: blur(2.8px);
        }
        h1 {
          text-align: center;
          font-size: 2.15rem;
          color: #21d19f;
          letter-spacing: 1.5px;
          font-weight: 900;
          margin-bottom: 26px;
          text-shadow: 0 3px 18px #1d303c8c;
          font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 24px;
          background: transparent;
          box-shadow: 0 5px 24px #22264d33;
          border-radius: 15px;
          overflow: hidden;
        }
        th, td {
          padding: 16px 8px;
          text-align: center;
        }
        th {
          background: #26315d;
          color: #21d19f;
          font-weight: 800;
          font-size: 1.08em;
          letter-spacing: 0.8px;
          border-bottom: 2.5px solid #21d19f44;
        }
        tr {
          border-bottom: 1px solid #313a65;
          transition: background 0.23s;
        }
        tr:nth-child(even) {
          background: #24284b99;
        }
        tr:hover {
          background: #2c355d !important;
        }
        tr:last-child { border-bottom: none; }
        .status-cell {
          border-radius: 13px;
          min-width: 66px;
          display: inline-block;
          padding: 8px 15px;
          font-size: 1em;
          box-shadow: 0 2px 9px #181a2166;
          transition: background 0.3s, color 0.3s;
        }
        .delete-btn {
          background: linear-gradient(90deg, #ff5858, #f09819);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 16px 58px;
          font-size: 1.19rem;
          margin-top: 34px;
          cursor: pointer;
          font-weight: 900;
          letter-spacing: 1.2px;
          box-shadow: 0 4px 14px #e74c3c1c;
          transition: background 0.23s;
        }
        .delete-btn:hover {
          background: linear-gradient(90deg, #e74c3c, #fbc631);
        }
        @media (max-width: 900px) {
          .container { padding: 7px 2px; }
          th, td { font-size: 0.95em; padding: 9px 2px; }
        }
        @media (max-width: 600px) {
          table, th, td { font-size: 0.77em; }
          .container { max-width: 100vw; }
        }
        ::selection { background: #21d19f66; }
        ::-webkit-scrollbar { width: 8px; background: #22253b; border-radius: 7px;}
        ::-webkit-scrollbar-thumb { background: #21d19f99; border-radius: 9px;}
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📝 Applicant Access Log</h1>
        <table>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>IP</th>
            <th>User Agent</th>
          </tr>
          ${result.map(log => `
            <tr>
              <td><b>${log.localDate || ''}</b></td>
              <td style="font-family:monospace; font-size:1.11em;">${log.localHour || ''}</td>
              <td>
                <span class="status-cell" style="${statusColor(log.status)}">${log.status ? log.status : '-'}</span>
              </td>
              <td>${log.ip || ''}</td>
              <td style="font-size:0.82em;word-break:break-all">${log.userAgent || ''}</td>
            </tr>
          `).join('')}
        </table>
        <form method="POST" action="/delete-all" onsubmit="return confirm('Delete all records?');" style="text-align:center;">
          <button class="delete-btn" type="submit">🗑️ DELETE ALL</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
