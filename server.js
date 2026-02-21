const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// İstifadəçi məlumatlarını saxlamaq üçün
let userData = [];

// Admin girişi
const ADMIN_USERNAME = '618ursaursamajor';
const ADMIN_PASSWORD = '618majorursa618';

// Admin autentifikasiya endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Giriş uğurlu!' });
  } else {
    res.status(401).json({ success: false, message: 'Yanlış ad və ya şifrə!' });
  }
});

// İstifadəçi məlumatlarını yadda saxlama
app.post('/api/submit-data', (req, res) => {
  try {
    const data = req.body;
    data.timestamp = new Date().toISOString();
    data.id = Date.now() + Math.random();
    userData.push(data);
    
    // Real-time olaraq admin panelinə göndər
    io.emit('new-user-data', data);
    
    res.json({ success: true, message: 'Məlumatlar qeyd edildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// Admin paneli üçün bütün məlumatları göndər
app.get('/api/admin/data', (req, res) => {
  res.json({ success: true, data: userData });
});

// Socket.IO bağlantıları
io.on('connection', (socket) => {
  console.log('Yeni istifadəçi bağlandı:', socket.id);
  
  socket.on('submit-user-data', (data) => {
    data.timestamp = new Date().toISOString();
    data.id = Date.now() + Math.random();
    userData.push(data);
    
    // Bütün admin panellərinə real-time göndər
    io.emit('new-user-data', data);
  });
  
  socket.on('disconnect', () => {
    console.log('İstifadəçi ayrıldı:', socket.id);
  });
});

// Health check endpoint (Render.com üçün)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Ana səhifə
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server başlat
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ${PORT} portunda işləyir`);
  console.log(`📡 Socket.IO aktiv`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM siqnalı alındı, server bağlanır...');
  server.close(() => {
    console.log('Server bağlandı');
  });
});
