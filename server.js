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
  <title>🤖 MILANO Quantum Log - Year 2150</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Orbitron:900,700|Cairo:wght@900&display=swap" rel="stylesheet">
  <style>
    html, body {
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(125deg, #131530 0%, #20d6ff 150%);
      font-family: 'Orbitron', 'Cairo', 'Segoe UI', Arial, sans-serif;
      box-shadow: 0 0 280px #4efaff44 inset;
      position: relative;
      overflow-x: hidden;
    }
    body::before {
      /* دخان ونيون */
      content: '';
      position: fixed;
      left: -40vw; top: -30vh; width: 180vw; height: 180vh;
      background: radial-gradient(circle at 40% 40%, #3ff1fff5 0%, #08fbb030 50%, transparent 70%);
      opacity: 0.18;
      pointer-events: none;
      z-index: 0;
      animation: neonSmoke 18s linear infinite alternate;
    }
    @keyframes neonSmoke {
      0% { transform: scale(1) translateY(0);}
      100%{ transform: scale(1.2) translateY(60px);}
    }
    .quantum-glass {
      margin: 62px auto 0 auto;
      width: 99vw;
      max-width: 1290px;
      background: linear-gradient(120deg,rgba(26,32,58,.94),rgba(50,72,110,0.95) 89%);
      border-radius: 49px;
      box-shadow: 0 0 130px #00e0ffc0, 0 3px 40px #22fcf8bb, 0 0px 22px 6px #ff18ff55;
      padding: 60px 3vw 60px 3vw;
      position: relative;
      overflow: visible;
      border: 3.8px solid #20d6ff;
      backdrop-filter: blur(15px) brightness(1.09);
      animation: quantumAppear 1.7s cubic-bezier(.79,1.6,.72,1) 1;
      z-index: 1;
    }
    @keyframes quantumAppear {
      0% { opacity: 0; transform: scale(0.85) translateY(160px);}
      100%{ opacity: 1; transform: scale(1) translateY(0);}
    }
    .quantum-glass:after {
      content: '';
      position: absolute; top:0; left:80px; right:80px; height:12px;
      background: linear-gradient(90deg, #20d6ff 0%, #fff 30%, #ff50fa 100%);
      filter: blur(12px) brightness(1.4) opacity(0.36);
      border-radius: 50px;
      z-index: 2;
      animation: glassglow 3s linear infinite alternate;
    }
    @keyframes glassglow {
      0% { filter: blur(12px) brightness(1.1) opacity(0.24);}
      100%{ filter: blur(15px) brightness(2.2) opacity(0.45);}
    }
    .log-title {
      text-align: center;
      font-size: 3.5rem;
      font-family: 'Orbitron', 'Cairo', sans-serif;
      letter-spacing: 8px;
      font-weight: 900;
      margin-bottom: 45px;
      background: linear-gradient(90deg,#fff 0%,#20d6ff 50%,#ff16ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 22px 80px #fff7, 0 1px 20px #20d6ff77;
      user-select: none;
      filter: brightness(1.18) drop-shadow(0 10px 24px #20d6ff);
      animation: titlePulse 3.3s ease-in-out infinite alternate;
    }
    @keyframes titlePulse {
      0% { letter-spacing: 5px; filter: brightness(1.09);}
      100%{ letter-spacing: 15px; filter: brightness(1.38);}
    }
    .cyber-divider {
      height: 7px;
      width: 92px;
      background: linear-gradient(90deg, #20d6ff 20%, #ff16ff 80%);
      border-radius: 16px;
      margin: 0 auto 43px auto;
      box-shadow: 0 4px 33px #20d6ff77, 0 1px 12px #ff18ff66;
      animation: cyberShine 2.8s linear infinite alternate;
    }
    @keyframes cyberShine {
      from {filter: blur(0);}
      to {filter: blur(3.5px);}
    }
    table {
      width: 100%;
      margin: 0 auto;
      background: linear-gradient(110deg, #202944 83%, #ff18ff12 100%);
      box-shadow: 0 15px 55px #20d6ff22, 0 0px 9px #ff18ff33;
      border-radius: 34px;
      overflow: hidden;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 1.19em;
      border: 2.5px solid #20d6ff66;
      filter: brightness(1.12) drop-shadow(0 2px 7px #fff2);
    }
    th, td {
      padding: 23px 11px;
      text-align: center;
      border: none;
    }
    th {
      background: linear-gradient(90deg, #1a2644 80%, #20d6ff33 100%);
      color: #fff;
      font-family: 'Orbitron', 'Montserrat', 'Cairo', sans-serif;
      font-weight: 900;
      font-size: 1.22em;
      letter-spacing: 2.6px;
      border-bottom: 3.5px solid #20d6ffcc;
      user-select: none;
      text-shadow: 0 3px 18px #20d6ff, 0 1px 14px #fff8;
      filter: brightness(1.11);
    }
    tr.data-row {
      color: #fff;
      font-weight: 900;
      font-family: 'Cairo', 'Montserrat', sans-serif;
      text-shadow: 0 2px 23px #fff, 0 1px 12px #20d6ff;
      background: linear-gradient(88deg, #14192e 65%, #20d6ff 135%);
      border-radius: 13px;
      filter: brightness(1.39);
      transition: background .16s, box-shadow .18s;
      box-shadow: 0 2px 23px #20d6ff11;
    }
    tr.data-row:hover {
      background: linear-gradient(90deg, #20d6ff 5%, #ff50fa 95%);
      color: #fff;
      box-shadow: 0 8px 29px #ff18ff44, 0 5px 19px #fff4;
      filter: brightness(1.65);
      border-radius: 18px;
    }
    .status-cell {
      border-radius: 22px;
      min-width: 88px;
      display: inline-block;
      padding: 16px 27px;
      font-size: 1.24em;
      box-shadow: 0 3px 25px #20d6ff99, 0 1px 13px #fff8;
      font-weight: 900;
      letter-spacing: 2.1px;
      background: linear-gradient(90deg, #20d6ff 30%, #ff18ff 90%);
      color: #fff;
      border: 3px solid #fff2;
      filter: brightness(1.31) drop-shadow(0 1px 11px #fff7);
      transition: filter .21s, box-shadow .18s;
      text-shadow: 0 1px 17px #fff9, 0 0 6px #20d6ff77;
    }
    .delete-btn {
      background: linear-gradient(90deg, #ff50fa 30%, #20d6ff 100%);
      color: #fff;
      border: none;
      border-radius: 23px;
      padding: 26px 120px;
      font-size: 1.4rem;
      margin: 60px auto 0 auto;
      cursor: pointer;
      font-weight: 900;
      letter-spacing: 2.5px;
      box-shadow: 0 18px 54px #ff18ff11, 0 6px 18px #20d6ff33;
      outline: none;
      border-bottom: 4.6px solid #ff18ff;
      display: block;
      transition: all 0.25s;
      animation: deletePulse 1.6s cubic-bezier(.8,.2,.6,1) infinite alternate;
    }
    @keyframes deletePulse {
      from { filter: brightness(1) blur(0);}
      to   { filter: brightness(1.7) blur(2px);}
    }
    .delete-btn:hover {
      background: linear-gradient(90deg, #20d6ff 5%, #ff50fa 95%);
      box-shadow: 0 22px 52px #20d6ff44, 0 9px 24px #ff18ff99;
      letter-spacing: 4.5px;
      transform: scale(1.12) translateY(-6px) rotate(-2deg);
      filter: brightness(2.1);
    }
    @media (max-width: 1200px) {
      .quantum-glass { padding: 10px 1vw 22px 1vw; }
      th, td { font-size: 0.95em; padding: 9px 1vw;}
    }
    @media (max-width: 700px) {
      .quantum-glass { max-width: 100vw;}
      th { font-size: 1.08em; }
      .delete-btn { padding: 14px 2vw;}
    }
    ::selection { background: #20d6ff66;}
    ::-webkit-scrollbar { width: 11px; background: #14192e; border-radius: 14px;}
    ::-webkit-scrollbar-thumb { background: #20d6ffcc; border-radius: 14px;}
  </style>
</head>
<body>
  <div class="quantum-glass">
    <h1 class="log-title">🚀 MILANO NeoLog</h1>
    <div class="cyber-divider"></div>
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
          <td style="font-family:monospace; font-size:1.18em;">${log.time || ''}</td>
          <td>
            <span class="status-cell">${log.status ? log.status : '-'}</span>
          </td>
          <td>${log.ip || ''}</td>
          <td style="font-size:0.97em;word-break:break-all">${log.href ? log.href.replace('https://www.blsspainmorocco.net/', '') : ''}</td>
          <td style="font-size:0.88em;word-break:break-all">${log.userAgent || ''}</td>
        </tr>
      `).join('')}
    </table>
    <button class="delete-btn" onclick="deleteAllLogs(event)">🪐 DELETE ALL</button>
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

