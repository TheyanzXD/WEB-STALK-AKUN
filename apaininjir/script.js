const API_CONFIG = {
    tiktok: {
        url: "https://api.fikmydomainsz.xyz/stalk/tiktok",
        param: "username"
    },
    npm: {
        url: "https://api.fikmydomainsz.xyz/stalk/npm",
        param: "name"
    },
    minecraft: {
        url: "https://api.fikmydomainsz.xyz/stalker/minecraft",
        param: "username"
    },
    github: {
        url: "https://api.fikmydomainsz.xyz/stalk/github",
        param: "username"
    },
    instagram: {
        url: "https://api.ryzumi.vip/api/stalk/instagram",
        param: "username"
    },
    mahasiswa: {
        url: "https://api.ryzumi.vip/api/search/mahasiswa",
        param: "query"
    },
    twitter: {
        url: "https://api.siputzx.my.id/api/stalk/twitter",
        param: "user"
    },
    youtube: {
        url: "https://api.siputzx.my.id/api/stalk/youtube",
        param: "username"
    }
};

let activePlatform = 'tiktok';

const exampleUsernames = {
    tiktok: 'yyanzxd',
    instagram: 'google',
    github: 'TheyanzXD',
    npm: 'naruyaizumi',
    minecraft: 'dream',
    mahasiswa: 'Muhammad nugi nugraha',
    twitter: 'siputzx',
    youtube: 'siputzx'
};

function init() {
    updatePlaceholder();
    
    const platformOptions = document.querySelectorAll('.platform-option');
    platformOptions.forEach(option => {
        option.addEventListener('click', () => {
            platformOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            activePlatform = option.dataset.platform;
            updatePlaceholder();
        });
    });
    
    const stalkButton = document.getElementById('stalkButton');
    stalkButton.addEventListener('click', stalkAccount);
    
    const usernameInput = document.getElementById('usernameInput');
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            stalkAccount();
        }
    });
}

function updatePlaceholder() {
    const usernameInput = document.getElementById('usernameInput');
    const example = exampleUsernames[activePlatform];
    const platformNames = {
        'tiktok': 'TikTok',
        'instagram': 'Instagram',
        'github': 'GitHub',
        'npm': 'NPM',
        'minecraft': 'Minecraft',
        'mahasiswa': 'Mahasiswa',
        'twitter': 'Twitter',
        'youtube': 'YouTube'
    };
    const platformName = platformNames[activePlatform] || activePlatform;
    usernameInput.placeholder = `Masukkan ${platformName} ${activePlatform === 'mahasiswa' ? 'nama' : 'username'}... Contoh: ${example}`;
}

