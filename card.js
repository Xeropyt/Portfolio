const card = document.getElementById("card");      
const cardInner = card.querySelector(".card-inner"); 
const maxTilt = 15;
let flipDeg = 0;

function applyTilt(x, y, rect) {
    let px = (x - rect.left) / rect.width;
    let py = (y - rect.top) / rect.height;
    px = Math.min(Math.max(px, 0), 1);
    py = Math.min(Math.max(py, 0), 1);
    const rotY = (px - 0.5) * maxTilt * 2;
    const rotX = (0.5 - py) * maxTilt * 2;
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

function updateHeaderOffset() {
  const header = document.querySelector('.header');
  const hero = document.querySelector('.card-hero');
  if (!header) { console.warn('header missing'); return; }
  if (!hero)   { console.warn('card-hero missing'); return; }
  const h = Math.round(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--header-offset', `${h}px`);
  hero.style.marginTop = '';
  hero.style.paddingTop = '';
  console.log('updateHeaderOffset:', {headerHeight: h, cssVar: getComputedStyle(document.documentElement).getPropertyValue('--header-offset')});
}

window.addEventListener('load', updateHeaderOffset);
window.addEventListener('resize', updateHeaderOffset);
updateHeaderOffset();

card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    applyTilt(e.clientX, e.clientY, rect);
});

card.addEventListener("touchmove", e => {
    const t = e.touches[0];
    const rect = card.getBoundingClientRect();
    applyTilt(t.clientX, t.clientY, rect);
}, { passive: true });

card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

card.addEventListener("click", () => {
    flipDeg = flipDeg === 0 ? 180 : 0;
    cardInner.style.transform = `rotateY(${flipDeg}deg)`;
});

const carouselContainer = document.querySelector('.carousel-container');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentIndex = 0;

function updateCarousel() {
    const width = carouselContainer.clientWidth;
    carouselContainer.style.transform = `translateX(-${currentIndex * width}px)`;
}

prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : carouselContainer.children.length - 1;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex < carouselContainer.children.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
});

updateCarousel();

const experienceSection = document.getElementById('experience');
const typewriterH3 = experienceSection.querySelector('.typewriter h3');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typewriterH3.classList.add('animate');
        }
    });
}, {
    threshold: 0.1 
});

if (experienceSection) {
    observer.observe(experienceSection);
}

const experienceLink = document.querySelector('a[href="#experience"]');
experienceLink.addEventListener('click', () => {
    typewriterH3.classList.remove('animate');
    setTimeout(() => {
        typewriterH3.classList.add('animate');
    }, 10); 
});

const cardLinks = document.querySelectorAll('.card-link');
cardLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation(); 
    });
});

const emailLink = document.querySelector('.email-link');
emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = 'jt.tabaluyan@gmail.com'; 
    navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy email');
    });
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

