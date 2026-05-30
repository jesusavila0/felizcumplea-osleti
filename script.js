let slideshowInterval;
let isMusicMuted = false; // Forzamos a que intente sonar unmuted al cargar
let musicStarted = false;

const CONFIG = {
    hero: {
        backgrounds: [
            { src: 'img/fondo.mp4', type: 'video' }
        ],
        title: 'Nuestra Historia',
        desc: 'Una serie original sobre nosotros.'
    },
    categories: []
};

// Datos base
const rawItems = [
    { title: "Recuerdo 1", date: "2024", src: "img/img1.JPEG", type: "foto" },
    { title: "Recuerdo 2", date: "2024", src: "img/img2.JPEG", type: "foto" },
    { title: "Recuerdo 3", date: "2024", src: "img/img3.JPEG", type: "foto" },
    { title: "Recuerdo 4", date: "2024", src: "img/img4.JPEG", type: "foto" },
    { title: "Recuerdo 5", date: "2024", src: "img/img5.JPEG", type: "foto" },
    { title: "Recuerdo 6", date: "2024", src: "img/img6.JPEG", type: "foto" },
    { title: "Recuerdo 7", date: "2024", src: "img/img7.JPEG", type: "foto" },
    { title: "Recuerdo 8", date: "2024", src: "img/img8.JPEG", type: "foto" },
    { title: "Recuerdo 9", date: "2024", src: "img/img9.JPEG", type: "foto" },
    { title: "Recuerdo 10", date: "2024", src: "img/img10.JPG", type: "foto" },
    { title: "Recuerdo 12", date: "2024", src: "img/img12.JPEG", type: "foto" },
    { title: "Recuerdo 13", date: "2024", src: "img/img13.JPG", type: "foto" },
    { title: "Recuerdo 14", date: "2024", src: "img/img14.JPEG", type: "foto" },
    { title: "Recuerdo 15", date: "2024", src: "img/img15.JPEG", type: "foto" },
    { title: "Recuerdo 16", date: "2024", src: "img/img16.JPEG", type: "foto" },
    { title: "Recuerdo 17", date: "2024", src: "img/img17.JPEG", type: "foto" },
    { title: "Recuerdo 18", date: "2024", src: "img/img18.JPEG", type: "foto" },
    { title: "Recuerdo 19", date: "2024", src: "img/img19.JPEG", type: "foto" },
    { title: "Recuerdo 20", date: "2024", src: "img/img20.JPEG", type: "foto" },
    { title: "Recuerdo 21", date: "2024", src: "img/img21.JPEG", type: "foto" },
    { title: "Recuerdo 22", date: "2024", src: "img/img22.JPEG", type: "foto" },
    { title: "Recuerdo 23", date: "2024", src: "img/img23.JPEG", type: "foto" },
    { title: "Recuerdo 24", date: "2024", src: "img/img24.JPEG", type: "foto" },
    { title: "Recuerdo 25", date: "2024", src: "img/img25.JPEG", type: "foto" },
    { title: "Recuerdo 26", date: "2024", src: "img/img26.JPEG", type: "foto" },
    { title: "Recuerdo 27", date: "2024", src: "img/img27.JPEG", type: "foto" },
    { title: "Recuerdo 28", date: "2024", src: "img/img28.JPEG", type: "foto" },
    { title: "Recuerdo 29", date: "2024", src: "img/img29.jpeg", type: "foto" },
    { title: "Vídeo 1", date: "2024", src: "img/V1.mp4", type: "video" },
    { title: "Vídeo 2", date: "2024", src: "img/V2.mp4", type: "video" },
    { title: "Vídeo 3", date: "2024", src: "img/V3.mp4", type: "video" },
    { title: "Vídeo 4", date: "2024", src: "img/V4.mp4", type: "video" },
    { title: "Vídeo 5", date: "2024", src: "img/V5.mp4", type: "video" },
    { title: "Vídeo 6", date: "2024", src: "img/V6.mp4", type: "video" },
    { title: "Vídeo Extra", date: "2024", src: "img/fondo.mp4", type: "video" }
];

