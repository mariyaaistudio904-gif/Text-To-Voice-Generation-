con { Telegraf } from "telegraf";
import fs from "fs-extra";
import gTTS from "gtts";

import { BOT_TOKEN, GROUP_ID } from "./config.js";
import { countries } from "./countries.js";

/* âœ… BOT */
const bot = new Telegraf(BOT_TOKEN);

const ADMIN_ID = 8385436442;

let botRunning = true;

/* ðŸ¢ SLOW MODE */

let slowMode = false;

let slowModeTimer = null;

/* âš¡ FAST MODE */

let fastMode = false;

let fastModeTimer = null;

/* â° AUTO ON TIMER */

let autoOnTimer = null;
let autoSlowInterval = null;

if (!fs.existsSync("./temp")) {
  fs.mkdirSync("./temp");
}

const codes = JSON.parse(
  fs.readFileSync("./codes.json")
);

let countryIndex = 0;
let codeIndex = 0;

let currentCountry = countries[0];
let countryStart = Date.now();

/* âœ… ENABLED COUNTRIES */

let enabledCountries = [
  ...countries
];
/* ================= TEXT ================= */

function getLocalizedText(countryCode) {

const texts = {

"+39": "Il tuo codice di verifica Ã¨",  

"+44": "Your verification code is",  

"+81": "ã‚ãªãŸã®ç¢ºèªã‚³ãƒ¼ãƒ‰ã¯",  

"+92": "Ø¢Ù¾ Ú©Ø§ ØªØµØ¯ÛŒÙ‚ÛŒ Ú©ÙˆÚˆ ÛÛ’",  

"+968": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",  

"+86": "æ‚¨çš„éªŒè¯ç æ˜¯",  

  "+91": "à¤†à¤ªà¤•à¤¾ à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¨ à¤•à¥‹à¤¡ à¤¹à¥ˆ",

"+880": "à¦†à¦ªà¦¨à¦¾à¦° à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦•à§‹à¦¡ à¦¹à¦²à§‹",

"+971": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+60": "Kod pengesahan anda ialah",

"+66": "à¸£à¸«à¸±à¸ªà¸¢à¸·à¸™à¸¢à¸±à¸™à¸‚à¸­à¸‡à¸„à¸¸à¸“à¸„à¸·à¸­",

"+7": "Ð’Ð°Ñˆ ÐºÐ¾Ð´ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ñ",

"+34": "Su cÃ³digo de verificaciÃ³n es",

"+55": "Seu cÃ³digo de verificaÃ§Ã£o Ã©",

"+20": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+93": "Ú©Ø¯ ØªØ£ÛŒÛŒØ¯ Ø´Ù…Ø§ Ø§ÛŒÙ† Ø§Ø³Øª",

"+212": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+31": "Uw verificatiecode is",

"+46": "Din verifieringskod Ã¤r",

"+41": "Ihr BestÃ¤tigungscode lautet",
  
  "+965": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+216": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+977": "à¤¤à¤ªà¤¾à¤ˆà¤‚à¤•à¥‹ à¤ªà¥à¤°à¤®à¤¾à¤£à¥€à¤•à¤°à¤£ à¤•à¥‹à¤¡ à¤¹à¥‹",

"+964": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+998": "Tasdiqlash kodingiz",

"+84": "MÃ£ xÃ¡c minh cá»§a báº¡n lÃ ",

"+94": "à¶”à¶¶à¶œà·š à¶­à·„à·€à·”à¶»à·” à¶šà·’à¶»à·“à¶¸à·š à¶šà·šà¶­à¶º",

"+966": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+213": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+263": "Your verification code is",

"+592": "Your verification code is",

"+249": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+234": "Your verification code is",

"+43": "Ihr BestÃ¤tigungscode lautet",

"+63": "Your verification code is",

"+52": "Su cÃ³digo de verificaciÃ³n es",
  
"+974": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",
  "+27": "Your verification code is",

"+54": "Your verification code is",

"+57": "Your verification code is",

"+51": "Your verification code is",

"+56": "Your verification code is",

"+351": "Your verification code is",

"+32": "Your verification code is",

"+45": "Your verification code is",

"+358": "Your verification code is",

"+30": "Your verification code is",

"+48": "Your verification code is",

"+40": "Your verification code is",

"+380": "Your verification code is",

"+254": "Your verification code is",

"+255": "Your verification code is",

"+256": "Your verification code is",

"+64": "Your verification code is",

"+61": "Your verification code is",

"+353": "Your verification code is",

"+420": "Your verification code is",

"+36": "Your verification code is",

"+39": "Il tuo codice di verifica Ã¨",

"+44": "Your verification code is",

"+81": "ã‚ãªãŸã®ç¢ºèªã‚³ãƒ¼ãƒ‰ã¯",

"+92": "Ø¢Ù¾ Ú©Ø§ ØªØµØ¯ÛŒÙ‚ÛŒ Ú©ÙˆÚˆ ÛÛ’",

"+968": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+86": "æ‚¨çš„éªŒè¯ç æ˜¯",

"+91": "à¤†à¤ªà¤•à¤¾ à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¨ à¤•à¥‹à¤¡ à¤¹à¥ˆ",

"+880": "à¦†à¦ªà¦¨à¦¾à¦° à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦•à§‹à¦¡ à¦¹à¦²à§‹",

"+971": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+60": "Kod pengesahan anda ialah",

"+66": "à¸£à¸«à¸±à¸ªà¸¢à¸·à¸™à¸¢à¸±à¸™à¸‚à¸­à¸‡à¸„à¸¸à¸“à¸„à¸·à¸­",

"+7": "Ð’Ð°Ñˆ ÐºÐ¾Ð´ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ñ",

"+34": "Su cÃ³digo de verificaciÃ³n es",

"+55": "Seu cÃ³digo de verificaÃ§Ã£o Ã©",

"+20": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+93": "Ú©Ø¯ ØªØ£ÛŒÛŒØ¯ Ø´Ù…Ø§ Ø§ÛŒÙ† Ø§Ø³Øª",

"+212": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+31": "Uw verificatiecode is",

"+46": "Din verifieringskod Ã¤r",

"+41": "Ihr BestÃ¤tigungscode lautet",

"+965": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+216": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+977": "à¤¤à¤ªà¤¾à¤ˆà¤‚à¤•à¥‹ à¤ªà¥à¤°à¤®à¤¾à¤£à¥€à¤•à¤°à¤£ à¤•à¥‹à¤¡ à¤¹à¥‹",

"+964": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+998": "Tasdiqlash kodingiz",

"+84": "MÃ£ xÃ¡c minh cá»§a báº¡n lÃ ",

"+94": "à¶”à¶¶à¶œà·š à¶­à·„à·€à·”à¶»à·” à¶šà·’à¶»à·“à¶¸à·š à¶šà·šà¶­à¶º",

"+966": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+213": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+263": "Your verification code is",

"+592": "Your verification code is",

"+249": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+234": "Your verification code is",

"+43": "Ihr BestÃ¤tigungscode lautet",

"+63": "Your verification code is",

"+52": "Su cÃ³digo de verificaciÃ³n es",

"+974": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+62": "Kode verifikasi Anda adalah",

"+251": "á‹¨áˆ›áˆ¨áŒ‹áŒˆáŒ« áŠ®á‹µá‹Ž á‹­áˆ… áŠá‹",

"+65": "Your verification code is",

"+98": "Ú©Ø¯ ØªØ£ÛŒÛŒØ¯ Ø´Ù…Ø§ Ø§ÛŒÙ† Ø§Ø³Øª",

"+973": "Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù‡Ùˆ",

"+47": "Bekreftelseskoden din er",

"+33": "Votre code de vÃ©rification est",

"+972": "×§×•×“ ×”××™×ž×•×ª ×©×œ×š ×”×•×",

"+49": "Ihr BestÃ¤tigungscode lautet",

"+1": "Your verification code is",

"+82": "ì¸ì¦ ì½”ë“œëŠ”",

"+90": "DoÄŸrulama kodunuz"
};

return texts[countryCode] || "Hello Your verification code is";
}

