# 🚀 VDS Tek Tık Kurulum

## VDS'e SSH ile bağlanın ve bu komutu çalıştırın:

```bash
bash <(curl -s https://raw.githubusercontent.com/yusufkocer/ses-bot/main/setup.sh)
```

## Manuel Kurulum:

```bash
wget https://raw.githubusercontent.com/yusufkocer/ses-bot/main/setup.sh
chmod +x setup.sh
sudo bash setup.sh
```

**Script otomatik yapar:**
- Node.js 18.x kurulumu
- PM2 yapılandırma  
- Bot dosyalarını oluşturma
- 7/24 otomatik başlatma
- Log yönetimi
- Firewall ayarları

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

**Not:** Ubuntu/Debian için hazırlanmıştır.