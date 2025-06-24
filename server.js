const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 4000;

// CORS Middleware
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

const AUTH_USER = "Milano";
const AUTH_PASS = "Mouad2006@";

// Sakura petals SVG (base64)
const sakuraSvg = 'data:image/svg+xml;base64,' + Buffer.from(`<svg width="26" height="22" viewBox="0 0 26 22" xmlns="http://www.w3.org/2000/svg"><path d="M13 1 Q17 5 20 13 Q22 17 13 21 Q4 17 6 13 Q9 5 13 1Z" fill="#ffd7ea" stroke="#e880b5" stroke-width="2"/></svg>`).toString('base64');

// Login Page HTML
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
      background: #18192e;
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      overflow: hidden;
      position: relative;
    }
    #sakura-bg {
      position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
      z-index: 0; pointer-events: none; opacity: 0.34;
    }
    .glass-card {
      background: rgba(29,38,73,0.98);
      border-radius: 22px;
      box-shadow: 0 10px 40px #ad121233, 0 1.5px 14px #ffe18f44, 0 0px 2px 1px #ffe18f77;
      padding: 48px 38px 36px 38px;
      min-width: 340px; max-width: 96vw;
      display: flex; flex-direction: column; align-items: center;
      position: relative; z-index: 2;
      animation: cardIn 1s cubic-bezier(.72,1.3,.58,1) 1;
      margin: auto;
    }
    @keyframes cardIn {
      from { transform: scale(.88) translateY(55px); opacity: 0; }
      to   { transform: scale(1)   translateY(0);    opacity: 1; }
    }
    .logo {
      font-size: 2.44rem;
      font-weight: 900;
      letter-spacing: 2.1px;
      background: linear-gradient(90deg,#ffe18f 5%, #ad1212 80%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 18px;
      text-shadow: 0 3px 18px #ad121288, 0 1px 5px #ffe18f44;
      transition: letter-spacing .18s;
    }
    .glass-card:hover .logo { letter-spacing: 2.8px; }
    h2 {
      color: #ffe18f; margin: 7px 0 29px 0;
      font-size: 1.29rem; font-weight: 900; letter-spacing: 1.15px; text-align: center;
      text-shadow: 0 1px 11px #ffe18f88;
    }
    .login-form { width: 100%; display: flex; flex-direction: column; gap: 15px; margin-bottom: 6px;}
    .input-box {
      position: relative; width: 100%; margin-bottom: 0px; display: flex; align-items: center;
    }
    .input-box input {
      flex: 1; padding: 14px 16px 14px 42px; font-size: 1.09rem;
      background: rgba(30, 34, 55, 0.94); border: 2.1px solid #ffe18f55; color: #e7eef7;
      border-radius: 13px; outline: none; font-family: inherit; font-weight: 700;
      box-shadow: 0 3px 17px #ffe18f18, 0 1px 2px #0001;
      transition: border 0.21s, background 0.24s, box-shadow .28s; margin-bottom: 8px; box-sizing: border-box;
    }
    .input-box input:focus { border-color: #ffe18f; background: rgba(32, 46, 89, 0.97); box-shadow: 0 4px 19px #ffe18f33;}
    .input-box .icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: #ffe18f; font-size: 1.18em; opacity: 0.82; pointer-events: none; transition: color 0.19s;
    }
    .input-box input:focus ~ .icon { color: #ad1212; opacity: 1; }
    .login-btn {
      width: 100%; background: linear-gradient(90deg, #ad1212 5%, #ffe18f 100%);
      color: #fff; font-size: 1.18rem; padding: 14px 0; border: none; border-radius: 14px;
      font-weight: 900; letter-spacing: 1.32px; cursor: pointer; margin-top: 12px;
      box-shadow: 0 6px 18px #ad121233, 0 2px 7px #ffe18f22;
      transition: background 0.22s, box-shadow 0.18s, transform .18s; transform: translateY(0);
      outline: none; border-bottom: 2px solid #ffe18f;
    }
    .login-btn:hover, .login-btn:focus {
      background: linear-gradient(90deg, #ffe18f 5%, #ad1212 100%);
      box-shadow: 0 8px 22px #ffe18f3a, 0 5px 10px #ad121244;
      transform: translateY(-4px) scale(1.025); border-bottom: 3.5px solid #ad1212;
      letter-spacing: 2.5px; color: #ad1212;
    }
    .error-msg {
      color: #e74c3c; font-weight: 900; font-size: 1.09em;
      text-align: center; margin-bottom: 11px; margin-top: -8px; letter-spacing: 1.13px;
      background: #fff5f5; padding: 7px 0 3px 0; border-radius: 7px;
      box-shadow: 0 2px 8px #e74c3c21;
    }
    @media (max-width: 600px) {
      .glass-card { padding: 22px 3vw; min-width: 90vw;}
      .logo { font-size: 1.34rem;}
    }
  </style>
</head>
<body>
  <canvas id="sakura-bg"></canvas>
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
  <script>
    // Sakura effect
    const canvas = document.getElementById('sakura-bg');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth, height = window.innerHeight;
    function resizeCanvas() {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    const petalImg = (() => {
      let img = new window.Image();
      img.src = '${sakuraSvg}';
      return img;
    })();
    function random(min, max) { return min + Math.random() * (max - min); }
    class Petal {
      constructor() {
        this.x = random(0, width); this.y = random(-40, -10); this.r = random(12, 25);
        this.speed = random(0.5, 1.5); this.amp = random(8, 38); this.phase = random(0, Math.PI * 2);
        this.swing = random(0.5, 1.2); this.angle = random(0, 360); this.spin = random(-0.015, 0.015);
        this.opacity = random(0.6, 1);
      }
      move() { this.y += this.speed; this.x += Math.sin(this.y / 30 + this.phase) * this.swing; this.angle += this.spin; if (this.y > height + 30) this.reset(); }
      reset() { this.x = random(0, width); this.y = random(-40, -10); this.r = random(12, 25); this.speed = random(0.5, 1.5); this.amp = random(8, 38); this.phase = random(0, Math.PI * 2); this.swing = random(0.5, 1.2); this.angle = random(0, 360); this.spin = random(-0.015, 0.015); this.opacity = random(0.6, 1);}
      draw(ctx) { ctx.save(); ctx.globalAlpha = this.opacity; ctx.translate(this.x, this.y); ctx.rotate(this.angle); ctx.drawImage(petalImg, -this.r/2, -this.r/2, this.r, this.r); ctx.restore();}
    }
    const petals = []; for(let i=0;i<18;i++) petals.push(new Petal());
    function animate() { ctx.clearRect(0, 0, width, height); for (let petal of petals) {petal.move(); petal.draw(ctx);} requestAnimationFrame(animate);}
    animate();
  </script>
</body>
</html>
  `;
}

// تسجيل الدخول في كل دخول (مسح الجلسة مع كل دخول جديد)
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  req.session.loggedIn = false; // Always require login
  res.send(loginPage());
}

// استلام السجلات من CALENDRIA (فقط status == 200 كل 5 دقائق لنفس IP)
const recentLogsByIp = {};
app.post('/log', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const status = req.body.status;
  if (status !== 200) return res.json({ ok: true, ignored: true });

  const now = Date.now();
  if (recentLogsByIp[ip] && now - recentLogsByIp[ip] < 5 * 60 * 1000) {
    return res.json({ ok: true, skipped: true });
  }
  recentLogsByIp[ip] = now;

  const logLine = `${req.body.isoTime || ''},${ip},${req.body.localTime || ''},${req.body.status || ''},${req.body.userAgent || ''}\n`;
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  fs.appendFileSync(pathLog, logLine);
  res.json({ ok: true });
});

// صفحة الجدول
app.get('/', requireLogin, (req, res) => {
  req.session.loggedIn = false; // force login on every refresh
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    logs = fs.readFileSync(pathLog, 'utf-8').trim().split('\n').filter(Boolean).map(line => {
      const [iso, ip, localTime, status, userAgent] = line.split(',', 5);
      const d = new Date(iso);
      const day = isNaN(d) ? '' : d.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
      const time = isNaN(d) ? (localTime || '') : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return { day, time, status, ip, userAgent };
    });
  }

  // HTML الجدول مع الساكورا
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>武士 MILANO LOG</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
  <style>
    html, body { height: 100%; min-height: 100vh; margin: 0; padding: 0; box-sizing: border-box; background: #18192e; overflow-x: hidden;}
    #sakura-bg { position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; opacity: 0.34;}
    .container { position: relative; z-index: 2; margin: 60px auto 0 auto; width: 98vw; max-width: 1100px; background: rgba(34,38,59,0.96); border-radius: 32px; box-shadow: 0 12px 48px #ad121255, 0 2px 16px #ffe18f55, 0 0px 2px 1px #ffe18f77; padding: 48px 18px 38px 18px; animation: fadeInUp 1.1s cubic-bezier(.72,1.3,.58,1) 1; backdrop-filter: blur(2.8px);}
    @keyframes fadeInUp { from { opacity:0; transform:translateY(60px) scale(.93);} to {opacity:1;transform:translateY(0) scale(1);}}
    h1 { text-align: center; font-size: 2.32rem; color: #fff; letter-spacing: 2.2px; font-weight: 900; margin-bottom: 44px; background: linear-gradient(90deg, #ffe18f 20%, #ad1212 70%); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 7px 26px #ad121245, 0 1px 10px #ffe18f77; position: relative;}
    h1::after { content: ''; display: block; margin: 0 auto; margin-top: 17px; height: 4px; width: 76px; border-radius: 6px; background: linear-gradient(90deg, #ad1212 5%, #ffe18f 100%); opacity: 0.67; box-shadow: 0 2px 8px #b4b6fa33; animation: shine 2.7s linear infinite;}
    @keyframes shine {0% {opacity:.25;}50% {opacity:1;}100% {opacity:.25;}}
    table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 18px; background: rgba(44, 49, 80, 0.99); box-shadow: 0 6px 30px #ad121233; border-radius: 18px; overflow: hidden; font-size: 1.13em; animation: fadeTable 1.5s;}
    @keyframes fadeTable { from {opacity:0;transform:scale(.97);} to {opacity:1;transform:scale(1);}}
    th, td {padding:17px 7px;text-align:center;border:none;}
    th {background: linear-gradient(90deg, #222a42 60%, #ad121222 100%);color: #ffe18f;font-weight: 900;font-size: 1.14em;letter-spacing: 1.15px;border-bottom: 2.7px solid #ffe18f44;user-select: none;transition: background .22s;position: relative;}
    tr { transition: background 0.22s; }
    tr:nth-child(even) { background: #23243b77; }
    .samurai-row { opacity: 0; transform: translateX(0); animation-duration: 1.17s; animation-fill-mode: forwards;}
    .samurai-row.left { animation-name: samurai-in-left; }
    .samurai-row.right { animation-name: samurai-in-right; }
    @keyframes samurai-in-left { 0% {opacity:0;transform:translateX(-80vw);} 60%{opacity:.98;} 100%{opacity:1;transform:translateX(0);}}
    @keyframes samurai-in-right { 0% {opacity:0;transform:translateX(80vw);} 60%{opacity:.98;} 100%{opacity:1;transform:translateX(0);}}
    .status-cell { border-radius: 14px; min-width: 66px; display: inline-block; padding: 8px 15px; font-size: 1em; font-weight: 900; letter-spacing: 1.13px; color: #fff; background: linear-gradient(90deg,#ad1212,#ffe18f); box-shadow: 0 2px 10px #ffe18f99; border: 2.1px solid #ffe18faa;}
    .delete-btn { background: linear-gradient(90deg, #ad1212, #ffe18f 90%); color: #fff; border: none; border-radius: 18px; padding: 18px 70px; font-size: 1.21rem; margin: 33px auto 0 auto; cursor: pointer; font-weight: 900; letter-spacing: 1.3px; box-shadow: 0 6px 18px #ad121233, 0 2px 7px #ffe18f33; transition: background 0.23s, box-shadow 0.19s, transform .18s; display: block;}
    .delete-btn:hover { background: linear-gradient(90deg, #ffe18f 5%, #ad1212 100%); box-shadow: 0 8px 24px #ffe18f44, 0 5px 10px #ad121244; transform: scale(1.045) translateY(-4px); letter-spacing: 2px; color: #ad1212;}
    td, th { color: #fff; text-shadow: 0 2px 16px #fff6, 0 1px 8px #ffe18fa8; font-weight: 900;}
    tr.samurai-row { background: rgba(44, 49, 80, 0.89); border-radius: 18px;}
    @media (max-width: 900px) { .container { padding: 7px 2px;} th,td{font-size:0.98em;padding:11px 2px;} }
    @media (max-width:600px){ table,th,td{font-size:0.85em;} .container{max-width:100vw;} th{font-size:1.05em;} }
    ::selection {background: #ffe18f33;}
    ::-webkit-scrollbar {width:8px;background:#23243b;border-radius:7px;}
    ::-webkit-scrollbar-thumb {background:#ffe18f99;border-radius:7px;}
  </style>
</head>
<body>
  <canvas id="sakura-bg"></canvas>
  <div class="container">
    <h1>武士 MILANO LOG</h1>
    <table>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Status</th>
        <th>IP</th>
        <th>User Agent</th>
      </tr>
      ${
        logs.length === 0
        ? `<tr class="samurai-row left"><td colspan="5" style="color:#ffa;">No data found yet.</td></tr>`
        : logs.map((log, i) => `
        <tr class="samurai-row ${i % 2 === 0 ? 'left' : 'right'}">
          <td><b>${log.day}</b></td>
          <td style="font-family:monospace;">${log.time}</td>
          <td><span class="status-cell">${log.status}</span></td>
          <td>${log.ip}</td>
          <td style="color:#ffe18f;">${log.userAgent || ''}</td>
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
      // Sakura Petals Effect
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
        img.src = '${sakuraSvg}';
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
      for(let i=0;i<22;i++) petals.push(new Petal());
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
  </div>
</body>
</html>
  `);
});

// حذف كل السجلات
app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

// تسجيل الدخول
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
