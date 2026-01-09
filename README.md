# Ses Botu

Discord sunucunuzda ses kanalında 7/24 aktif kalan bir bot.

## Kurulum

1. **Discord Bot Oluşturun:**
   - [Discord Developer Portal](https://discord.com/developers/applications) gidin
   - New Application oluşturun
   - Bot sekmesine gidin ve "Add Bot" deyin
   - Bot token kopyalayın

2. **Bot İzinleri:**
   - Bot ayarlarından "Privileged Gateway Intents" altında:
     - ✅ MESSAGE CONTENT INTENTS
     - ✅ SERVER MEMBERS INTENTS
   - "OAuth2" -> "URL Generator" dan bot invite linki oluşturun
   - Gerekli izinler: `Connect`, `Speak`, `Read Messages`

3. **Proje Ayarları:**
   ```bash
   npm install
   ```

4. **.env Dosyasını Düzenleyin:**
   - `.env` dosyasını açın
   - `DISCORD_TOKEN=BOT_TOKENINIZI_BURAYA_YAZIN` yerine kendi tokeninizi yazın

## Kullanım

Botu başlatmak için:
```bash
npm start
```

Geliştirme modunda başlatmak için:
```bash
npm run dev
```

## Komutlar

### `.dotnet tun <kanal_id>`
Botu belirtilen ses kanalına bağlar ve 7/24 aktif tutar.

**Örnek:**
```
.dotnet tun 123456789012345678
```

**Kanal ID Nasıl Bulunur?**
- Discord'da kanal adına sağ tıklayın
- "Copy Channel ID" (Kanal ID'sini Kopyala) deyin
- Eğer bu seçenek görünmüyorsa, Discord ayarlarından "Developer Mode" (Geliştirici Modu) açın

## Özellikler

- ✅ 7/24 ses kanalında aktif kalma
- ✅ Otomatik yeniden bağlanma
- ✅ Hata yönetimi
- ✅ Komut ile kanal değiştirme
- ✅ Konsolda durum bildirimleri

## Notlar

- Botun ses kanalında kalması için sürekli çalışması gerekir
- Sunucu veya VPS üzerinde çalıştırmanız önerilir
- Bot ses çıkarmaz, sadece kanalda aktif kalır