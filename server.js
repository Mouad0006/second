const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 إعدادات الدخول
const AUTH_USER = "Milano";       // اسم المستخدم
const AUTH_PASS = "Mouad2006@";   // كلمة السر

function loginPage(error = "") {
  return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
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


app.post('/', (req, res) => {
  const { username, password, city } = req.body || {};
  if (username === AUTH_USER && password === AUTH_PASS) {
    // 🟢 تحميل السجلات
    const pathLog = path.join(__dirname, 'applicant_log.csv');
    let logs = [];
    if (fs.existsSync(pathLog)) {
      const lines = fs.readFileSync(pathLog, 'utf8').split('\n').filter(Boolean);
      logs = lines.map(line => {
        const [date, ip, data] = line.split(/,(.+?),({.*})$/).filter(Boolean);
        let info = {};
        try { info = JSON.parse(data); } catch {}
        let localTime = info.localTime || '';
        let isoDate = '';
        if (info.isoTime) {
          try {
            const d = new Date(info.isoTime);
            isoDate = d.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
          } catch {}
        }
        return { date, ip, ...info, localDate: isoDate, localHour: localTime };
      }).reverse();
    }

    // 🟢 المدن المطلوبة
    const cities = [
      { id: "casablanca", label: "Casablanca" },
      { id: "tangier", label: "Tangier" },
      { id: "nador", label: "Nador" },
      { id: "tetouan", label: "Tetouan" },
      { id: "agadir", label: "Agadir" },
      { id: "rabat", label: "Rabat" }
    ];

    // 🟢 تصفية السجلات حسب المدينة
    let filtered = logs;
    if (city && cities.some(c => c.id === city)) {
      filtered = logs.filter(log => String(log.city || '').toLowerCase() === city);
    } else {
      filtered = [];
    }

    function statusClass(status) {
      if (status == 200) return 'status-200';
      if (status == 302) return 'status-302';
      if (!status) return 'status-null';
      return 'status-other';
    }

    // 🟢 صفحة اختيار المدينة + جدول السجلات حسب الاختيار
    res.send(`
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>Booking Log | MILANO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body {
      background: linear-gradient(135deg, #23243b 0%, #2376ae 100%);
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
      margin: 0; min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
    }
    .cities-list {
      margin-top: 50px;
      display: flex; flex-wrap: wrap; gap: 28px;
      justify-content: center;
      animation: fadeInUp 0.8s;
    }
    .city-btn {
      background: linear-gradient(90deg, #1fd1f9 5%, #21d19f 100%);
      color: #fff;
      font-size: 1.27rem;
      font-weight: 900;
      border: none;
      border-radius: 18px;
      box-shadow: 0 7px 26px #1fd1f955;
      padding: 28px 44px;
      cursor: pointer;
      margin-bottom: 12px;
      transition: background 0.18s, box-shadow 0.16s, transform .16s;
      letter-spacing: 2px;
      outline: none;
      border-bottom: 3.5px solid #1fd1f9;
    }
    .city-btn:hover, .city-btn:focus {
      background: linear-gradient(90deg, #21d19f 5%, #1fd1f9 100%);
      box-shadow: 0 10px 32px #2fc7fc66;
      transform: scale(1.06) translateY(-4px);
      letter-spacing: 3px;
      border-bottom: 3.5px solid #21d19f;
    }
    .city-title {
      margin-top: 25px; margin-bottom: 10px;
      color: #21d19f; font-size: 2rem; font-weight: 900;
      letter-spacing: 2.1px; text-align: center;
      background: linear-gradient(90deg, #1fd1f9 5%, #21d19f 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
      text-shadow: 0 4px 20px #21d19f33, 0 1px 10px #1fd1f933;
    }
    .container {
      margin-top: 10px;
      width: 98vw;
      max-width: 1000px;
      background: rgba(34, 38, 59, 0.98);
      border-radius: 28px;
      box-shadow: 0 12px 40px 0 #00357266, 0 2px 16px 0 #1fd1f955, 0 0px 2px 1px #21d19f77;
      padding: 35px 7px 28px 7px;
      animation: fadeInUp 0.88s cubic-bezier(.72,1.3,.58,1) 1;
      backdrop-filter: blur(2.8px);
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 10px;
      background: rgba(33, 41, 66, 0.98);
      box-shadow: 0 5px 24px #21d19f26;
      border-radius: 18px;
      overflow: hidden;
      font-size: 1.08em;
      animation: fadeTable 1.4s;
    }
    th, td {
      padding: 14px 7px; text-align: center; border: none;
    }
    th {
      background: linear-gradient(90deg, #222a42 60%, #21d19f22 100%);
      color: #1fd1f9; font-weight: 900; font-size: 1.14em; letter-spacing: 1.15px;
      border-bottom: 2.7px solid #21d19f44; user-select: none;
    }
    tr { transition: background 0.22s; }
    tr:nth-child(even) { background: #23243b77; }
    tr:hover { background: linear-gradient(90deg, #1fd1f925 15%, #2fc7fc10 100%); box-shadow: 0 2px 10px #1fd1f933; }
    .status-cell { border-radius: 12px; min-width: 66px; display: inline-block; padding: 8px 15px; font-size: 1em; box-shadow: 0 2px 9px #181a2166; font-weight: 900; }
    .status-200 { background:#21d19f;color:#fff; }
    .status-302 { background: #ffe066;color: #2a2a2a; }
    .status-other { background: #e74c3c;color: #fff; }
    .status-null { background: #282b34;color: #bbb; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(60px) scale(.93);} to { opacity: 1; transform: translateY(0) scale(1);} }
    @keyframes fadeTable { from {opacity:0;transform:scale(.97);} to {opacity:1;transform:scale(1);} }
    @media (max-width: 900px) {.container { padding: 7px 2px; } th, td { font-size: 0.96em; padding: 11px 2px; } }
    @media (max-width: 600px) {table, th, td { font-size: 0.78em; } .container { max-width: 100vw; } th { font-size: 1.05em; } }
  </style>
</head>
<body>
  <div class="cities-list">
    ${cities.map(cityObj => `<button class="city-btn" onclick="selectCity('${cityObj.id}')">${cityObj.label}</button>`).join('')}
  </div>
  ${city && cities.some(c=>c.id===city) ? `
    <div class="city-title">${cities.find(c=>c.id===city).label} - Logs</div>
    <div class="container">
      <table>
        <tr>
          <th>📅 Date</th>
          <th>⏰ Time</th>
          <th>✅ Status</th>
          <th>🌐 IP</th>
          <th>City</th>
        </tr>
        ${filtered.map(log => `
          <tr>
            <td><b>${log.localDate || ''}</b></td>
            <td style="font-family:monospace; font-size:1.11em;">${log.localHour || ''}</td>
            <td><span class="status-cell ${statusClass(log.status)}">${log.status ? log.status : '-'}</span></td>
            <td>${log.ip || ''}</td>
            <td>${log.city || ''}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  ` : ""}
  <form id="cityForm" method="POST" style="display:none;">
    <input type="hidden" name="username" value="${AUTH_USER}">
    <input type="hidden" name="password" value="${AUTH_PASS}">
    <input type="hidden" name="city" id="cityInput">
  </form>
  <script>
    function selectCity(city) {
      document.getElementById('cityInput').value = city;
      document.getElementById('cityForm').submit();
    }
  </script>
</body>
</html>
    `);

  } else {
    res.send(loginPage("خطأ في اسم المستخدم أو كلمة المرور!"));
  }
});

// حماية Route حذف الكل أيضاً (يبقى سري!)
app.post('/delete-all', (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
