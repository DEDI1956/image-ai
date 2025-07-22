# Telegram Gmail Bot

Bot Telegram ini memungkinkan pengguna untuk membuat dan mendaftar akun Gmail.

## Prasyarat

*   Server VPS yang menjalankan Ubuntu
*   Node.js dan npm
*   Token Bot Telegram

## Instalasi

1.  **Kloning repositori ini:**
    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd telegram-gmail-bot
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasikan token bot Anda:**
    Buka file `config.js` dan ganti `YOUR_TELEGRAM_BOT_TOKEN` dengan token bot Telegram Anda yang sebenarnya.
    ```javascript
    module.exports = {
      telegramToken: "TOKEN_BOT_ANDA_DI_SINI"
    };
    ```

4.  **Instal dependensi Puppeteer di Ubuntu:**
    Puppeteer membutuhkan beberapa dependensi yang mungkin tidak diinstal secara default di server Ubuntu. Jalankan perintah berikut untuk menginstalnya:
    ```bash
    sudo apt-get update
    sudo apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
    ```

## Menjalankan Bot

Untuk memulai bot, jalankan perintah berikut:
```bash
npm start
```

Untuk menjaga agar bot tetap berjalan di latar belakang, disarankan untuk menggunakan manajer proses seperti `pm2`.

1.  **Instal pm2 secara global:**
    ```bash
    npm install pm2 -g
    ```

2.  **Mulai bot dengan pm2:**
    ```bash
    pm2 start bot/bot.js --name "gmail-bot"
    ```

3.  **(Opsional) Simpan daftar proses pm2 agar dapat dimulai ulang secara otomatis saat boot:**
    ```bash
    pm2 save
    pm2 startup
    ```

## Struktur Proyek

*   `/bot/bot.js`: File utama untuk logika bot Telegram.
*   `/bot/gmailCreator.js`: Skrip untuk membuat akun Gmail menggunakan Puppeteer.
*   `/data/accounts.json`: Menyimpan data akun Gmail yang dibuat.
*   `config.js`: File konfigurasi untuk token Telegram.
*   `package.json`: Mendefinisikan skrip dan dependensi proyek.
*   `README.md`: File ini.
