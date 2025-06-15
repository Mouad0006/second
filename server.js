const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 إعدادات الدخول
const AUTH_USER = "Milano";       // اسم المستخدم
const AUTH_PASS = "Mouad2006@";   // كلمة السر
const SESSION_SECRET = "change_this_secret"; // سر الجلسة

// دالة توليد كود الجلسة
function createSession(user) {
  const expires = Date.now() + 1000 * 60 * 60 * 2; // ساعتان
  const data = JSON.stringify({ user, expires });
  const hash = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
  return Buffer.from(`${data}|${hash}`).toString('base64');
}
function verifySession(token) {
  try {
    const str = Buffer.from(token, 'base64').toString();
    const [data, hash] = str.split('|');
    if (!data || !hash) return false;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
    if (expected !== hash) return false;
    const { user, expires } = JSON.parse(data);
    if (Date.now() > expires) return false;
    return user === AUTH_USER;
  } catch {
    return false;
  }
}

// Middleware للتحقق من الجلسة
function requireLogin(req, res, next) {
  const cookie = req.headers.cookie || "";
  const token = (cookie.match(/milano_session=([^;]+)/) || [])[1];
  if (token && verifySession(token)) return next();
  res.send(loginPage());
}

// صفحة تسجيل الدخول العصرية
function loginPage(error = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login | Milano Log</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cairo:wght@600;800&display=swap" rel="stylesheet">
  <style>
    body {
      background: linear-gradient(120deg, #2a3454 0%, #3e8ecf 100%);
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
      min-height: 100vh;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-container {
      background: rgba(35, 38, 63, 0.97);
      border-radius: 24px;
      box-shadow: 0 10px 40px 0 #1e223950, 0 1.5px 12px 0 #2596be33;
      padding: 38px 42px 36px 42px;
      min-width: 345px;
      max-width: 97vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .logo {
      font-size: 2.35rem;
      font-weight: 900;
      background: linear-gradient(90deg, #21d19f, #2fc7fc 70%);
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
      text-align: center;
      text-shadow: 0 3px 18px #23b5e68c;
    }
    h2 {
      color: #21d19f;
      margin: 10px 0 28px 0;
      font-size: 1.31rem;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-align: center;
      text-shadow: 0 1px 10px #1d303c8c;
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
      font-size: 1.12rem;
      background: #222842;
      border: 2px solid #21d19f44;
      color: #f3fcff;
      border-radius: 11px;
      outline: none;
      font-family: inherit;
      font-weight: 700;
      transition: border 0.2s, background 0.23s;
    }
    .input-box input:focus {
      border-color: #21d19f;
      background: #243058;
    }
    .input-box .icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #21d19f;
      font-size: 1.16em;
      opacity: 0.86;
      pointer-events: none;
    }
    .login-btn {
      width: 100%;
      background: linear-gradient(90deg, #21d19f 10%, #2fc7fc 100%);
      color: #fff;
      font-size: 1.23rem;
      padding: 13px 0;
      border: none;
      border-radius: 13px;
      font-weight: 900;
      letter-spacing: 1.2px;
      cursor: pointer;
      margin-top: 8px;
      box-shadow: 0 5px 17px #21d19f33;
      transition: background 0.2s;
    }
    .login-btn:hover {
      background: linear-gradient(90deg, #2fc7fc 10%, #21d19f 100%);
    }
    .error-msg {
      color: #e74c3c;
      font-weight: 800;
      font-size: 1.02em;
      text-align: center;
      margin-bottom: 10px;
      margin-top: -10px;
      letter-spacing: 1.1px;
    }
    @media (max-width: 600px) {
      .login-container { padding: 19px 6vw; min-width: 80vw; }
      .logo { font-size: 1.38rem; }
    }
  </style>
</head>
<body>
  <form class="login-container" method="POST" autocomplete="off">
    <div class="logo">MILANO Log</div>
    <h2>تسجيل الدخول إلى لوحة المتابعة</h2>
    ${error ? `<div class="error-msg">${error}</div>` : ""}
    <div class="login-form">
      <div class="input-box">
        <span class="icon">👤</span>
        <input name="username" type="text" required placeholder="اسم المستخدم" autocomplete="username">
      </div>
      <div class="input-box">
        <span class="icon">🔒</span>
        <input name="password" type="password" required placeholder="كلمة المرور" autocomplete="current-password">
      </div>
      <button class="login-btn" type="submit">تسجيل الدخول</button>
    </div>
  </form>
</body>
</html>
`;
}

// معالجة POST تسجيل الدخول مع حل إعادة التوجيه
app.post('/', (req, res) => {
  const { username, password } = req.body || {};
  if (username === AUTH_USER && password === AUTH_PASS) {
    const token = createSession(username);
    res.setHeader('Set-Cookie', `milano_session=${token}; Path=/; HttpOnly; SameSite=Lax`);
    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="0;url=/" />
          <script>window.location = "/";</script>
        </head>
        <body></body>
      </html>
    `);
  } else {
    res.send(loginPage("خطأ في اسم المستخدم أو كلمة المرور!"));
  }
});

// صفحة الجدول الرئيسية (احفظ كود الجدول العصري هنا داخل هذا الروت)
app.get('/', requireLogin, (req, res) => {
  // === ضع هنا كود الجدول الذي أرسلته لك سابقاً بالكامل (من كود صفحة العرض الجدول العصري) ===
  // إذا احتجت الكود مجمّع أرسله لك فوراً
  res.send(`<div style="text-align:center;color:#21d19f;font-size:2em;padding:50px;">جدول المتابعة هنا...</div>`);
});

// احمِ routes الإضافية أيضاً:
app.post('/delete-all', requireLogin, (req, res) => {
  const pathLog = path.join(__dirname, 'applicant_log.csv');
  if (fs.existsSync(pathLog)) fs.unlinkSync(pathLog);
  res.json({ status: 'all_deleted' });
});

app.get('/log', requireLogin, (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
