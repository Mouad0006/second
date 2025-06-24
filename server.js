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

// صفحة تسجيل الدخول مع بتلات ساكورا
function loginPage(error = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login | MILANO Samurai</title>
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
      position: relative;
    }
    #sakura-bg {
      position: fixed;
      left: 0; top: 0; width: 100vw; height: 100vh;
      z-index: 0;
      pointer-events: none;
    }
    .glass-card {
      background: rgba(29,38,73,0.96);
      border-radius: 24px;
      box-shadow: 0 10px 40px 0 #00357266, 0 1.5px 14px 0 #2596be44, 0 0px 2px 1px #1fd1f977;
      padding: 56px 38px 36px 38px;
      min-width: 340px;
      max-width: 96vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      animation: cardIn 1s cubic-bezier(.72,1.3,.58,1) 1;
      z-index: 10;
    }
    @keyframes cardIn {
      from { transform: scale(.88) translateY(55px); opacity: 0; }
      to   { transform: scale(1)   translateY(0);    opacity: 1; }
    }
    .logo {
      font-size: 2.44rem;
      font-weight: 900;
      letter-spacing: 2.1px;
      background: linear-gradient(90deg,#ef629f 5%, #eecda3 80%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 18px;
      text-shadow: 0 3px 18px #ef629f88, 0 1px 5px #eecda388;
      transition: letter-spacing .18s;
    }
    .glass-card:hover .logo { letter-spacing: 2.8px; }
    h2 {
      color: #eecda3;
      margin: 7px 0 29px 0;
      font-size: 1.29rem;
      font-weight: 900;
      letter-spacing: 1.15px;
      text-align: center;
      text-shadow: 0 1px 11px #eecda399;
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
      border: 2.1px solid #eecda399;
      color: #fef3f7;
      border-radius: 13px;
      outline: none;
      font-family: inherit;
      font-weight: 700;
      box-shadow: 0 3px 17px #ef629f18, 0 1px 2px #0001;
      transition: border 0.21s, background 0.24s, box-shadow .28s;
      margin-bottom: 8px;
      box-sizing: border-box;
    }
    .input-box input:focus {
      border-color: #ef629f;
      background: rgba(32, 46, 89, 0.97);
      box-shadow: 0 4px 19px #ef629f33;
    }
    .input-box .icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #ef629f;
      font-size: 1.18em;
      opacity: 0.82;
      pointer-events: none;
      transition: color 0.19s;
    }
    .input-box input:focus ~ .icon {
      color: #eecda3;
      opacity: 1;
    }
    .login-btn {
      width: 100%;
      background: linear-gradient(90deg, #ef629f 5%, #eecda3 100%);
      color: #fff;
      font-size: 1.18rem;
      padding: 14px 0;
      border: none;
      border-radius: 14px;
      font-weight: 900;
      letter-spacing: 1.32px;
      cursor: pointer;
      margin-top: 12px;
      box-shadow: 0 6px 18px #ef629f33, 0 2px 7px #eecda322;
      transition: background 0.22s, box-shadow 0.18s, transform .18s;
      transform: translateY(0);
      outline: none;
      border-bottom: 2px solid #eecda3;
    }
    .login-btn:hover, .login-btn:focus {
      background: linear-gradient(90deg, #eecda3 5%, #ef629f 100%);
      box-shadow: 0 8px 22px #ef629f3a, 0 5px 10px #eecda333;
      transform: translateY(-4px) scale(1.025);
      border-bottom: 3.5px solid #ef629f;
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
    .petal {
      pointer-events: none;
      border-radius: 60% 80% 60% 80%/60% 60% 80% 100%;
      box-shadow: 0 3px 12px #ef629f66, 0 0px 2px #fff9;
      background: radial-gradient(ellipse at 60% 30%, #fff4f7 60%, #faaccb 100%);
      position: absolute;
      top: 0; left: 0;
      will-change: transform;
    }
  </style>
</head>
<body>
  <div id="sakura-bg"></div>
  <form class="glass-card" method="POST" autocomplete="off">
    <div class="logo">MILANO Samurai</div>
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
  <!-- سكريبت بتلات الساكورا -->
  <script>
    const petalColors = ['#fff1f7', '#ffe9fa', '#faaccb', '#f9b4d1', '#f6adc6'];
    function createPetal() {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const size = Math.random() * 10 + 15;
      petal.style.width = size + 'px';
      petal.style.height = (size * 0.8) + 'px';
      petal.style.background = \`radial-gradient(ellipse at 60% 30%, #fff4f7 60%, \${petalColors[Math.floor(Math.random()*petalColors.length)]} 100%)\`;
      petal.style.left = Math.random() * window.innerWidth + 'px';
      petal.style.opacity = Math.random() * 0.7 + 0.5;
      petal.style.position = 'absolute';
      petal.style.top = '-32px';
      petal.style.zIndex = 2;
      document.getElementById('sakura-bg').appendChild(petal);

      // الحركة
      const duration = Math.random() * 4 + 5;
      const swing = Math.random() * 70 + 20;
      let rotate = Math.random() * 180;

      petal.animate([
        { transform: \`translateX(0) rotate(\${rotate}deg)\` },
        { transform: \`translateX(\${swing}px) rotate(\${rotate+30}deg)\` },
        { transform: \`translateX(\${-swing}px) rotate(\${rotate-40}deg)\` },
        { transform: \`translateX(0) rotate(\${rotate+10}deg)\` }
      ], {
        duration: duration * 1000,
        iterations: Infinity
      });

      petal.style.transition = \`top \${duration}s linear\`;
      setTimeout(() => {
        petal.style.top = window.innerHeight + 40 + 'px';
      }, 20);

      setTimeout(() => {
        petal.remove();
      }, duration * 1000);
    }
    setInterval(createPetal, 340);
  </script>
</body>
</html>
  `;
}

// حماية صفحة الجدول
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.send(loginPage());
}

// صفحة تسجيل الدخول POST
app.post('/', (req, res) => {
  const { username, password } = req.body || {};
  if (username === AUTH_USER && password === AUTH_PASS) {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send(loginPage("Invalid username or password!"));
  }
});

// صفحة الجدول الرئيسية (تصميم ساموراي عصري!)
app.get('/', requireLogin, (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    logs = fs.readFileSync(pathLog, 'utf-8')
      .trim().split('\n').map(line => {
        const [date, ip, infoRaw] = line.split(',', 3);
        let info = {};
        try { info = JSON.parse(infoRaw); } catch {}
        let localTime = info.localTime || "";
        let isoTime = info.isoTime || "";
        let hour = "";
        if (info.isoTime) {
          const d = new Date(info.isoTime);
          hour = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        return { date, ip, ...info, localTime, hour };
      }).reverse();
  }
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title> SAMURAI LOG | MILANO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body {
      background: linear-gradient(135deg, #23243b 0%, #2376ae 100%);
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow-x: hidden;
    }
    .container {
      margin-top: 48px;
      width: 98vw;
      max-width: 1000px;
      background: rgba(34, 38, 59, 0.97);
      border-radius: 28px;
      box-shadow: 0 12px 40px #00357266, 0 2px 16px #1fd1f955, 0 0px 2px 1px #21d19f77;
      padding: 40px 15px 35px 15px;
      animation: fadeInUp 0.88s cubic-bezier(.72,1.3,.58,1) 1;
      backdrop-filter: blur(2.8px);
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(60px) scale(.93);}
      to { opacity: 1; transform: translateY(0) scale(1);}
    }
    h1 {
      text-align: center;
      font-size: 2.17rem;
      color: #ef629f;
      letter-spacing: 2.2px;
      font-weight: 900;
      margin-bottom: 34px;
      background: linear-gradient(90deg, #ef629f 5%, #eecda3 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 4px 20px #ef629f33, 0 1px 10px #eecda333;
      position: relative;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 18px;
      background: rgba(33, 41, 66, 0.98);
      box-shadow: 0 5px 24px #ef629f26;
      border-radius: 18px;
      overflow: hidden;
      font-size: 1.08em;
      animation: fadeTable 1.4s;
    }
    @keyframes fadeTable {
      from {opacity:0;transform:scale(.97);}
      to {opacity:1;transform:scale(1);}
    }
    th, td {
      padding: 17px 7px;
      text-align: center;
      border: none;
    }
    th {
      background: linear-gradient(90deg, #222a42 60%, #ef629f22 100%);
      color: #ef629f;
      font-weight: 900;
      font-size: 1.14em;
      letter-spacing: 1.15px;
      border-bottom: 2.7px solid #ef629f44;
      user-select: none;
      position: relative;
    }
    th i {
      font-style: normal;
      font-size: 1.11em;
      margin-right: 4px;
      color: #ef629f99;
    }
    tr {
      transition: background 0.22s;
    }
    tr:nth-child(even) {
      background: #23243b77;
    }
    tr:hover {
      background: linear-gradient(90deg, #ef629f25 15%, #eecda310 100%);
      box-shadow: 0 2px 10px #ef629f33;
      cursor: pointer;
    }
    tr:last-child { border-bottom: none; }
    td, th {
      color: #fff;
      font-weight: 900;
      text-shadow: 0 1px 12px #ffffffa1, 0 0px 6px #fff4;
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
    }
    .status-cell {
      border-radius: 12px;
      min-width: 66px;
      display: inline-block;
      padding: 8px 15px;
      font-size: 1em;
      box-shadow: 0 2px 9px #181a2166;
      transition: background 0.3s, color 0.3s;
      font-weight: 900;
      letter-spacing: 1.15px;
    }
    .status-200 {
      background: #21d19f;
      color: #fff;
      box-shadow: 0 2px 8px #21d19f55;
      border: 2.1px solid #ef629faa;
    }
    .status-302 {
      background: #ffe066;
      color: #2a2a2a;
      border: 2.1px solid #ffe066;
    }
    .status-other {
      background: #e74c3c;
      color: #fff;
      border: 2.1px solid #e74c3c;
    }
    .status-null {
      background: #282b34;
      color: #bbb;
      border: 2.1px solid #222b33;
    }
    .delete-btn {
      background: linear-gradient(90deg, #ef629f 5%, #eecda3 100%);
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 16px 54px;
      font-size: 1.17rem;
      margin: 33px auto 0 auto;
      cursor: pointer;
      font-weight: 900;
      letter-spacing: 1.2px;
      box-shadow: 0 6px 18px #ef629f33, 0 2px 7px #eecda322;
      transition: background 0.23s, box-shadow 0.19s, transform .17s;
      display: block;
    }
    .delete-btn:hover {
      background: linear-gradient(90deg, #eecda3 5%, #ef629f 100%);
      box-shadow: 0 8px 24px #ef629f44, 0 5px 10px #eecda333;
      transform: scale(1.045) translateY(-4px);
      letter-spacing: 2px;
    }
    @media (max-width: 900px) {
      .container { padding: 7px 2px; }
      th, td { font-size: 0.96em; padding: 11px 2px; }
    }
    @media (max-width: 600px) {
      table, th, td { font-size: 0.78em; }
      .container { max-width: 100vw; }
      th { font-size: 1.05em; }
    }
    ::selection { background: #ef629f44; }
    ::-webkit-scrollbar { width: 7px; background: #23243b; border-radius: 6px;}
    ::-webkit-scrollbar-thumb { background: #ef629fbb; border-radius: 7px;}
  </style>
</head>
<body>
  <div class="container">
    <h1>武士 MILANO LOG</h1>
    <table>
      <tr>
        <th><i>📅</i> Date</th>
        <th><i>⏰</i> Time</th>
        <th><i>✅</i> Status</th>
        <th><i>🌐</i> IP</th>
        <th><i>💻</i> Client</th>
      </tr>
      ${logs.map(log => {
        let statusClass = log.status == 200 ? 'status-200' : (log.status == 302 ? 'status-302' : (log.status ? 'status-other' : 'status-null'));
        return `
          <tr>
            <td>${log.date || ''}</td>
            <td style="font-family:monospace; font-size:1.11em;">${log.localTime || ''}</td>
            <td>
              <span class="status-cell ${statusClass}">${log.status ? log.status : '-'}</span>
            </td>
            <td>${log.ip || ''}</td>
            <td style="font-size:1.03em;font-weight:700;color:#ef629f;letter-spacing:1.2px;">${log.clientId || ''}</td>
          </tr>
        `;
      }).join('')}
    </table>
    <button class="delete-btn" onclick="deleteAllLogs(event)">🗑️ DELETE ALL</button>
    <script>
      function deleteAllLogs(e) {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete all records?')) return;
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

// صفحة حذف جميع السجلات
app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

// استقبال الطلبات وتسجيلها
app.post('/log', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // سجل كامل الكائن المرسل من العميل
  const line = `${new Date().toISOString()},${ip},${JSON.stringify(req.body)}\n`;
  fs.appendFileSync(pathLog, line);
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

