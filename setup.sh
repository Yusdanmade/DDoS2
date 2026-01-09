#!/bin/bash

# VDS Ses Botu Otomatik Kurulum Script'i
# Ubuntu/Debian için hazırlanmıştır

set -e

echo "🚀 VDS Ses Botu Otomatik Kurulum Başlıyor..."
echo "================================================"

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log fonksiyonu
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Sistem kontrolü
log "Sistem kontrolü yapılıyor..."
if [[ "$EUID" -ne 0 ]]; then
    error "Bu script root olarak çalıştırılmalıdır!"
    exit 1
fi

# Sistem güncellemesi
log "Sistem güncelleniyor..."
apt update && apt upgrade -y

# Gerekli paketler
log "Gerekli paketler kuruluyor..."
apt install -y curl wget git unzip htop build-essential

# Node.js kurulumu
log "Node.js 18.x kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Node.js versiyon kontrolü
log "Node.js versiyonu kontrol ediliyor..."
node_version=$(node --version)
npm_version=$(npm --version)
log "Node.js: $node_version"
log "NPM: $npm_version"

# PM2 kurulumu
log "PM2 kuruluyor..."
npm install -g pm2

# PM2 startup
log "PM2 sistem başlangıcına ekleniyor..."
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

# Bot klasörü oluştur
log "Bot klasörü oluşturuluyor..."
mkdir -p /root/ses-bot
cd /root/ses-bot

# Log klasörü oluştur
mkdir -p /root/ses-bot/logs

# Bot dosyalarını GitHub'dan çek
log "Bot dosyaları GitHub'dan indiriliyor..."
git clone https://github.com/Yusdanmade/DDoS2.git /tmp/ses-bot
cp -r /tmp/ses-bot/* /root/ses-bot/
rm -rf /tmp/ses-bot

# NPM paketlerini yükle
log "NPM paketleri kuruluyor..."
npm install

# Log rotation kur
log "Log rotation kuruluyor..."
pm2 install pm2-logrotate

# Botu başlat
log "Bot başlatılıyor..."
pm2 start ecosystem.config.json

# PM2 kaydet
log "PM2 ayarları kaydediliyor..."
pm2 save

# Firewall ayarları
log "Firewall ayarları yapılıyor..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Servisleri kontrol et
log "Servisler kontrol ediliyor..."
systemctl enable ufw
systemctl start ufw

echo ""
echo "🎉 KURULUM TAMAMLANDI!"
echo "================================================"
echo -e "${GREEN}✅${NC} Bot artık 7/24 çalışıyor!"
echo -e "${GREEN}✅${NC} PM2 otomatik başlatma ayarlandı!"
echo -e "${GREEN}✅${NC} Log rotation aktif!"
echo -e "${GREEN}✅${NC} Firewall yapılandırıldı!"
echo ""
echo "📊 Yönetim Komutları:"
echo "  pm2 status              - Bot durumunu göster"
echo "  pm2 logs ses-bot        - Logları göster"
echo "  pm2 restart ses-bot     - Botu yeniden başlat"
echo "  pm2 stop ses-bot        - Botu durdur"
echo "  pm2 monit               - Monitor modu"
echo ""
echo "🎵 Bot çalışıyor! Discord'ta ses kanalına bağlanmak için:"
echo "  1. Botun sunucuda olduğunu kontrol et"
echo "  2. '.dotnet tun <kanal_id>' komutunu kullan"
echo ""
echo "🔧 Destek için: /root/ses-bot/logs/"
echo ""