/* ================= SPEECH ================= */

function codeToSpeech(code) {
  const words = {
    "0": "zero","1": "one","2": "two","3": "three","4": "four",
    "5": "five","6": "six","7": "seven","8": "eight","9": "nine"
  };

  return code.toString().split("").map(d => words[d]).join(" ");
}

/* ================= NUMBER ================= */

function generateNumber(prefix) {
  const last = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}***${last}`;
}

/* ================= DELAY ================= */

function getDelay() {

  /* âš¡ FAST MODE */

  if (fastMode) {

    const delays = [
      1000,
      1500,
      2000
    ];

    return delays[
      Math.floor(Math.random() * delays.length)
    ];

  }

  /* ðŸ¢ SLOW MODE */

  if (slowMode) {

    const delays = [
      12000,
      18000,
      25000
    ];

    return delays[
      Math.floor(Math.random() * delays.length)
    ];

  }

  /* âš¡ NORMAL MODE */

  const normalDelays = [
    4000,
    5000,
    6000
  ];

  return normalDelays[
    Math.floor(Math.random() * normalDelays.length)
  ];

}

/* ================= COUNTRY ================= */

function updateCountry() {

  /* âŒ NO COUNTRY ENABLED */
  if (enabledCountries.length === 0) {
    currentCountry = null;
    return;
  }

  const now = Date.now();

  if (
    now - countryStart >= 3600000
  ) {

    countryIndex =
      (countryIndex + 1) %
      enabledCountries.length;

    countryStart = now;

  }

  if (Math.random() < 0.5) {

    countryIndex =
      Math.floor(
        Math.random() *
        enabledCountries.length
      );

  }

  currentCountry =
    enabledCountries[countryIndex];

}

/* ================= VOICE ================= */

async function createVoice(code, file) {

  const text = "আল্লাহ আপনাকে ভালো রাখুন";

  return new Promise((resolve, reject) => {

    const tts = new gTTS(text, "bn");

    tts.save(file, (err) => {
      if (err) reject(err);
      else resolve();
    });

  });
}

/* ================= SEND ================= */

async function sendCall() {

  if (!botRunning) {
    setTimeout(sendCall, 2000);
    return;
  }

  try {

  updateCountry();

  /* âŒ NO COUNTRY ENABLED */
  if (!currentCountry) {
    setTimeout(sendCall, 2000);
    return;
  }

  const code = codes[codeIndex];
  codeIndex = (codeIndex + 1) % codes.length;

  const number = generateNumber(currentCountry.code);
  const file = `./temp/${Date.now()}.mp3`;

  await createVoice(code, file);

  const time = new Date().toLocaleString();
    const caption =
`<b>â•­â”ðŸ“¡Voice Call AlertðŸ“¡â”â•® </b>
â”â”â”â”â”TELEGRAMâ”â”â”â”â”

