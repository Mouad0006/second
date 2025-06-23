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
  <title>SAMURAI LOG - MILANO 2200</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Sans+JP:wght@900&display=swap" rel="stylesheet">
  <style>
    html, body {
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #171b26 0%, #253348 100%);
      font-family: 'Noto Sans JP', 'Montserrat', 'Segoe UI', Arial, sans-serif;
      color: #eee;
      overflow-x: hidden;
      letter-spacing: 0.04em;
    }
    .samurai-glass {
      margin: 55px auto 0 auto;
      width: 99vw;
      max-width: 1220px;
      background: rgba(27,30,40,0.98);
      border-radius: 40px;
      box-shadow: 0 0 110px #ad1212a0, 0 2px 24px #c3a96f55, 0 0px 10px 2px #ffe18f38;
      padding: 54px 2vw 48px 2vw;
      position: relative;
      border: 2.5px solid #c3a96f;
      animation: appear 1.25s cubic-bezier(.61,1.1,.47,1) 1;
    }
    @keyframes appear {
      from { opacity: 0; transform: scale(0.93) translateY(70px);}
      to { opacity: 1; transform: scale(1) translateY(0);}
    }
    .samurai-title {
      text-align: center;
      font-size: 3rem;
      font-family: 'Noto Sans JP', 'Montserrat', sans-serif;
      letter-spacing: 9px;
      font-weight: 900;
      margin-bottom: 30px;
      color: #ffe18f;
      text-shadow: 0 4px 32px #ad1212b5, 0 1px 14px #c3a96fdd;
      user-select: none;
      line-height: 1.2;
      border-bottom: 4px solid #ad1212;
      padding-bottom: 13px;
      background: linear-gradient(90deg, #ffe18f 60%, #ad1212 90%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      filter: brightness(1.09);
    }
    .samurai-divider {
      height: 6px;
      width: 85px;
      background: linear-gradient(90deg, #ad1212 40%, #ffe18f 100%);
      border-radius: 11px;
      margin: 0 auto 33px auto;
      box-shadow: 0 4px 28px #ad1212bb, 0 1px 12px #c3a96f99;
    }
    table {
      width: 100%;
      margin: 0 auto;
      background: linear-gradient(120deg, #23262c 87%, #ad12121b 100%);
      box-shadow: 0 6px 28px #ad121211, 0 0px 6px #ffe18f11;
      border-radius: 24px;
      overflow: hidden;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 1.15em;
      border: 1.7px solid #ad1212;
    }
    th, td {
      padding: 18px 8px;
      text-align: center;
      border: none;
    }
    th {
      background: linear-gradient(90deg, #20232a 90%, #ffe18f15 100%);
      color: #ffe18f;
      font-family: 'Montserrat', 'Noto Sans JP', sans-serif;
      font-weight: 900;
      font-size: 1.1em;
      letter-spacing: 2px;
      border-bottom: 2.2px solid #ad1212;
      user-select: none;
      text-shadow: 0 2px 10px #ad1212bb, 0 1px 5px #ffe18fcc;
    }
    tr.data-row {
      color: #fff;
      font-weight: 900;
      font-family: 'Noto Sans JP', 'Montserrat', sans-serif;
      background: linear-gradient(88deg, #21232b 80%, #ad1212 145%);
      border-radius: 10px;
      transition: background .16s, box-shadow .18s;
      box-shadow: 0 1.5px 9px #ad121230;
      filter: brightness(1.16);
    }
    tr.data-row:hover {
      background: linear-gradient(90deg, #ad1212 20%, #23262c 100%);
      color: #ffe18f;
      box-shadow: 0 4px 24px #ffe18f55, 0 1.5px 6px #ad1212;
      border-radius: 14px;
      filter: brightness(1.19);
    }
    .status-cell {
      border-radius: 14px;
      min-width: 70px;
      display: inline-block;
      padding: 11px 18px;
      font-size: 1.1em;
      box-shadow: 0 3px 12px #ffe18f28, 0 1px 7px #ad121230;
      font-weight: 900;
      letter-spacing: 1.2px;
      background: linear-gradient(90deg, #ffe18f 50%, #ad1212 100%);
      color: #2d2321;
      border: 2px solid #c3a96f;
      filter: brightness(1.07);
      transition: filter .17s, box-shadow .15s;
      text-shadow: 0 1px 8px #ffe18f8c, 0 0 3px #ad121288;
    }
    .delete-btn {
      background: linear-gradient(90deg, #ad1212 60%, #ffe18f 100%);
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 16px 58px;
      font-size: 1.21rem;
      margin: 42px auto 0 auto;
      cursor: pointer;
      font-weight: 900;
      letter-spacing: 2px;
      box-shadow: 0 8px 18px #ad121244, 0 3px 8px #ffe18f33;
      outline: none;
      border-bottom: 2.7px solid #c3a96f;
      display: block;
      transition: all 0.21s;
    }
    .delete-btn:hover {
      background: linear-gradient(90deg, #ffe18f 20%, #ad1212 100%);
      box-shadow: 0 16px 40px #ad121244, 0 6px 16px #ffe18f77;
      letter-spacing: 3.5px;
      transform: scale(1.08) translateY(-3px) rotate(-1.5deg);
      filter: brightness(1.15);
      color: #ad1212;
    }
    @media (max-width: 900px) {
      .samurai-glass { padding: 13px 1vw 21px 1vw;}
      th, td { font-size: 0.95em; padding: 6px 1vw;}
    }
    @media (max-width: 600px) {
      .samurai-glass { max-width: 100vw; }
      th { font-size: 1em; }
      .delete-btn { padding: 10px 2vw;}
    }
    ::selection { background: #ffe18f33;}
    ::-webkit-scrollbar { width: 9px; background: #1a202a; border-radius: 12px;}
    ::-webkit-scrollbar-thumb { background: #ad1212cc; border-radius: 12px;}
  </style>
</head>
<body>
  <div class="samurai-glass">
    <h1 class="samurai-title">武士 MILANO LOG 2200</h1>
    <div class="samurai-divider"></div>
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
          <td><b>${log.day || ''}</b></td>
          <td style="font-family:monospace; font-size:1.12em;">${log.time || ''}</td>
          <td>
            <span class="status-cell">${log.status ? log.status : '-'}</span>
          </td>
          <td>${log.ip || ''}</td>
          <td style="font-size:0.97em;word-break:break-all">${log.href ? log.href.replace('https://www.blsspainmorocco.net/', '') : ''}</td>
          <td style="font-size:0.86em;word-break:break-all">${log.userAgent || ''}</td>
        </tr>
      `).join('')}
    </table>
    <button class="delete-btn" onclick="deleteAllLogs(event)">🗡️ DELETE ALL</button>
    <script>
      function deleteAllLogs(e) {
        e.preventDefault();
        fetch('/delete-all', { method: 'POST' })
          .then(res => res.json())
          .then(json => {
            if (json.status === 'all_deleted') location.reload();
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

