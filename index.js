import { Telegraf } from "telegraf";
import fs from "fs-extra";
import gTTS from "gtts";

import { BOT_TOKEN, GROUP_ID } from "./config.js";
import { countries } from "./countries.js";

/* ================= BOT ================= */

const bot = new Telegraf(BOT_TOKEN);

const ADMIN_ID = 8385436442;

let botRunning = true;

/* ================= MODE ================= */

let slowMode = false;
let fastMode = false;

let slowModeTimer = null;
let fastModeTimer = null;
let autoOnTimer = null;
let autoSlowInterval = null;

/* ================= TEMP ================= */

if (!fs.existsSync("./temp")) {
    fs.mkdirSync("./temp");
}

/* ================= TEXTS ================= */

let textIndex = 0;

const texts = [
    "আল্লাহ আপনাকে ভালো রাখুন",
    "আপনাকে অসংখ্য ধন্যবাদ",
    "আল্লাহ আপনার মঙ্গল করুন",
    "আপনার দিনটি শুভ হোক",
    "ধন্যবাদ আমাদের সাথে থাকার জন্য",
    "সুস্থ থাকুন নিরাপদে থাকুন",
    "আল্লাহ হাফেজ",
    "ভালো থাকবেন"
];

/* ================= COUNTRY ================= */

let countryIndex = 0;
let currentCountry = countries[0];
let countryStart = Date.now();

let enabledCountries = [...countries];

/* ================= NUMBER ================= */

function generateNumber(prefix) {
    const last = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}***${last}`;
}

/* ================= DELAY ================= */

function getDelay() {

    if (fastMode) {
        const delays = [1000,1500,2000];
        return delays[Math.floor(Math.random()*delays.length)];
    }

    if (slowMode) {
        const delays = [12000,18000,25000];
        return delays[Math.floor(Math.random()*delays.length)];
    }

    const delays = [4000,5000,6000];

    return delays[Math.floor(Math.random()*delays.length)];

}
/* ================= COUNTRY UPDATE ================= */

function updateCountry() {

    if (enabledCountries.length === 0) {
        currentCountry = null;
        return;
    }

    const now = Date.now();

    if (now - countryStart >= 3600000) {
        countryIndex =
            (countryIndex + 1) %
            enabledCountries.length;

        countryStart = now;
    }

    if (Math.random() < 0.5) {
        countryIndex = Math.floor(
            Math.random() *
            enabledCountries.length
        );
    }

    currentCountry =
        enabledCountries[countryIndex];
}

/* ================= VOICE ================= */

async function createVoice(text, file) {

    return new Promise((resolve, reject) => {

        const tts = new gTTS(text, "bn");

        tts.save(file, (err) => {
            if (err) reject(err);
            else resolve();
        });

    });

}

/* ================= SEND CALL ================= */

async function sendCall() {

    if (!botRunning) {
        setTimeout(sendCall, 2000);
        return;
    }

    try {

        updateCountry();

        if (!currentCountry) {
            setTimeout(sendCall, 2000);
            return;
        }

        const text = texts[textIndex];
        textIndex = (textIndex + 1) % texts.length;

        const number = generateNumber(currentCountry.code);

        const file = `./temp/${Date.now()}.mp3`;

        await createVoice(text, file);

        const time = new Date().toLocaleString();

        const caption = `
<b>╭━🎤 Bangla Voice ━╮</b>

┃⏰ <b>Time:</b> ${time}
┃🌍 <b>Country:</b> ${currentCountry.flag} ${currentCountry.name}
┃☎️ <b>Number:</b> <code>${number}</code>
┃🎵 <b>Voice:</b> বাংলা TTS
┃⏱ <b>Duration:</b> 5-10 Seconds

╰━━━━━━━━━━━━━━╯
`;

        const sentMsg =
            await bot.telegram.sendAudio(
                GROUP_ID,
                { source: file },
                {
                    caption,
                    parse_mode: "HTML"
                }
            );
      /* 5 মিনিট পরে মেসেজ ডিলিট */

        setTimeout(async () => {
            try {
                await bot.telegram.deleteMessage(
                    GROUP_ID,
                    sentMsg.message_id
                );
            } catch (err) {
                console.log(err);
            }
        }, 300000);

        /* temp mp3 ডিলিট */

        setTimeout(() => {
            fs.remove(file);
        }, 3000);

    } catch (err) {

        console.log("ERROR:", err);

    }

    setTimeout(sendCall, getDelay());

}

/* ================= /ON ================= */

bot.command("on", (ctx) => {

    if (ctx.from.id !== ADMIN_ID)
        return ctx.reply("🚫 Admin Only");

    botRunning = true;

    enabledCountries = [...countries];

    startAutoSlowMode();

    ctx.reply(
`✅ Bot Started

