const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 4000;

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إعدادات الجلسة
app.use(session({ secret: 'milanoSecret', resave: false, saveUninitialized: true }));

const AUTH_USER = "Milano";
const AUTH_PASS = "Mouad2006@";

// صفحة تسجيل الدخول
function loginPage(error = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login | MILANO Log</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body { min-height: 100vh; background: linear-gradient(125deg, #23243b 0%, #2376ae 100%); font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; display: flex; align-items: center; justify-content: center; margin: 0; overflow: hidden; }
    .glass-card { background: rgba(29,38,73,0.98); border-radius: 22px; box-shadow: 0 10px 40px 0 #00357266, 0 1.5px 14px 0 #2596be44, 0 0px 2px 1px #1fd1f977; padding: 48px 38px 36px 38px; min-width: 340px; max-width: 96vw; display: flex; flex-direction: column; align-items: center; position: relative; animation: cardIn 1s cubic-bezier(.72,1.3,.58,1) 1;}
    @keyframes cardIn { from { transform: scale(.88) translateY(55px); opacity: 0; } to   { transform: scale(1)   translateY(0);    opacity: 1; }}
    .logo { font-size: 2.44rem; font-weight: 900; letter-spacing: 2.1px; background: linear-gradient(90deg,#1fd1f9 5%, #21d19f 80%); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 18px; text-shadow: 0 3px 18px #23b5e68c, 0 1px 5px #26d7c444; transition: letter-spacing .18s; }
    .glass-card:hover .logo { letter-spacing: 2.8px; }
    h2 { color: #21d19f; margin: 7px 0 29px 0; font-size: 1.29rem; font-weight: 900; letter-spacing: 1.15px; text-align: center; text-shadow: 0 1px 11px #1fd1f988;}
    .login-form { width: 100%; display: flex; flex-direction: column; gap: 15px; margin-bottom: 6px; }
    .input-box { position: relative; width: 100%; margin-bottom: 0px; display: flex; align-items: center; }
    .input-box input { flex: 1; padding: 14px 16px 14px 42px; font-size: 1.09rem; background: rgba(30, 34, 55, 0.94); border: 2.1px solid #21d19f55; color: #e7eef7; border-radius: 13px; outline: none; font-family: inherit; font-weight: 700; box-shadow: 0 3px 17px #21d19f18, 0 1px 2px #0001; transition: border 0.21s, background 0.24s, box-shadow .28s; margin-bottom: 8px; box-sizing: border-box;}
    .input-box input:focus { border-color: #1fd1f9; background: rgba(32, 46, 89, 0.97); box-shadow: 0 4px 19px #1fd1f933;}
    .input-box .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #1fd1f9; font-size: 1.18em; opacity: 0.82; pointer-events: none; transition: color 0.19s; }
    .input-box input:focus ~ .icon { color: #21d19f; opacity: 1; }
    .login-btn { width: 100%; background: linear-gradient(90deg, #1fd1f9 5%, #21d19f 100%); color: #fff; font-size: 1.18rem; padding: 14px 0; border: none; border-radius: 14px; font-weight: 900; letter-spacing: 1.32px; cursor: pointer; margin-top: 12px; box-shadow: 0 6px 18px #1fd1f933, 0 2px 7px #21d19f22; transition: background 0.22s, box-shadow 0.18s, transform .18s; transform: translateY(0); outline: none; border-bottom: 2px solid #1fd1f9;}
    .login-btn:hover, .login-btn:focus { background: linear-gradient(90deg, #21d19f 5%, #1fd1f9 100%); box-shadow: 0 8px 22px #2fc7fc3a, 0 5px 10px #21d19f33; transform: translateY(-4px) scale(1.025); border-bottom: 3.5px solid #21d19f; letter-spacing: 2.5px;}
    .error-msg { color: #e74c3c; font-weight: 900; font-size: 1.09em; text-align: center; margin-bottom: 11px; margin-top: -8px; letter-spacing: 1.13px; background: #fff5f5; padding: 7px 0 3px 0; border-radius: 7px; box-shadow: 0 2px 8px #e74c3c21;}
    @media (max-width: 600px) { .glass-card { padding: 22px 3vw; min-width: 90vw;} .logo { font-size: 1.34rem;} }
  </style>
</head>
<body>
  <form class="glass-card" method="POST" autocomplete="off">
    <div class="logo">MILANO Log</div>
    <h2>Sign in to the control panel</h2>
    ${error ? `<div class="error-msg">${error}</div>` : ""}
    <div class="login-form">
      <div class="input-box">
        <input name="username" type="text" required placeholder="Username" autocomplete="username">
        <span class="icon">👤</span>
      </div>
      <div class="input-box">
        <input name="password" type="password" required placeholder="Password" autocomplete="current-password">
        <span class="icon">🔒</span>
      </div>
      <button class="login-btn" type="submit">Sign In</button>
    </div>
  </form>
</body>
</html>
  `;
}

// حماية الدخول
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.send(loginPage());
}

// يسجل فقط الطلبات التي status=200
app.post('/log', (req, res) => {
  if (req.body.status == 200) {
    const now = new Date();
    const time = now.toISOString();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "";
    const extra = JSON.stringify(req.body || {});
    const logLine = `${time},${ip},${extra}\n`;
    fs.appendFileSync(path.join(__dirname, 'applicant_log.csv'), logLine);
    res.json({ status: "ok", logged: now });
  } else {
    res.json({ status: "ignored" });
  }
});

// زر حذف الكل
app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

// صفحة الجدول العصرية
app.get('/', requireLogin, (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    const lines = fs.readFileSync(pathLog, 'utf8').split('\n').filter(Boolean);
    logs = lines.map(line => {
      const [date, ip, data] = line.split(/,(.+?),({.*})$/).filter(Boolean);
      let info = {};
      try { info = JSON.parse(data); } catch {}
      let dateStr = info.isoTime || date || "";
      let dateObj = dateStr ? new Date(dateStr) : null;
      let day = "";
      let time = "";
      if (dateObj && !isNaN(dateObj.getTime())) {
        day = dateObj.toLocaleDateString('en-CA');
        time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
      return { ...info, ip, day, time, status: info.status, userAgent: info.userAgent, href: info.href };
    })
    .filter(log => log.status == 200)
    .reverse();
  }

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
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>IP</th>
            <th>Page</th>
            <th>User Agent</th>
          </tr>
          ${logs.map(log => `
            <tr>
              <td><b>${log.day || ''}</b></td>
              <td>${log.time || ''}</td>
              <td>
                <span class="status-cell" style="${statusColor(log.status)}">${log.status ? log.status : '-'}</span>
              </td>
              <td>${log.ip || ''}</td>
              <td style="font-size:0.93em;word-break:break-all">${log.href ? log.href.replace('https://www.blsspainmorocco.net/', '') : ''}</td>
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

// POST تسجيل الدخول
app.post('/', (req, res) => {
  const { username, password } = req.body || {};
  if (username === AUTH_USER && password === AUTH_PASS) {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send(loginPage("Invalid username or password!"));
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