â”ƒâ° <b>Time:</b> ${time}
â”ƒðŸŒ <b>Country:</b> ${currentCountry.flag} ${currentCountry.name}

â”ƒâ˜Žï¸ <b>Number:</b> <code>${number}</code>

â”ƒðŸ” <b>Access:</b> <code>âž¤ New China Panelâ™»ï¸</code>

â”ƒâ± <b>Duration:</b> âž¤ 15 Seconds
 â•°â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â•¯
âš¡ <b>Mode:</b> <b>Call To Music Generator</b> â€” <a href="https://t.me/+2R-AXlxNPWthNGFh">Click Here to join</a>
<b><i>Powered by Smart Method ðŸ¤–</i></b>`;

const sentMsg = await bot.telegram.sendAudio(
      GROUP_ID,
      { source: file },
      {
        caption,
        parse_mode: "HTML"
      }
    );

    // â³ 5 à¦®à¦¿à¦¨à¦¿à¦Ÿ à¦ªà¦°à§‡ à¦®à§‡à¦¸à§‡à¦œ à¦¡à¦¿à¦²à¦¿à¦Ÿ
    setTimeout(async () => {
      try {
        await bot.telegram.deleteMessage(GROUP_ID, sentMsg.message_id);
      } catch (err) {
        console.log("Delete Error:", err);
      }
    }, 300000);

    // ðŸ§¹ 3 à¦¸à§‡à¦•à§‡à¦¨à§à¦¡ à¦ªà¦°à§‡ à¦«à¦¾à¦‡à¦² à¦¡à¦¿à¦²à¦¿à¦Ÿ
    setTimeout(() => fs.remove(file), 3000);

  } catch (err) {
    console.log("ERROR:", err);
  }

  setTimeout(sendCall, getDelay());
}
/* ================= COMMANDS ================= */

bot.command("on", (ctx) => {

  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("ðŸš« This command is only for admin");
  }

  botRunning = true;

startAutoSlowMode();

/* âœ… ALL COUNTRY ON AGAIN */
enabledCountries = [...countries];

  ctx.reply(
`âœ… Bot Fully ON

