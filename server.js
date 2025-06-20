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

// بيانات تسجيل الدخول (غيرها كما تريد)
const AUTH_USER = "Milano";
const AUTH_PASS = "Mouad2006@";

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

function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.send(loginPage());
}

// ======== LOG ROUTE - مفتوح للكل ========
app.post('/log', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const line = `${new Date().toISOString()},${ip},${JSON.stringify(req.body)}\n`;
  fs.appendFileSync(pathLog, line);
  res.json({ ok: true });
});

function cityTablePage(cityTables) {
  const cities = [
    { id: "casablanca", label: "Casablanca" },
    { id: "nador", label: "Nador" },
    { id: "tangier", label: "Tangier" },
    { id: "tetouan", label: "Tetouan" },
    { id: "agadir", label: "Agadir" },
    { id: "rabat", label: "Rabat" }
  ];
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Select City | MILANO Log</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body { background: linear-gradient(135deg, #23243b 0%, #2376ae 100%);
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; margin:0; min-height:100vh;
      display:flex; justify-content:center; align-items:center; flex-direction:column; }
    h1 {
      text-align: center;
      font-size: 2.17rem;
      color: #ee3445;
      letter-spacing: 2.2px;
      font-weight: 900;
      margin-bottom: 34px;
      text-shadow: 0 4px 20px #ee344455, 0 1px 10px #ee344455;
      position: relative;
    }
    .city-bar {
      display: flex;
      gap: 18px;
      justify-content: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .city-btn {
      background: linear-gradient(90deg, #ff4747 0%, #ff7676 100%);
      color: #fff;
      font-size: 1.12rem;
      font-weight: 900;
      letter-spacing: 1.18px;
      padding: 18px 36px;
      border: none;
      border-radius: 14px;
      box-shadow: 0 3px 18px #ee344544, 0 1.5px 5px #ee344544;
      cursor: pointer;
      transition: background .19s, box-shadow .19s, transform .18s, width .42s cubic-bezier(.22,1.2,.58,1.1);
      position: relative;
      z-index: 2;
      outline: none;
      min-width: 138px;
    }
    .city-btn.active, .city-btn:focus {
      background: linear-gradient(90deg, #ee3445 0%, #c42039 100%);
      box-shadow: 0 8px 22px #ee344577, 0 1.5px 9px #ee344533;
      color: #fff;
      transform: scale(1.085) translateY(-5px);
      min-width: 260px;
    }
    .city-content {
      width: 100%;
      max-width: 1060px;
      margin: 0 auto;
      margin-top: -5px;
      background: rgba(34,38,59,0.98);
      border-radius: 0 0 22px 22px;
      box-shadow: 0 8px 32px #ee344522, 0 1.5px 9px #21d19f33;
      padding: 0 18px 30px 18px;
      opacity: 0;
      height: 0;
      pointer-events: none;
      overflow: hidden;
      transform: scaleY(0.9);
      transition: opacity 0.3s cubic-bezier(.35,1.5,.58,1.05), height .45s cubic-bezier(.55,1.33,.54,1), transform .35s;
      will-change: opacity, height;
      position: relative;
      z-index: 1;
    }
    .city-content.active {
      opacity: 1;
      pointer-events: auto;
      height: auto;
      transform: scaleY(1.02);
      margin-bottom: 25px;
      transition-delay: .09s;
    }
    @media (max-width:900px){ .city-content{padding:0 2vw 10vw 2vw;} .city-btn{padding:10px 14px;} }
    @media (max-width:600px){ .city-bar{gap:10px;} .city-content{max-width:98vw;} .city-btn{font-size:.93em;} }
    ::selection{background: #ee344544;}
    ::-webkit-scrollbar{width:7px;background:#23243b;border-radius:6px;}
    ::-webkit-scrollbar-thumb{background:#ee344599;border-radius:7px;}
  </style>
</head>
<body>
  <h1>Select a City</h1>
  <div class="city-bar">
    ${cities.map((c, i) => `
      <button class="city-btn" id="btn-${c.id}" onclick="openCity('${c.id}')">${c.label}</button>
    `).join('')}
  </div>
  ${cities.map(c => `
    <div class="city-content" id="content-${c.id}">
      ${cityTables[c.id] || `<div style="color:#ccc; padding:45px 0; text-align:center; font-size:1.4em;">No records for ${c.label}.</div>`}
    </div>
  `).join('')}
  <script>
    function openCity(city) {
      document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.city-content').forEach(c => c.classList.remove('active'));
      document.getElementById('btn-' + city).classList.add('active');
      document.getElementById('content-' + city).classList.add('active');
    }
    // افتح أول مدينة افتراضيًا لو تريد
    openCity('${cities[0].id}');
  </script>
</body>
</html>
`;
}


app.get('/', requireLogin, (req, res) => {
  res.send(cityButtonsPage());
});

// صفحة جدول المدينة
app.get('/city/:city', requireLogin, (req, res) => {
  const { city } = req.params;
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  let result = [];
  if (fs.existsSync(pathLog)) {
    result = fs.readFileSync(pathLog, 'utf-8')
      .trim().split('\n').map(line => {
        const [date, ip, infoRaw] = line.split(',', 3);
        let info = {};
        try { info = JSON.parse(infoRaw); } catch {}
        let localDate = "";
        let localHour = "";
        if (info.sentAt) {
          try {
            const d = new Date(info.sentAt);
            localDate = d.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            localHour = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          } catch {}
        }
        return { date, ip, ...info, localDate, localHour };
      }).filter(log => log.city && log.city.toLowerCase() === city.toLowerCase())
        .reverse();
  }
  // استخدم نفس واجهة الجدول العصرية السابقة مع عنوان المدينة
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${city.charAt(0).toUpperCase() + city.slice(1)} Log | MILANO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body { background: linear-gradient(135deg, #23243b 0%, #2376ae 100%);
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; margin:0; min-height:100vh; display:flex; justify-content:center; align-items:flex-start; overflow-x:hidden;}
    .container { margin-top:48px; width:98vw; max-width:1000px; background:rgba(34,38,59,0.98); border-radius:28px; box-shadow:0 12px 40px #00357266, 0 2px 16px #1fd1f955, 0 0px 2px 1px #21d19f77; padding:40px 15px 35px 15px; animation:fadeInUp 0.88s cubic-bezier(.72,1.3,.58,1) 1; backdrop-filter:blur(2.8px);}
    @keyframes fadeInUp { from { opacity:0; transform:translateY(60px) scale(.93);} to {opacity:1;transform:translateY(0) scale(1);}}
    h1 { text-align:center; font-size:2.17rem; color:#1fd1f9; letter-spacing:2.2px; font-weight:900; margin-bottom:34px; background:linear-gradient(90deg, #1fd1f9 5%, #21d19f 100%); -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow:0 4px 20px #21d19f33, 0 1px 10px #1fd1f933; position:relative;}
    h1::after {content:'';display:block;margin:0 auto;margin-top:13px;height:4px;width:64px;border-radius:6px;background:linear-gradient(90deg,#1fd1f9 5%,#21d19f 100%);opacity:0.48;box-shadow:0 2px 8px #21d19f44;animation:shine 2.8s linear infinite;}
    @keyframes shine {0% {opacity:.25;}50% {opacity:1;}100% {opacity:.25;}}
    table { width:100%; border-collapse:separate; border-spacing:0; margin-top:18px; background:rgba(33,41,66,0.98); box-shadow:0 5px 24px #21d19f26; border-radius:18px; overflow:hidden; font-size:1.08em; animation:fadeTable 1.4s;}
    @keyframes fadeTable { from {opacity:0;transform:scale(.97);} to {opacity:1;transform:scale(1);}}
    th, td {padding:17px 7px;text-align:center;border:none;}
    th {background:linear-gradient(90deg, #222a42 60%, #21d19f22 100%);color:#1fd1f9;font-weight:900;font-size:1.14em;letter-spacing:1.15px;border-bottom:2.7px solid #21d19f44;user-select:none;transition:background .22s;position:relative;}
    th i {font-style:normal;font-size:1.11em;margin-right:4px;color:#21d19f99;}
    tr {transition:background 0.22s;}
    tr:nth-child(even) {background:#23243b77;}
    tr:hover {background:linear-gradient(90deg, #1fd1f925 15%, #2fc7fc10 100%);box-shadow:0 2px 10px #1fd1f933;cursor:pointer;}
    tr:last-child { border-bottom: none; }
    .status-cell {border-radius:12px;min-width:66px;display:inline-block;padding:8px 15px;font-size:1em;box-shadow:0 2px 9px #181a2166;transition:background 0.3s,color 0.3s;font-weight:900;letter-spacing:1.15px;}
    .status-200 {background:#21d19f;color:#fff;box-shadow:0 2px 8px #21d19f55;border:2.1px solid #1fd1f9aa;}
    .status-302 {background: #ffe066; color: #2a2a2a; border: 2.1px solid #ffe066;}
    .status-other {background: #e74c3c; color: #fff; border: 2.1px solid #e74c3c;}
    .status-null {background: #282b34; color: #bbb; border: 2.1px solid #222b33;}
    .delete-btn {background:linear-gradient(90deg, #ff5858, #21d19f 90%);color:#fff;border:none;border-radius:14px;padding:16px 54px;font-size:1.17rem;margin:33px auto 0 auto;cursor:pointer;font-weight:900;letter-spacing:1.2px;box-shadow:0 6px 18px #e74c3c33, 0 2px 7px #21d19f22;transition:background 0.23s, box-shadow 0.19s, transform .17s;display:block;}
    .delete-btn:hover {background:linear-gradient(90deg, #21d19f 5%, #ff5858 100%);box-shadow:0 8px 24px #e74c3c44, 0 5px 10px #21d19f33;transform:scale(1.045) translateY(-4px);letter-spacing:2px;}
    @media (max-width:900px){.container{padding:7px 2px;}th,td{font-size:0.96em;padding:11px 2px;}}
    @media (max-width:600px){table,th,td{font-size:0.78em;}.container{max-width:100vw;}th{font-size:1.05em;}}
    ::selection {background: #1fd1f966;}
    ::-webkit-scrollbar {width:7px;background:#23243b;border-radius:6px;}
    ::-webkit-scrollbar-thumb {background:#21d19fbb;border-radius:7px;}
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 Log - ${city.charAt(0).toUpperCase() + city.slice(1)}</h1>
    <table>
      <tr>
        <th><i>📅</i> Date</th>
        <th><i>⏰</i> Time</th>
        <th><i>✅</i> Status</th>
        <th><i>🌐</i> IP</th>
        <th><i>💻</i> Client</th>
      </tr>
      ${(() => {
        const clientList = [];
        return result.map(log => {
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
              <td>
                <span class="status-cell ${statusClass}">${log.status ? log.status : '-'}</span>
              </td>
              <td>${log.ip || ''}</td>
              <td style="font-size:1.03em;font-weight:700;color:#1fd1f9;letter-spacing:1.2px;">${clientLabel}</td>
            </tr>
          `;
        }).join('');
      })()}
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

app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

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
