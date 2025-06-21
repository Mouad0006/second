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

// بيانات تسجيل الدخول (يمكنك تغييرها)
const AUTH_USER = "admin";
const AUTH_PASS = "mypass123";

// صفحة تسجيل الدخول (تصميم احترافي انجليزي)
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
  // سجل كامل الكائن المرسل من العميل (يدعم id, sentAt ... إلخ)
  const line = `${new Date().toISOString()},${ip},${JSON.stringify(req.body)}\n`;
  fs.appendFileSync(pathLog, line);
  res.json({ ok: true });
});

app.get('/', requireLogin, (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let all = [];
  if (fs.existsSync(pathLog)) {
    all = fs.readFileSync(pathLog, 'utf-8')
      .trim().split('\n').map(line => {
        const [date, ip, infoRaw] = line.split(',', 3);
        let info = {};
        try { info = JSON.parse(infoRaw); } catch {}
        let localDate = info.localTime || "";
        let localHour = info.isoTime ? (new Date(info.isoTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })) : "";
        if (!localDate && info.sentAt) {
          try {
            const d = new Date(info.sentAt);
            localDate = d.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            localHour = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          } catch {}
        }
        return { date, ip, ...info, localDate, localHour };
      });
  }

  // بناء جداول منفصلة حسب المدينة ونوع الفيزا
  let grouped = {};
  for (const log of all) {
    const city = (log.city || "Unknown").toLowerCase();
    const visa = (log.visa || "Unknown").toLowerCase();
    if (!grouped[city]) grouped[city] = {};
    if (!grouped[city][visa]) grouped[city][visa] = [];
    grouped[city][visa].push(log);
  }

  let allTables = '';
  Object.keys(grouped).forEach(city => {
    Object.keys(grouped[city]).forEach(visa => {
      const rows = grouped[city][visa];
      if (!rows.length) return;
      const clientList = [];
      allTables += `
      <div style="margin:38px 0 40px 0; border-radius:22px; background:rgba(36,44,74,.97); box-shadow:0 8px 30px #00357255; padding:19px 7px;">
        <h2 style="color:#ee3445; font-size:1.21em; letter-spacing:1.6px; font-weight:900; margin-bottom:10px;">
          City: <span style="color:#1fd1f9">${city.charAt(0).toUpperCase() + city.slice(1)}</span>
           | Visa: <span style="color:#21d19f">${visa.toUpperCase()}</span>
        </h2>
        <table style="width:100%; margin-bottom:12px;">
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>IP</th>
            <th>Client</th>
          </tr>
          ${rows.map(log => {
            let idx = clientList.indexOf(log.clientId);
            if (idx === -1) {
              clientList.push(log.clientId);
              idx = clientList.length - 1;
            }
            const orderNames = [
              "FIRST CLIENT", "SECOND CLIENT", "THIRD CLIENT", "FOURTH CLIENT", "FIFTH CLIENT",
              "SIXTH CLIENT", "SEVENTH CLIENT", "EIGHTH CLIENT", "NINTH CLIENT", "TENTH CLIENT"
            ];
            const clientLabel = orderNames[idx] || `CLIENT ${idx + 1}`;
            let statusClass = log.status == 200 ? 'status-200' : (log.status == 302 ? 'status-302' : (log.status ? 'status-other' : 'status-null'));
            return `
              <tr>
                <td><b>${log.localDate || ''}</b></td>
                <td style="font-family:monospace; font-size:1.11em;">${log.localHour || ''}</td>
                <td><span class="status-cell ${statusClass}">${log.status ? log.status : '-'}</span></td>
                <td>${log.ip || ''}</td>
                <td style="font-size:1.03em;font-weight:700;color:#1fd1f9;letter-spacing:1.2px;">${clientLabel}</td>
              </tr>
            `;
          }).join('')}
        </table>
      </div>
      `;
    });
  });

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Booking Log | MILANO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body { background: linear-gradient(135deg, #23243b 0%, #2376ae 100%);
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; margin:0; min-height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; }
    h1 { text-align:center; font-size:2.17rem; color:#1fd1f9; letter-spacing:2.2px; font-weight:900; margin:36px auto 14px auto; background:linear-gradient(90deg, #1fd1f9 5%, #21d19f 100%); -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow:0 4px 20px #1fd1f933, 0 1px 10px #1fd1f933;}
    table { width:100%; border-collapse:separate; border-spacing:0; margin-top:8px; background:rgba(33,41,66,0.98); box-shadow:0 5px 24px #21d19f26; border-radius:18px; overflow:hidden; font-size:1.08em;}
    th, td {padding:17px 7px;text-align:center;border:none;}
    th {background:linear-gradient(90deg, #222a42 60%, #21d19f22 100%);color:#1fd1f9;font-weight:900;font-size:1.14em;letter-spacing:1.15px;}
    .status-cell {border-radius:12px;min-width:66px;display:inline-block;padding:8px 15px;font-size:1em;font-weight:900;letter-spacing:1.15px;}
    .status-200 {background:#21d19f;color:#fff;}
    .status-302 {background: #ffe066; color: #2a2a2a;}
    .status-other {background: #e74c3c; color: #fff;}
    .status-null {background: #282b34; color: #bbb;}
    .delete-btn {background:linear-gradient(90deg, #ff5858, #21d19f 90%);color:#fff;border:none;border-radius:14px;padding:16px 54px;font-size:1.17rem;margin:33px auto 0 auto;cursor:pointer;font-weight:900;letter-spacing:1.2px;}
    .delete-btn:hover {background:linear-gradient(90deg, #21d19f 5%, #ff5858 100%);}
  </style>
</head>
<body>
  <h1>📝 Booking Attempts Log (Grouped)</h1>
  <div style="width:98vw; max-width:1150px; margin:0 auto;">
    ${allTables}
    <button class="delete-btn" onclick="deleteAllLogs(event)">🗑️ DELETE ALL</button>
  </div>
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
