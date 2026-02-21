# Render.com Deployment Təlimatı

## Render.com-da Deploy etmək üçün addımlar:

### 1. Render.com hesabı yaradın
- https://render.com saytına daxil olun
- GitHub hesabınızla qeydiyyatdan keçin

### 2. Yeni Web Service yaradın
- Dashboard-da "New +" düyməsinə basın
- "Web Service" seçin
- GitHub repository seçin: `tupi1021-cmyk/khsgajs-`

### 3. Konfiqurasiya parametrləri
Aşağıdakı parametrləri daxil edin:

**Name**: `webapp` (və ya istədiyiniz ad)

**Region**: Europe (Frankfurt) və ya sizə yaxın region

**Branch**: `main`

**Runtime**: `Node`

**Build Command**:
```
npm install
```

**Start Command**:
```
npm start
```

**Instance Type**: `Free`

### 4. Environment Variables əlavə edin
Settings → Environment səhifəsinə keçin və əlavə edin:

```
NODE_ENV=production
```

### 5. Deploy edin
- "Create Web Service" düyməsinə basın
- Deploy prosesi avtomatik başlayacaq (3-5 dəqiqə)
- Deploy tamamlandıqdan sonra Render sizə URL verəcək

### 6. URL formatı
Render URL formatı:
```
https://webapp-xxxx.onrender.com
```

### 7. Health Check
Render avtomatik olaraq `/health` endpoint-ini yoxlayacaq.

## Qeydlər

### Auto-Deploy
- `main` branch-a hər push etdikdə avtomatik deploy olacaq
- Manual deploy üçün: Dashboard → Manual Deploy düyməsi

### Logs
Render dashboardda "Logs" bölməsindən real-time logları izləyə bilərsiniz.

### Custom Domain
- Settings → Custom Domain bölməsindən öz domeninizi əlavə edə bilərsiniz
- CNAME record əlavə etməlisiniz: `your-domain.com` → `webapp-xxxx.onrender.com`

### Free Tier Məhdudiyyətləri
- 750 saat/ay pulsuz
- 15 dəqiqə qeyri-aktivlikdən sonra yatır (sleep mode)
- İlk request 30-60 saniyə çəkə bilər (cold start)

### Production Best Practices
Paid plan üçün tövsiyələr:
- Database əlavə edin (PostgreSQL/MongoDB)
- Persistent storage üçün Volume mount
- Auto-scaling aktiv edin
- Backup sistemi qurun

## Digər Deployment Platformaları

### Heroku
```bash
heroku create webapp
git push heroku main
```

### Railway.app
- GitHub repository-ni connect edin
- Deploy düyməsinə basın

### Vercel (Serverless)
```bash
npm install -g vercel
vercel
```

### DigitalOcean App Platform
- GitHub-dan import edin
- Auto-deploy aktivləşir

## Troubleshooting

### Deploy uğursuz olarsa:
1. Build logları yoxlayın
2. `package.json` içində `start` script-ini yoxlayın
3. Environment variables-ləri yoxlayın
4. Node.js versiyasını yoxlayın (>= 14.0.0)

### Service işləmirsə:
1. Logs bölməsinə baxın
2. Health check endpoint-ini test edin
3. PORT environment variable düzgün istifadə olunub?

## Yardım

Render dokumentasiyası:
https://render.com/docs

Support:
https://render.com/support