ðŸŒ All Countries Enabled`
  );

});

bot.command("off", (ctx) => {

  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("ðŸš« This command is only for admin");
  }

  botRunning = false;

  enabledCountries = [];

  slowMode = false;
  fastMode = false;

  if (slowModeTimer) {
    clearTimeout(slowModeTimer);
  }

  if (fastModeTimer) {
    clearTimeout(fastModeTimer);
  }

  if (autoOnTimer) {
    clearTimeout(autoOnTimer);
  }

  if (autoSlowInterval) {
    clearInterval(autoSlowInterval);
    autoSlowInterval = null;
  }

  ctx.reply(
`â›” BOT FULLY OFF

âŒ All Systems Disabled
âŒ All Countries Disabled
âŒ Auto Slow OFF
âŒ Fast Mode OFF
âŒ Slow Mode OFF

âœ… Bot Will Stay OFF Until /on`
  );

});
/* ================= AUTO TIME SYSTEM ================= */

bot.hears(/^\/time(\d+)$/, async (ctx) => {

  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("ðŸš« Admin only command");
  }

  try {
    
    const minutes =
      parseInt(ctx.match[1]);

    if (isNaN(minutes) || minutes <= 0) {
      return ctx.reply("âŒ Invalid time");
    }

    /* âœ… BOT OFF */

    botRunning = false;

    /* â° MINUTES â†’ MILLISECONDS */

    const ms =
      minutes * 60 * 1000;

    /* ðŸ”„ REMOVE OLD TIMER */

    if (autoOnTimer) {
      clearTimeout(autoOnTimer);
    }

    /* âœ… AUTO ON */

    autoOnTimer = setTimeout(() => {

      botRunning = true;

      ctx.reply(
`âœ… Bot Auto ON Successfully

â° OFF Time Finished:
${minutes} Minute`
      ).catch(() => {});

    }, ms);

    ctx.reply(
`â›” Bot OFF Successfully

â° Auto ON After:
${minutes} Minute`
    );

  } catch (e) {

    console.log(e);

  }

});

/* ================= SLOW MODE ================= */

bot.command("slow", async (ctx) => {

  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("ðŸš« Admin only command");
  }

  try {

    /* âœ… ENABLE */

    slowMode = true;
    
fastMode = false;
    
    /* ðŸ”„ REMOVE OLD TIMER */

    if (slowModeTimer) {
      clearTimeout(slowModeTimer);
    }

    /* â° AUTO OFF AFTER 5 MIN */

    slowModeTimer = setTimeout(() => {

      slowMode = false;

      ctx.reply(
        "âš¡ Slow Mode Auto OFF"
      ).catch(() => {});

    }, 300000);

    ctx.reply(
`ðŸ¢ SLOW MODE ON

