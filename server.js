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

app.use(session({ secret: 'milanoSecret', resave: false, saveUninitialized: true }));

const AUTH_USER = "Milano";
const AUTH_PASS = "Mouad2006@";

// صفحة تسجيل الدخول عادية (بدون مؤثرات)
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
        background: #1b2232;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
      }
      .glass-card {
        background: rgba(29,38,73,0.98);
        border-radius: 22px;
        box-shadow: 0 10px 40px 0 #00357266;
        padding: 48px 38px 36px 38px;
        min-width: 340px;
        max-width: 96vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
      }
      .logo {
        font-size: 2.1rem;
        font-weight: 900;
        color: #f4d9ff;
        margin-bottom: 18px;
        letter-spacing: 2.1px;
        text-shadow: 0 3px 18px #bbb7fc8c;
      }
      .login-form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 6px;
      }
      .input-box input {
        width: 100%;
        padding: 14px 16px;
        font-size: 1.07rem;
        background: rgba(30, 34, 55, 0.94);
        border: 2.1px solid #7e22ce55;
        color: #e7eef7;
        border-radius: 13px;
        outline: none;
        font-family: inherit;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .input-box input:focus {
        border-color: #f472b6;
        background: rgba(32, 46, 89, 0.97);
      }
      .login-btn {
        width: 100%;
        background: linear-gradient(90deg, #be185d 5%, #312e81 100%);
        color: #fff;
        font-size: 1.1rem;
        padding: 12px 0;
        border: none;
        border-radius: 14px;
        font-weight: 900;
        letter-spacing: 1.32px;
        cursor: pointer;
        margin-top: 12px;
        box-shadow: 0 6px 18px #be185d33, 0 2px 7px #4338ca22;
      }
      .login-btn:hover {
        background: linear-gradient(90deg, #312e81 5%, #be185d 100%);
      }
      .error-msg {
        color: #e74c3c;
        font-weight: 900;
        font-size: 1.09em;
        text-align: center;
        margin-bottom: 11px;
        background: #fff5f5;
        padding: 7px 0 3px 0;
        border-radius: 7px;
      }
    </style>
  </head>
  <body>
    <form class="glass-card" method="POST" autocomplete="off">
      <div class="logo">WANО LOG — MILANO</div>
      ${error ? `<div class="error-msg">${error}</div>` : ""}
      <div class="login-form">
        <div class="input-box">
          <input name="username" type="text" required placeholder="Username" autocomplete="username">
        </div>
        <div class="input-box">
          <input name="password" type="password" required placeholder="Password" autocomplete="current-password">
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
  req.session.loggedIn = false;
  if (req.session && req.session.loggedIn) return next();
  res.send(loginPage());
}

// استقبال السجلات
app.post('/log', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // يسجل فقط الطلبات التي فيها status == 200
  if (req.body && req.body.status == 200) {
    const line = `${new Date().toISOString()},${ip},${JSON.stringify(req.body)}\n`;
    fs.appendFileSync(pathLog, line);
  }
  res.json({ ok: true });
});

// صفحة الجدول الرئيسية
app.get('/', requireLogin, (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let logs = [];
  if (fs.existsSync(pathLog)) {
    logs = fs.readFileSync(pathLog, 'utf-8')
      .trim().split('\n').map(line => {
        const [date, ip, infoRaw] = line.split(',', 3);
        let info = {};
        try { info = JSON.parse(infoRaw); } catch {}
        return {
          date, ip,
          localTime: info.localTime || '',
          page: info.href || '',
          status: info.status || '',
          userAgent: info.userAgent || ''
        };
      }).reverse();
  }

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WANO LOG — MILANO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      min-height: 100vh;
      background: #1e2338;
      background: linear-gradient(120deg, #1e2338 70%, #23243b 100%);
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .container {
      margin: 44px auto;
      background: rgba(27,29,46,0.98);
      border-radius: 28px;
      box-shadow: 0 12px 40px 0 #00357266, 0 2px 16px 0 #c084fc55;
      padding: 38px 19px 35px 19px;
      width: 98vw;
      max-width: 1060px;
    }
    h1 {
      text-align:center;
      font-size:2.15rem;
      color:#f3e8ff;
      letter-spacing:2.3px;
      font-weight:900;
      margin-bottom:31px;
      margin-top:0;
      text-shadow: 0 3px 18px #b4ade6a4;
    }
    table {
      width:100%;
      border-collapse:separate;
      border-spacing:0;
      margin-top:18px;
      background:rgba(34,38,59,0.99);
      border-radius:18px;
      overflow:hidden;
      font-size:1.09em;
      box-shadow:0 5px 24px #d8b4fe28;
    }
    th, td {
      padding:14px 7px;
      text-align:center;
      border:none;
      color: #fff;
    }
    th {
      background:#332858;
      color:#a21caf;
      font-size:1.13em;
      letter-spacing:1.07px;
      font-weight:900;
      border-bottom: 2px solid #a21caf38;
    }
    tr { transition:background 0.18s;}
    tr:nth-child(even) {background:#252035a4;}
    tr:hover {background:#8b5cf62e;}
    .status-cell {
      border-radius:10px;
      min-width:56px;
      display:inline-block;
      padding:8px 15px;
      font-size:1em;
      font-weight:900;
      letter-spacing:1.05px;
      background: #a21caf;
      color: #fff;
      box-shadow:0 2px 8px #c084fc50;
    }
    .delete-btn {
      background: linear-gradient(90deg, #be185d 15%, #a21caf 100%);
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 14px 52px;
      font-size: 1.12rem;
      margin: 33px auto 0 auto;
      cursor: pointer;
      font-weight: 900;
      letter-spacing: 1.2px;
      box-shadow: 0 6px 18px #be185d33, 0 2px 7px #4338ca22;
      transition: background 0.23s, box-shadow 0.19s, transform .17s;
      display: block;
    }
    .delete-btn:hover {
      background: linear-gradient(90deg, #a21caf 5%, #be185d 100%);
      box-shadow: 0 8px 24px #be185d44;
      transform: scale(1.04) translateY(-3px);
    }
    ::selection { background: #be185d33; }
    ::-webkit-scrollbar { width:7px;background:#23243b;border-radius:6px;}
    ::-webkit-scrollbar-thumb {background:#a21cafbb;border-radius:7px;}
  </style>
</head>
<body>
  <div class="container">
    <h1>WANO LOG — MILANO</h1>
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
          <td style="font-size:0.93em;word-break:break-all">${log.page ? log.page.replace('https://www.blsspainmorocco.net/', '') : ''}</td>
          <td><span class="status-cell">${log.status ? log.status : '-'}</span></td>
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
