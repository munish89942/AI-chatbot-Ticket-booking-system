import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI, createOrder, verifyPayment } from '../services/api';
import ChatHeader from './chat/ChatHeader';
import ChatWindow from './chat/ChatWindow';
import ChatInput from './chat/ChatInput';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Museum AI guide. I can help you book tickets and answer your questions. When would you like to visit?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState(null);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await chatWithAI(currentInput, history);
            const aiContent = response.data.content;

            const jsonMatch = aiContent.match(/:::JSON\s*([\s\S]*?)\s*:::/);

            let displayContent = aiContent;
            if (jsonMatch) {
                try {
                    const jsonStr = jsonMatch[1];
                    const data = JSON.parse(jsonStr);
                    setBookingData(data);
                    displayContent = aiContent.replace(jsonMatch[0], '').trim();
                } catch (e) {
                    console.error("Failed to parse booking JSON", e);
                }
            }

            setMessages(prev => [...prev, { role: 'assistant', content: displayContent }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const confirmBooking = async () => {
        if (!bookingData) return;
        setLoading(true);
        try {
            const slotsRes = await import('../services/api').then(m => m.getSlots());
            const slot = slotsRes.data.find(s => s.label === bookingData.details.slot_label);

            if (!slot) throw new Error("Slot not found");

            const ticketsRes = await import('../services/api').then(m => m.getTickets());
            let total = 0;
            Object.entries(bookingData.details.tickets).forEach(([type, count]) => {
                const t = ticketsRes.data.find(t => t.name === type);
                if (t) total += t.price * count;
            });

            const orderRes = await createOrder({
                amount: total,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });

            const order = orderRes.data;
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const options = {
                key: "rzp_test_SL6WjyJenfFI9e",
                amount: order.amount,
                currency: order.currency,
                name: "Museum AI",
                description: "Ticket Booking",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await verifyPayment({
                            ...response,
                            customerDetails: {
                                name: "Visitor",
                                date: bookingData.details.date,
                                slotId: slot.id,
                                tickets: bookingData.details.tickets,
                                totalPrice: total
                            }
                        });

                        const ticketCode = verifyRes.data.ticketCode;
                        const ticketId = verifyRes.data.bookingId;

                        setBookingData(null);

                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `✅ **Payment Successful!**\n\nYour ticket for **${bookingData.details.date}** has been confirmed.\n\n🎟️ **TICKET CODE: ${ticketCode}**\n*(Reference ID: #${ticketId})*\n\nPlease show this code at the museum entrance. Enjoy your visit!`
                        }]);

                    } catch (err) {
                        alert("Payment verification failed: " + (err.response?.data?.error || err.message));
                    }
                },
                prefill: {
                    name: "Visitor",
                    email: "visitor@example.com",
                    contact: "9999999999"
                },
                theme: { color: "#6366f1" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            alert("Order creation failed: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: 'Chat history cleared. How else can I help you today?' }]);
        setBookingData(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col h-screen overflow-hidden bg-slate-950 text-white"
        >
            <ChatHeader />

            <main className="flex-1 flex flex-col relative overflow-hidden pt-4">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

                <ChatWindow
                    messages={messages}
                    loading={loading}
                    bookingData={bookingData}
                    onBookingConfirm={confirmBooking}
                    onBookingCancel={() => {
                        setBookingData(null);
                        setMessages(p => [...p, { role: 'assistant', content: 'No problem. What would you like to change?' }]);
                    }}
                />

                <ChatInput
                    input={input}
                    setInput={setInput}
                    onSend={handleSend}
                    onClear={clearChat}
                    loading={loading}
                    disabled={!!bookingData}
                />
            </main>
        </motion.div>
    );
}