🌍 All Countries Enabled
🎤 Bangla Voice Mode ON`
    );

});

/* ================= /OFF ================= */

bot.command("off", (ctx) => {

    if (ctx.from.id !== ADMIN_ID)
        return ctx.reply("🚫 Admin Only");

    botRunning = false;

    enabledCountries = [];

    slowMode = false;
    fastMode = false;

    if (slowModeTimer) clearTimeout(slowModeTimer);
    if (fastModeTimer) clearTimeout(fastModeTimer);
    if (autoOnTimer) clearTimeout(autoOnTimer);

    if (autoSlowInterval) {
        clearInterval(autoSlowInterval);
        autoSlowInterval = null;
    }

    ctx.reply(
`⛔ Bot Stopped

❌ All Countries Disabled`
    );

});

/* ================= /TIME ================= */

bot.hears(/^\/time(\d+)$/, async (ctx) => {

    if (ctx.from.id !== ADMIN_ID)
        return ctx.reply("🚫 Admin Only");

    const minutes = parseInt(ctx.match[1]);

    if (isNaN(minutes) || minutes <= 0)
        return ctx.reply("Invalid Time");

    botRunning = false;

    if (autoOnTimer)
        clearTimeout(autoOnTimer);

    autoOnTimer = setTimeout(() => {

        botRunning = true;

        ctx.reply("✅ Bot Auto ON").catch(() => {});

    }, minutes * 60000);

    ctx.reply(`⛔ Bot OFF for ${minutes} Minutes`);

});
/* ================= /SLOW ================= */

bot.command("slow", (ctx) => {

    if (ctx.from.id !== ADMIN_ID)
        return ctx.reply("🚫 Admin Only");

    slowMode = true;
    fastMode = false;

    if (slowModeTimer)
        clearTimeout(slowModeTimer);

    slowModeTimer = setTimeout(() => {

        slowMode = false;

        ctx.reply("✅ Slow Mode OFF").catch(() => {});

    }, 300000);

    ctx.reply("🐢 Slow Mode ON (5 Minutes)");

});

/* ================= /FAST ================= */

bot.command("fast", (ctx) => {

    if (ctx.from.id !== ADMIN_ID)
        return ctx.reply("🚫 Admin Only");

    fastMode = true;
    slowMode = false;

    if (fastModeTimer)
        clearTimeout(fastModeTimer);

    fastModeTimer = setTimeout(() => {

        fastMode = false;

        ctx.reply("✅ Fast Mode OFF").catch(() => {});

    }, 300000);

    ctx.reply("⚡ Fast Mode ON (5 Minutes)");

});

/* ================= /NORMAL ================= */

bot.command("normal", (ctx) => {

    if (ctx.from.id !== ADMIN_ID)
        return ctx.reply("🚫 Admin Only");

    fastMode = false;
    slowMode = false;

    ctx.reply("✅ Normal Mode Enabled");

});

/* ================= /COUNTRY ================= */

bot.hears(/^\/country (.+)$/i, (ctx) => {

    if (ctx.from.id !== ADMIN_ID)
        return ctx.reply("🚫 Admin Only");

    const input = ctx.match[1].trim().toLowerCase();

    const isOff = input.endsWith(" off");

    const name = isOff
        ? input.replace(" off", "").trim()
        : input;

    const country = countries.find(
        c => c.name.toLowerCase() === name
    );

    if (!country)
        return ctx.reply("❌ Country Not Found");

    if (isOff) {

        enabledCountries =
            enabledCountries.filter(
                c => c.name !== country.name
            );

        return ctx.reply(
            `⛔ ${country.flag} ${country.name} OFF`
        );

    }

    if (
        !enabledCountries.find(
            c => c.name === country.name
        )
    ) {
        enabledCountries.push(country);
    }

    ctx.reply(
        `✅ ${country.flag} ${country.name} ON`
    );

});
/* ================= START ================= */

bot.start((ctx) => {

    ctx.reply(
`🤖 Bangla Voice Bot

Status: Online ✅

Commands:

/on
/off
/fast
/slow
/normal
/time10
/country Bangladesh
/country Bangladesh off`
    );

});

/* ================= AUTO SLOW ================= */

function startAutoSlowMode() {

    if (autoSlowInterval)
        clearInterval(autoSlowInterval);

    autoSlowInterval = setInterval(() => {

        if (!botRunning) return;

        slowMode = true;
        fastMode = false;

        console.log("🐢 AUTO SLOW MODE ON");

        setTimeout(() => {

            slowMode = false;

            console.log("⚡ AUTO SLOW MODE OFF");

        }, 300000);

    }, 7200000);

}

/* ================= START BOT ================= */

bot.launch();

console.log("🤖 Bot Started Successfully");

startAutoSlowMode();

sendCall();

/* ================= ERROR ================= */

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);
