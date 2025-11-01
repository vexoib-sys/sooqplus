// Data Storage
const STORAGE_KEYS = {
    USERS: 'classified_users',
    ADS: 'classified_ads',
    CURRENT_USER: 'classified_current_user',
    SETTINGS: 'classified_settings',
    CATEGORIES: 'classified_categories'
};

// Initialize default admin user
function initializeAdmin() {
    const users = getUsers();
    const adminExists = users.find(u => u.email === 'vexo.ib@gmail.com');
    
    if (!adminExists) {
        const admin = {
            id: 'admin_' + Date.now(),
            name: 'المدير',
            email: 'vexo.ib@gmail.com',
            password: 'abuhamD@190',
            phone: '1234567890',
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        users.push(admin);
        saveUsers(users);
    }
}

// Initialize default categories with subcategories
function initializeCategories() {
    const categories = getCategories();
    if (categories.length === 0) {
        const defaultCategories = [
            {
                id: 'cars',
                nameAr: 'سيارات',
                nameEn: 'cars',
                icon: '🚗',
                isMain: true,
                subcategories: [
                    { id: 'cars-sedan', nameAr: 'سيدان', nameEn: 'sedan' },
                    { id: 'cars-suv', nameAr: 'SUV', nameEn: 'suv' },
                    { id: 'cars-truck', nameAr: 'شاحنات', nameEn: 'truck' },
                    { id: 'cars-motorcycle', nameAr: 'دراجات نارية', nameEn: 'motorcycle' },
                    { id: 'cars-parts', nameAr: 'قطع غيار', nameEn: 'parts' }
                ]
            },
            {
                id: 'electronics',
                nameAr: 'إلكترونيات',
                nameEn: 'electronics',
                icon: '📱',
                isMain: true,
                subcategories: [
                    { id: 'electronics-mobile', nameAr: 'موبايلات', nameEn: 'mobile' },
                    { id: 'electronics-laptop', nameAr: 'لابتوب', nameEn: 'laptop' },
                    { id: 'electronics-tv', nameAr: 'تلفزيونات', nameEn: 'tv' },
                    { id: 'electronics-camera', nameAr: 'كاميرات', nameEn: 'camera' },
                    { id: 'electronics-accessories', nameAr: 'إكسسوارات', nameEn: 'accessories' }
                ]
            },
            {
                id: 'real-estate',
                nameAr: 'عقارات',
                nameEn: 'real-estate',
                icon: '🏠',
                isMain: true,
                subcategories: [
                    { id: 'real-estate-sell', nameAr: 'للبيع', nameEn: 'sell' },
                    { id: 'real-estate-rent', nameAr: 'للإيجار', nameEn: 'rent' },
                    { id: 'real-estate-commercial', nameAr: 'تجاري', nameEn: 'commercial' },
                    { id: 'real-estate-land', nameAr: 'أراضي', nameEn: 'land' }
                ]
            },
            {
                id: 'jobs',
                nameAr: 'وظائف',
                nameEn: 'jobs',
                icon: '💼',
                isMain: true,
                subcategories: [
                    { id: 'jobs-fulltime', nameAr: 'دوام كامل', nameEn: 'fulltime' },
                    { id: 'jobs-parttime', nameAr: 'دوام جزئي', nameEn: 'parttime' },
                    { id: 'jobs-remote', nameAr: 'عمل عن بُعد', nameEn: 'remote' },
                    { id: 'jobs-internship', nameAr: 'تدريب', nameEn: 'internship' }
                ]
            },
            {
                id: 'services',
                nameAr: 'خدمات',
                nameEn: 'services',
                icon: '🔧',
                isMain: true,
                subcategories: [
                    { id: 'services-maintenance', nameAr: 'صيانة', nameEn: 'maintenance' },
                    { id: 'services-cleaning', nameAr: 'تنظيف', nameEn: 'cleaning' },
                    { id: 'services-moving', nameAr: 'نقل وتركيب', nameEn: 'moving' },
                    { id: 'services-education', nameAr: 'تعليم ودروس', nameEn: 'education' }
                ]
            },
            {
                id: 'fashion',
                nameAr: 'أزياء',
                nameEn: 'fashion',
                icon: '👔',
                isMain: true,
                subcategories: [
                    { id: 'fashion-men', nameAr: 'رجالي', nameEn: 'men' },
                    { id: 'fashion-women', nameAr: 'نسائي', nameEn: 'women' },
                    { id: 'fashion-kids', nameAr: 'أطفال', nameEn: 'kids' },
                    { id: 'fashion-accessories', nameAr: 'إكسسوارات', nameEn: 'accessories' }
                ]
            },
            {
                id: 'pets',
                nameAr: 'حيوانات أليفة',
                nameEn: 'pets',
                icon: '🐕',
                isMain: true,
                subcategories: [
                    { id: 'pets-dogs', nameAr: 'كلاب', nameEn: 'dogs' },
                    { id: 'pets-cats', nameAr: 'قطط', nameEn: 'cats' },
                    { id: 'pets-birds', nameAr: 'طيور', nameEn: 'birds' },
                    { id: 'pets-accessories', nameAr: 'مستلزمات', nameEn: 'accessories' }
                ]
            },
            {
                id: 'furniture',
                nameAr: 'أثاث',
                nameEn: 'furniture',
                icon: '🛋️',
                isMain: true,
                subcategories: [
                    { id: 'furniture-sofa', nameAr: 'أرائك', nameEn: 'sofa' },
                    { id: 'furniture-bedroom', nameAr: 'غرف نوم', nameEn: 'bedroom' },
                    { id: 'furniture-kitchen', nameAr: 'مطابخ', nameEn: 'kitchen' },
                    { id: 'furniture-office', nameAr: 'مكتبية', nameEn: 'office' }
                ]
            }
        ];
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
    }
}

// Initialize on page load
if (typeof window !== 'undefined') {
    initializeAdmin();
    initializeCategories();
}

// User Management
function getUsers() {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Ads Management
function getAds() {
    const ads = localStorage.getItem(STORAGE_KEYS.ADS);
    return ads ? JSON.parse(ads) : [];
}

function saveAds(ads) {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
}

function getCategories() {
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : [];
}

function saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

// Category name helper
function getCategoryName(categoryId) {
    const categories = getCategories();
    // Search in main categories
    let category = categories.find(c => c.id === categoryId || c.nameEn === categoryId);
    
    // If not found, search in subcategories
    if (!category) {
        for (const mainCat of categories) {
            if (mainCat.subcategories) {
                const subCat = mainCat.subcategories.find(sc => sc.id === categoryId || sc.nameEn === categoryId);
                if (subCat) {
                    return subCat.nameAr;
                }
            }
        }
    }
    
    return category ? category.nameAr : categoryId;
}

// Get category icon
function getCategoryIcon(categoryId) {
    const categories = getCategories();
    // Search in main categories first
    let category = categories.find(c => c.id === categoryId || c.nameEn === categoryId);
    
    // If found and has icon, return it
    if (category && category.icon) {
        return category.icon;
    }
    
    // If not found, search in subcategories (will inherit parent icon)
    if (!category) {
        for (const mainCat of categories) {
            if (mainCat.subcategories) {
                const subCat = mainCat.subcategories.find(sc => sc.id === categoryId || sc.nameEn === categoryId);
                if (subCat) {
                    // Return parent category icon
                    return mainCat.icon || '📦';
                }
            }
            // Also check if the categoryId matches main category (for backward compatibility)
            if (categoryId === mainCat.id) {
                return mainCat.icon || '📦';
            }
        }
    }
    
    // If still not found but has mainCategory property
    const ads = getAds();
    const ad = ads.find(a => a.category === categoryId);
    if (ad && ad.mainCategory) {
        const mainCat = categories.find(c => c.id === ad.mainCategory);
        if (mainCat && mainCat.icon) {
            return mainCat.icon;
        }
    }
    
    return '📦';
}

// Get main categories only
function getMainCategories() {
    const categories = getCategories();
    return categories.filter(c => c.isMain === true);
}

// Get subcategories for a main category
function getSubcategories(mainCategoryId) {
    const categories = getCategories();
    const mainCategory = categories.find(c => c.id === mainCategoryId || c.nameEn === mainCategoryId);
    return mainCategory && mainCategory.subcategories ? mainCategory.subcategories : [];
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Check if user is suspended
        if (isUserSuspended(user)) {
            errorDiv.textContent = 'تم تعطيل حسابك. يرجى التواصل مع الإدارة.';
            errorDiv.style.display = 'block';
            return;
        }
        
        setCurrentUser(user);
        window.location.href = 'index.html';
    } else {
        errorDiv.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        errorDiv.style.display = 'block';
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    // Check if registration is allowed
    if (!isRegistrationAllowed()) {
        const errorDiv = document.getElementById('registerError');
        errorDiv.textContent = 'التسجيل غير متاح حالياً. يرجى المحاولة لاحقاً.';
        errorDiv.style.display = 'block';
        return;
    }
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    
    if (password !== passwordConfirm) {
        errorDiv.textContent = 'كلمات المرور غير متطابقة';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    const users = getUsers();
    const userExists = users.find(u => u.email === email);
    
    if (userExists) {
        errorDiv.textContent = 'هذا البريد الإلكتروني مستخدم بالفعل';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: 'user',
        suspended: false,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    successDiv.textContent = 'تم إنشاء الحساب بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول...';
    successDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function logout() {
    setCurrentUser(null);
    window.location.href = 'index.html';
}

function checkAuthStatus() {
    const user = getCurrentUser();
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const postAdLink = document.getElementById('postAdLink');
    const adminLink = document.getElementById('adminLink');
    const userDashboardLink = document.getElementById('userDashboardLink');
    
    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        if (userDashboardLink && user.role !== 'admin') {
            userDashboardLink.style.display = 'inline';
        }
        if (adminLink && user.role === 'admin') {
            adminLink.style.display = 'inline';
            if (userDashboardLink) userDashboardLink.style.display = 'none';
        }
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (userDashboardLink) userDashboardLink.style.display = 'none';
    }
}

// Ad Functions
function loadCategoryOptions() {
    const mainCategorySelect = document.getElementById('adMainCategory');
    if (!mainCategorySelect) return;
    
    const mainCategories = getMainCategories();
    mainCategorySelect.innerHTML = '<option value="">اختر القسم الرئيسي</option>';
    
    mainCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.icon || ''} ${cat.nameAr}`;
        mainCategorySelect.appendChild(option);
    });
}

function loadSubcategoryOptions() {
    const mainCategorySelect = document.getElementById('adMainCategory');
    const subcategorySelect = document.getElementById('adCategory');
    const subcategoryGroup = document.getElementById('subcategoryGroup');
    
    if (!mainCategorySelect || !subcategorySelect) return;
    
    const mainCategoryId = mainCategorySelect.value;
    
    if (!mainCategoryId) {
        subcategoryGroup.style.display = 'none';
        subcategorySelect.innerHTML = '<option value="">اختر القسم الفرعي</option>';
        return;
    }
    
    const subcategories = getSubcategories(mainCategoryId);
    
    if (subcategories.length === 0) {
        // If no subcategories, use main category
        subcategoryGroup.style.display = 'none';
        return;
    }
    
    subcategorySelect.innerHTML = '<option value="">اختر القسم الفرعي</option>';
    subcategories.forEach(subCat => {
        const option = document.createElement('option');
        option.value = subCat.id;
        option.textContent = subCat.nameAr;
        subcategorySelect.appendChild(option);
    });
    
    subcategoryGroup.style.display = 'block';
}

async function handlePostAd(event) {
    event.preventDefault();
    const user = getCurrentUser();
    
    if (!user) {
        alert('يجب تسجيل الدخول أولاً');
        window.location.href = 'login.html';
        return;
    }
    
    const settings = getSettings();
    const requireApproval = settings.requireApproval !== false;
    
    // Handle images
    const imageFiles = document.getElementById('adImages').files;
    const images = [];
    
    if (imageFiles.length > 0) {
        // Store images as base64 (for demo purposes)
        // In production, you would upload to a server
        const imagePromises = [];
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            if (file.type.startsWith('image/')) {
                const promise = new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        resolve(e.target.result);
                    };
                    reader.readAsDataURL(file);
                });
                imagePromises.push(promise);
            }
        }
        const loadedImages = await Promise.all(imagePromises);
        images.push(...loadedImages);
    }
    
    // Get category - prefer subcategory, fallback to main category
    const mainCategory = document.getElementById('adMainCategory').value;
    const subcategory = document.getElementById('adCategory').value;
    const category = subcategory || mainCategory;
    
    const newAd = {
        id: 'ad_' + Date.now(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: document.getElementById('adPhone').value,
        title: document.getElementById('adTitle').value,
        category: category,
        mainCategory: mainCategory,
        price: parseFloat(document.getElementById('adPrice').value),
        location: document.getElementById('adLocation').value,
        description: document.getElementById('adDescription').value,
        images: images,
        status: requireApproval ? 'pending' : 'active',
        createdAt: new Date().toISOString()
    };
    
    const ads = getAds();
    ads.push(newAd);
    saveAds(ads);
    
    const successDiv = document.getElementById('postAdSuccess');
    successDiv.textContent = 'تم إضافة الإعلان بنجاح! ' + (requireApproval ? 'سيتم مراجعته من قبل الإدارة.' : '');
    successDiv.style.display = 'block';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function loadAds(filterCategory = 'all', searchTerm = '') {
    const ads = getAds();
    let filteredAds = ads.filter(ad => ad.status === 'active');
    
    if (filterCategory !== 'all') {
        filteredAds = filteredAds.filter(ad => ad.category === filterCategory);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredAds = filteredAds.filter(ad => 
            ad.title.toLowerCase().includes(term) ||
            ad.description.toLowerCase().includes(term) ||
            ad.location.toLowerCase().includes(term)
        );
    }
    
    const adsGrid = document.getElementById('adsGrid');
    if (!adsGrid) return;
    
    if (filteredAds.length === 0) {
        adsGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:2rem;">لا توجد إعلانات متاحة</p>';
        return;
    }
    
    adsGrid.innerHTML = filteredAds.map(ad => {
        const imageHtml = ad.images && ad.images.length > 0 
            ? `<img src="${ad.images[0]}" alt="${ad.title}">`
            : `<div class="ad-image-placeholder">${getCategoryIcon(ad.category)}</div>`;
        
        return `
            <div class="ad-card" onclick="viewAd('${ad.id}')">
                <div class="ad-image">${imageHtml}</div>
                <div class="ad-content">
                    <div class="ad-title">${ad.title}</div>
                    <div class="ad-price">${ad.price.toLocaleString()} دينار</div>
                    <div class="ad-location">📍 ${ad.location}</div>
                    <div class="ad-category">
                        <span class="category-icon">${getCategoryIcon(ad.category)}</span>
                        ${getCategoryName(ad.category)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterByCategory(category, subcategory = null) {
    // Hide subcategory tabs if switching main category
    if (category === 'all' || (!subcategory && category !== currentMainCategory)) {
        document.getElementById('subCategoryTabs').style.display = 'none';
        currentMainCategory = category;
        currentSubcategory = null;
    }
    
    // Update active main tab
    document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load and show subcategories if main category selected
    if (category !== 'all') {
        const subcategories = getSubcategories(category);
        if (subcategories.length > 0 && !subcategory) {
            loadSubcategoryTabs(category, subcategories);
        } else if (subcategory) {
            // Update subcategory active state
            document.querySelectorAll('.subcategory-tabs .sub-tab-btn').forEach(btn => btn.classList.remove('active'));
            if (event && event.target) {
                event.target.classList.add('active');
            }
            currentSubcategory = subcategory;
        }
    }
    
    loadAds(subcategory || category);
}

let currentMainCategory = 'all';
let currentSubcategory = null;

function loadMainCategoryTabs() {
    const mainCategories = getMainCategories();
    const tabsContainer = document.getElementById('mainCategoryTabs');
    
    if (!tabsContainer) return;
    
    let tabsHtml = `<button class="tab-btn active" onclick="filterByCategory('all')">
        <span class="tab-icon">🏠</span>
        <span class="tab-text">الكل</span>
    </button>`;
    
    mainCategories.forEach(cat => {
        tabsHtml += `
            <button class="tab-btn" onclick="filterByCategory('${cat.id}')">
                <span class="tab-icon">${cat.icon || '📦'}</span>
                <span class="tab-text">${cat.nameAr}</span>
            </button>
        `;
    });
    
    tabsContainer.innerHTML = tabsHtml;
}

function loadSubcategoryTabs(mainCategoryId, subcategories) {
    const subTabsContainer = document.getElementById('subCategoryTabs');
    
    if (!subTabsContainer) return;
    
    let subTabsHtml = `<button class="sub-tab-btn active" onclick="filterByCategory('${mainCategoryId}', '${mainCategoryId}')">
        <span>الكل</span>
    </button>`;
    
    subcategories.forEach(subCat => {
        subTabsHtml += `
            <button class="sub-tab-btn" onclick="filterByCategory('${mainCategoryId}', '${subCat.id}')">
                <span>${subCat.nameAr}</span>
            </button>
        `;
    });
    
    subTabsContainer.innerHTML = subTabsHtml;
    subTabsContainer.style.display = 'flex';
}

function searchAds() {
    const searchTerm = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    loadAds(category, searchTerm);
}

function viewAd(adId) {
    // Track ad view
    if (typeof trackAdView === 'function') {
        trackAdView(adId);
    }
    window.location.href = `ad-details.html?id=${adId}`;
}

function loadAdDetails(adId) {
    const ads = getAds();
    const ad = ads.find(a => a.id === adId);
    const content = document.getElementById('adDetailsContent');
    
    if (!ad) {
        content.innerHTML = '<div class="error-message">الإعلان غير موجود</div>';
        return;
    }
    
    // Get user info
    const users = getUsers();
    const user = users.find(u => u.id === ad.userId);
    
    let imagesHtml = '';
    if (ad.images && ad.images.length > 0) {
        imagesHtml = `
            <div class="ad-images-gallery">
                ${ad.images.map((img, index) => `
                    <div class="gallery-item">
                        <img src="${img}" alt="صورة ${index + 1}" onclick="openImageModal('${img}')">
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        imagesHtml = '<div class="ad-image-placeholder"><span>📦</span></div>';
    }
    
    content.innerHTML = `
        <div class="ad-details-container">
            <div class="ad-details-main">
                <div class="ad-details-images">
                    ${imagesHtml}
                </div>
                <div class="ad-details-info">
                    <h1 class="ad-details-title">${ad.title}</h1>
                    <div class="ad-details-price">${ad.price.toLocaleString()} دينار</div>
                    <div class="ad-details-meta">
                        <span class="meta-item">📍 ${ad.location}</span>
                        <span class="meta-item">📁 ${getCategoryName(ad.category)}</span>
                        <span class="meta-item">📅 ${new Date(ad.createdAt).toLocaleDateString('ar')}</span>
                    </div>
                    <div class="ad-details-description">
                        <h3>وصف الإعلان</h3>
                        <p>${ad.description.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
            <div class="ad-details-sidebar">
                <div class="contact-card">
                    <h3>معلومات الاتصال</h3>
                    <div class="contact-info">
                        <p><strong>المعلن:</strong> ${user ? user.name : ad.userName}</p>
                        <p><strong>رقم الهاتف:</strong> <a href="tel:${ad.userPhone}">${ad.userPhone}</a></p>
                        ${user && user.email ? `<p><strong>البريد الإلكتروني:</strong> <a href="mailto:${user.email}">${user.email}</a></p>` : ''}
                    </div>
                    <button class="btn-primary btn-contact" onclick="contactUser('${ad.userPhone}', '${user ? user.email : ad.userEmail}')">اتصل الآن</button>
                </div>
                <div class="ad-actions-card">
                    <h3>إجراءات</h3>
                    <button class="btn-secondary" onclick="shareAd('${adId}')">مشاركة</button>
                    <button class="btn-secondary" onclick="printAd()">طباعة</button>
                    ${isLoggedIn() && getCurrentUser().id === ad.userId ? `
                        <button class="btn-secondary" onclick="editMyAd('${adId}')">تعديل الإعلان</button>
                        <button class="btn-secondary btn-danger" onclick="deleteMyAd('${adId}')">حذف الإعلان</button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function previewImages(event) {
    const previewContainer = document.getElementById('imagePreview');
    previewContainer.innerHTML = '';
    
    const files = event.target.files;
    if (files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgDiv = document.createElement('div');
                imgDiv.className = 'preview-image-item';
                imgDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-image-btn" onclick="removePreviewImage(this)">×</button>
                `;
                previewContainer.appendChild(imgDiv);
            };
            reader.readAsDataURL(file);
        }
    }
}

function removePreviewImage(btn) {
    btn.parentElement.remove();
    // Also remove from file input
    const fileInput = document.getElementById('adImages');
    const dt = new DataTransfer();
    const files = Array.from(fileInput.files);
    files.forEach(file => {
        if (file !== btn.parentElement.file) {
            dt.items.add(file);
        }
    });
    fileInput.files = dt.files;
}

function contactUser(phone, email) {
    const message = `أريد الاستفسار عن الإعلان\n\nرقم الهاتف: ${phone}`;
    if (email) {
        window.location.href = `mailto:${email}?subject=استفسار عن الإعلان&body=${encodeURIComponent(message)}`;
    } else {
        window.location.href = `tel:${phone}`;
    }
}

function shareAd(adId) {
    const url = window.location.origin + window.location.pathname.replace('ad-details.html', '') + `ad-details.html?id=${adId}`;
    if (navigator.share) {
        navigator.share({
            title: 'إعلان من السوق المفتوح',
            url: url
        });
    } else {
        navigator.clipboard.writeText(url);
        alert('تم نسخ رابط الإعلان!');
    }
}

function printAd() {
    window.print();
}

function editMyAd(adId) {
    window.location.href = `edit-ad.html?id=${adId}`;
}

function deleteMyAd(adId) {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    
    const ads = getAds();
    const filteredAds = ads.filter(a => a.id !== adId);
    saveAds(filteredAds);
    alert('تم حذف الإعلان بنجاح');
    window.location.href = 'index.html';
}

function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <span class="image-modal-close" onclick="this.parentElement.remove()">&times;</span>
        <img src="${imageSrc}" alt="صورة الإعلان">
    `;
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    document.body.appendChild(modal);
}

// Settings Management
function getSettings() {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
        siteName: 'السوق المفتوح',
        supportEmail: 'support@example.com',
        supportPhone: '1234567890',
        requireApproval: true,
        allowRegistration: true,
        siteColor: '#ff6b35',
        siteLogo: '',
        siteDescription: '',
        adsPerPage: 12
    };
}

function saveSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        supportEmail: document.getElementById('supportEmail').value,
        supportPhone: document.getElementById('supportPhone').value,
        requireApproval: document.getElementById('requireApproval').checked,
        allowRegistration: document.getElementById('allowRegistration').checked,
        siteColor: document.getElementById('siteColor') ? document.getElementById('siteColor').value : '#ff6b35',
        siteLogo: document.getElementById('siteLogo') ? document.getElementById('siteLogo').value : '',
        siteDescription: document.getElementById('siteDescription') ? document.getElementById('siteDescription').value : '',
        adsPerPage: document.getElementById('adsPerPage') ? parseInt(document.getElementById('adsPerPage').value) : 12
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    
    const messageDiv = document.getElementById('settingsMessage');
    messageDiv.textContent = 'تم حفظ الإعدادات بنجاح!';
    messageDiv.style.display = 'block';
    
    // Update site name in current page if admin
    updateSiteName();
    updateSiteColor();
    
    // Notify site to update
    if (typeof notifySiteUpdate === 'function') {
        notifySiteUpdate('settings');
    } else {
        // Fallback notification
        const updateData = {
            type: 'settings',
            timestamp: Date.now(),
            action: 'update'
        };
        localStorage.setItem('site_update_notification', JSON.stringify(updateData));
        setTimeout(() => {
            localStorage.removeItem('site_update_notification');
        }, 100);
    }
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Update site name in all pages
function updateSiteName() {
    const settings = getSettings();
    const siteName = settings.siteName || 'السوق المفتوح';
    
    // Update page title
    document.title = siteName + (window.location.pathname.includes('admin') ? ' - لوحة التحكم' : 
                      window.location.pathname.includes('user-dashboard') ? ' - لوحتي' : 
                      ' - الموقع الإلكتروني للإعلانات');
    
    // Update nav brand
    const navBrands = document.querySelectorAll('.nav-brand h1');
    navBrands.forEach(brand => {
        if (!brand.textContent.includes('لوحة التحكم') && !brand.textContent.includes('لوحتي')) {
            brand.textContent = siteName;
        }
    });
    
    // Update footer
    const footer = document.querySelector('.footer p');
    if (footer) {
        footer.innerHTML = `&copy; ${new Date().getFullYear()} ${siteName}. جميع الحقوق محفوظة.`;
    }
}

// Update site color
function updateSiteColor() {
    const settings = getSettings();
    const siteColor = settings.siteColor || '#ff6b35';
    
    // Update CSS variable or direct style
    document.documentElement.style.setProperty('--primary-color', siteColor);
    
    // Update navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.backgroundColor = siteColor;
    }
    
    // Update hero section gradient
    const hero = document.querySelector('.hero');
    if (hero) {
        // Create gradient from color
        const rgb = hexToRgb(siteColor);
        hero.style.background = `linear-gradient(135deg, ${siteColor} 0%, ${adjustBrightness(siteColor, -20)} 100%)`;
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function adjustBrightness(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const r = Math.max(0, Math.min(255, rgb.r + (rgb.r * percent / 100)));
    const g = Math.max(0, Math.min(255, rgb.g + (rgb.g * percent / 100)));
    const b = Math.max(0, Math.min(255, rgb.b + (rgb.b * percent / 100)));
    
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Check if user is suspended
function isUserSuspended(user) {
    return user && user.suspended === true;
}

// Check if registration is allowed
function isRegistrationAllowed() {
    const settings = getSettings();
    return settings.allowRegistration !== false;
}