// Separar dinámicamente
CONFIG.categories = [
    {
        title: "Nuestras Fotos",
        items: rawItems.filter(i => i.type === 'foto')
    },
    {
        title: "Nuestros Vídeos",
        items: rawItems.filter(i => i.type === 'video')
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bgMusic');
    music.volume = 0.5; // Iniciar a mitad de volumen
    music.muted = false;

    // Sincronizar el slider de volumen visualmente si existe
    const volumeControl = document.getElementById('volumeControl');
    if (volumeControl) volumeControl.value = 0.5;

    initHero();
    renderRows();
    updateMusicUI();

    // ESCUCHADORES MÚLTIPLES: Intentamos activar el audio con CUALQUIER actividad inicial
    const autoUnlock = () => {
        if (!musicStarted) startMusic();
    };

    ['click', 'touchstart', 'scroll', 'keydown', 'mousedown', 'wheel'].forEach(event => {
        document.addEventListener(event, autoUnlock, { once: true, passive: true });
    });

    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (!scrollTimer) {
            window.requestAnimationFrame(() => {
                const nav = document.getElementById('navbar');
                if (window.scrollY > 50) nav.classList.add('scrolled');
                else nav.classList.remove('scrolled');
                scrollTimer = false;
            });
            scrollTimer = true;
        }
    }, { passive: true });

    setTimeout(() => {
        document.getElementById('app-loader').classList.add('hidden');
        startMusic(); // Intentar reproducir justo cuando desaparece el loader
    }, 1000);
});

