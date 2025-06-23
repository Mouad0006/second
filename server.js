const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 4000;

// تفعيل CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إعدادات الجلسة
app.use(session({ secret: 'milanoSecret', resave: false, saveUninitialized: true }));

// بيانات تسجيل الدخول
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
    body {
      min-height: 100vh;
      background: linear-gradient(125deg, #23243b 0%, #2376ae 100%);
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      overflow: hidden;
    }
    .glass-card {
      background: rgba(29,38,73,0.98);
      border-radius: 22px;
      box-shadow: 0 10px 40px 0 #00357266, 0 1.5px 14px 0 #2596be44, 0 0px 2px 1px #1fd1f977;
      padding: 48px 38px 36px 38px;
      min-width: 340px;
      max-width: 96vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      animation: cardIn 1s cubic-bezier(.72,1.3,.58,1) 1;
    }
    @keyframes cardIn {
      from { transform: scale(.88) translateY(55px); opacity: 0; }
      to   { transform: scale(1)   translateY(0);    opacity: 1; }
    }
    .logo {
      font-size: 2.44rem;
      font-weight: 900;
      letter-spacing: 2.1px;
      background: linear-gradient(90deg,#1fd1f9 5%, #21d19f 80%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 18px;
      text-shadow: 0 3px 18px #23b5e68c, 0 1px 5px #26d7c444;
      transition: letter-spacing .18s;
    }
    .glass-card:hover .logo { letter-spacing: 2.8px; }
    h2 {
      color: #21d19f;
      margin: 7px 0 29px 0;
      font-size: 1.29rem;
      font-weight: 900;
      letter-spacing: 1.15px;
      text-align: center;
      text-shadow: 0 1px 11px #1fd1f988;
    }
    .login-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 6px;
    }
    .input-box {
      position: relative;
      width: 100%;
      margin-bottom: 0px;
      display: flex;
      align-items: center;
    }
    .input-box input {
      flex: 1;
      padding: 14px 16px 14px 42px;
      font-size: 1.09rem;
      background: rgba(30, 34, 55, 0.94);
      border: 2.1px solid #21d19f55;
      color: #e7eef7;
      border-radius: 13px;
      outline: none;
      font-family: inherit;
      font-weight: 700;
      box-shadow: 0 3px 17px #21d19f18, 0 1px 2px #0001;
      transition: border 0.21s, background 0.24s, box-shadow .28s;
      margin-bottom: 8px;
      box-sizing: border-box;
    }
    .input-box input:focus {
      border-color: #1fd1f9;
      background: rgba(32, 46, 89, 0.97);
      box-shadow: 0 4px 19px #1fd1f933;
    }
    .input-box .icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #1fd1f9;
      font-size: 1.18em;
      opacity: 0.82;
      pointer-events: none;
      transition: color 0.19s;
    }
    .input-box input:focus ~ .icon {
      color: #21d19f;
      opacity: 1;
    }
    .login-btn {
      width: 100%;
      background: linear-gradient(90deg, #1fd1f9 5%, #21d19f 100%);
      color: #fff;
      font-size: 1.18rem;
      padding: 14px 0;
      border: none;
      border-radius: 14px;
      font-weight: 900;
      letter-spacing: 1.32px;
      cursor: pointer;
      margin-top: 12px;
      box-shadow: 0 6px 18px #1fd1f933, 0 2px 7px #21d19f22;
      transition: background 0.22s, box-shadow 0.18s, transform .18s;
      transform: translateY(0);
      outline: none;
      border-bottom: 2px solid #1fd1f9;
    }
    .login-btn:hover, .login-btn:focus {
      background: linear-gradient(90deg, #21d19f 5%, #1fd1f9 100%);
      box-shadow: 0 8px 22px #2fc7fc3a, 0 5px 10px #21d19f33;
      transform: translateY(-4px) scale(1.025);
      border-bottom: 3.5px solid #21d19f;
      letter-spacing: 2.5px;
    }
    .error-msg {
      color: #e74c3c;
      font-weight: 900;
      font-size: 1.09em;
      text-align: center;
      margin-bottom: 11px;
      margin-top: -8px;
      letter-spacing: 1.13px;
      background: #fff5f5;
      padding: 7px 0 3px 0;
      border-radius: 7px;
      box-shadow: 0 2px 8px #e74c3c21;
    }
    @media (max-width: 600px) {
      .glass-card { padding: 22px 3vw; min-width: 90vw;}
      .logo { font-size: 1.34rem;}
    }
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

// حماية صفحة الجدول فقط
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.send(loginPage());
}

// ======== LOG ROUTE - مفتوح للكل ========
app.post('/log', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const body = req.body || {};
  // تحقق ألا يسجل أكثر من طلب 200 لنفس الآيبي خلال 5 دقائق
  if (body.status == 200) {
    let allowLog = true;
    if (fs.existsSync(pathLog)) {
      const logs = fs.readFileSync(pathLog, 'utf8').split('\n').filter(Boolean);
      for (let i = logs.length - 1; i >= 0; i--) {
        const line = logs[i];
        const [date, prevIp, data] = line.split(/,(.+?),({.*})$/).filter(Boolean);
        let info = {};
        try { info = JSON.parse(data); } catch {}
        if (prevIp === ip && info.status == 200) {
          let prevTime = new Date(info.isoTime || date).getTime();
          let nowTime = new Date(body.isoTime).getTime();
          if (!isNaN(prevTime) && nowTime - prevTime < 5 * 60 * 1000) {
            allowLog = false;
            break;
          }
        }
      }
    }
    if (allowLog) {
      const line = `${new Date().toISOString()},${ip},${JSON.stringify(body)}\n`;
      fs.appendFileSync(pathLog, line);
    }
  }
  res.json({ ok: true });
});

