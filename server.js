const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// تخزين السجلات في ملف حسب الفئة (مثلا c1.csv)
app.post('/log', (req, res) => {
  const { city, type, localDate, localHour, status, ip, clientLabel } = req.body;
  if (!city || !type) return res.status(400).send('city & type required');
  const fileName = `${type}.csv`;
  const filePath = path.join(__dirname, fileName);
  const logLine = `${localDate},${localHour},${status},${ip || ''},${clientLabel || ''}\n`;
  fs.appendFileSync(filePath, logLine);
  res.json({ status: 'saved' });
});

// صفحة رئيسية: عرض كل الجداول
app.get('/', (req, res) => {
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.csv'));
  let tableLinks = files.map(f =>
    `<li><a href="/table/${f.replace('.csv', '')}">${f.replace('.csv', '')}</a></li>`
  ).join('');
  res.send(`
    <html>
    <head>
      <title>جداول الحجز</title>
      <style>
        body { font-family: Tahoma, Arial; background: #fafbff; }
        .main { max-width: 520px; margin: 45px auto; background: #fff; border-radius: 18px; box-shadow: 0 6px 24px #bed7f8; padding: 40px; }
        h2 { color: #1a2247; }
        a { color: #1976d2; text-decoration: none; font-weight: 700 }
        a:hover { color: #0b7cb8; }
        ul { margin: 20px 0 0 0; padding: 0 }
        li { list-style: none; margin: 0 0 12px 0; }
        .delete-btn { background: #ff5555; color: #fff; border: none; padding: 11px 25px; font-size: 16px; border-radius: 7px; margin-top: 35px; font-weight: bold; cursor: pointer }
      </style>
    </head>
    <body>
      <div class="main">
        <h2>🗂️ جميع جداول الحجز (حسب الفئة)</h2>
        <ul>${tableLinks}</ul>
        <form method="POST" action="/delete-all" onsubmit="return confirm('متأكد؟');" style="margin-top:32px">
          <button class="delete-btn" onclick="deleteAllLogs(event)">🗑️ DELETE ALL</button>
        </form>
      </div>
      <script>
        function deleteAllLogs(e) {
          e.preventDefault();
          if (!confirm('هل أنت متأكد من حذف كل السجلات؟')) return;
          fetch('/delete-all', { method: 'POST' })
            .then(res => res.json())
            .then(json => { if(json.status==='all_deleted') location.reload(); });
        }
      </script>
    </body>
    </html>
  `);
});

// صفحة جدول معيّن
app.get('/table/:name', (req, res) => {
  const fileName = req.params.name + '.csv';
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) return res.send('لا يوجد جدول بهذا الاسم');
  const content = fs.readFileSync(filePath, 'utf8');
  let rows = content.trim().split('\n').map(line =>
    `<tr>${line.split(',').map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('');
  res.send(`
    <html>
    <head>
      <title>${req.params.name}</title>
      <style>
        body { font-family: Tahoma, Arial; background: #f0f6ff; }
        .tbl-box { max-width: 800px; margin: 40px auto; background: #fff; border-radius: 17px; box-shadow: 0 3px 13px #d3e1fd; padding: 38px; }
        table { border-collapse: collapse; width: 100%; margin-top: 12px }
        th, td { border: 1px solid #d1e8fd; padding: 8px 16px; text-align: center; font-size: 15px }
        th { background: #d9ecff; color: #223555 }
        td { background: #f8fbff }
        a { color: #1976d2; text-decoration: none; font-weight: 700 }
        a:hover { color: #0b7cb8; }
      </style>
    </head>
    <body>
      <div class="tbl-box">
        <h2>سجلات: <b>${req.params.name}</b></h2>
        <a href="/">⬅️ رجوع</a>
        <table>
          <tr>
            <th>التاريخ</th><th>الساعة</th><th>الحالة</th><th>IP</th><th>CLIENT</th>
          </tr>
          ${rows}
        </table>
      </div>
    </body>
    </html>
  `);
});

// حذف كل الجداول
app.post('/delete-all', (req, res) => {
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.csv'));
  files.forEach(f => fs.unlinkSync(path.join(__dirname, f)));
  res.json({ status: 'all_deleted' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