/**
 * Mezcla un array de forma aleatoria (Algoritmo Fisher-Yates)
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initHero() {
    const container = document.getElementById('heroBg');
    // Elegimos uno al azar de la lista de backgrounds
    const bg = CONFIG.hero.backgrounds[Math.floor(Math.random() * CONFIG.hero.backgrounds.length)];

    if (bg.type === 'video') {
        container.innerHTML = `<video id="mainHeroVideo" src="${bg.src}" autoplay muted loop playsinline preload="auto"></video>`;
    } else {
        container.style.backgroundImage = `url('${bg.src}')`;
    }

    document.getElementById('btnPlayHero').onclick = () => {
        const music = document.getElementById('bgMusic');

        // Forzamos que la configuración sea de "sonido activado"
        isMusicMuted = false;
        music.muted = false;
        music.volume = 0.5;
        musicStarted = false; // Permitimos que startMusic lo intente de nuevo
        if (document.getElementById('volumeControl')) document.getElementById('volumeControl').value = 0.5;

        updateMusicUI();
        startMusic();
        startSlideshow();
    };
}

function startMusic() {
    const music = document.getElementById('bgMusic');
    const heroVideo = document.getElementById('mainHeroVideo');

    if (isMusicMuted || (musicStarted && !music.paused)) return;

    music.muted = false;
    music.play().then(() => {
        musicStarted = true;
        // Silenciamos el video de fondo para no solapar sonidos
        if (heroVideo) heroVideo.muted = true;
        updateMusicUI();
    }).catch(() => {
        console.log("Esperando interacción para activar audio...");
        updateMusicUI();
    });
}

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    isMusicMuted = !isMusicMuted;
    music.muted = isMusicMuted;

    // Sincronizamos el video de fondo con el estado de mute de la música
    const heroVideo = document.getElementById('mainHeroVideo');
    if (heroVideo) heroVideo.muted = isMusicMuted;

    if (!isMusicMuted) {
        musicStarted = false;
        startMusic();
    } else {
        music.pause();
    }
    updateMusicUI();
}

function changeVolume(val) {
    const music = document.getElementById('bgMusic');
    music.volume = val;
    if (val > 0) {
        music.muted = false;
        isMusicMuted = false;
    } else {
        music.muted = true;
        isMusicMuted = true;
    }
    updateMusicUI();
}

function updateMusicUI() {
    const music = document.getElementById('bgMusic');
    const icon = document.getElementById('musicToggle');

    if (isMusicMuted) {
        icon.className = 'fas fa-volume-mute nav-icon';
        icon.classList.remove('music-playing');
    } else {
        icon.className = 'fas fa-volume-up nav-icon';
        if (!music.paused) icon.classList.add('music-playing');
        else icon.classList.remove('music-playing');
    }
}

function renderRows() {
    const container = document.getElementById('main-content');
    CONFIG.categories.forEach((cat, idx) => {
        // Mezclamos los items antes de renderizarlos
        shuffleArray(cat.items);

        const row = document.createElement('section');
        row.className = 'row';
        row.innerHTML = `
            <h2 class="row-title">${cat.title}</h2>
            <div class="slider-wrapper">
                <button class="slider-arrow arrow-left" onclick="scrollSlider(this, -1)"><i class="fas fa-chevron-left"></i></button>
                <div class="slider">${cat.items.map(item => `
                    <div class="card" onclick="openModal('${item.src}', ${item.type === 'video'})">
                        <div class="card-img-wrap">
                            ${item.type === 'video'
                ? `<video src="${item.src}#t=0.001" muted loop playsinline preload="auto" onmouseenter="this.play().catch(()=>{})" onmouseleave="this.pause()"></video>`
                : `<img src="${item.src}" alt="${item.title}" loading="lazy">`
            }
                            <div class="card-overlay">
                                <div class="card-meta" style="justify-content: flex-end;">
                                    <span class="card-label ${item.type === 'video' ? 'video-label' : ''}">${item.type === 'video' ? 'Video' : 'Foto'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}</div>
                <button class="slider-arrow arrow-right" onclick="scrollSlider(this, 1)"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        container.appendChild(row);
    });
}

function scrollSlider(btn, direction) {
    const slider = btn.parentElement.querySelector('.slider');
    const scrollAmount = slider.offsetWidth * 0.8;
    slider.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

function startSlideshow() {
    if (slideshowInterval) clearTimeout(slideshowInterval);

    // Creamos una copia de los elementos y la barajamos al iniciar el modo reproducción
    let slideshowPool = [...rawItems];
    shuffleArray(slideshowPool);
    let currentIndex = 0;

    const playNext = async () => {
        const mediaContainer = document.getElementById('modalMedia');

        // 1. Iniciar desvanecimiento de salida
        mediaContainer.style.opacity = '0';

        // Esperar a que termine la animación de salida (0.5s en CSS)
        await new Promise(resolve => setTimeout(resolve, 500));

        currentIndex++;
        if (currentIndex >= slideshowPool.length) {
            shuffleArray(slideshowPool);
            currentIndex = 0;
        }

        const item = slideshowPool[currentIndex];

        // 2. Cargar el medio y esperar a que esté listo (Promesa)
        await updateModalMedia(item.src, item.type === 'video', true);

        // 3. Pre-cargar el siguiente elemento en segundo plano para evitar esperas después
        const nextItem = slideshowPool[(currentIndex + 1) % slideshowPool.length];
        if (nextItem.type === 'foto') {
            const imgPreload = new Image();
            imgPreload.src = nextItem.src;
        }

        // Mantener la música sonando
        const music = document.getElementById('bgMusic');
        if (!isMusicMuted && music.paused) music.play().catch(() => { });
        updateMusicUI();

        // 4. Iniciar desvanecimiento de entrada con el contenido ya cargado
        mediaContainer.style.opacity = '1';

        // Programar el siguiente después de mostrar el actual
        slideshowInterval = setTimeout(playNext, 3000);
    };

    // Abrir el primero de la lista barajada inmediatamente
    openModal(slideshowPool[0].src, slideshowPool[0].type === 'video', true);
    slideshowInterval = setTimeout(playNext, 3500);
}

function updateModalMedia(src, isVideo, muted = false) {
    return new Promise((resolve) => {
        const container = document.getElementById('modalMedia');
        if (isVideo) {
            container.innerHTML = `<video src="${src}" controls autoplay playsinline preload="auto" ${muted ? 'muted' : ''}></video>`;
            const video = container.querySelector('video');
            video.oncanplay = () => resolve();
            video.onerror = () => resolve();
            // Fallback por si el video tarda demasiado
            setTimeout(resolve, 4000);
        } else {
            const img = new Image();
            img.onload = () => {
                container.innerHTML = '';
                container.appendChild(img);
                resolve();
            };
            img.onerror = () => resolve();
            img.src = src;
            img.alt = "Recuerdo";
            // Fallback
            setTimeout(resolve, 3000);
        }
    });
}

async function openModal(src, isVideo, muted = false) {
    startMusic();
    const mediaContainer = document.getElementById('modalMedia');
    mediaContainer.style.opacity = '0';
    document.body.classList.add('modal-open');

    await updateModalMedia(src, isVideo, muted);

    const music = document.getElementById('bgMusic');
    // Si es un vídeo y NO está silenciado (clic manual), pausamos la música de fondo
    if (isVideo && !muted) {
        music.pause();
    } else if (!isMusicMuted) {
        // Si es foto o vídeo silenciado, nos aseguramos de que la música siga sonando
        music.play().catch(() => { });
    }
    updateMusicUI();

    mediaContainer.style.opacity = '1';
    document.getElementById('modalDate').style.display = 'none';
    document.getElementById('modalBackdrop').classList.add('active');
}

function closeModal() {
    document.body.classList.remove('modal-open');
    document.getElementById('modalBackdrop').classList.remove('active');
    document.getElementById('modalMedia').innerHTML = '';

    const music = document.getElementById('bgMusic');
    if (!isMusicMuted) {
        music.muted = false; // Asegurar que no esté muteada antes de reproducir
        music.play().catch(() => { });
    }
    updateMusicUI();

    if (slideshowInterval) {
        clearTimeout(slideshowInterval);
        slideshowInterval = null;
    }
}

function closeModalOutside(e) { if (e.target.id === 'modalBackdrop') closeModal(); }
function openLetter() {
    document.getElementById('letterBackdrop').classList.add('active');
    document.body.classList.add('modal-open');
}
function closeLetter() {
    document.getElementById('letterBackdrop').classList.remove('active');
    document.body.classList.remove('modal-open');
}
function closeLetterOutside(e) { if (e.target.id === 'letterBackdrop') closeLetter(); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeLetter(); } });