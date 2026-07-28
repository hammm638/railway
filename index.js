// ====================================================
// 🔥 IMPORT MODULES
// ====================================================
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const sharp = require('sharp');
const moment = require('moment-timezone');

const config = require('./config.js');

// ====================================================
// 🤖 INIT BOT
// ====================================================
const bot = new TelegramBot(config.TOKEN, { polling: true });

// ====================================================
// 📁 FOLDER UNTUK GAMBAR
// ====================================================
const IMG_FOLDER = path.join(__dirname, 'database', 'profile_images');
if (!fs.existsSync(IMG_FOLDER)) {
    fs.mkdirSync(IMG_FOLDER, { recursive: true });
}

// ====================================================
// 🎨 GENERATE FOTO PROFIL
// ====================================================
async function generateProfileImage(userData) {
    const {
        userId,
        firstName,
        lastName,
        username,
        mention,
        dcId,
        isPremium,
        createdAt,
        fullName
    } = userData;

    const width = 600;
    const height = 700;

    // 🔥 FORMAT TANGGAL
    const createdDate = createdAt ? new Date(createdAt) : new Date();
    const dateStr = createdDate.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // 🔥 EMOJI PREMIUM
    const premiumEmoji = isPremium ? '✅ Ya' : '❌ Tidak';
    const premiumColor = isPremium ? '#34a853' : '#ea4335';

    // 🔥 USERNAME
    const usernameDisplay = username ? `@${username}` : 'Tidak ada';

    // 🔥 MENTION
    const mentionDisplay = mention || `@${username || 'user'}`;

    // 🔥 DC ID
    const dcDisplay = dcId || '?';

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#0d1b2a;stop-opacity:1" />
                <stop offset="40%" style="stop-color:#1b2d45;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0d1b2a;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#1a73e8;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0d47a1;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f0f4f8;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#34a853;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1e7e34;stop-opacity:1" />
            </linearGradient>
            <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#00000050"/>
            </filter>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <!-- Background -->
        <rect width="${width}" height="${height}" fill="url(#bgGrad)" rx="20"/>

        <!-- Decorative Circles -->
        <circle cx="500" cy="-50" r="200" fill="rgba(26,115,232,0.06)"/>
        <circle cx="550" cy="650" r="150" fill="rgba(52,168,83,0.05)"/>
        <circle cx="-50" cy="500" r="120" fill="rgba(26,115,232,0.04)"/>

        <!-- Header -->
        <rect x="0" y="0" width="${width}" height="80" fill="url(#headerGrad)" rx="20"/>
        <rect x="0" y="60" width="${width}" height="20" fill="url(#headerGrad)"/>

        <!-- Icon User -->
        <circle cx="50" cy="40" r="28" fill="white" filter="url(#glow)"/>
        <text x="50" y="52" font-size="30" text-anchor="middle" fill="#1a73e8" font-weight="bold">👤</text>

        <!-- Title -->
        <text x="95" y="32" font-size="18" fill="white" font-weight="bold" font-family="Arial, sans-serif">📋 INFORMASI PROFIL</text>
        <text x="95" y="55" font-size="12" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif">🆔 ID: ${userId} • 📱 Telegram</text>

        <!-- CARD -->
        <rect x="25" y="105" width="550" height="480" rx="16" fill="url(#cardGrad)" filter="url(#shadow)"/>

        <!-- Avatar Large -->
        <circle cx="300" cy="185" r="60" fill="#1a73e8" opacity="0.1"/>
        <circle cx="300" cy="185" r="50" fill="#1a73e8" opacity="0.15"/>
        <circle cx="300" cy="185" r="40" fill="white" filter="url(#shadow)"/>
        <text x="300" y="200" font-size="36" text-anchor="middle" fill="#1a73e8" font-weight="bold">${fullName ? fullName.charAt(0).toUpperCase() : 'U'}</text>

        <!-- Nama Lengkap -->
        <text x="300" y="245" font-size="20" text-anchor="middle" fill="#202124" font-weight="bold" font-family="Arial, sans-serif">${fullName || 'Tanpa Nama'}</text>

        <line x1="50" y1="270" x2="550" y2="270" stroke="#e0e0e0" stroke-width="1.5"/>

        <!-- Row 1: Mention -->
        <text x="50" y="305" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">⭐️ Mention</text>
        <text x="250" y="305" font-size="15" fill="#1a73e8" font-family="Arial, sans-serif" font-weight="bold">${mentionDisplay}</text>

        <!-- Row 2: User ID -->
        <text x="50" y="345" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">🔑 ID Kamu</text>
        <text x="250" y="345" font-size="15" fill="#d32f2f" font-family="monospace" font-weight="bold">${userId} (ID 8, 10 digit)</text>

        <!-- Row 3: Username -->
        <text x="50" y="385" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">🌐 Username</text>
        <text x="250" y="385" font-size="15" fill="#1a73e8" font-family="Arial, sans-serif" font-weight="bold">${usernameDisplay}</text>

        <!-- Row 4: DC ID -->
        <text x="50" y="425" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">🖥 DC ID</text>
        <text x="250" y="425" font-size="15" fill="#202124" font-family="Arial, sans-serif" font-weight="bold">${dcDisplay}</text>

        <!-- Row 5: Premium -->
        <text x="50" y="465" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">💎 Akun Premium</text>
        <rect x="250" y="452" width="100" height="26" rx="13" fill="${isPremium ? 'url(#premiumGrad)' : '#ea4335'}"/>
        <text x="300" y="470" font-size="13" fill="white" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">${premiumEmoji}</text>

        <!-- Row 6: Estimasi Dibuat -->
        <text x="50" y="505" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">🗓 Estimasi Dibuat</text>
        <text x="250" y="505" font-size="15" fill="#202124" font-family="Arial, sans-serif" font-weight="bold">${dateStr}</text>

        <!-- Store Badge -->
        <rect x="150" y="535" width="300" height="36" rx="18" fill="#1a73e8" opacity="0.1"/>
        <text x="300" y="558" font-size="14" fill="#1a73e8" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">🛍 STORE AMAN DAN TERPERCAYA</text>

        <!-- FOOTER -->
        <rect x="0" y="650" width="${width}" height="50" fill="rgba(0,0,0,0.15)" rx="0"/>
        <text x="${width/2}" y="678" font-size="11" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-family="Arial, sans-serif">🤖 ${config.botName} • Sistem Profil Otomatis © 2026</text>
    </svg>`;

    const fileName = `profile_${userId}_${Date.now()}.png`;
    const filePath = path.join(IMG_FOLDER, fileName);

    await sharp(Buffer.from(svg))
        .png()
        .toFile(filePath);

    return { filePath, fileName };
}

// ====================================================
// 🚀 PERINTAH /start
// ====================================================
bot.onText(/^\/start$/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const from = msg.from;

        // 🔥 AMBIL DATA USER
        const userId = from.id.toString();
        const firstName = from.first_name || 'User';
        const lastName = from.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const username = from.username || null;
        const mention = username ? `@${username}` : `[${fullName}](tg://user?id=${userId})`;
        const isPremium = from.is_premium || false;
        const dcId = from.dc_id || '?';

        // 🔥 ESTIMASI TANGGAL BUAT (fallback)
        let createdAt = null;
        try {
            const userFull = await bot.getChat(userId);
            if (userFull && userFull.date) {
                createdAt = new Date(userFull.date * 1000);
            }
        } catch (err) {
            // fallback
            createdAt = new Date();
        }

        // 🔥 GENERATE GAMBAR
        const userData = {
            userId,
            firstName,
            lastName,
            fullName,
            username,
            mention,
            isPremium,
            dcId,
            createdAt
        };

        const result = await generateProfileImage(userData);

        // 🔥 CAPTION
        const caption = `
<blockquote>
<b>─ 👤 INFORMASI PROFIL 👤 ─</b>
━━━━━━━━━━━━━━━━━━━━━━━
🚀 Berikut adalah detail profil Anda saat ini:

⭐️ <b>Mention</b> » ${mention}
🔑 <b>ID Kamu</b> » <code>${userId}</code> (ID 8, 10 digit)
🌐 <b>Username</b> » ${username || 'Tidak ada'}
🖥 <b>DC ID</b> » ${dcId}
💎 <b>Akun Premium</b> » ${isPremium ? '✅ Ya' : '❌ Tidak'}
🗓 <b>Estimasi Dibuat</b> » ${createdAt ? createdAt.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric' }) : 'Tidak diketahui'}
━━━━━━━━━━━━━━━━━━━━━━━
🛍 <b>STORE AMAN DAN TERPERCAYA</b>
</blockquote>
`;

        // 🔥 KIRIM FOTO
        await bot.sendPhoto(chatId, result.filePath, {
            caption: caption,
            parse_mode: 'HTML'
        });

        // 🔥 HAPUS FILE SETELAH 5 DETIK
        setTimeout(() => {
            try {
                fs.unlinkSync(result.filePath);
            } catch (err) {}
        }, 5000);

        console.log(`✅ Profil dikirim ke ${userId} (${fullName})`);

    } catch (error) {
        console.error('❌ Error /start:', error);
        await bot.sendMessage(
            msg.chat.id,
            `<b>❌ Terjadi kesalahan.</b>\n\n📌 Error: ${error.message}`,
            { parse_mode: 'HTML' }
        );
    }
});

// ====================================================
// 🚀 START BOT
// ====================================================
bot.getMe().then((botInfo) => {
    console.log('✅ Bot Berjalan!');
    console.log(`🤖 @${botInfo.username}`);
    console.log(`📁 Folder gambar: ${IMG_FOLDER}`);
}).catch((err) => {
    console.error('❌ Gagal start:', err);
});