// الصفحة العصرية العجيبة!
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
    }).filter(log => log.status == 200).reverse();
  }

  function statusColor(status) {
    if (status == 200) return 'background:linear-gradient(90deg,#21d19f,#1fd1f9);color:#fff;font-weight:bold;box-shadow:0 2px 10px #21d19f99;';
    if (status == 302) return 'background:linear-gradient(90deg,#fbbf24,#facc15);color:#222;font-weight:bold;';
    if (!status) return 'background:#eee;color:#888;';
    return 'background:linear-gradient(90deg,#e74c3c,#dc2626);color:#fff;font-weight:bold;';
  }

  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>📝 Milano Booking Log</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
    <style>
      body {
        min-height: 100vh;
        background: linear-gradient(125deg, #181928 0%, #2376ae 100%);
        font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }
      .container {
        margin-top: 48px;
        width: 96vw;
        max-width: 1080px;
        background: rgba(33,38,59,0.98);
        border-radius: 32px;
        box-shadow: 0 14px 48px 0 #00357288, 0 2px 24px #1fd1f977, 0 0px 4px 1px #21d19f33;
        padding: 42px 20px 30px 20px;
        animation: fadeInUp 1.05s cubic-bezier(.72,1.3,.58,1) 1;
        backdrop-filter: blur(4.5px);
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(65px) scale(.92);}
        to   { opacity: 1; transform: translateY(0) scale(1);}
      }
      h1 {
        text-align: center;
        font-size: 2.44rem;
        font-weight: 900;
        letter-spacing: 2.6px;
        margin-bottom: 38px;
        background: linear-gradient(90deg,#1fd1f9 15%,#21d19f 80%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 6px 24px #1fd1f966, 0 1px 12px #21d19f88;
      }
      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin-top: 12px;
        background: rgba(23,27,48,0.98);
        box-shadow: 0 8px 28px #21d19f11;
        border-radius: 20px;
        overflow: hidden;
        font-size: 1.09em;
        animation: fadeTable 1.4s;
        transition: box-shadow 0.28s;
      }
      @keyframes fadeTable {
        from {opacity:0;transform:scale(.98);}
        to {opacity:1;transform:scale(1);}
      }
      th, td {
        padding: 18px 8px;
        text-align: center;
        border: none;
      }
      th {
        background: linear-gradient(90deg, #222a42 55%, #21d19f22 100%);
        color: #1fd1f9;
        font-weight: 900;
        font-size: 1.17em;
        letter-spacing: 1.2px;
        border-bottom: 2.7px solid #21d19f44;
        user-select: none;
        transition: background .22s;
        position: relative;
      }
      tr { transition: background 0.22s;}
      tr.data-row {
        color: #fff;
        font-weight: 900;
        text-shadow: 0 2px 12px #21d1f9cc, 0 1px 4px #fff4;
        background: linear-gradient(90deg, #25324b 80%, #27e4e7 150%);
        transition: background .2s, box-shadow .21s;
      }
      tr.data-row:hover {
        background: linear-gradient(90deg, #1fd1f9 5%, #21d19f 80%);
        color: #fff;
        box-shadow: 0 2px 20px #1fd1f933, 0 4px 20px #fff3;
      }
      tr:nth-child(even) { background: #23243b77; }
      tr:last-child { border-bottom: none; }
      .status-cell {
        border-radius: 14px;
        min-width: 70px;
        display: inline-block;
        padding: 10px 17px;
        font-size: 1.08em;
        box-shadow: 0 2px 12px #181a2177;
        transition: background 0.3s, color 0.3s;
        font-weight: 900;
        letter-spacing: 1.13px;
      }
      .delete-btn {
        background: linear-gradient(90deg, #ff5858 25%, #21d19f 100%);
        color: #fff;
        border: none;
        border-radius: 16px;
        padding: 20px 70px;
        font-size: 1.23rem;
        margin: 44px auto 0 auto;
        cursor: pointer;
        font-weight: 900;
        letter-spacing: 1.5px;
        box-shadow: 0 10px 32px #e74c3c38, 0 2px 14px #21d19f33;
        transition: background 0.24s, box-shadow 0.18s, transform .19s;
        display: block;
      }
      .delete-btn:hover {
        background: linear-gradient(90deg, #21d19f 8%, #ff5858 100%);
        box-shadow: 0 16px 32px #e74c3c54, 0 9px 22px #21d19f29;
        transform: scale(1.057) translateY(-5px);
        letter-spacing: 3.1px;
      }
      @media (max-width: 900px) {
        .container { padding: 7px 2px; }
        th, td { font-size: 0.97em; padding: 12px 3px; }
        .delete-btn { padding: 12px 0; font-size: 1.06rem; }
      }
      @media (max-width: 600px) {
        table, th, td { font-size: 0.82em; }
        .container { max-width: 100vw; }
        th { font-size: 1.06em; }
      }
      ::selection { background: #1fd1f966; }
      ::-webkit-scrollbar { width: 8px; background: #23243b; border-radius: 6px;}
      ::-webkit-scrollbar-thumb { background: #21d19fbb; border-radius: 7px;}
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📝 Milano Booking Log</h1>
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
          <tr class="data-row">
            <td>${log.day || ''}</td>
            <td>${log.time || ''}</td>
            <td><span class="status-cell" style="${statusColor(log.status)}">${log.status ? log.status : '-'}</span></td>
            <td>${log.ip || ''}</td>
            <td style="font-size:0.97em;word-break:break-all">${log.href ? log.href.replace('https://www.blsspainmorocco.net/', '') : ''}</td>
            <td style="font-size:0.85em;word-break:break-all">${log.userAgent || ''}</td>
          </tr>
        `).join('')}
      </table>
      <button class="delete-btn" onclick="deleteAllLogs(event)">🗑️ DELETE ALL</button>
      <script>
        function deleteAllLogs(e) {
          e.preventDefault();
          fetch('/delete-all', { method: 'POST' })
            .then(res => res.json())
            .then(json => {
              if (json.status === 'all_deleted') {
                location.reload();
              }
            });
        }
      </script>
    </div>
  </body>
  </html>
  `);
});

// صفحة الحذف
app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

// صفحة POST تسجيل الدخول
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

