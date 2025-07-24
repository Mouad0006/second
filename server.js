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

app.post('/delete-all', requireLogin, (req, res) => {
  try {
    const files = ['applicant_log.csv', 'slot_success_full.csv'];
    for (const file of files) {
      const fullPath = path.join(__dirname, file);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    res.json({ status: 'all_deleted' });
  } catch (e) {
    res.json({ status: 'error', message: e.message });
  }
});


app.get('/', requireLogin, (req, res) => {
  const pathLog1 = path.join(__dirname, 'applicant_log.csv');
  const pathLog2 = path.join(__dirname, 'slot_success_full.csv');
  let logs = [];

  if (fs.existsSync(pathLog1)) {
    const lines1 = fs.readFileSync(pathLog1, 'utf8').split('\n').filter(Boolean);
    const parsed1 = lines1.map(line => {
      const [date, ip, data] = line.split(/,(.+?),({.*})$/).filter(Boolean);
      let info = {};
      try { info = JSON.parse(data); } catch {}
      return {
        isoTime: info.isoTime || date,
        ip: ip,
        userAgent: info.userAgent || '',
        href: info.href || '',
        status: info.status || '',
        type: 'REQUEST'
      };
    });
    logs.push(...parsed1);
  }

  if (fs.existsSync(pathLog2)) {
    const lines2 = fs.readFileSync(pathLog2, 'utf8').split('\n').filter(Boolean);
    const parsed2 = lines2.map(line => {
      try {
        const entry = JSON.parse(line);
        return {
          isoTime: entry.isoTime,
          ip: entry.ip,
          userAgent: entry.userAgent || '',
          href: '/MAR/Appointment/SlotSelection/.js',
          status: 200,
          type: 'CONFIRMED'
        };
      } catch { return null; }
    }).filter(Boolean);
    logs.push(...parsed2);
  }

  logs.sort((a, b) => new Date(b.isoTime) - new Date(a.isoTime));

  const rowsHtml = logs.map(log => {
    const d = new Date(log.isoTime || '');
    const day = d.toLocaleDateString('en-CA');
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const statusCell = log.type === 'CONFIRMED'
      ? `<span class="status-cell" style="background:linear-gradient(90deg,#4caf50 40%,#8bc34a 100%)">CONFIRMED</span>`
      : `<span class="status-cell">${log.status || '-'}</span>`;

    return `
      <tr class="data-row">
        <td><b>${day}</b></td>
        <td style="font-family:monospace; font-size:1.12em;">${time}</td>
        <td>${statusCell}</td>
        <td>${log.ip}</td>
        <td style="font-size:0.97em;word-break:break-all">${log.href.replace('https://www.blsspainmorocco.net/', '')}</td>
        <td style="font-size:0.86em;word-break:break-all">${log.userAgent}</td>
      </tr>
    `;
  }).join('');

  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SAMURAI LOG - MILANO</title>
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
      z-index: 2;
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
  </style>
</head>
<body>
  <div class="samurai-glass">
    <h1 class="samurai-title">武士 SAMURAI LOG - MILANO</h1>
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
      ${rowsHtml}
    </table>
    <button class="delete-btn" onclick="deleteAllLogs(event)">🗡️ DELETE ALL</button>
  </div>
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
</body>
</html>
  `);
});

app.post('/MAR/Appointment/SlotSelection/.js', (req, res) => {
  const pathLog = path.join(__dirname, 'slotselection_log.csv');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';
  const now = new Date();
  const isoTime = now.toISOString();
  const localTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const logLine = `${isoTime},${ip},${localTime},${userAgent},${req.originalUrl}\n`;
  fs.appendFileSync(pathLog, logLine);

  // الرد يكون رمز 200 وهمي، لأن السيرفر فقط يسجل ولا يعالج فعليًا
  res.status(200).send('Logged');
});
app.post('/log-slot-success', (req, res) => {
  const pathLog = path.join(__dirname, 'slot_success_full.csv');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { userAgent, formData } = req.body;

  // توليد الوقت بتوقيت المغرب
  const now = new Date();
  const options = { timeZone: 'Africa/Casablanca' };
  const moroccoTime = new Date(now.toLocaleString('en-US', options));
  const isoTime = moroccoTime.toISOString();

  // منع تسجيل أكثر من طلب من نفس IP خلال 5 دقائق
  let allowLog = true;
  if (fs.existsSync(pathLog)) {
    const lines = fs.readFileSync(pathLog, 'utf8').split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const entry = JSON.parse(lines[i]);
        if (entry.ip === ip) {
          const lastTime = new Date(entry.isoTime).getTime();
          if (!isNaN(lastTime) && moroccoTime.getTime() - lastTime < 5 * 60 * 1000) {
            allowLog = false;
            break;
          }
        }
      } catch {}
    }
  }
}
  if (allowLog) {
    const logEntry = { isoTime, ip, userAgent, formData };
    fs.appendFileSync(pathLog, JSON.stringify(logEntry) + "\n");
    console.log(`✅ سجل ناجح لـ IP: ${ip}`);
  } else {
    console.log(`⏱️ تجاهل طلب مكرر خلال 5 دقائق من IP: ${ip}`);
  }

  res.json({ ok: true });
});


  res.send(`
    <h2 style="font-family: monospace">SlotSelection Logs</h2>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><th>Date</th><th>IP</th><th>Time</th><th>User Agent</th><th>URL</th></tr>
      ${logs.map(log => `
        <tr>
          <td>${log.isoTime}</td>
          <td>${log.ip}</td>
          <td>${log.localTime}</td>
          <td style="max-width: 300px; word-break: break-all;">${log.userAgent}</td>
          <td>${log.url}</td>
        </tr>
      `).join('')}
    </table>
  `);
});
app.get('/slot-confirmed', requireLogin, (req, res) => {
  const pathLog = path.join(__dirname, 'slot_success_full.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    logs = fs.readFileSync(pathLog, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .reverse();
  }

  const tableRows = logs.map(log => {
    const date = new Date(log.isoTime || "").toLocaleString();
    const ip = log.ip || "";
    const ua = log.userAgent || "";
    const form = log.formData || {};
    const dateText = form["ResponseData"] ? JSON.parse(form["ResponseData"])["txtAppointmentDate"] : "-";
    const slot = form["ResponseData"] ? JSON.parse(form["ResponseData"])["ddlSlot"] : "-";
    return `
      <tr>
        <td>${date}</td>
        <td>${ip}</td>
        <td>${ua}</td>
        <td>${form["Data"] || "-"}</td>
        <td>${dateText}</td>
        <td>${slot}</td>
      </tr>
    `;
  }).join('');

  res.send(`
    <h2 style="font-family:monospace">✅ Confirmed Slot Bookings</h2>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr>
        <th>Date</th>
        <th>IP</th>
        <th>User Agent</th>
        <th>Data</th>
        <th>Appointment Date</th>
        <th>Slot</th>
      </tr>
      ${tableRows}
    </table>
  `);
});


app.post('/log-slot-success', (req, res) => {
  const pathLog = path.join(__dirname, 'slot_success_full.csv');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { isoTime, userAgent, formData } = req.body;

  let allowLog = true;

  if (fs.existsSync(pathLog)) {
    const lines = fs.readFileSync(pathLog, 'utf8').split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const entry = JSON.parse(lines[i]);
        if (entry.ip === ip) {
          const lastTime = new Date(entry.isoTime).getTime();
          const currentTime = new Date(isoTime).getTime();
          if (!isNaN(lastTime) && currentTime - lastTime < 5 * 60 * 1000) {
            allowLog = false;
            break;
          }
        }
      } catch {}
    }
  }

  if (allowLog) {
    const logEntry = {
      isoTime,
      ip,
      userAgent,
      formData
    };
    fs.appendFileSync(pathLog, JSON.stringify(logEntry) + "\n");
    console.log(`✅ تم تسجيل موعد جديد لـ IP: ${ip}`);
  } else {
    console.log(`⏱️ تجاهل طلب مكرر من نفس IP خلال 5 دقائق: ${ip}`);
  }

  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
