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
          background: linear-gradient(135deg, #181a21 0%, #24243e 100%);
          color: #e4e8ef;
          font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
        .container {
          max-width: 980px;
          margin: 38px auto 0 auto;
          background: rgba(36,36,62, 0.97);
          border-radius: 20px;
          box-shadow: 0 16px 32px rgba(35,35,50,.21);
          padding: 36px 18px 32px 18px;
          backdrop-filter: blur(2.5px);
        }
        h1 {
          text-align: center;
          font-size: 2.1rem;
          color: #21d19f;
          letter-spacing: 1.2px;
          font-weight: 800;
          margin-bottom: 22px;
          text-shadow: 0 2px 10px #1d303c6b;
          font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 24px;
          background: transparent;
        }
        th, td {
          padding: 13px 10px;
          text-align: center;
        }
        th {
          background: #23253a;
          color: #21d19f;
          font-weight: 800;
          font-size: 1.03em;
          letter-spacing: 0.5px;
          border-bottom: 2.5px solid #21d19f44;
        }
        tr {
          border-bottom: 1px solid #282b34;
          transition: background 0.25s;
        }
        tr:hover {
          background: #22233199;
        }
        tr:last-child { border-bottom: none; }
        .status-cell {
          border-radius: 13px;
          min-width: 64px;
          display: inline-block;
          padding: 6px 13px;
          font-size: 1em;
          box-shadow: 0 2px 9px #181a2166;
          transition: background 0.3s, color 0.3s;
        }
        .delete-btn {
          background: linear-gradient(90deg, #ff5858, #f09819);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 48px;
          font-size: 1.18rem;
          margin-top: 26px;
          cursor: pointer;
          font-weight: 800;
          letter-spacing: 1.2px;
          box-shadow: 0 4px 14px #e74c3c1c;
          transition: background 0.23s;
        }
        .delete-btn:hover {
          background: linear-gradient(90deg, #e74c3c, #fbc631);
        }
        @media (max-width: 800px) {
          .container { padding: 10px 2px; }
          th, td { font-size: 0.93em; padding: 7px 4px; }
        }
        @media (max-width: 550px) {
          table, th, td { font-size: 0.81em; }
        }
        ::selection {
          background: #21d19f66;
        }
        /* سكرول بار أنيق */
        ::-webkit-scrollbar { width: 8px; background: #212332; border-radius: 6px;}
        ::-webkit-scrollbar-thumb { background: #21d19f77; border-radius: 8px;}
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📝 Applicant Access Log</h1>
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
              <td style="font-size:0.94em;word-break:break-all">${log.href ? log.href.replace('https://www.blsspainmorocco.net/', '') : ''}</td>
              <td>
                <span class="status-cell" style="${statusColor(log.status)}">${log.status ? log.status : '-'}</span>
              </td>
              <td style="font-size:0.84em;word-break:break-all">${log.userAgent || ''}</td>
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
