// User Dashboard Functions

function loadUserDashboard() {
    loadUserStats();
    loadUserInfo();
    loadMyAds();
}

function loadUserStats() {
    const user = getCurrentUser();
    if (!user) return;
    
    const ads = getAds();
    const userAds = ads.filter(ad => ad.userId === user.id);
    
    const totalAds = userAds.length;
    const activeAds = userAds.filter(a => a.status === 'active').length;
    const pendingAds = userAds.filter(a => a.status === 'pending').length;
    const rejectedAds = userAds.filter(a => a.status === 'rejected').length;
    
    document.getElementById('userTotalAds').textContent = totalAds;
    document.getElementById('userActiveAds').textContent = activeAds;
    document.getElementById('userPendingAds').textContent = pendingAds;
    document.getElementById('userRejectedAds').textContent = rejectedAds;
}

function loadUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    const userInfoContent = document.getElementById('userInfoContent');
    userInfoContent.innerHTML = `
        <div class="user-info-grid">
            <div class="user-info-item">
                <strong>الاسم:</strong> ${user.name}
            </div>
            <div class="user-info-item">
                <strong>البريد الإلكتروني:</strong> ${user.email}
            </div>
            <div class="user-info-item">
                <strong>رقم الهاتف:</strong> ${user.phone || 'غير محدد'}
            </div>
            <div class="user-info-item">
                <strong>تاريخ التسجيل:</strong> ${new Date(user.createdAt).toLocaleDateString('ar')}
            </div>
        </div>
    `;
    
    // Fill profile form
    document.getElementById('profileName').value = user.name;
    document.getElementById('profileEmail').value = user.email;
    document.getElementById('profilePhone').value = user.phone || '';
}