âš¡ Fast Mode OFF
ðŸ¢ Slow Mode Activated

â° Duration:
5 Minute`
);

  } catch (e) {

    console.log(e);

  }

});
/* ================= FAST MODE ================= */

bot.command("fast", async (ctx) => {

  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("ðŸš« Admin only command");
  }

  try {

    fastMode = true;
    slowMode = false;

    if (fastModeTimer) {
      clearTimeout(fastModeTimer);
    }

    fastModeTimer = setTimeout(() => {

      fastMode = false;

      ctx.reply(
        "âš¡ Fast Mode Auto OFF"
      ).catch(() => {});

    }, 300000);

    ctx.reply(
`âš¡ FAST MODE ON

ðŸš€ Super Fast Sending Started

â° Duration:
5 Minute`
    );

  } catch (e) {

    console.log(e);

  }

});
/* ================= NORMAL MODE ================= */

bot.command("normal", async (ctx) => {

  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("ðŸš« Admin only command");
  }

  try {

    fastMode = false;
    slowMode = false;

    ctx.reply(
`âœ… NORMAL MODE ON

âš¡ Fast OFF
ðŸ¢ Slow OFF

ðŸš€ System Back To Normal`
    );

  } catch (e) {

    console.log(e);

  }

});
/* ================= COUNTRY SYSTEM ================= */

bot.hears(/^\/country (.+)$/i, async (ctx) => {

  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("ðŸš« Admin only command");
  }

  try {

    const input = ctx.match[1].trim().toLowerCase();

    const isOff = input.endsWith(" off");

    const cleanName = isOff
      ? input.replace(" off", "").trim()
      : input;

    /* ðŸ” MATCH FULL NAME (LIKE United Kingdom, South Korea) */
    const foundCountry = countries.find(c =>
      c.name.toLowerCase() === cleanName
    );

    if (!foundCountry) {
      return ctx.reply(
`âŒ Country Not Found

Example:
/country Pakistan
/country United Kingdom
/country South Korea off`
      );
    }

    /* âŒ OFF */
    if (isOff) {

      enabledCountries = enabledCountries.filter(
        c => c.name !== foundCountry.name
      );

      return ctx.reply(
`â›” Country OFF

ðŸŒ ${foundCountry.flag} ${foundCountry.name}`
      );
    }

    /* âœ… ON */
    const exists = enabledCountries.find(
      c => c.name === foundCountry.name
    );

    if (!exists) {
      enabledCountries.push(foundCountry);
    }
botRunning = true;

if (!autoSlowInterval) {
  startAutoSlowMode();
}
    return ctx.reply(
`âœ… Country ON

ðŸŒ ${foundCountry.flag} ${foundCountry.name}`
    );

  } catch (e) {
    console.log(e);
  }
});

/* ================= START ================= */

bot.start((ctx) => {

  ctx.reply(
    "ðŸ‘‹ Welcome to China Call Bot ðŸ¤–âœ¨\n\nðŸ”¥ Status: Online\nðŸŒ System: China Panel Call Recording System\nðŸ”¢ Feature: OTP Voice Recovered System\n\nâš¡ Commands:\nâ–¶ /on - Start bot (Admin only)\nâ›” /off - Stop bot (Admin only)\n\nðŸš€ Enjoy your system!"
  );

});

/* ================= BOT START ================= */

bot.launch();

console.log("ðŸ¤– Bot Started...");
startAutoSlowMode();

/* ================= AUTO RANDOM SLOW ================= */

function startAutoSlowMode() {

  if (autoSlowInterval) {
    clearInterval(autoSlowInterval);
  }

  autoSlowInterval = setInterval(() => {

    if (!botRunning) return;

    slowMode = true;
    fastMode = false;

    console.log("ðŸ¢ AUTO SLOW MODE ON");

    setTimeout(() => {

      slowMode = false;

      console.log("âš¡ AUTO SLOW MODE OFF");

    }, 300000);

  }, 7200000);

}

/* ================= LOOP ================= */

sendCall();