async function stalkAccount() {
    const usernameInput = document.getElementById('usernameInput');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const resultContainer = document.getElementById('resultContainer');
    
    const inputValue = usernameInput.value.trim();
    
    if (!inputValue) {
        showError('Masukkan nama/username terlebih dahulu!');
        return;
    }
    
    loadingIndicator.classList.add('active');
    errorMessage.classList.remove('active');
    resultContainer.classList.remove('active');
    
    try {
        const apiConfig = API_CONFIG[activePlatform];
        const apiUrl = `${apiConfig.url}?${apiConfig.param}=${encodeURIComponent(inputValue)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        loadingIndicator.classList.remove('active');
        
        if (activePlatform === 'mahasiswa') {
            if (!Array.isArray(data) || data.length === 0) {
                showError('Data mahasiswa tidak ditemukan. Periksa kembali nama yang dimasukkan.');
                return;
            }
        } else if (activePlatform === 'instagram') {
            if (!data.avatar || !data.username) {
                showError('Data Instagram tidak ditemukan. Periksa kembali username yang dimasukkan.');
                return;
            }
        } else if (data.success === false || (data.status === false) || (data.status === undefined && !data.creator && !data.success)) {
            showError('Data tidak ditemukan. Periksa kembali input yang dimasukkan.');
            return;
        }
        
        displayResult(data);
        
    } catch (error) {
        console.error('Error:', error);
        loadingIndicator.classList.remove('active');
        showError(`Terjadi kesalahan: ${error.message}`);
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorMessage.classList.add('active');
}

function displayResult(data) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';
    
    let resultHTML = '';
    
    switch (activePlatform) {
        case 'tiktok':
            resultHTML = createTikTokCard(data);
            break;
        case 'instagram':
            resultHTML = createInstagramCard(data);
            break;
        case 'github':
            resultHTML = createGitHubCard(data);
            break;
        case 'npm':
            resultHTML = createNPMCard(data);
            break;
        case 'minecraft':
            resultHTML = createMinecraftCard(data);
            break;
        case 'mahasiswa':
            resultHTML = createMahasiswaCard(data);
            break;
        case 'twitter':
            resultHTML = createTwitterCard(data);
            break;
        case 'youtube':
            resultHTML = createYouTubeCard(data);
            break;
        default:
            resultHTML = '<div class="result-card">Platform tidak didukung</div>';
    }
    
    resultContainer.innerHTML = resultHTML;
    resultContainer.classList.add('active');
    
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function createTikTokCard(data) {
    const result = data.result;
    return `
        <div class="result-card">
            <div class="platform-header">
                <i class="fab fa-tiktok" style="color:#ff0080;"></i>
                <h2 class="platform-title">TikTok Profile</h2>
            </div>
            
            <div class="profile-section">
                <img src="${result.avatar}" alt="${result.uniqueId}" class="profile-img">
                <div class="profile-info">
                    <h3>${result.nickname}</h3>
                    <div class="username">@${result.uniqueId}</div>
                    <div class="bio">${result.signature || 'Tidak ada bio'}</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${result.followers}</div>
                    <div class="stat-label">Followers</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.following}</div>
                    <div class="stat-label">Following</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.likes}</div>
                    <div class="stat-label">Likes</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.videos}</div>
                    <div class="stat-label">Videos</div>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <div class="info-label">ID</div>
                    <div class="info-value">${result.id}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Verified</div>
                    <div class="info-value">${result.verified ? 'Ya' : 'Tidak'}</div>
                </div>
            </div>
        </div>
    `;
}

function createInstagramCard(data) {
    return `
        <div class="result-card">
            <div class="platform-header">
                <i class="fab fa-instagram" style="color:#e4405f;"></i>
                <h2 class="platform-title">Instagram Profile</h2>
            </div>
            
            <div class="profile-section">
                <img src="${data.avatar}" alt="${data.username}" class="profile-img">
                <div class="profile-info">
                    <h3>${data.name}</h3>
                    <div class="username">@${data.username}</div>
                    <div class="bio">${data.bio || 'Tidak ada bio'}</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${data.followers}</div>
                    <div class="stat-label">Followers</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.following}</div>
                    <div class="stat-label">Following</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.posts}</div>
                    <div class="stat-label">Posts</div>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <div class="info-label">Username</div>
                    <div class="info-value">@${data.username}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Nama Lengkap</div>
                    <div class="info-value">${data.name}</div>
                </div>
            </div>
        </div>
    `;
}

function createGitHubCard(data) {
    const result = data.result;
    return `
        <div class="result-card">
            <div class="platform-header">
                <i class="fab fa-github" style="color:#f5f5f5;"></i>
                <h2 class="platform-title">GitHub Profile</h2>
            </div>
            
            <div class="profile-section">
                <img src="${result.profile_pic}" alt="${result.username}" class="profile-img">
                <div class="profile-info">
                    <h3>${result.nickname}</h3>
                    <div class="username">@${result.username}</div>
                    <div class="bio">${result.bio || 'Tidak ada bio'}</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${result.public_repo}</div>
                    <div class="stat-label">Repositories</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.followers}</div>
                    <div class="stat-label">Followers</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.following}</div>
                    <div class="stat-label">Following</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.public_gists}</div>
                    <div class="stat-label">Gists</div>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <div class="info-label">User ID</div>
                    <div class="info-value">${result.id}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Type</div>
                    <div class="info-value">${result.type}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Blog/Website</div>
                    <div class="info-value">${result.blog || 'Tidak ada'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Account Created</div>
                    <div class="info-value">${new Date(result.ceated_at).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Last Updated</div>
                    <div class="info-value">${new Date(result.updated_at).toLocaleDateString('id-ID')}</div>
                </div>
            </div>
        </div>
    `;
}

function createNPMCard(data) {
    const result = data.result;
    return `
        <div class="result-card">
            <div class="platform-header">
                <i class="fab fa-npm" style="color:#cb3837;"></i>
                <h2 class="platform-title">NPM Package</h2>
            </div>
            
            <div class="profile-section">
                <div style="width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; background: #cb3837; border-radius: 50%;">
                    <i class="fab fa-npm" style="font-size: 3rem; color: white;"></i>
                </div>
                <div class="profile-info">
                    <h3>${result.name}</h3>
                    <div class="username">NPM Package</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${result.versionLatest}</div>
                    <div class="stat-label">Latest Version</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.versionPublish}</div>
                    <div class="stat-label">Published Version</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.versionUpdate}</div>
                    <div class="stat-label">Version Updates</div>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <div class="info-label">Latest Dependencies</div>
                    <div class="info-value">${result.latestDependencies}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Published Dependencies</div>
                    <div class="info-value">${result.publishDependencies}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">First Published</div>
                    <div class="info-value">${new Date(result.publishTime).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Last Updated</div>
                    <div class="info-value">${new Date(result.latestPublishTime).toLocaleDateString('id-ID')}</div>
                </div>
            </div>
        </div>
    `;
}

function createMinecraftCard(data) {
    const result = data.result;
    return `
        <div class="result-card">
            <div class="platform-header">
                <i class="fas fa-cube" style="color:#6ab04a;"></i>
                <h2 class="platform-title">Minecraft Player</h2>
            </div>
            
            <div class="profile-section">
                <img src="${result.skin}" alt="${result.name}" class="profile-img">
                <div class="profile-info">
                    <h3>${result.name}</h3>
                    <div class="username">Minecraft Player</div>
                    <div class="bio">UUID: ${result.uuid}</div>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <div class="info-label">Player Name</div>
                    <div class="info-value">${result.name}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">UUID</div>
                    <div class="info-value">${result.uuid}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Cape</div>
                    <div class="info-value">${result.cape ? 'Available' : 'Not available'}</div>
                </div>
            </div>
        </div>
    `;
}

function createMahasiswaCard(data) {
    return `
        <div class="result-card">
            <div class="platform-header">
                <i class="fas fa-graduation-cap" style="color:#2196F3;"></i>
                <h2 class="platform-title">Data Mahasiswa</h2>
            </div>
            
            <div class="profile-section">
                <div style="width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2196F3, #03A9F4); border-radius: 50%;">
                    <i class="fas fa-user-graduate" style="font-size: 3rem; color: white;"></i>
                </div>
                <div class="profile-info">
                    <h3>${data[0].nama}</h3>
                    <div class="username">NIM: ${data[0].nim}</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${data[0].nama_pt}</div>
                    <div class="stat-label">Universitas</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data[0].nama_prodi}</div>
                    <div class="stat-label">Program Studi</div>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <div class="info-label">ID</div>
                    <div class="info-value">${data[0].id.substring(0, 20)}...</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Jumlah Hasil</div>
                    <div class="info-value">${data.length} data ditemukan</div>
                </div>
            </div>
            
            ${data.length > 1 ? `
            <h3 style="margin: 20px 0 10px 0;">Hasil Lainnya</h3>
            <div class="additional-info">
                ${data.slice(1).map((item, index) => `
                    <div class="info-item" style="grid-column: 1 / -1;">
                        <div class="info-label">Mahasiswa ${index + 2}</div>
                        <div class="info-value">
                            <strong>${item.nama}</strong><br>
                            NIM: ${item.nim}<br>
                            Universitas: ${item.nama_pt}<br>
                            Program Studi: ${item.nama_prodi}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    `;
}

function createTwitterCard(data) {
    const result = data.data;
    return `
        <div class="result-card">
            <div class="platform-header">
                <i class="fab fa-twitter" style="color:#1da1f2;"></i>
                <h2 class="platform-title">Twitter Profile</h2>
            </div>
            
            <div class="profile-section">
                <img src="${result.profile.image}" alt="${result.username}" class="profile-img">
                <div class="profile-info">
                    <h3>${result.name}</h3>
                    <div class="username">@${result.username}</div>
                    <div class="bio">${result.description || 'Tidak ada deskripsi'}</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${result.stats.tweets}</div>
                    <div class="stat-label">Tweets</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.stats.followers}</div>
                    <div class="stat-label">Followers</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.stats.following}</div>
                    <div class="stat-label">Following</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${result.stats.likes}</div>
                    <div class="stat-label">Likes</div>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <div class="info-label">User ID</div>
                    <div class="info-value">${result.id}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Location</div>
                    <div class="info-value">${result.location || 'Tidak diketahui'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Account Created</div>
                    <div class="info-value">${new Date(result.created_at).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Verified</div>
                    <div class="info-value">${result.verified ? 'Ya' : 'Tidak'}</div>
                </div>
            </div>
        </div>
    `;
}

function createYouTubeCard(data) {
    const result = data.data;
    const channel = result.channel;
    
    return `
        <div class="result-card">
            <div class="platform-header">
                <i class="fab fa-youtube" style="color:#ff0000;"></i>
                <h2 class="platform-title">YouTube Channel</h2>
            </div>
            
            <div class="profile-section">
                <img src="${channel.avatarUrl}" alt="${channel.username}" class="profile-img">
                <div class="profile-info">
                    <h3>${channel.username}</h3>
                    <div class="bio">${channel.description || 'Tidak ada deskripsi'}</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${channel.subscriberCount}</div>
                    <div class="stat-label">Subscribers</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${channel.videoCount}</div>
                    <div class="stat-label">Videos</div>
                </div>
            </div>
            
            ${result.latest_videos && result.latest_videos.length > 0 ? `
            <h3 style="margin: 20px 0 10px 0;">Latest Videos</h3>
            <div class="videos-grid">
                ${result.latest_videos.slice(0, 4).map(video => `
                    <div class="video-card">
                        <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                        <div class="video-info">
                            <div class="video-title">${video.title}</div>
                            <div class="video-meta">
                                <span><i class="far fa-eye"></i> ${video.viewCount}</span>
                                <span>${video.publishedTime}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div class="additional-info" style="margin-top: 20px;">
                <div class="info-item">
                    <div class="info-label">Channel URL</div>
                    <div class="info-value"><a href="${channel.channelUrl}" target="_blank" style="color:#40e0d0;">${channel.channelUrl}</a></div>
                </div>
            </div>
        </div>
    `;
}

window.addEventListener('DOMContentLoaded', init);