function showUserTab(tabName, clickedElement) {
    // Hide all tabs
    document.querySelectorAll('.user-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.user-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
    
    // Load data for the tab
    if (tabName === 'myAds') {
        loadMyAds();
    } else if (tabName === 'profile') {
        loadUserInfo();
    }
}

function loadMyAds(filterStatus = 'all', searchTerm = '') {
    const user = getCurrentUser();
    if (!user) return;
    
    const ads = getAds();
    let userAds = ads.filter(ad => ad.userId === user.id);
    
    if (filterStatus !== 'all') {
        userAds = userAds.filter(ad => ad.status === filterStatus);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        userAds = userAds.filter(ad => 
            ad.title.toLowerCase().includes(term) ||
            ad.description.toLowerCase().includes(term)
        );
    }
    
    // Sort by newest first
    userAds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const myAdsList = document.getElementById('myAdsList');
    if (!myAdsList) return;
    
    if (userAds.length === 0) {
        myAdsList.innerHTML = `
            <div class="no-ads-message">
                <p>لا توجد إعلانات لديك</p>
                <button class="btn-primary" onclick="window.location.href='post-ad.html'">أضف إعلانك الأول</button>
            </div>
        `;
        return;
    }
    
    myAdsList.innerHTML = userAds.map(ad => {
        const statusBadge = `
            <span class="status-badge status-${ad.status}">
                ${ad.status === 'active' ? 'نشط' : ad.status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
            </span>
        `;
        
        const imageThumb = ad.images && ad.images.length > 0 
            ? `<img src="${ad.images[0]}" alt="${ad.title}" class="user-ad-thumb">`
            : '<div class="user-ad-thumb-placeholder">📦</div>';
        
        return `
            <div class="user-ad-item">
                <div class="user-ad-image">
                    ${imageThumb}
                </div>
                <div class="user-ad-info">
                    <div class="user-ad-title">${ad.title}</div>
                    <div class="user-ad-meta">
                        الفئة: ${getCategoryName(ad.category)} | السعر: ${ad.price.toLocaleString()} دينار | 
                        الموقع: ${ad.location} | 
                        التاريخ: ${new Date(ad.createdAt).toLocaleDateString('ar')}
                        ${statusBadge}
                    </div>
                    ${ad.description ? `<div class="user-ad-description">${ad.description.substring(0, 150)}${ad.description.length > 150 ? '...' : ''}</div>` : ''}
                </div>
                <div class="user-ad-actions">
                    <button class="btn-small btn-view" onclick="viewMyAd('${ad.id}')">عرض</button>
                    <button class="btn-small btn-edit" onclick="editMyAd('${ad.id}')">تعديل</button>
                    <button class="btn-small btn-delete" onclick="deleteMyAdFromDashboard('${ad.id}')">حذف</button>
                </div>
            </div>
        `;
    }).join('');
}

function searchMyAds() {
    const searchTerm = document.getElementById('searchMyAds').value;
    const filterStatus = document.getElementById('filterMyAdsStatus').value;
    loadMyAds(filterStatus, searchTerm);
}

function filterMyAds() {
    searchMyAds();
}

function viewMyAd(adId) {
    window.open(`ad-details.html?id=${adId}`, '_blank');
}

function editMyAd(adId) {
    const ads = getAds();
    const ad = ads.find(a => a.id === adId);
    const user = getCurrentUser();
    
    if (!ad || ad.userId !== user.id) {
        showUserNotification('لا يمكنك تعديل هذا الإعلان', 'error');
        return;
    }
    
    document.getElementById('editMyAdId').value = ad.id;
    document.getElementById('editMyAdTitle').value = ad.title;
    document.getElementById('editMyAdPrice').value = ad.price;
    document.getElementById('editMyAdLocation').value = ad.location;
    document.getElementById('editMyAdPhone').value = ad.userPhone;
    document.getElementById('editMyAdDescription').value = ad.description;
    
    // Load categories
    const categories = getCategories();
    const categorySelect = document.getElementById('editMyAdCategory');
    categorySelect.innerHTML = categories.map(cat => 
        `<option value="${cat.id}" ${cat.id === ad.category ? 'selected' : ''}>${cat.nameAr}</option>`
    ).join('');
    
    document.getElementById('editMyAdModal').style.display = 'block';
}

function handleEditMyAd(event) {
    event.preventDefault();
    const user = getCurrentUser();
    const adId = document.getElementById('editMyAdId').value;
    const ads = getAds();
    const adIndex = ads.findIndex(a => a.id === adId);
    
    if (adIndex === -1 || ads[adIndex].userId !== user.id) {
        showUserNotification('حدث خطأ', 'error');
        return;
    }
    
    // If status was rejected, change back to pending after edit
    const wasRejected = ads[adIndex].status === 'rejected';
    
    ads[adIndex].title = document.getElementById('editMyAdTitle').value;
    ads[adIndex].category = document.getElementById('editMyAdCategory').value;
    ads[adIndex].price = parseFloat(document.getElementById('editMyAdPrice').value);
    ads[adIndex].location = document.getElementById('editMyAdLocation').value;
    ads[adIndex].userPhone = document.getElementById('editMyAdPhone').value;
    ads[adIndex].description = document.getElementById('editMyAdDescription').value;
    
    // If it was rejected and user edited it, set to pending for admin review
    if (wasRejected) {
        ads[adIndex].status = 'pending';
    }
    
    ads[adIndex].updatedAt = new Date().toISOString();
    
    saveAds(ads);
    closeModal('editMyAdModal');
    loadMyAds();
    loadUserStats();
    showUserNotification('تم تحديث الإعلان بنجاح', 'success');
}

function deleteMyAdFromDashboard(adId) {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذه العملية.')) return;
    
    const user = getCurrentUser();
    const ads = getAds();
    const adIndex = ads.findIndex(a => a.id === adId);
    
    if (adIndex === -1 || ads[adIndex].userId !== user.id) {
        showUserNotification('لا يمكنك حذف هذا الإعلان', 'error');
        return;
    }
    
    const filteredAds = ads.filter(a => a.id !== adId);
    saveAds(filteredAds);
    loadMyAds();
    loadUserStats();
    showUserNotification('تم حذف الإعلان بنجاح', 'success');
}

function handleUpdateProfile(event) {
    event.preventDefault();
    const user = getCurrentUser();
    if (!user) return;
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    
    // Verify current password
    if (currentPassword && currentPassword !== user.password) {
        showUserNotification('كلمة المرور الحالية غير صحيحة', 'error');
        return;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
        showUserNotification('حدث خطأ', 'error');
        return;
    }
    
    // Update user info
    users[userIndex].name = document.getElementById('profileName').value;
    users[userIndex].email = document.getElementById('profileEmail').value;
    users[userIndex].phone = document.getElementById('profilePhone').value;
    
    // Update password if provided
    if (newPassword && newPassword.length >= 6) {
        users[userIndex].password = newPassword;
    }
    
    saveUsers(users);
    
    // Update current user session
    setCurrentUser(users[userIndex]);
    
    // Update ads with new phone if changed
    const ads = getAds();
    ads.forEach(ad => {
        if (ad.userId === user.id) {
            ad.userPhone = users[userIndex].phone;
        }
    });
    saveAds(ads);
    
    loadUserInfo();
    loadMyAds();
    
    const profileMessage = document.getElementById('profileMessage');
    profileMessage.textContent = 'تم تحديث الملف الشخصي بنجاح!';
    profileMessage.style.display = 'block';
    profileMessage.className = 'success-message';
    
    setTimeout(() => {
        profileMessage.style.display = 'none';
    }, 3000);
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showUserNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

