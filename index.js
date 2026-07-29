// ====================================================
// 🔥 IMPORT MODULES
// ====================================================
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const sharp = require('sharp');
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
// 🔧 GET DC ID DARI USER ID
// ====================================================
function getDcId(userId) {
    const id = parseInt(userId);
    
    if (id >= 1 && id <= 9999) return 1;
    if (id >= 10000 && id <= 9999999) return 2;
    if (id >= 10000000 && id <= 999999999) return 3;
    if (id >= 1000000000 && id <= 999999999999) return 4;
    if (id >= 1000000000000) return 5;
    
    return '?';
}

// ====================================================
// 🎨 GENERATE FOTO PROFIL
// ====================================================
async function generateProfileImage(userData) {
    const {
        userId,
        fullName,
        username,
        mention,
        dcId,
        isPremium
    } = userData;

    const width = 600;
    const height = 700;

    const premiumText = isPremium ? '✅ Ya' : '❌ Tidak';
    const premiumColor = isPremium ? '#34a853' : '#ea4335';
    const usernameDisplay = username ? `@${username}` : 'Tidak ada';
    const mentionDisplay = mention || `@${username || 'user'}`;
    const initial = fullName ? fullName.charAt(0).toUpperCase() : 'U';
    
    const colors = ['#1a73e8', '#34a853', '#ea4335', '#fbbc04', '#9c27b0', '#00bcd4', '#ff5722'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];
    const userIdDisplay = userId.length === 10 ? userId : userId.padStart(10, '0');

    const dcDisplay = dcId || '?';

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#0d1b2a" rx="20"/>
        <circle cx="500" cy="-50" r="200" fill="rgba(26,115,232,0.05)"/>
        <circle cx="550" cy="650" r="150" fill="rgba(52,168,83,0.04)"/>
        <circle cx="-50" cy="500" r="120" fill="rgba(26,115,232,0.03)"/>
        <rect x="0" y="0" width="${width}" height="70" fill="#1a73e8" rx="20"/>
        <rect x="0" y="50" width="${width}" height="20" fill="#1a73e8"/>
        <text x="${width/2}" y="45" font-size="22" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">📋 INFORMASI PROFIL</text>
        <rect x="25" y="90" width="550" height="530" rx="16" fill="white" opacity="0.95"/>
        <circle cx="${width/2}" cy="170" r="55" fill="${avatarColor}" opacity="0.15"/>
        <circle cx="${width/2}" cy="170" r="45" fill="${avatarColor}" opacity="0.2"/>
        <circle cx="${width/2}" cy="170" r="35" fill="white"/>
        <text x="${width/2}" y="182" font-size="34" text-anchor="middle" fill="${avatarColor}" font-weight="bold" font-family="Arial, sans-serif">${initial}</text>
        <text x="${width/2}" y="225" font-size="18" fill="#202124" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">${fullName || 'Tanpa Nama'}</text>
        <line x1="50" y1="250" x2="550" y2="250" stroke="#e0e0e0" stroke-width="1"/>
        <text x="50" y="290" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">⭐️ Mention</text>
        <text x="250" y="290" font-size="15" fill="#1a73e8" font-family="Arial, sans-serif" font-weight="bold">${mentionDisplay}</text>
        <text x="50" y="330" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">🔑 ID Kamu</text>
        <text x="250" y="330" font-size="15" fill="#d32f2f" font-family="monospace" font-weight="bold">${userIdDisplay} (ID 8, 10 digit)</text>
        <text x="50" y="370" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">🌐 Username</text>
        <text x="250" y="370" font-size="15" fill="#1a73e8" font-family="Arial, sans-serif" font-weight="bold">${usernameDisplay}</text>
        <text x="50" y="410" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">🖥 DC ID</text>
        <text x="250" y="410" font-size="15" fill="#202124" font-family="Arial, sans-serif" font-weight="bold">${dcDisplay}</text>
        <text x="50" y="450" font-size="14" fill="#5f6368" font-family="Arial, sans-serif">💎 Akun Premium</text>
        <rect x="250" y="438" width="100" height="26" rx="13" fill="${premiumColor}"/>
        <text x="300" y="457" font-size="13" fill="white" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">${premiumText}</text>
        <rect x="150" y="490" width="300" height="36" rx="18" fill="#1a73e8" opacity="0.1"/>
        <text x="300" y="514" font-size="14" fill="#1a73e8" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">🛍 STORE AMAN DAN TERPERCAYA</text>
        <rect x="0" y="650" width="${width}" height="50" fill="rgba(0,0,0,0.2)" rx="0"/>
        <text x="${width/2}" y="678" font-size="11" fill="rgba(255,255,255,0.4)" text-anchor="middle" font-family="Arial, sans-serif">🤖 OrderRumahOtp • Sistem Profil Otomatis</text>
    </svg>`;

    const fileName = `profile_${userId}_${Date.now()}.png`;
    const filePath = path.join(IMG_FOLDER, fileName);

    await sharp(Buffer.from(svg))
        .png({ compressionLevel: 6, quality: 80 })
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

        const userId = from.id.toString();
        const firstName = from.first_name || 'User';
        const lastName = from.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const username = from.username || null;
        const mention = username ? `@${username}` : `[${fullName}](tg://user?id=${userId})`;
        const isPremium = from.is_premium || false;
        
        const dcId = getDcId(userId);

        const userData = { userId, fullName, username, mention, isPremium, dcId };
        const result = await generateProfileImage(userData);

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
━━━━━━━━━━━━━━━━━━━━━━━
🛍 <b>STORE AMAN DAN TERPERCAYA</b>
</blockquote>
`;

        // 🔥 1 BUTTON SAJA
        const buttons = [
            [
                { 
                    text: "🔗 Buka Store", 
                    url: "https://t.me/flowpeachieee",
                    style: "primary" 
                }
            ]
        ];

        // 🔥 KIRIM FOTO + BUTTON
        await bot.sendPhoto(chatId, result.filePath, {
            caption: caption,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: buttons
            }
        });

        // 🔥 HAPUS FILE SETELAH 5 DETIK
        setTimeout(() => {
            try { fs.unlinkSync(result.filePath); } catch (err) {}
        }, 5000);

    } catch (error) {
        console.error('❌ Error:', error);
        await bot.sendMessage(msg.chat.id, `<b>❌ Error: ${error.message}</b>`, { parse_mode: 'HTML' });
    }
});

// ====================================================
// 🚀 START
// ====================================================
bot.getMe().then((botInfo) => {
    console.log('✅ Bot Berjalan!');
    console.log(`🤖 @${botInfo.username}`);
}).catch((err) => {
    console.error('❌ Gagal start:', err);
});