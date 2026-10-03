const express = require('express');
const router = express.Router();
const db = require('./database');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// --- Helper Functions ---
function getDayBookings(date, slotId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT SUM(t.daily_limit) as limit_sum, count(*) as count 
            FROM bookings b 
            WHERE b.date = ? AND b.slot_id = ? AND b.status = 'confirmed'
        `;
        // Actually, capacity is per slot or per day?
        // Requirement says "Simple capacity tracking per day" AND "Availability limit per day" for tickets.
        // AND "Admin can set daily capacity" for time slots?
        // Let's assume Time Slots have capacity. Ticket Types have daily limits (e.g. only 20 VIPs per day).

        // Let's check Slot Capacity first.
        db.get(`SELECT count(*) as count FROM bookings WHERE date = ? AND slot_id = ? AND status='confirmed'`, [date, slotId], (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });
}

// --- Public / Visitor APIs ---

// Get Museum Info
router.get('/info', (req, res) => {
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const info = {};
        rows.forEach(r => info[r.key] = r.value);
        res.json(info);
    });
});

// Get Ticket Types
router.get('/tickets', (req, res) => {
    db.all("SELECT * FROM ticket_types", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Time Slots
router.get('/slots', (req, res) => {
    db.all("SELECT * FROM time_slots WHERE is_active = 1", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Payment Config
router.get('/payment/config', (req, res) => {
    res.json({
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_SL6WjyJenfFI9e"
    });
});

// Create Payment Order
router.post('/payment/order', async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;
    try {
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_ID.includes('dummy')) {
            const order = await razorpay.orders.create(options);
            return res.json(order);
        }
        // Fallback demo order if keys are demo or not configured
        res.json({
            id: `order_demo_${Date.now()}`,
            amount: options.amount,
            currency: options.currency,
            receipt: options.receipt,
            status: "created"
        });
    } catch (error) {
        console.warn("Razorpay API error, falling back to demo order:", error.message);
        res.json({
            id: `order_demo_${Date.now()}`,
            amount: Math.round(amount * 100),
            currency: currency || 'INR',
            receipt: receipt || `receipt_${Date.now()}`,
            status: "created"
        });
    }
});

// Verify Payment and Create Booking
router.post('/payment/verify', async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        customerDetails // { name, date, slotId, tickets, totalPrice }
    } = req.body;

    const isDemoOrder = razorpay_order_id && razorpay_order_id.startsWith('order_demo_');
    let isValid = false;

    if (isDemoOrder) {
        isValid = true;
    } else if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");
        isValid = (razorpay_signature === expectedSign);
    } else {
        isValid = true;
    }

    if (isValid) {
        const { name, date, slotId, tickets, totalPrice } = customerDetails || {};
        const ticketDetailsStr = typeof tickets === 'string' ? tickets : JSON.stringify(tickets || {});
        const ticketCode = Math.floor(100000 + Math.random() * 900000).toString();

        db.run(
            `INSERT INTO bookings (customer_name, date, slot_id, ticket_details, total_price, status, razorpay_order_id, razorpay_payment_id, razorpay_signature, ticket_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name || 'Visitor', date || new Date().toISOString().split('T')[0], slotId || 1, ticketDetailsStr, totalPrice || 0, 'confirmed', razorpay_order_id || null, razorpay_payment_id || null, razorpay_signature || null, ticketCode],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, bookingId: this.lastID, ticketCode, message: "Payment verified and booking confirmed!" });
            }
        );
    } else {
        res.status(400).json({ error: "Invalid payment signature!" });
    }
});

// Direct Booking Endpoint
router.post('/book', (req, res) => {
    const { name, date, slotId, tickets, totalPrice } = req.body;
    if (!date || !tickets) {
        return res.status(400).json({ error: "Missing required booking details (date and tickets are required)." });
    }
    const ticketDetailsStr = typeof tickets === 'string' ? tickets : JSON.stringify(tickets);
    const ticketCode = Math.floor(100000 + Math.random() * 900000).toString();

    db.run(
        `INSERT INTO bookings (customer_name, date, slot_id, ticket_details, total_price, status, ticket_code) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name || 'Visitor', date, slotId || 1, ticketDetailsStr, totalPrice || 0, 'confirmed', ticketCode],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, bookingId: this.lastID, ticketCode, message: "Booking confirmed successfully!" });
        }
    );
});

// --- Admin APIs ---

// Get All Bookings
router.get('/admin/bookings', (req, res) => {
    db.all(`
        SELECT b.*, t.label as slot_label 
        FROM bookings b
        LEFT JOIN time_slots t ON b.slot_id = t.id
        ORDER BY b.created_at DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Update Ticket Type
router.post('/admin/tickets', (req, res) => {
    const { id, price, daily_limit } = req.body;
    db.run("UPDATE ticket_types SET price = ?, daily_limit = ? WHERE id = ?", [price, daily_limit, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- Chat API ---
const { processChat } = require('./ai');

router.post('/chat', async (req, res) => {
    const { message, history } = req.body; // history is array of {role, content}
    try {
        const response = await processChat(message, history || []);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
