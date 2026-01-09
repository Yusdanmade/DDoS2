# 🚀 VDS Tek Tık Kurulum

## Hazır! Sadece VDS'e SSH ile bağlanın ve şu komutu çalıştırın:

```bash
bash <(curl -s https://raw.githubusercontent.com/your-repo/ses-bot/main/setup.sh)
```

## Manuel Kurulum (Eğer yukarıdaki çalışmazsa):

1. **VDS'e SSH ile bağlanın**
2. **Setup script'ini indirin:**
   ```bash
   wget https://raw.githubusercontent.com/your-repo/ses-bot/main/setup.sh
   chmod +x setup.sh
   ./setup.sh
   ```

## Script Ne Yapıyor?

✅ **Otomatik Kurulum:**
- Node.js 18.x kurulumu
- PM2 kurulumu ve yapılandırma
- Bot dosyalarını oluşturma
- NPM paketlerini yükleme
- Discord token'ini ekleme
- Log rotation kurulumu
- Firewall yapılandırma
- 7/24 otomatik başlatma

✅ **Özellikler:**
- PC kapansa bile bot çalışır
- Sunucu yeniden başlatsa bot otomatik başlar
- Hata durumunda otomatik yeniden başlar
- Log yönetimi
- Memory limit (1GB)

## Kurulum Sonrası

Bot otomatik başlar! Discord'ta:
```
.dotnet tun <kanal_id>
```

## Yönetim

```bash
pm2 status          # Durum
pm2 logs ses-bot    # Loglar
pm2 restart ses-bot # Yeniden başlat
pm2 monit           # Monitor
```

**Not:** Script Ubuntu/Debian için hazırlanmıştır.