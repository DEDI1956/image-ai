const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs-extra');
const path = require('path');
const { telegramToken } = require('../config');
const { createGmailAccount } = require('./gmailCreator');

const bot = new TelegramBot(telegramToken, { polling: true });

const dataPath = path.join(__dirname, '../data/accounts.json');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
Selamat datang di Bot Pembuat Akun Gmail!

**Peraturan Penggunaan Bot:**
1. Gunakan bot ini dengan bijak.
2. Jangan menyalahgunakan bot ini untuk aktivitas ilegal.
3. Satu pengguna hanya dapat membuat beberapa akun dalam sehari.

**Tujuan Bot:**
Bot ini bertujuan untuk membantu Anda membuat akun Gmail dengan cepat dan mudah.

**Resiko Penggunaan Bot:**
Akun yang dibuat melalui bot ini mungkin memiliki risiko lebih tinggi untuk dinonaktifkan oleh Google.

Silakan pilih salah satu tombol di bawah ini:
  `;
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Daftar Gmail', callback_data: 'register_gmail' },
          { text: 'List Gmail', callback_data: 'list_gmail' }
        ]
      ]
    }
  };
  bot.sendMessage(chatId, welcomeMessage, opts);
});

bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  if (data === 'register_gmail') {
    bot.sendMessage(chatId, 'Masukkan nama akun Gmail yang Anda inginkan:');
    bot.once('message', async (nameMsg) => {
      const gmailName = nameMsg.text;
      bot.sendMessage(chatId, 'Masukkan password untuk akun Gmail Anda:');
      bot.once('message', async (passwordMsg) => {
        const gmailPassword = passwordMsg.text;
        bot.sendMessage(chatId, 'Sedang memproses pembuatan akun Gmail, mohon tunggu...');
        try {
          const result = await createGmailAccount(gmailName, gmailPassword);
          if (result.success) {
            const accounts = await fs.readJson(dataPath, { throws: false }) || [];
            accounts.push({
              name: gmailName,
              email: result.email,
              password: gmailPassword
            });
            await fs.writeJson(dataPath, accounts, { spaces: 2 });
            bot.sendMessage(chatId, `Akun Gmail berhasil dibuat:\nEmail: ${result.email}\nPassword: ${gmailPassword}`);
          } else {
            bot.sendMessage(chatId, `Gagal membuat akun Gmail: ${result.error}`);
          }
        } catch (error) {
          bot.sendMessage(chatId, `Terjadi kesalahan: ${error.message}`);
        }
      });
    });
  } else if (data === 'list_gmail') {
    try {
      const accounts = await fs.readJson(dataPath, { throws: false }) || [];
      if (accounts.length === 0) {
        bot.sendMessage(chatId, 'Belum ada akun Gmail yang terdaftar.');
      } else {
        let message = 'Berikut adalah daftar akun Gmail yang terdaftar:\n\n';
        message += '```\n';
        message += '| No. | Nama Akun | Email          | Password     |\n';
        message += '|-----|-----------|----------------|--------------|\n';
        accounts.forEach((account, index) => {
          message += `| ${index + 1}   | ${account.name.padEnd(9)} | ${account.email.padEnd(14)} | ${account.password.padEnd(12)} |\n`;
        });
        message += '```';
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      bot.sendMessage(chatId, `Terjadi kesalahan: ${error.message}`);
    }
  }
});
