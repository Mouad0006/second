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

// جلسة تسجيل الدخول
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
  <title>SAMURAI LOGIN | MILANO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Sans+JP:wght@900&display=swap" rel="stylesheet">
  <style>
    html, body {
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #171b26 0%, #253348 100%);
      font-family: 'Noto Sans JP', 'Montserrat', 'Segoe UI', Arial, sans-serif;
      overflow-x: hidden;
    }
    #sakura-bg {
      position: fixed;
      left: 0; top: 0;
      width: 100vw; height: 100vh;
      z-index: 0;
      pointer-events: none;
      opacity: 0.33;
    }
    .samurai-glass {
      margin: 95px auto 0 auto;
      max-width: 390px;
      background: rgba(27,30,40,0.98);
      border-radius: 36px;
      box-shadow: 0 0 90px #ad1212a0, 0 2px 24px #c3a96f55, 0 0px 10px 2px #ffe18f38;
      padding: 54px 32px 38px 32px;
      border: 2.5px solid #c3a96f;
      animation: appear 1.3s cubic-bezier(.61,1.1,.47,1) 1;
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    @keyframes appear {
      from { opacity: 0; transform: scale(0.93) translateY(60px);}
      to { opacity: 1; transform: scale(1) translateY(0);}
    }
    .samurai-title {
      text-align: center;
      font-size: 2.2rem;
      font-family: 'Noto Sans JP', 'Montserrat', sans-serif;
      letter-spacing: 6px;
      font-weight: 900;
      margin-bottom: 13px;
      color: #ffe18f;
      text-shadow: 0 4px 32px #ad1212b5, 0 1px 14px #c3a96fdd;
      user-select: none;
      background: linear-gradient(90deg, #ffe18f 60%, #ad1212 90%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      filter: brightness(1.09);
    }
    .samurai-divider {
      height: 6px;
      width: 63px;
      background: linear-gradient(90deg, #ad1212 40%, #ffe18f 100%);
      border-radius: 11px;
      margin: 0 auto 29px auto;
      box-shadow: 0 4px 28px #ad1212bb, 0 1px 12px #c3a96f99;
    }
    .login-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
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
      padding: 15px 16px 15px 43px;
      font-size: 1.1rem;
      background: rgba(30, 34, 55, 0.94);
      border: 2px solid #ad1212bb;
      color: #ffe18f;
      border-radius: 13px;
      outline: none;
      font-family: inherit;
      font-weight: 800;
      box-shadow: 0 3px 14px #ad121222, 0 1px 2px #ffe18f11;
      transition: border 0.21s, background 0.22s, box-shadow .21s;
      margin-bottom: 8px;
      box-sizing: border-box;
      letter-spacing: 1.2px;
    }
    .input-box input:focus {
      border-color: #ffe18f;
      background: rgba(32, 46, 89, 0.97);
      box-shadow: 0 4px 12px #ffe18f33;
      color: #ffe18f;
    }
    .input-box .icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #ffe18f;
      font-size: 1.23em;
      opacity: 0.80;
      pointer-events: none;
      transition: color 0.18s;
    }
    .input-box input:focus ~ .icon {
      color: #ad1212;
      opacity: 1;
    }
    .login-btn {
      width: 100%;
      background: linear-gradient(90deg, #ad1212 60%, #ffe18f 100%);
      color: #ffe18f;
      font-size: 1.17rem;
      padding: 15px 0;
      border: none;
      border-radius: 14px;
      font-weight: 900;
      letter-spacing: 2.1px;
      cursor: pointer;
      margin-top: 15px;
      box-shadow: 0 8px 18px #ad121244, 0 3px 8px #ffe18f33;
      outline: none;
      border-bottom: 2.7px solid #c3a96f;
      transition: background 0.22s, box-shadow 0.19s, transform .17s;
      transform: translateY(0);
    }
    .login-btn:hover, .login-btn:focus {
      background: linear-gradient(90deg, #ffe18f 20%, #ad1212 100%);
      box-shadow: 0 16px 32px #ad121233, 0 8px 20px #ffe18faa;
      transform: scale(1.05) translateY(-3px) rotate(-1deg);
      border-bottom: 3.8px solid #ad1212;
      letter-spacing: 3.5px;
      color: #ad1212;
    }
    .error-msg {
      color: #ad1212;
      font-weight: 900;
      font-size: 1.09em;
      text-align: center;
      margin-bottom: 13px;
      margin-top: -5px;
      letter-spacing: 1.13px;
      background: #ffe7ee;
      padding: 8px 0 4px 0;
      border-radius: 7px;
      box-shadow: 0 2px 8px #ad121221;
      display: ${error ? 'block' : 'none'};
    }
    @media (max-width: 600px) {
      .samurai-glass { padding: 20px 3vw; min-width: 93vw;}
      .samurai-title { font-size: 1.1rem;}
    }
  </style>
</head>
<body>
  <canvas id="sakura-bg"></canvas>
  <form class="samurai-glass" method="POST" autocomplete="off">
    <div class="samurai-title">武士 MILANO LOGIN</div>
    <div class="samurai-divider"></div>
    <div class="error-msg">${error ? error : ''}</div>
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
  <script>
    // Sakura Petals Animation
    const canvas = document.getElementById('sakura-bg');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth, height = window.innerHeight;
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const petalImg = (() => {
      let img = new window.Image();
      img.src = 'data:image/svg+xml;base64,' + btoa('<svg width="26" height="22" viewBox="0 0 26 22" xmlns="http://www.w3.org/2000/svg"><path d="M13 1 Q17 5 20 13 Q22 17 13 21 Q4 17 6 13 Q9 5 13 1Z" fill="#ffd7ea" stroke="#e880b5" stroke-width="2"/></svg>');
      return img;
    })();

    function random(min, max) { return min + Math.random() * (max - min); }

    class Petal {
      constructor() {
        this.x = random(0, width);
        this.y = random(-40, -10);
        this.r = random(12, 25);
        this.speed = random(0.5, 1.5);
        this.amp = random(8, 38);
        this.phase = random(0, Math.PI * 2);
        this.swing = random(0.5, 1.2);
        this.angle = random(0, 360);
        this.spin = random(-0.015, 0.015);
        this.opacity = random(0.6, 1);
      }
      move() {
        this.y += this.speed;
        this.x += Math.sin(this.y / 30 + this.phase) * this.swing;
        this.angle += this.spin;
        if (this.y > height + 30) this.reset();
      }
      reset() {
        this.x = random(0, width);
        this.y = random(-40, -10);
        this.r = random(12, 25);
        this.speed = random(0.5, 1.5);
        this.amp = random(8, 38);
        this.phase = random(0, Math.PI * 2);
        this.swing = random(0.5, 1.2);
        this.angle = random(0, 360);
        this.spin = random(-0.015, 0.015);
        this.opacity = random(0.6, 1);
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(petalImg, -this.r/2, -this.r/2, this.r, this.r);
        ctx.restore();
      }
    }

    const petals = [];
    for(let i=0;i<20;i++) petals.push(new Petal());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let petal of petals) {
        petal.move();
        petal.draw(ctx);
      }
      requestAnimationFrame(animate);
    }
    animate();
  </script>
</body>
</html>
  `;
}

// حماية الصفحة
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.send(loginPage());
}

// Route تسجيل الدخول
app.post('/', (req, res) => {
  const { username, password } = req.body || {};
  if (username === AUTH_USER && password === AUTH_PASS) {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send(loginPage("Invalid username or password!"));
  }
});

// Route لوجين CSV
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

// Route حذف كل اللوجات
app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

// الصفحة الرئيسية - جدول اللوجات
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

  function escape(str) {
    return String(str || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SAMURAI LOG - MILANO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body {
      background: linear-gradient(120deg, #141e30 0%, #243b55 100%);
      min-height: 100vh;
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
      margin: 0;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container {
      margin-top: 64px;
      width: 98vw;
      max-width: 1150px;
      background: rgba(31,34,57,0.98);
      border-radius: 32px;
      box-shadow: 0 20px 60px #0005, 0 2px 16px #00eaff50, 0 0px 2px 1px #b4b6fa77;
      padding: 48px 18px 38px 18px;
      animation: fadeInUp 1.1s cubic-bezier(.72,1.3,.58,1) 1;
      backdrop-filter: blur(2.8px);
      position: relative;
    }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(60px) scale(.93);} to {opacity:1;transform:translateY(0) scale(1);}}
    h1 {
      text-align: center;
      font-size: 2.32rem;
      color: #fff;
      letter-spacing: 2.2px;
      font-weight: 900;
      margin-bottom: 44px;
      background: linear-gradient(90deg, #e96443 20%, #904e95 70%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 7px 26px #c41f1f45, 0 1px 10px #1fd1f933;
      position: relative;
    }
    h1::after {
      content: '';
      display: block;
      margin: 0 auto;
      margin-top: 17px;
      height: 4px;
      width: 76px;
      border-radius: 6px;
      background: linear-gradient(90deg, #e96443 5%, #904e95 100%);
      opacity: 0.67;
      box-shadow: 0 2px 8px #b4b6fa33;
      animation: shine 2.7s linear infinite;
    }
    @keyframes shine {0% {opacity:.25;}50% {opacity:1;}100% {opacity:.25;}}
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 18px;
      background: rgba(44, 49, 80, 0.99);
      box-shadow: 0 6px 30px #e9644333;
      border-radius: 18px;
      overflow: hidden;
      font-size: 1.13em;
      animation: fadeTable 1.5s;
    }
    @keyframes fadeTable { from {opacity:0;transform:scale(.97);} to {opacity:1;transform:scale(1);}}
    th, td {padding:17px 7px;text-align:center;border:none;}
    th {
      background: linear-gradient(90deg, #222a42 60%, #e9644322 100%);
      color: #e96443;
      font-weight: 900;
      font-size: 1.14em;
      letter-spacing: 1.15px;
      border-bottom: 2.7px solid #e9644344;
      user-select: none;
      transition: background .22s;
      position: relative;
    }
    tr {
      transition: background 0.22s;
    }
    tr:nth-child(even) {
      background: #23243b77;
    }
    .samurai-row {
      opacity: 0;
      transform: translateX(0);
      animation-duration: 1.17s;
      animation-fill-mode: forwards;
    }
    .samurai-row.left {
      animation-name: samurai-in-left;
    }
    .samurai-row.right {
      animation-name: samurai-in-right;
    }
    @keyframes samurai-in-left {
      0% {opacity:0;transform:translateX(-80vw);}
      60%{opacity:.98;}
      100%{opacity:1;transform:translateX(0);}
    }
    @keyframes samurai-in-right {
      0% {opacity:0;transform:translateX(80vw);}
      60%{opacity:.98;}
      100%{opacity:1;transform:translateX(0);}
    }
    .status-cell {
      border-radius: 14px;
      min-width: 66px;
      display: inline-block;
      padding: 8px 15px;
      font-size: 1em;
      font-weight: 900;
      letter-spacing: 1.13px;
      color: #fff;
      background: linear-gradient(90deg,#ee0979,#ff6a00);
      box-shadow: 0 2px 10px #ee097977;
      border: 2.1px solid #ff6a00aa;
    }
    .delete-btn {
      background: linear-gradient(90deg, #e96443, #904e95 90%);
      color: #fff;
      border: none;
      border-radius: 18px;
      padding: 18px 70px;
      font-size: 1.21rem;
      margin: 33px auto 0 auto;
      cursor: pointer;
      font-weight: 900;
      letter-spacing: 1.3px;
      box-shadow: 0 6px 18px #e9644333, 0 2px 7px #e9644333;
      transition: background 0.23s, box-shadow 0.19s, transform .18s;
      display: block;
    }
    .delete-btn:hover {
      background: linear-gradient(90deg, #904e95 5%, #e96443 100%);
      box-shadow: 0 8px 24px #e9644344, 0 5px 10px #e9644344;
      transform: scale(1.045) translateY(-4px);
      letter-spacing: 2px;
    }
    .katana-slash {
      position: fixed;
      top: 0;
      left: 50vw;
      width: 7px;
      height: 100vh;
      background: linear-gradient(180deg,#fff,#ff8b60,#ff3864,#fff);
      box-shadow: 0 0 40px 15px #fff7, 0 0 180px 35px #ff386422;
      border-radius: 6px;
      z-index: 9999;
      animation: katana-slash-in .54s cubic-bezier(.95,-0.04,.29,1.24);
      pointer-events: none;
    }
    @keyframes katana-slash-in {
      0%   { opacity: 0; transform: scaleY(0) translateX(0);}
      40%  { opacity: 1; transform: scaleY(1.08) translateX(-2vw);}
      80%  { opacity: 1;}
      100% { opacity: 0; transform: scaleY(1) translateX(8vw);}
    }
    td, th {
      color: #fff;
      text-shadow: 0 2px 16px #fff6, 0 1px 8px #ff3864a8;
      font-weight: 900;
    }
    tr.samurai-row {
      background: rgba(44, 49, 80, 0.89);
      border-radius: 18px;
    }
    @media (max-width: 900px) {
      .container { padding: 7px 2px;}
      th,td{font-size:0.98em;padding:11px 2px;}
    }
    @media (max-width:600px){
      table,th,td{font-size:0.85em;}
      .container{max-width:100vw;}
      th{font-size:1.05em;}
    }
    ::selection {background: #ee097933;}
    ::-webkit-scrollbar {width:8px;background:#23243b;border-radius:7px;}
    ::-webkit-scrollbar-thumb {background:#ee097999;border-radius:7px;}
  </style>
</head>
<body>
  <div class="katana-slash"></div>
  <script>
    setTimeout(() => {
      document.querySelector('.katana-slash')?.remove();
    }, 850);
  </script>
  <div class="container">
    <h1>武士 MILANO LOG</h1>
    <table>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Status</th>
        <th>IP</th>
        <th>Client</th>
      </tr>
      ${
        logs.length === 0
          ? `<tr class="samurai-row left"><td colspan="5" style="color:#ffa;">No data found yet.</td></tr>`
          : logs.map((log, i) => `
        <tr class="samurai-row ${i % 2 === 0 ? 'left' : 'right'}">
          <td><b>${escape(log.day)}</b></td>
          <td style="font-family:monospace;">${escape(log.time)}</td>
          <td><span class="status-cell">${escape(log.status)}</span></td>
          <td>${escape(log.ip)}</td>
          <td style="color:#21d19f;">${escape(log.userAgent || log.href || '')}</td>
        </tr>
      `).join('')
      }
    </table>
    <button class="delete-btn" onclick="deleteAllLogs(event)">🗑️ DELETE ALL</button>
    <script>
      function deleteAllLogs(e) {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete all records?')) return;
        fetch('/delete-all', { method: 'POST' })
          .then(res => res.json())
          .then(json => {
            if (json.status === 'all_deleted') location.reload();
          });
      }
      window.addEventListener("DOMContentLoaded",()=>{
        document.querySelectorAll('.samurai-row').forEach((row,i)=>{
          row.style.animationDelay = \`\${0.23 + i*0.11}s\`;
        });
      });
    </script>
  </div>
</body>
</html>
  `);
});

app.listen(port, () => {
  console.log(\`Server is running at http://localhost:${port}\`);
});
