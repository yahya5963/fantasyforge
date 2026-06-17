// Global State
let favorites = JSON.parse(localStorage.getItem('ff_favorites')) || [];

function init() {
    highlightActiveLink();
    setupMobileNav();
    setupSearch();
    
    const outputList = document.getElementById('outputList');
    if (outputList && outputList.dataset.type) {
        generateNames(outputList.dataset.type);
    }

    if(window.location.pathname.includes('favorites.html')) {
        renderFavorites();
    }
}

function generateNames(type) {
    const count = parseInt(document.getElementById('genCount').value) || 10;
    const list = document.getElementById('outputList');
    const tool = NAME_DATA[type];
    
    list.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const name = tool.pre[Math.floor(Math.random() * tool.pre.length)] + 
                     tool.suf[Math.floor(Math.random() * tool.suf.length)];
        
        const li = document.createElement('li');
        li.className = 'name-card';
        li.innerHTML = `
            <span>${name}</span>
            <div class="actions">
                <button onclick="copyName('${name}')" title="Copy">📋</button>
                <button onclick="toggleFavorite('${name}')" title="Favorite">♥</button>
            </div>
        `;
        list.appendChild(li);
    }
}

function copyName(text) {
    navigator.clipboard.writeText(text);
    alert('Copied: ' + text);
}

function toggleFavorite(name) {
    if (!favorites.includes(name)) {
        favorites.push(name);
        localStorage.setItem('ff_favorites', JSON.stringify(favorites));
        alert('Added to Favorites!');
    }
}

function downloadTXT() {
    const names = Array.from(document.querySelectorAll('.name-card span')).map(el => el.innerText).join('\n');
    const blob = new Blob([names], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FantasyForge_Names.txt`;
    a.click();
}

function setupSearch() {
    const search = document.getElementById('navSearch');
    if (!search) return;
    search.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.nav-links li').forEach(li => {
            const text = li.innerText.toLowerCase();
            li.style.display = text.includes(term) ? 'block' : 'none';
        });
    });
}

function setupMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle) {
        toggle.onclick = () => sidebar.classList.toggle('open');
    }
}

function highlightActiveLink() {
    const path = window.location.pathname.split("/").pop();
    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href').includes(path)) a.classList.add('active');
    });
}

document.addEventListener('DOMContentLoaded', init);
