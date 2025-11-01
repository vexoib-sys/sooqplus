// Admin Dashboard Functions

function loadAdminDashboard() {
    loadAdminStats();
    loadAnalytics();
    loadAdminAds();
    loadAdminUsers();
    loadAdminCategories();
    loadSettings();
}

function loadAdminStats() {
    const ads = getAds();
    const users = getUsers();
    
    const totalAds = ads.length;
    const totalUsers = users.filter(u => u.role !== 'admin').length;
    const pendingAds = ads.filter(a => a.status === 'pending').length;
    const activeAds = ads.filter(a => a.status === 'active').length;
    
    document.getElementById('totalAds').textContent = totalAds;
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('pendingAds').textContent = pendingAds;
    document.getElementById('activeAds').textContent = activeAds;
}

function showAdminTab(tabName, clickedElement) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    if (clickedElement) {
        clickedElement.classList.add('active');
    } else if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load data for the tab
    if (tabName === 'analytics') {
        loadAnalytics();
    } else if (tabName === 'ads') {
        loadAdminAds();
    } else if (tabName === 'users') {
        loadAdminUsers();
    } else if (tabName === 'categories') {
        loadAdminCategories();
    }
}

function loadAdminAds(filterStatus = 'all', filterCategory = 'all', searchTerm = '') {
    const ads = getAds();
    let filteredAds = [...ads];
    
    if (filterStatus !== 'all') {
        filteredAds = filteredAds.filter(ad => ad.status === filterStatus);
    }
    
    if (filterCategory !== 'all') {
        filteredAds = filteredAds.filter(ad => ad.category === filterCategory);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredAds = filteredAds.filter(ad => 
            ad.title.toLowerCase().includes(term) ||
            ad.description.toLowerCase().includes(term) ||
            ad.userName.toLowerCase().includes(term)
        );
    }
    
    // Sort by newest first
    filteredAds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const adsList = document.getElementById('adminAdsList');
    if (!adsList) return;
    
    if (filteredAds.length === 0) {
        adsList.innerHTML = '<div class="admin-item"><p>لا توجد إعلانات</p></div>';
        return;
    }
    
    adsList.innerHTML = filteredAds.map(ad => {
        const statusBadge = `
            <span class="status-badge status-${ad.status}">
                ${ad.status === 'active' ? 'نشط' : ad.status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
            </span>
        `;
        
        const imageThumb = ad.images && ad.images.length > 0 
            ? `<img src="${ad.images[0]}" alt="${ad.title}" class="admin-ad-thumb">`
            : '<div class="admin-ad-thumb-placeholder">📦</div>';
        
        return `
            <div class="admin-item">
                <div class="admin-item-image">
                    ${imageThumb}
                </div>
                <div class="admin-item-info">
                    <div class="admin-item-title">${ad.title}</div>
                    <div class="admin-item-meta">
                        الفئة: ${getCategoryName(ad.category)} | السعر: ${ad.price.toLocaleString()} دينار | 
                        الموقع: ${ad.location} | المستخدم: ${ad.userName} | 
                        التاريخ: ${new Date(ad.createdAt).toLocaleDateString('ar')}
                        ${statusBadge}
                    </div>
                    ${ad.description ? `<div class="admin-item-description">${ad.description.substring(0, 100)}${ad.description.length > 100 ? '...' : ''}</div>` : ''}
                </div>
                <div class="admin-item-actions">
                    <button class="btn-small btn-view" onclick="viewAdFromAdmin('${ad.id}')">عرض</button>
                    <button class="btn-small btn-edit" onclick="editAd('${ad.id}')">تعديل</button>
                    ${ad.status === 'pending' ? `
                        <button class="btn-small btn-approve" onclick="approveAd('${ad.id}')">موافقة</button>
                        <button class="btn-small btn-reject" onclick="rejectAd('${ad.id}')">رفض</button>
                    ` : ''}
                    ${ad.status === 'active' ? `
                        <button class="btn-small btn-reject" onclick="rejectAd('${ad.id}')">رفض</button>
                    ` : ''}
                    ${ad.status === 'rejected' ? `
                        <button class="btn-small btn-approve" onclick="approveAd('${ad.id}')">موافقة</button>
                    ` : ''}
                    <button class="btn-small btn-delete" onclick="deleteAd('${ad.id}')">حذف</button>
                </div>
            </div>
        `;
    }).join('');
}

