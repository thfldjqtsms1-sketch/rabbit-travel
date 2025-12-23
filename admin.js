// ===============================
// RABBIT TRAVEL - Admin Script
// ===============================

// Supabase Configuration
const SUPABASE_URL = 'https://qgaqguflhbomjapcrcsw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NB9yifqzelDvlnuBad8-aA_UqN1kg7C';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// DOM Elements
// ===============================
const totalCountEl = document.getElementById('totalCount');
const todayCountEl = document.getElementById('todayCount');
const weekCountEl = document.getElementById('weekCount');
const lastUpdateEl = document.getElementById('lastUpdate');
const tableInfoEl = document.getElementById('tableInfo');
const tableContentEl = document.getElementById('tableContent');

// ===============================
// Helper Functions
// ===============================
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function formatCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();

    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function isThisWeek(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return date >= weekAgo && date <= today;
}

// ===============================
// Data Loading
// ===============================
async function loadData() {
    try {
        // Show loading state
        tableContentEl.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;

        // Fetch data from Supabase
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Calculate stats
        const totalCount = data.length;
        const todayCount = data.filter(item => isToday(item.created_at)).length;
        const weekCount = data.filter(item => isThisWeek(item.created_at)).length;

        // Update stats UI
        totalCountEl.textContent = totalCount.toLocaleString();
        todayCountEl.textContent = todayCount.toLocaleString();
        weekCountEl.textContent = weekCount.toLocaleString();
        lastUpdateEl.textContent = formatCurrentTime();
        tableInfoEl.textContent = `총 ${totalCount}건`;

        // Render table
        if (data.length === 0) {
            renderEmptyState();
        } else {
            renderTable(data);
        }

    } catch (error) {
        console.error('Error loading data:', error);
        tableContentEl.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__icon">❌</div>
                <h3 class="empty-state__title">데이터를 불러올 수 없습니다</h3>
                <p class="empty-state__text">Supabase 연결을 확인해주세요.<br>${error.message}</p>
            </div>
        `;
    }
}

// ===============================
// Render Functions
// ===============================
function renderEmptyState() {
    tableContentEl.innerHTML = `
        <div class="empty-state">
            <div class="empty-state__icon">📭</div>
            <h3 class="empty-state__title">아직 문의가 없습니다</h3>
            <p class="empty-state__text">상담 신청이 접수되면 여기에 표시됩니다.</p>
        </div>
    `;
}

function renderTable(data) {
    const rows = data.map((item, index) => `
        <tr>
            <td>${data.length - index}</td>
            <td><strong>${escapeHtml(item.name)}</strong></td>
            <td>${escapeHtml(item.phone)}</td>
            <td><span class="badge">${escapeHtml(item.fetal_age)}</span></td>
            <td class="timestamp">${formatDate(item.created_at)}</td>
        </tr>
    `).join('');

    tableContentEl.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th style="width: 60px;">#</th>
                    <th>이름</th>
                    <th>연락처</th>
                    <th>임신 주수</th>
                    <th>접수일시</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

// HTML Escape for security
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===============================
// Auto Refresh
// ===============================
// Refresh every 30 seconds
setInterval(loadData, 30000);

// ===============================
// Initialize
// ===============================
document.addEventListener('DOMContentLoaded', loadData);
