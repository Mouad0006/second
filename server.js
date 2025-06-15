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
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تسجيل الدخول | MILANO Log</title>
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
      gap: 20px;
      margin-bottom: 8px;
    }
    .input-box {
      position: relative;
      width: 100%;
    }
    .input-box input {
      width: 100%;
      padding: 15px 16px 15px 44px;
      font-size: 1.13rem;
      background: #222842;
      border: 2.2px solid #21d19f55;
      color: #f3fcff;
      border-radius: 11px;
      outline: none;
      font-family: inherit;
      font-weight: 700;
      box-shadow: 0 2px 9px #181a2144;
      transition: border 0.21s, background 0.24s, box-shadow .28s;
    }
    .input-box input:focus {
      border-color: #1fd1f9;
      background: #253968;
      box-shadow: 0 5px 19px #2fc7fc33;
    }
    .input-box .icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #21d19f;
      font-size: 1.13em;
      opacity: 0.86;
      pointer-events: none;
      transition: color 0.19s;
    }
    .input-box input:focus ~ .icon {
      color: #1fd1f9;
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
    .login-btn:hover {
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
    <h2>لوحة المتابعة المحمية</h2>
    ${error ? `<div class="error-msg">${error}</div>` : ""}
    <div class="login-form">
      <div class="input-box">
        <input name="username" type="text" required placeholder="اسم المستخدم" autocomplete="username">
        <span class="icon">👤</span>
      </div>
      <div class="input-box">
        <input name="password" type="password" required placeholder="كلمة المرور" autocomplete="current-password">
        <span class="icon">🔒</span>
      </div>
      <button class="login-btn" type="submit">دخول</button>
    </div>
  </form>
</body>
</html>
`;
}


// 🟢 عرض صفحة تسجيل الدخول عند أي دخول (GET)
app.get('/', (req, res) => {
  res.send(loginPage());
});

// 🟢 معالجة POST تسجيل الدخول وإظهار الجدول مباشرة
app.post('/', (req, res) => {
  const { username, password } = req.body || {};
  if (username === AUTH_USER && password === AUTH_PASS) {
    // تحميل السجلات وجدول العرض
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

    // فلترة أول 200 لكل clientId كل 5 دقائق
    const lastSeen = {};
    const result = [];
    logs.forEach(log => {
      if (log.status == 200 && log.clientId) {
        const nowTime = new Date(log.date).getTime();
        if (!lastSeen[log.clientId] || nowTime - lastSeen[log.clientId] > 5 * 60 * 1000) {
          lastSeen[log.clientId] = nowTime;
          result.push(log);
        }
      }
    });

    function statusColor(status) {
      if (status == 200) return 'background:#21d19f;color:#fff;font-weight:600;';
      if (status == 302) return 'background:#ffe066;color:#2a2a2a;font-weight:600;';
      if (!status) return 'background:#282b34;color:#bbb;';
      return 'background:#e74c3c;color:#fff;font-weight:600;';
    }

    const clientList = [];
    function getClientLabel(log) {
      let idx = clientList.indexOf(log.clientId);
      if (idx === -1) {
        clientList.push(log.clientId);
        idx = clientList.length - 1;
      }
      const orderNames = [
        "FIRST CLIENT", "SECOND CLIENT", "THIRD CLIENT", "FOURTH CLIENT", "FIFTH CLIENT",
        "SIXTH CLIENT", "SEVENTH CLIENT", "EIGHTH CLIENT", "NINTH CLIENT", "TENTH CLIENT"
      ];
      return orderNames[idx] || `CLIENT ${idx + 1}`;
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Applicant Access Log</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Cairo:wght@600;800&display=swap" rel="stylesheet">
        <style>
          body {
            background: linear-gradient(135deg, #1e2239 0%, #29397a 100%);
            color: #e7eef7;
            font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
          }
          .container {
            max-width: 950px;
            margin: 38px auto 0 auto;
            background: rgba(40,42,73, 0.97);
            border-radius: 28px;
            box-shadow: 0 18px 36px rgba(25, 28, 65, .22);
            padding: 38px 16px 32px 16px;
            backdrop-filter: blur(2.8px);
          }
          h1 {
            text-align: center;
            font-size: 2.15rem;
            color: #21d19f;
            letter-spacing: 1.5px;
            font-weight: 900;
            margin-bottom: 26px;
            text-shadow: 0 3px 18px #1d303c8c;
            font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 24px;
            background: transparent;
            box-shadow: 0 5px 24px #22264d33;
            border-radius: 15px;
            overflow: hidden;
          }
          th, td {
            padding: 16px 8px;
            text-align: center;
          }
          th {
            background: #26315d;
            color: #21d19f;
            font-weight: 800;
            font-size: 1.08em;
            letter-spacing: 0.8px;
            border-bottom: 2.5px solid #21d19f44;
          }
          tr {
            border-bottom: 1px solid #313a65;
            transition: background 0.23s;
          }
          tr:nth-child(even) {
            background: #24284b99;
          }
          tr:hover {
            background: #2c355d !important;
          }
          tr:last-child { border-bottom: none; }
          .status-cell {
            border-radius: 13px;
            min-width: 66px;
            display: inline-block;
            padding: 8px 15px;
            font-size: 1em;
            box-shadow: 0 2px 9px #181a2166;
            transition: background 0.3s, color 0.3s;
          }
          .delete-btn {
            background: linear-gradient(90deg, #ff5858, #f09819);
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 16px 58px;
            font-size: 1.19rem;
            margin-top: 34px;
            cursor: pointer;
            font-weight: 900;
            letter-spacing: 1.2px;
            box-shadow: 0 4px 14px #e74c3c1c;
            transition: background 0.23s;
          }
          .delete-btn:hover {
            background: linear-gradient(90deg, #e74c3c, #fbc631);
          }
          @media (max-width: 900px) {
            .container { padding: 7px 2px; }
            th, td { font-size: 0.95em; padding: 9px 2px; }
          }
          @media (max-width: 600px) {
            table, th, td { font-size: 0.77em; }
            .container { max-width: 100vw; }
          }
          ::selection { background: #21d19f66; }
          ::-webkit-scrollbar { width: 8px; background: #22253b; border-radius: 7px;}
          ::-webkit-scrollbar-thumb { background: #21d19f99; border-radius: 9px;}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📝 Applicant Access Log</h1>
          <table>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>IP</th>
              <th>User Agent</th>
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
                return `
                  <tr>
                    <td><b>${log.localDate || ''}</b></td>
                    <td style="font-family:monospace; font-size:1.11em;">${log.localHour || ''}</td>
                    <td>
                      <span class="status-cell" style="${statusColor(log.status)}">${log.status ? log.status : '-'}</span>
                    </td>
                    <td>${log.ip || ''}</td>
                    <td style="font-size:1.03em;font-weight:700;color:#21d19f;letter-spacing:1.2px;">${clientLabel}</td>
                  </tr>
                `;
              }).join('');
            })()}
          </table>
          <form method="POST" action="/delete-all" onsubmit="return confirm('Delete all records?');" style="text-align:center;">
            <button class="delete-btn" type="submit">🗑️ DELETE ALL</button>
          </form>
        </div>
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