function viewAdFromAdmin(adId) {
    window.open(`ad-details.html?id=${adId}`, '_blank');
}

function showNotification(message, type = 'success') {
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

function searchAdsAdmin() {
    const searchTerm = document.getElementById('searchAdsAdmin').value;
    const filterStatus = document.getElementById('filterAdsStatus').value;
    const filterCategory = document.getElementById('filterAdsCategory').value;
    loadAdminAds(filterStatus, filterCategory, searchTerm);
}

function filterAdsAdmin() {
    searchAdsAdmin();
}

// Function to notify all open pages about updates
function notifySiteUpdate(updateType = 'ads') {
    // Store update timestamp in localStorage to trigger storage event
    const updateData = {
        type: updateType,
        timestamp: Date.now(),
        action: 'update'
    };
    localStorage.setItem('site_update_notification', JSON.stringify(updateData));
    
    // Store last update time for periodic checks
    localStorage.setItem('last_ads_update', Date.now().toString());
    
    // Remove it after a short delay so it can trigger again
    setTimeout(() => {
        localStorage.removeItem('site_update_notification');
    }, 100);
    
    // Also use custom event for same-window communication
    window.dispatchEvent(new CustomEvent('siteUpdated', { detail: updateType }));
    
    // Also notify all open windows (if using BroadcastChannel)
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('site_updates');
        channel.postMessage(updateData);
    }
}

function approveAd(adId) {
    if (!confirm('هل أنت متأكد من الموافقة على هذا الإعلان؟')) return;
    
    const ads = getAds();
    const adIndex = ads.findIndex(a => a.id === adId);
    if (adIndex !== -1) {
        ads[adIndex].status = 'active';
        saveAds(ads);
        loadAdminAds();
        loadAdminStats();
        showNotification('تمت الموافقة على الإعلان بنجاح', 'success');
        notifySiteUpdate('ads'); // Notify site to update
    }
}

function rejectAd(adId) {
    if (!confirm('هل أنت متأكد من رفض هذا الإعلان؟')) return;
    
    const ads = getAds();
    const adIndex = ads.findIndex(a => a.id === adId);
    if (adIndex !== -1) {
        ads[adIndex].status = 'rejected';
        saveAds(ads);
        loadAdminAds();
        loadAdminStats();
        showNotification('تم رفض الإعلان', 'success');
        notifySiteUpdate('ads'); // Notify site to update
    }
}

function deleteAd(adId) {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذه العملية.')) return;
    
    const ads = getAds();
    const filteredAds = ads.filter(a => a.id !== adId);
    saveAds(filteredAds);
    loadAdminAds();
    loadAdminStats();
    showNotification('تم حذف الإعلان بنجاح', 'success');
    notifySiteUpdate('ads'); // Notify site to update
}

function editAd(adId) {
    const ads = getAds();
    const ad = ads.find(a => a.id === adId);
    if (!ad) return;
    
    document.getElementById('editAdId').value = ad.id;
    document.getElementById('editAdTitle').value = ad.title;
    document.getElementById('editAdPrice').value = ad.price;
    document.getElementById('editAdLocation').value = ad.location;
    document.getElementById('editAdDescription').value = ad.description;
    document.getElementById('editAdStatus').value = ad.status;
    
    // Load categories
    const categories = getCategories();
    const categorySelect = document.getElementById('editAdCategory');
    categorySelect.innerHTML = categories.map(cat => 
        `<option value="${cat.id}" ${cat.id === ad.category ? 'selected' : ''}>${cat.nameAr}</option>`
    ).join('');
    
    document.getElementById('editAdModal').style.display = 'block';
}

function handleEditAd(event) {
    event.preventDefault();
    const adId = document.getElementById('editAdId').value;
    const ads = getAds();
    const adIndex = ads.findIndex(a => a.id === adId);
    
    if (adIndex !== -1) {
        ads[adIndex].title = document.getElementById('editAdTitle').value;
        ads[adIndex].category = document.getElementById('editAdCategory').value;
        ads[adIndex].price = parseFloat(document.getElementById('editAdPrice').value);
        ads[adIndex].location = document.getElementById('editAdLocation').value;
        ads[adIndex].description = document.getElementById('editAdDescription').value;
        ads[adIndex].status = document.getElementById('editAdStatus').value;
        ads[adIndex].updatedAt = new Date().toISOString();
        
        saveAds(ads);
        closeModal('editAdModal');
        loadAdminAds();
        loadAdminStats();
        showNotification('تم تحديث الإعلان بنجاح', 'success');
        notifySiteUpdate('ads'); // Notify site to update
    }
}

