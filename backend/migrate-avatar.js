// migrate-avatar.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.run(`ALTER TABLE Users ADD COLUMN avatar TEXT DEFAULT 'default-avatar.jpg'`, function (err) {
  if (err) {
    if (err.message.includes("duplicate column name")) {
      console.log("⚠️ Avatar sütunu zaten var.");
    } else {
      console.error("❌ Migration hatası:", err.message);
    }
  } else {
    console.log("✅ Avatar sütunu başarıyla eklendi!");
  }
  db.close();
});
