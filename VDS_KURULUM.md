# VDS Kurulum Talimatları

## 1. VDS Sunucu Hazırlığı

### Node.js Kurulumu (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Node.js Kurulumu (CentOS/RHEL):
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

## 2. PM2 Kurulumu
```bash
sudo npm install pm2 -g
```

## 3. Bot Dosyalarını VDS'e Yükleme

### Seçenek 1: Git ile
```bash
git clone <repository_url>
cd ses-bot
npm install
```

### Seçenek 2: Dosya Yükleme
- Bot dosyalarını zip yap
- VDS'e upload et
- Zip'i aç: `unzip ses-bot.zip`
- `cd ses-bot`
- `npm install`

## 4. Botu Başlatma

### PM2 ile başlat:
```bash
pm2 start ecosystem.config.json
```

### Manuel başlat:
```bash
pm2 start index.js --name "ses-bot"
```

## 5. PM2 Yönetim Komutları

### Bot durumunu kontrol et:
```bash
pm2 status
```

### Logları görüntüle:
```bash
pm2 logs ses-bot
```

### Botu yeniden başlat:
```bash
pm2 restart ses-bot
```

### Botu durdur:
```bash
pm2 stop ses-bot
```

### Botu sil:
```bash
pm2 delete ses-bot
```

### PM2 sistem başlangıcına ekle:
```bash
pm2 startup
pm2 save
```

## 6. Otomatik Başlatma Ayarları

### PM2'i sistem servisi olarak ayarla:
```bash
pm2 startup
# Çıkan komutu kopyalayıp çalıştırın
pm2 save
```

### Test etmek için sunucuyu yeniden başlat:
```bash
sudo reboot
```

## 7. Port ve Firewall Ayarları

### Gerekli portları aç (Ubuntu UFW):
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### CentOS/RHEL Firewall:
```bash
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 8. Güvenlik İpuçları

- Bot tokeninizi güvenli tutun
- SSH anahtar kimlik doğrulaması kullanın
- Regular backup yapın
- Sistem güncellemelerini takip edin

## 9. Monitor ve Bakım

### Sistem kaynaklarını kontrol et:
```bash
htop
free -h
df -h
```

### PM2 monitoring:
```bash
pm2 monit
```

### Log rotation (logların büyümesini engeller):
```bash
pm2 install pm2-logrotate
```

## 10. Hata Ayıklama

### Bot çalışmıyorsa:
```bash
pm2 logs ses-bot --lines 50
```

### Node.js versiyonunu kontrol et:
```bash
node --version
npm --version
```

### Disk alanını kontrol et:
```bash
df -h
```

## Hızlı Kurulum Scripti (Ubuntu)

```bash
#!/bin/bash
echo "🚀 VDS Ses Botu Kurulum Başlıyor..."

# Node.js kur
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kur
sudo npm install pm2 -g

# Log klasörü oluştur
mkdir -p logs

# Botu başlat
pm2 start ecosystem.config.json

# PM2 startup
pm2 startup
pm2 save

echo "✅ Kurulum tamamlandı! Bot artık 7/24 çalışacak."
echo "📊 Durum kontrolü: pm2 status"
echo "📝 Loglar: pm2 logs ses-bot"
```