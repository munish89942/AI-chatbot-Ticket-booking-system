const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'db.sqlite');

// Ensure parent directory exists (especially critical for volume mounts like /data)
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Settings Table (Museum Info)
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE,
            value TEXT
        )`, (err) => {
            if (!err) {
                // Seed settings if empty
                db.get("SELECT count(*) as count FROM settings", (err, row) => {
                    if (row.count === 0) {
                        const settings = [
                            { key: 'museum_name', value: 'City Museum of Innovation' },
                            { key: 'address', value: '123 Innovation Drive, Tech City' },
                            { key: 'opening_hours', value: '09:00 - 18:00' },
                            { key: 'contact_email', value: 'info@citymuseum.com' }
                        ];
                        const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
                        settings.forEach(s => stmt.run(s.key, s.value));
                        stmt.finalize();
                        console.log('Seeded settings.');
                    }
                });
            }
        });

        // Ticket Types Table
        db.run(`CREATE TABLE IF NOT EXISTS ticket_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            daily_limit INTEGER DEFAULT 100
        )`, (err) => {
            if (!err) {
                db.get("SELECT count(*) as count FROM ticket_types", (err, row) => {
                    if (row.count === 0) {
                        const tickets = [
                            { name: 'Adult', price: 20, description: 'Standard entry for adults (18-64)', daily_limit: 200 },
                            { name: 'Child', price: 10, description: 'Entry for children (under 18)', daily_limit: 100 },
                            { name: 'Senior', price: 15, description: 'Entry for seniors (65+)', daily_limit: 50 },
                            { name: 'Student', price: 12, description: 'Discounted entry for students with ID', daily_limit: 100 },
                            { name: 'VIP', price: 50, description: 'Priority access and guided tour', daily_limit: 20 }
                        ];
                        const stmt = db.prepare("INSERT INTO ticket_types (name, price, description, daily_limit) VALUES (?, ?, ?, ?)");
                        tickets.forEach(t => stmt.run(t.name, t.price, t.description, t.daily_limit));
                        stmt.finalize();
                        console.log('Seeded ticket types.');
                    }
                });
            }
        });

        // Time Slots Table
        db.run(`CREATE TABLE IF NOT EXISTS time_slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            max_capacity INTEGER DEFAULT 50,
            is_active INTEGER DEFAULT 1
        )`, (err) => {
            if (!err) {
                db.get("SELECT count(*) as count FROM time_slots", (err, row) => {
                    if (row.count === 0) {
                        const slots = [
                            { label: 'Morning (09:00 - 12:00)', max_capacity: 50 },
                            { label: 'Afternoon (12:00 - 15:00)', max_capacity: 50 },
                            { label: 'Evening (15:00 - 18:00)', max_capacity: 50 }
                        ];
                        const stmt = db.prepare("INSERT INTO time_slots (label, max_capacity) VALUES (?, ?)");
                        slots.forEach(s => stmt.run(s.label, s.max_capacity));
                        stmt.finalize();
                        console.log('Seeded time slots.');
                    }
                });
            }
        });

        // Bookings Table
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            date TEXT NOT NULL,
            slot_id INTEGER,
            ticket_details TEXT NOT NULL, -- JSON string: { "Adult": 2, "Child": 1 }
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
            razorpay_order_id TEXT,
            razorpay_payment_id TEXT,
            razorpay_signature TEXT,
            ticket_code TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (slot_id) REFERENCES time_slots(id)
        )`, (err) => {
            if (err) console.error("Error creating bookings table", err);
        });
    });
}

module.exports = db;
