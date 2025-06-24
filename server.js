const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 4000;

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({ secret: 'milanoSecret', resave: false, saveUninitialized: true }));

// Auth data
const AUTH_USER = "Milano";
const AUTH_PASS = "Mouad2006@";

// Login page with sakura petals (keep as you like)
function loginPage(error = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login | MILANO Log</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      min-height: 100vh;
      background: linear-gradient(145deg,#17243d 0%,#1d2846 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      overflow: hidden;
    }
    .moon {
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      width: 180px;
      height: 180px;
      background: radial-gradient(circle at 60% 40%, #fffde9 90%, #bcd3e7 100%, #11182600 100%);
      border-radius: 50%;
      box-shadow: 0 0 160px 40px #e8dfff99, 0 0 360px 160px #d8eaff44;
      z-index: 1;
      opacity: .95;
      animation: moonGlow 5s ease-in-out infinite alternate;
    }
    @keyframes moonGlow { to { box-shadow:0 0 240px 80px #fffbeea0, 0 0 480px 200px #bcd3e788;} }
    .glass-card {
      position: relative;
      z-index: 10;
      background: rgba(32,36,49,0.97);
      border-radius: 20px;
      box-shadow: 0 10px 40px 0 #002b4e77, 0 2px 18px #bcd3e755;
      padding: 48px 38px 36px 38px;
      min-width: 340px;
      max-width: 95vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      backdrop-filter: blur(2.2px);
      animation: cardIn 1.2s cubic-bezier(.72,1.3,.58,1) 1;
    }
    @keyframes cardIn {
      from { transform: scale(.95) translateY(60px); opacity: 0; }
      to   { transform: scale(1)   translateY(0);    opacity: 1; }
    }
    .logo {
      font-size: 2.25rem;
      font-weight: 900;
      letter-spacing: 2px;
      background: linear-gradient(90deg,#bcb2fa 5%, #fffde9 60%, #e5a5c7 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 12px;
      text-shadow: 0 1px 15px #eec8ef22, 0 1px 3px #bcb2fa28;
    }
    h2 {
      color: #fff;
      margin: 4px 0 22px 0;
      font-size: 1.18rem;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: center;
      text-shadow: 0 1px 10px #ffd2f880;
    }
    .login-form { width: 100%; display: flex; flex-direction: column; gap: 11px; margin-bottom: 4px; }
    .input-box { position: relative; width: 100%; display: flex; align-items: center;}
    .input-box input {
      flex: 1;
      padding: 13px 16px 13px 38px;
      font-size: 1.08rem;
      background: rgba(29, 32, 55, 0.93);
      border: 2px solid #d0b0ea99;
      color: #faf9fa;
      border-radius: 12px;
      outline: none;
      font-family: inherit;
      font-weight: 700;
      margin-bottom: 7px;
      box-sizing: border-box;
      box-shadow: 0 2px 10px #ad80c418;
      transition: border 0.18s, background 0.23s;
    }
    .input-box input:focus { border-color: #ef7ebc; background: rgba(37, 42, 73, 0.98); }
    .input-box .icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 1.16em; color: #ffb5e9; opacity: 0.82;}
    .input-box input:focus ~ .icon { color: #ef7ebc; opacity: 1;}
    .login-btn {
      width: 100%;
      background: linear-gradient(90deg, #eecda3 5%, #ef629f 100%);
      color: #fff;
      font-size: 1.12rem;
      padding: 13px 0;
      border: none;
      border-radius: 13px;
      font-weight: 900;
      letter-spacing: 1.12px;
      cursor: pointer;
      margin-top: 10px;
      box-shadow: 0 6px 16px #ef629f33, 0 2px 7px #eecda322;
      transition: background 0.22s, box-shadow 0.16s, transform .17s;
      border-bottom: 2.5px solid #eecda3;
    }
    .login-btn:hover, .login-btn:focus {
      background: linear-gradient(90deg, #ef629f 5%, #eecda3 100%);
      box-shadow: 0 8px 22px #ef629f44, 0 5px 10px #eecda333;
      transform: translateY(-3px) scale(1.02);
      border-bottom: 4px solid #ef629f;
      letter-spacing: 2.5px;
    }
    .error-msg {
      color: #e74c3c;
      font-weight: 900;
      font-size: 1.04em;
      text-align: center;
      margin-bottom: 8px;
      letter-spacing: 1.07px;
      background: #fff5f5;
      padding: 5px 0 2px 0;
      border-radius: 6px;
      box-shadow: 0 2px 8px #e74c3c22;
    }
    @media (max-width: 600px) {
      .glass-card { padding: 19px 2vw; min-width: 92vw;}
      .moon { width:110px; height:110px; top:22px;}
      .logo { font-size: 1.13rem;}
    }
  </style>
</head>
<body>
  <div class="moon"></div>
  <form class="glass-card" method="POST" autocomplete="off">
    <div class="logo">MILANO Wano Log</div>
    <h2>Sign in to Wano Panel</h2>
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
  <canvas id="sakura"></canvas>
  <script>
    // Simple sakura petals
    const canvas = document.getElementById('sakura');
    const ctx = canvas.getContext('2d');
    let petals = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    function Petal() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.r = 8 + Math.random() * 14;
      this.speed = 0.8 + Math.random() * 1.5;
      this.wind = -1.2 + Math.random() * 2.4;
      this.opa = 0.55 + Math.random() * 0.25;
      this.rot = Math.random() * 2 * Math.PI;
      this.spin = (Math.random() - 0.5) * 0.07;
      this.draw = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.opa;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.r, -this.r*1.3, this.r*0.7, this.r*1.1, 0, this.r);
        ctx.bezierCurveTo(-this.r*0.7, this.r*1.1, -this.r, -this.r*1.3, 0, 0);
        ctx.fillStyle = "rgba(245, 169, 184, 0.78)";
        ctx.shadowColor = "#fff4";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      };
      this.update = function() {
        this.y += this.speed;
        this.x += this.wind;
        this.rot += this.spin;
        if(this.y > canvas.height + 10 || this.x < -20 || this.x > canvas.width+20) {
          // respawn
          this.x = Math.random() * canvas.width;
          this.y = -20;
        }
      };
    }
    function loop() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let p of petals) { p.update(); p.draw(); }
      requestAnimationFrame(loop);
    }
    for(let i=0;i<32;i++) petals.push(new Petal());
    loop();
  </script>
</body>
</html>
  `;
}

// Require login every time
function requireLogin(req, res, next) {
  req.session.loggedIn = false;
  if (req.session && req.session.loggedIn) return next();
  res.send(loginPage());
}

// استقبال الطلبات وتسجيلها
const lastLogByIP = {}; // ip: { time: timestamp }
app.post('/log', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { status } = req.body || {};
  const now = Date.now();
  if (status == 200) {
    if (lastLogByIP[ip] && now - lastLogByIP[ip] < 5 * 60 * 1000) {
      // Ignore repeated logs in 5 minutes for same IP
      return res.json({ skip: true });
    }
    lastLogByIP[ip] = now;
    const line = `${new Date().toISOString()},${ip},${JSON.stringify(req.body)}\n`;
    fs.appendFileSync(pathLog, line);
  }
  res.json({ ok: true });
});

// صفحة الجدول (بستايل وانو ليل + قمر وبتلات ساكورا)
app.get('/', requireLogin, (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    logs = fs.readFileSync(pathLog, 'utf-8')
      .trim().split('\n').map(line => {
        const [date, ip, infoRaw] = line.split(',', 3);
        let info = {};
        try { info = JSON.parse(infoRaw); } catch {}
        return { date, ip, ...info };
      }).reverse();
  }

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Applicant Log | Wano Night</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      background: linear-gradient(170deg, #161a24 0%, #23305d 100%);
      min-height:100vh; margin:0; padding:0;
      font-family: 'Segoe UI', Arial, sans-serif;
      overflow-x:hidden;
    }
    .moon-bg {
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 200px;
      background: radial-gradient(circle at 60% 40%, #fffde9 75%, #bcd3e7 98%, #161a2400 100%);
      border-radius: 50%;
      box-shadow: 0 0 240px 60px #fffde955, 0 0 800px 320px #e9dfff16;
      z-index: 0;
      opacity: .92;
      animation: moonMove 11s ease-in-out infinite alternate;
    }
    @keyframes moonMove { 0% { top:60px;} 100% { top:90px; } }
    .container {
      position: relative;
      margin: 88px auto 0 auto;
      width: 97vw; max-width: 1100px;
      background: rgba(32,36,49,0.96);
      border-radius: 26px;
      box-shadow: 0 16px 60px #002b4e66, 0 3px 24px #bcd3e733;
      padding: 44px 18px 30px 18px;
      animation: fadeInUp 1.05s cubic-bezier(.72,1.3,.58,1) 1;
      z-index: 5;
      overflow-x:auto;
    }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(60px) scale(.94);} to {opacity:1;transform:translateY(0) scale(1);}}
    h1 {
      text-align:center;
      font-size:2.21rem;
      color:#fff;
      letter-spacing:2.1px;
      font-weight:900;
      margin-bottom:28px;
      background:linear-gradient(90deg,#bcb2fa 5%, #fffde9 50%, #e5a5c7 100%);
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;
      text-shadow:0 3px 25px #bcb2fa45, 0 1px 10px #fff4;
    }
    table {
      width:100%; border-collapse:separate; border-spacing:0;
      margin-top:14px;
      background:rgba(33,41,66,0.97);
      box-shadow:0 4px 20px #bcb2fa22;
      border-radius:18px; overflow:hidden; font-size:1.12em;
      animation:fadeTable 1.1s;
    }
    @keyframes fadeTable { from {opacity:0;transform:scale(.97);} to {opacity:1;transform:scale(1);}}
    th, td {
      padding: 17px 7px;
      text-align: center;
      border: none;
    }
    th {
      background:linear-gradient(90deg, #222a42 60%, #ef629f22 100%);
      color:#ef629f;
      font-weight:900;font-size:1.13em;letter-spacing:1.15px;border-bottom:2.7px solid #ef629f33;
      text-shadow:0 2px 7px #ef629f33;
    }
    tr {
      transition: background 0.22s;
      position: relative;
    }
    tr:nth-child(even) { background:#23243b77; }
    tr:hover { background:linear-gradient(90deg, #eecda322 10%, #ef629f18 100%); }
    tr::before, tr::after {
      content: '';
      display: block;
      position: absolute;
      top: 50%; left: -17px; right: -17px; height: 3px;
      background: linear-gradient(90deg,#fff0 0%,#fff8 60%,#fff0 100%);
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.25s;
      pointer-events: none;
    }
    tr:hover::before, tr:hover::after { opacity: 0.48; }
    .status-cell {
      border-radius: 12px;
      min-width: 66px;
      display: inline-block;
      padding: 8px 15px;
      font-size:1em;
      font-weight:900;
      letter-spacing:1.15px;
      background:#ef629f;
      color:#fff;
      box-shadow:0 2px 8px #ef629f33;
      border:2.1px solid #eecda3aa;
    }
    .delete-btn {
      background:linear-gradient(90deg, #ff8bb5 0%, #eecda3 90%);
      color:#fff;
      border:none;
      border-radius:15px;
      padding:17px 49px;
      font-size:1.19rem;
      margin:33px auto 0 auto;
      cursor:pointer;
      font-weight:900;
      letter-spacing:1.2px;
      box-shadow:0 6px 18px #ef629f33, 0 2px 7px #eecda322;
      transition:background 0.23s, box-shadow 0.19s, transform .17s;
      display:block;
      outline:none;
    }
    .delete-btn:hover {
      background:linear-gradient(90deg, #eecda3 10%, #ef629f 100%);
      box-shadow:0 8px 24px #eecda344, 0 5px 10px #ef629f33;
      transform:scale(1.045) translateY(-4px);
      letter-spacing:2px;
    }
    td, th {
      color: #fff;
      text-shadow: 0 2px 14px #fff4;
      font-weight: bold;
    }
    /* Petals always behind all */
    #sakura { position:fixed; top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none; }
  </style>
</head>
<body>
  <div class="moon-bg"></div>
  <canvas id="sakura"></canvas>
  <div class="container">
    <h1>Wano Full Moon — Booking Log</h1>
    <table>
      <tr>
        <th>Time (UTC)</th>
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
            <span class="status-cell">${log.status ? log.status : '-'}</span>
          </td>
          <td style="font-size:0.84em;word-break:break-all">${log.userAgent || ''}</td>
        </tr>
      `).join('')}
    </table>
    <button class="delete-btn" onclick="deleteAllLogs(event)">🗑️ DELETE ALL</button>
    <script>
      function deleteAllLogs(e) {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete all records?')) return;
        fetch('/delete-all', { method: 'POST' })
          .then(res => res.json())
          .then(json => { if (json.status === 'all_deleted') location.reload(); });
      }
    </script>
  </div>
  <script>
    // Sakura Petals
    const canvas = document.getElementById('sakura');
    const ctx = canvas.getContext('2d');
    let petals = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();
    function Petal() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.r = 8 + Math.random() * 15;
      this.speed = 0.8 + Math.random() * 1.2;
      this.wind = -1.2 + Math.random() * 2.4;
      this.opa = 0.45 + Math.random() * 0.28;
      this.rot = Math.random() * 2 * Math.PI;
      this.spin = (Math.random() - 0.5) * 0.07;
      this.draw = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.opa;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.r, -this.r*1.3, this.r*0.7, this.r*1.1, 0, this.r);
        ctx.bezierCurveTo(-this.r*0.7, this.r*1.1, -this.r, -this.r*1.3, 0, 0);
        ctx.fillStyle = "rgba(245, 169, 184, 0.84)";
        ctx.shadowColor = "#fff5";
        ctx.shadowBlur = 11;
        ctx.fill();
        ctx.restore();
      };
      this.update = function() {
        this.y += this.speed;
        this.x += this.wind;
        this.rot += this.spin;
        if(this.y > canvas.height + 10 || this.x < -20 || this.x > canvas.width+20) {
          // respawn
          this.x = Math.random() * canvas.width;
          this.y = -20;
        }
      };
    }
    function loop() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let p of petals) { p.update(); p.draw(); }
      requestAnimationFrame(loop);
    }
    for(let i=0;i<38;i++) petals.push(new Petal());
    loop();
  </script>
</body>
</html>
  `);
});

// حذف كل شيء
app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

// POST login
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

