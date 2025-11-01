// Analytics and Visitor Tracking System

const ANALYTICS_KEYS = {
    VISITORS: 'site_visitors',
    AD_VIEWS: 'site_ad_views',
    VISITS_HISTORY: 'site_visits_history'
};

// Track page visit
function trackPageVisit() {
    const now = new Date();
    const visitData = {
        timestamp: now.getTime(),
        date: now.toISOString().split('T')[0],
        page: window.location.pathname
    };
    
    // Track visitor
    const visitors = getVisitors();
    const todayKey = now.toISOString().split('T')[0];
    if (!visitors[todayKey]) {
        visitors[todayKey] = 0;
    }
    visitors[todayKey]++;
    saveVisitors(visitors);
    
    // Track visit history
    const history = getVisitHistory();
    history.push(visitData);
    
    // Keep only last 1000 visits
    if (history.length > 1000) {
        history.shift();
    }
    saveVisitHistory(history);
}

// Track ad view
function trackAdView(adId) {
    const views = getAdViews();
    if (!views[adId]) {
        views[adId] = 0;
    }
    views[adId]++;
    saveAdViews(views);
}

function getVisitors() {
    const visitors = localStorage.getItem(ANALYTICS_KEYS.VISITORS);
    return visitors ? JSON.parse(visitors) : {};
}

function saveVisitors(visitors) {
    localStorage.setItem(ANALYTICS_KEYS.VISITORS, JSON.stringify(visitors));
}

function getAdViews() {
    const views = localStorage.getItem(ANALYTICS_KEYS.AD_VIEWS);
    return views ? JSON.parse(views) : {};
}

function saveAdViews(views) {
    localStorage.setItem(ANALYTICS_KEYS.AD_VIEWS, JSON.stringify(views));
}

function getVisitHistory() {
    const history = localStorage.getItem(ANALYTICS_KEYS.VISITS_HISTORY);
    return history ? JSON.parse(history) : [];
}

function saveVisitHistory(history) {
    localStorage.setItem(ANALYTICS_KEYS.VISITS_HISTORY, JSON.stringify(history));
}

// Analytics Functions for Admin
function loadAnalytics() {
    const visitors = getVisitors();
    const visitHistory = getVisitHistory();
    const adViews = getAdViews();
    
    // Calculate statistics
    const totalVisitors = Object.values(visitors).reduce((sum, count) => sum + count, 0);
    
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = visitors[today] || 0;
    
    // Calculate week visitors
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    let weekVisitors = 0;
    Object.keys(visitors).forEach(date => {
        if (new Date(date) >= weekAgo) {
            weekVisitors += visitors[date] || 0;
        }
    });
    
    // Calculate month visitors
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let monthVisitors = 0;
    Object.keys(visitors).forEach(date => {
        if (new Date(date) >= monthAgo) {
            monthVisitors += visitors[date] || 0;
        }
    });
    
    // Calculate total ad views
    const totalAdViews = Object.values(adViews).reduce((sum, count) => sum + count, 0);
    
    // Calculate click rate (views / total ads)
    const ads = getAds();
    const activeAds = ads.filter(a => a.status === 'active').length;
    const clickRate = activeAds > 0 ? ((totalAdViews / activeAds) * 100).toFixed(1) : 0;
    
    // Update display
    document.getElementById('totalVisitors').textContent = totalVisitors.toLocaleString();
    document.getElementById('todayVisitors').textContent = todayVisitors.toLocaleString();
    document.getElementById('weekVisitors').textContent = weekVisitors.toLocaleString();
    document.getElementById('monthVisitors').textContent = monthVisitors.toLocaleString();
    document.getElementById('totalAdViews').textContent = totalAdViews.toLocaleString();
    document.getElementById('clickRate').textContent = clickRate + '%';
    
    // Generate charts
    generateVisitorsChart(visitHistory);
    generateCategoryChart(ads);
}

function generateVisitorsChart(visitHistory) {
    const chartContainer = document.getElementById('visitorsChart');
    if (!chartContainer) return;
    
    // Get last 7 days
    const days = [];
    const data = {};
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        days.push(dateStr);
        data[dateStr] = 0;
    }
    
    // Count visits per day
    visitHistory.forEach(visit => {
        const visitDate = visit.date;
        if (data.hasOwnProperty(visitDate)) {
            data[visitDate]++;
        }
    });
    
    // Create simple bar chart
    const maxValue = Math.max(...Object.values(data), 1);
    const chartHtml = `
        <div class="simple-chart">
            ${days.map(day => {
                const value = data[day];
                const height = (value / maxValue) * 100;
                const dayLabel = new Date(day).toLocaleDateString('ar', { weekday: 'short' });
                return `
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar" style="height: ${height}%"></div>
                        <div class="chart-value">${value}</div>
                        <div class="chart-label">${dayLabel}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    chartContainer.innerHTML = chartHtml;
}

function generateCategoryChart(ads) {
    const chartContainer = document.getElementById('categoryChart');
    if (!chartContainer) return;
    
    // Count ads by category
    const categoryCounts = {};
    ads.forEach(ad => {
        if (ad.status === 'active') {
            const catName = getCategoryName(ad.category);
            categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
        }
    });
    
    const total = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
        chartContainer.innerHTML = '<p>لا توجد إعلانات نشطة</p>';
        return;
    }
    
    // Create simple bar chart
    const maxValue = Math.max(...Object.values(categoryCounts));
    const chartHtml = `
        <div class="simple-chart">
            ${Object.entries(categoryCounts).map(([catName, count]) => {
                const percentage = ((count / total) * 100).toFixed(1);
                const height = (count / maxValue) * 100;
                return `
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar" style="height: ${height}%"></div>
                        <div class="chart-value">${count}</div>
                        <div class="chart-label">${catName}</div>
                        <div class="chart-percentage">${percentage}%</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    chartContainer.innerHTML = chartHtml;
}

// Initialize tracking on page load
if (typeof window !== 'undefined') {
    // Track visit after a short delay to avoid counting admin panel visits
    setTimeout(() => {
        if (!window.location.pathname.includes('admin.html')) {
            trackPageVisit();
        }
    }, 1000);
}