function loadAdminUsers(searchTerm = '', filterStatus = 'all') {
    const users = getUsers();
    let filteredUsers = users.filter(u => u.role !== 'admin');
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.phone.includes(term)
        );
    }
    
    if (filterStatus !== 'all') {
        filteredUsers = filteredUsers.filter(u => {
            if (filterStatus === 'active') {
                return !u.suspended;
            } else if (filterStatus === 'suspended') {
                return u.suspended === true;
            }
            return true;
        });
    }
    
    // Sort by newest first
    filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const usersList = document.getElementById('adminUsersList');
    if (!usersList) return;
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<div class="admin-item"><p>لا يوجد مستخدمون</p></div>';
        return;
    }
    
    usersList.innerHTML = filteredUsers.map(user => {
        const statusBadge = user.suspended 
            ? '<span class="status-badge status-rejected">معطل</span>'
            : '<span class="status-badge status-active">نشط</span>';
        
        // Count user ads
        const ads = getAds();
        const userAdsCount = ads.filter(a => a.userId === user.id).length;
        
        return `
            <div class="admin-item">
                <div class="admin-item-info">
                    <div class="admin-item-title">${user.name} ${statusBadge}</div>
                    <div class="admin-item-meta">
                        البريد: ${user.email} | الهاتف: ${user.phone} | 
                        عدد الإعلانات: ${userAdsCount} | 
                        تاريخ التسجيل: ${new Date(user.createdAt).toLocaleDateString('ar')}
                    </div>
                </div>
                <div class="admin-item-actions">
                    ${user.suspended 
                        ? `<button class="btn-small btn-approve" onclick="activateUser('${user.id}')">تفعيل</button>`
                        : `<button class="btn-small btn-reject" onclick="suspendUser('${user.id}')">تعطيل</button>`
                    }
                    <button class="btn-small btn-delete" onclick="deleteUser('${user.id}')">حذف</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterUsersAdmin() {
    const searchTerm = document.getElementById('searchUsersAdmin').value;
    const filterStatus = document.getElementById('filterUsersStatus').value;
    loadAdminUsers(searchTerm, filterStatus);
}

function suspendUser(userId) {
    if (!confirm('هل أنت متأكد من تعطيل هذا المستخدم؟')) return;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].suspended = true;
        users[userIndex].suspendedAt = new Date().toISOString();
        saveUsers(users);
        loadAdminUsers();
        showNotification('تم تعطيل المستخدم بنجاح', 'success');
        notifySiteUpdate('users');
    }
}

function activateUser(userId) {
    if (!confirm('هل أنت متأكد من تفعيل هذا المستخدم؟')) return;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].suspended = false;
        delete users[userIndex].suspendedAt;
        saveUsers(users);
        loadAdminUsers();
        showNotification('تم تفعيل المستخدم بنجاح', 'success');
        notifySiteUpdate('users');
    }
}

function searchUsersAdmin() {
    const searchTerm = document.getElementById('searchUsersAdmin').value;
    const filterStatus = document.getElementById('filterUsersStatus').value;
    loadAdminUsers(searchTerm, filterStatus);
}

function deleteUser(userId) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع إعلاناته أيضاً.')) return;
    
    const users = getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    saveUsers(filteredUsers);
    
    // Delete user's ads
    const ads = getAds();
    const filteredAds = ads.filter(a => a.userId !== userId);
    saveAds(filteredAds);
    
    loadAdminUsers();
    loadAdminStats();
    showNotification('تم حذف المستخدم وإعلاناته بنجاح', 'success');
    notifySiteUpdate('ads'); // Notify site to update
}

function loadAdminCategories() {
    const categories = getCategories();
    const categoriesList = document.getElementById('adminCategoriesList');
    if (!categoriesList) return;
    
    if (categories.length === 0) {
        categoriesList.innerHTML = '<div class="admin-item"><p>لا توجد فئات</p></div>';
        return;
    }
    
    let html = '';
    const mainCategories = categories.filter(c => c.isMain === true);
    
    mainCategories.forEach(cat => {
        html += `
            <div class="admin-item category-main-item">
                <div class="admin-item-info">
                    <div class="admin-item-title">
                        <span class="category-icon-large">${cat.icon || '📦'}</span>
                        ${cat.nameAr}
                        ${cat.subcategories && cat.subcategories.length > 0 ? `<span class="subcategory-count">(${cat.subcategories.length} أقسام فرعية)</span>` : ''}
                    </div>
                    <div class="admin-item-meta">الكود: ${cat.nameEn} | المعرف: ${cat.id}</div>
                    ${cat.subcategories && cat.subcategories.length > 0 ? `
                        <div class="subcategories-list">
                            ${cat.subcategories.map(subCat => `
                                <div class="subcategory-item">
                                    <span>└─ ${subCat.nameAr}</span>
                                    <span class="subcategory-code">${subCat.nameEn}</span>
                                    <button class="btn-small btn-delete" onclick="deleteSubcategory('${cat.id}', '${subCat.id}')">حذف</button>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="admin-item-actions">
                    <button class="btn-small btn-edit" onclick="showEditCategoryModal('${cat.id}')">تعديل</button>
                    <button class="btn-small btn-approve" onclick="showAddSubcategoryModal('${cat.id}')">إضافة قسم فرعي</button>
                    <button class="btn-small btn-delete" onclick="deleteCategory('${cat.id}')">حذف</button>
                </div>
            </div>
        `;
    });
    
    categoriesList.innerHTML = html;
}

function deleteSubcategory(mainCategoryId, subcategoryId) {
    if (!confirm('هل أنت متأكد من حذف هذا القسم الفرعي؟')) return;
    
    const categories = getCategories();
    const mainCategory = categories.find(c => c.id === mainCategoryId);
    
    if (mainCategory && mainCategory.subcategories) {
        mainCategory.subcategories = mainCategory.subcategories.filter(sc => sc.id !== subcategoryId);
        
        // Update ads that use this subcategory
        const ads = getAds();
        ads.forEach(ad => {
            if (ad.category === subcategoryId) {
                ad.category = mainCategoryId; // Fallback to main category
            }
        });
        saveAds(ads);
        
        saveCategories(categories);
        loadAdminCategories();
        showNotification('تم حذف القسم الفرعي بنجاح', 'success');
        notifySiteUpdate('categories');
    }
}

function showAddCategoryModal() {
    document.getElementById('addCategoryModal').style.display = 'block';
}

function showEditCategoryModal(categoryId) {
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) return;
    
    document.getElementById('categoryNameAr').value = category.nameAr;
    document.getElementById('categoryNameEn').value = category.nameEn;
    document.getElementById('categoryIcon').value = category.icon || '';
    document.getElementById('editCategoryId').value = categoryId;
    
    // Change form action
    const form = document.getElementById('addCategoryForm');
    form.onsubmit = handleEditCategory;
    
    // Change modal title
    const modal = document.getElementById('addCategoryModal');
    modal.querySelector('h3').textContent = 'تعديل الفئة';
    modal.querySelector('button[type="submit"]').textContent = 'حفظ التغييرات';
    
    document.getElementById('addCategoryModal').style.display = 'block';
}

function handleEditCategory(event) {
    event.preventDefault();
    const categoryId = document.getElementById('editCategoryId').value;
    const nameAr = document.getElementById('categoryNameAr').value;
    const nameEn = document.getElementById('categoryNameEn').value;
    const icon = document.getElementById('categoryIcon').value || '📦';
    
    const categories = getCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
        showNotification('الفئة غير موجودة', 'error');
        return;
    }
    
    categories[categoryIndex].nameAr = nameAr;
    categories[categoryIndex].nameEn = nameEn;
    categories[categoryIndex].icon = icon;
    
    saveCategories(categories);
    
    closeModal('addCategoryModal');
    loadAdminCategories();
    
    // Reset form
    const form = document.getElementById('addCategoryForm');
    form.onsubmit = handleAddCategory;
    const modal = document.getElementById('addCategoryModal');
    modal.querySelector('h3').textContent = 'إضافة فئة جديدة';
    modal.querySelector('button[type="submit"]').textContent = 'إضافة الفئة';
    form.reset();
    
    showNotification('تم تحديث الفئة بنجاح', 'success');
    updateCategoryFilters();
    notifySiteUpdate('categories');
}

function handleAddCategory(event) {
    event.preventDefault();
    const nameAr = document.getElementById('categoryNameAr').value;
    const nameEn = document.getElementById('categoryNameEn').value;
    const icon = document.getElementById('categoryIcon').value || '📦';
    
    const categories = getCategories();
    const categoryExists = categories.find(c => c.id === nameEn || c.nameEn === nameEn);
    
    if (categoryExists) {
        showNotification('هذه الفئة موجودة بالفعل', 'error');
        return;
    }
    
    const newCategory = {
        id: nameEn,
        nameAr: nameAr,
        nameEn: nameEn,
        icon: icon,
        isMain: true,
        subcategories: []
    };
    
    categories.push(newCategory);
    saveCategories(categories);
    
    closeModal('addCategoryModal');
    loadAdminCategories();
    document.getElementById('addCategoryForm').reset();
    showNotification('تم إضافة الفئة بنجاح', 'success');
    
    // Update category filters
    updateCategoryFilters();
    notifySiteUpdate('categories'); // Notify site to update
}

function showAddSubcategoryModal(mainCategoryId) {
    document.getElementById('subcategoryMainCategoryId').value = mainCategoryId;
    document.getElementById('addSubcategoryModal').style.display = 'block';
}

function handleAddSubcategory(event) {
    event.preventDefault();
    const mainCategoryId = document.getElementById('subcategoryMainCategoryId').value;
    const nameAr = document.getElementById('subcategoryNameAr').value;
    const nameEn = document.getElementById('subcategoryNameEn').value;
    
    const categories = getCategories();
    const mainCategory = categories.find(c => c.id === mainCategoryId);
    
    if (!mainCategory) {
        showNotification('القسم الرئيسي غير موجود', 'error');
        return;
    }
    
    // Check if subcategory already exists
    if (mainCategory.subcategories) {
        const exists = mainCategory.subcategories.find(sc => sc.id === `${mainCategoryId}-${nameEn}` || sc.nameEn === nameEn);
        if (exists) {
            showNotification('هذا القسم الفرعي موجود بالفعل', 'error');
            return;
        }
    } else {
        mainCategory.subcategories = [];
    }
    
    const newSubcategory = {
        id: `${mainCategoryId}-${nameEn}`,
        nameAr: nameAr,
        nameEn: nameEn
    };
    
    mainCategory.subcategories.push(newSubcategory);
    saveCategories(categories);
    
    closeModal('addSubcategoryModal');
    loadAdminCategories();
    document.getElementById('addSubcategoryForm').reset();
    showNotification('تم إضافة القسم الفرعي بنجاح', 'success');
    
    // Update category filters
    updateCategoryFilters();
    notifySiteUpdate('categories');
}

function deleteCategory(categoryId) {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع الإعلانات المرتبطة بها أيضاً.')) return;
    
    const categories = getCategories();
    const filteredCategories = categories.filter(c => c.id !== categoryId);
    saveCategories(filteredCategories);
    
    // Also update ads that use this category
    const ads = getAds();
    ads.forEach(ad => {
        if (ad.category === categoryId) {
            ad.category = 'other'; // Set to default category
        }
    });
    saveAds(ads);
    
    loadAdminCategories();
    showNotification('تم حذف الفئة بنجاح', 'success');
    updateCategoryFilters();
    notifySiteUpdate('categories'); // Notify site to update
}

function updateCategoryFilters() {
    // This function updates category dropdowns across the site
    // It will be called after category changes
    const categories = getCategories();
    const mainCategories = categories.filter(c => c.isMain === true);
    
    // Update admin filter
    const adminFilter = document.getElementById('filterAdsCategory');
    if (adminFilter) {
        const currentValue = adminFilter.value;
        let optionsHtml = '<option value="all">جميع الفئات</option>';
        
        mainCategories.forEach(cat => {
            optionsHtml += `<option value="${cat.id}">${cat.icon || ''} ${cat.nameAr}</option>`;
            if (cat.subcategories) {
                cat.subcategories.forEach(subCat => {
                    optionsHtml += `<option value="${subCat.id}">  └─ ${subCat.nameAr}</option>`;
                });
            }
        });
        
        adminFilter.innerHTML = optionsHtml;
        adminFilter.value = currentValue;
    }
    
    // Note: In a real application, you'd update all category dropdowns across all pages
}

function generateReport() {
    const dateFrom = document.getElementById('reportDateFrom').value;
    const dateTo = document.getElementById('reportDateTo').value;
    const ads = getAds();
    const users = getUsers();
    
    let filteredAds = [...ads];
    
    if (dateFrom) {
        filteredAds = filteredAds.filter(ad => new Date(ad.createdAt) >= new Date(dateFrom));
    }
    
    if (dateTo) {
        filteredAds = filteredAds.filter(ad => new Date(ad.createdAt) <= new Date(dateTo + 'T23:59:59'));
    }
    
    const totalAds = filteredAds.length;
    const activeAds = filteredAds.filter(a => a.status === 'active').length;
    const pendingAds = filteredAds.filter(a => a.status === 'pending').length;
    const rejectedAds = filteredAds.filter(a => a.status === 'rejected').length;
    
    // Category breakdown
    const categoryBreakdown = {};
    filteredAds.forEach(ad => {
        categoryBreakdown[ad.category] = (categoryBreakdown[ad.category] || 0) + 1;
    });
    
    const reportResults = document.getElementById('reportResults');
    reportResults.innerHTML = `
        <h3>نتائج التقرير</h3>
        <div class="admin-stats" style="margin-top: 1rem;">
            <div class="stat-card">
                <h3>${totalAds}</h3>
                <p>إجمالي الإعلانات</p>
            </div>
            <div class="stat-card">
                <h3>${activeAds}</h3>
                <p>إعلانات نشطة</p>
            </div>
            <div class="stat-card">
                <h3>${pendingAds}</h3>
                <p>قيد المراجعة</p>
            </div>
            <div class="stat-card">
                <h3>${rejectedAds}</h3>
                <p>مرفوضة</p>
            </div>
        </div>
        <h4 style="margin-top: 2rem;">التوزيع حسب الفئات:</h4>
        <div style="margin-top: 1rem;">
            ${Object.entries(categoryBreakdown).map(([cat, count]) => `
                <p><strong>${getCategoryName(cat)}:</strong> ${count} إعلان</p>
            `).join('')}
        </div>
    `;
}

function loadSettings() {
    const settings = getSettings();
    const siteNameInput = document.getElementById('siteName');
    const supportEmailInput = document.getElementById('supportEmail');
    const supportPhoneInput = document.getElementById('supportPhone');
    const requireApprovalInput = document.getElementById('requireApproval');
    const allowRegistrationInput = document.getElementById('allowRegistration');
    
    if (siteNameInput) siteNameInput.value = settings.siteName || 'السوق المفتوح';
    if (supportEmailInput) supportEmailInput.value = settings.supportEmail || 'support@example.com';
    if (supportPhoneInput) supportPhoneInput.value = settings.supportPhone || '1234567890';
    if (requireApprovalInput) requireApprovalInput.checked = settings.requireApproval !== false;
    if (allowRegistrationInput) allowRegistrationInput.checked = settings.allowRegistration !== false;
    
    // Load additional settings if they exist
    const siteColorInput = document.getElementById('siteColor');
    const siteLogoInput = document.getElementById('siteLogo');
    const siteDescriptionInput = document.getElementById('siteDescription');
    const adsPerPageInput = document.getElementById('adsPerPage');
    
    if (siteColorInput) siteColorInput.value = settings.siteColor || '#ff6b35';
    if (siteLogoInput) siteLogoInput.value = settings.siteLogo || '';
    if (siteDescriptionInput) siteDescriptionInput.value = settings.siteDescription || '';
    if (adsPerPageInput) adsPerPageInput.value = settings.adsPerPage || 12;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // Reset add category form if closing that modal
        if (modalId === 'addCategoryModal') {
            const form = document.getElementById('addCategoryForm');
            if (form) {
                form.onsubmit = handleAddCategory;
                form.reset();
                const modalTitle = modal.querySelector('h3');
                const submitBtn = modal.querySelector('button[type="submit"]');
                if (modalTitle) modalTitle.textContent = 'إضافة فئة جديدة';
                if (submitBtn) submitBtn.textContent = 'إضافة الفئة';
                document.getElementById('editCategoryId').value = '';
            }
        }
    }
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

