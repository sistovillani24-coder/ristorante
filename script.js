// ==========================================
// INSERISCI QUI LA TUA CONFIGURAZIONE FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyB5Uc3K7_0fnZZV-E3-cbLCrCagucCJuxQ",
    authDomain: "menu-67421.firebaseapp.com",
    projectId: "menu-67421",
    storageBucket: "menu-67421.firebasestorage.app",
    messagingSenderId: "975456424276",
    appId: "1:975456424276:web:560c366265f116deb038c1",
    measurementId: "G-E9M2Y2R4T6"
};

if (!window.firebase) {
    console.warn("Firebase Compat SDK non caricato. Verifica i tag script nell'HTML.");
} else if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = window.firebase ? firebase.firestore() : null;

document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
        }, 800);
    }

    // 1. Initial Hero Animation
    setTimeout(() => {
        document.querySelector('.hero').classList.add('loaded');
    }, 100);


    // 2. Custom Cursor
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Slight delay for the follower
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Hover effects on clickable elements and advanced cursor
        const clickables = document.querySelectorAll('a, button, input, select');
        const viewables = document.querySelectorAll('.bento-item, .gallery-item, .image-box');

        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('active');
            });
        });

        viewables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('view-mode');
                follower.setAttribute('data-text', 'VEDI');
                document.getElementById('cursor').style.opacity = '0'; // Hide the small dot
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('view-mode');
                follower.removeAttribute('data-text');
                document.getElementById('cursor').style.opacity = '1'; // Show the small dot
            });
        });
        
        // Magnetic Buttons Logic
        const magnetics = document.querySelectorAll('.btn-primary, .nav-item');
        magnetics.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'none';
            });
            btn.addEventListener('mousemove', function(e) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
            });
            btn.addEventListener('mouseleave', function(e) {
                btn.style.transition = ''; // Restore CSS transition
                btn.style.transform = `translate(0px, 0px)`;
            });
        });

        // 3D Tilt Logic for Bento & Gallery
        viewables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                // Una transizione leggerissima invece di 'none' smorza gli scatti (jitter)
                el.style.transition = 'transform 0.15s ease-out'; 
            });
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Gradi ridotti a 5 e scale3d a 1.04: lo scale compensa il tilt
                // in modo che il bordo della card non scappi via da sotto il cursore!
                const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
                const rotateY = ((x - centerX) / centerX) * 5;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; // Restore CSS transition
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });

        // Text Splitter for Advanced Reveal
        const splitTexts = document.querySelectorAll('.scroll-reveal-text .text-inner');
        splitTexts.forEach(el => {
            const text = el.textContent;
            el.textContent = ''; // clear
            const words = text.split(' ');
            words.forEach((word, index) => {
                const mask = document.createElement('span');
                mask.className = 'word-mask';
                const inner = document.createElement('span');
                inner.className = 'word-inner';
                inner.style.transitionDelay = `${index * 0.05}s`;
                inner.textContent = word;
                mask.appendChild(inner);
                el.parentElement.appendChild(mask);
            });
            el.remove(); // Remove the original .text-inner wrapper
        });
    }

    // 3. Parallax Effect & Sticky Navbar
    const navbar = document.getElementById('navbar');
    const heroBg = document.querySelector('.hero-bg');
    const parallaxImages = document.querySelectorAll('.gallery-img, .image-box img');
    const marqueeSec = document.querySelector('.marquee-section');
    
    let lastScrollY = window.scrollY;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // The hero is now fixed via CSS, so we don't need JS parallax for it.

        // Parallax Images using CSS variables to avoid conflict with hover scale
        parallaxImages.forEach(img => {
            if (window.innerWidth <= 768) {
                img.style.setProperty('--parallax-y', `0px`);
                return; // Disabilita l'effetto parallax su mobile per evitare bug di scorrimento
            }
            
            const rect = img.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const yOffset = (rect.top - window.innerHeight/2) * 0.15;
                img.style.setProperty('--parallax-y', `${yOffset}px`);
            }
        });

        // Pinned Horizontal Scroll Logic
        const pinnedSections = document.querySelectorAll('.menu-pinned-section');
        
        pinnedSections.forEach(section => {
            const wrapper = section.querySelector('.menu-horizontal-wrapper');
            if (section && wrapper) {
                const rect = section.getBoundingClientRect();
                const maxScroll = section.offsetHeight - window.innerHeight;
                
                if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                    // Inside the pinned area
                    const scrolledPast = Math.abs(rect.top);
                    const progress = scrolledPast / maxScroll; // 0 to 1
                    
                    // Calculate max translate
                    const wrapperWidth = wrapper.scrollWidth;
                    const maxTranslate = wrapperWidth - window.innerWidth + (window.innerWidth * 0.10); // Match 10vw padding
                    
                    wrapper.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
                    section.style.backgroundColor = ''; // Assicura che rimanga il colore di base
                    
                } else if (rect.top > 0) {
                    wrapper.style.transform = `translate3d(0px, 0, 0)`;
                    section.style.backgroundColor = '';
                } else if (rect.bottom < window.innerHeight) {
                    const wrapperWidth = wrapper.scrollWidth;
                    const maxTranslate = wrapperWidth - window.innerWidth + (window.innerWidth * 0.10);
                    wrapper.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
                    section.style.backgroundColor = '';
                }
            }
        });

        // Scroll Skew on Marquee
        if (marqueeSec) {
            const velocity = scrolled - lastScrollY;
            const skew = Math.max(-10, Math.min(10, velocity * 0.1));
            marqueeSec.style.transform = `skewY(${skew}deg)`;
            marqueeSec.style.transition = 'none';
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (marqueeSec) {
                marqueeSec.style.transform = `skewY(0deg)`;
                marqueeSec.style.transition = `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`;
            }
        }, 100);
        
        lastScrollY = scrolled;
    });

    // 4. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const mobileMenu = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // 0. Dynamic Logo Animation
    const mainLogo = document.querySelector('.logo');
    
    // Nascondi il logo all'avvio finché non calcoliamo le sue coordinate esatte,
    // per evitare che appaia in alto a sinistra per un secondo prima di saltare al centro.
    if (mainLogo && !document.body.classList.contains('page-inner')) {
        mainLogo.style.opacity = '0';
    }

    let logoMaxMoveX = 0;
    let logoMaxMoveY = 0;
    let logoMaxScale = 5; 
    let logoAnimDistance = window.innerHeight * 0.7; 

    function initLogoAnim() {
        if (!mainLogo) return;
        
        // Disabilita l'animazione del logo nelle pagine interne (es. menu.html)
        if (document.body.classList.contains('page-inner')) {
            mainLogo.style.transform = 'none';
            mainLogo.style.color = '';
            mainLogo.style.textShadow = '';
            return;
        }
        // Misura tramite reset temporaneo per evitare sfasamenti del flexbox
        const oldTransform = mainLogo.style.transform;
        const oldTransition = mainLogo.style.transition;
        const oldPadding = mainLogo.style.paddingLeft;
        mainLogo.style.transition = 'none';
        mainLogo.style.transform = 'none';
        // Solo per sicurezza temporanea
        if (mainLogo.querySelector('.logo-img') && mainLogo.querySelector('.logo-img').style.display !== 'none') {
            mainLogo.style.paddingLeft = '0';
        }
        
        // Adattiamo la scala e la distanza dell'animazione per i dispositivi mobili
        if (window.innerWidth <= 768) {
            logoMaxScale = 2.5; 
            logoAnimDistance = window.innerHeight * 0.6; 
        } else {
            logoMaxScale = 5; 
            logoAnimDistance = window.innerHeight * 0.8; 
        }

        // Use requestAnimationFrame to ensure layout is ready
        requestAnimationFrame(() => {
            const rect = mainLogo.getBoundingClientRect();
            
            // Ripristina stili originali
            mainLogo.style.transform = oldTransform;
            mainLogo.style.transition = oldTransition;
            mainLogo.style.paddingLeft = oldPadding;
            
            const centerX = window.innerWidth / 2;
            const verticalCenterRatio = window.innerWidth <= 768 ? 0.42 : 0.50;
            const centerY = window.innerHeight * verticalCenterRatio; 
            
            const naturalCenterX = rect.left + rect.width / 2;
            const naturalCenterY = rect.top + rect.height / 2;
            
            logoMaxMoveX = centerX - naturalCenterX;
            logoMaxMoveY = centerY - naturalCenterY;
            
            logoMaxMoveY = centerY - naturalCenterY;
            
            // Forza l'aggiornamento immediato prima di renderlo visibile
            currentLerpedScrollY = window.scrollY;
            isLogoInitialRendered = false; // Forza renderLoop a disegnare il logo al centro ORA

            
            // Mostra il logo con un elegante fade-in una volta posizionato correttamente
            if (!document.body.classList.contains('page-inner')) {
                mainLogo.style.transition = 'opacity 0.8s ease';
                mainLogo.style.opacity = '1';
            }
        });
    }

    let isUpdatingLogo = false;
    let currentLerpedScrollY = window.scrollY;
    let isLogoInitialRendered = false;
    
    function renderLoop() {
        const targetScrollY = window.scrollY;
        
        // Applica LERP (Linear Interpolation) per smorzare gli scatti
        // Valori più bassi (es. 0.08) rendono il movimento più "gommoso" e fluido
        currentLerpedScrollY += (targetScrollY - currentLerpedScrollY) * 0.12;
        
        // Ottimizzazione: aggiorna il DOM solo se il valore interpolato è cambiato in modo percettibile
        if (!isLogoInitialRendered || Math.abs(targetScrollY - currentLerpedScrollY) > 0.05) {
            isLogoInitialRendered = true;
            
            // 1. Logo Animation
            if (mainLogo && !document.body.classList.contains('page-inner')) {
                let progress = currentLerpedScrollY / logoAnimDistance;
                if (progress > 1) progress = 1;
                if (progress < 0) progress = 0;
                
                const easeProgress = progress;
                
                const currentScale = 1 + (logoMaxScale - 1) * (1 - easeProgress);
                const currentX = logoMaxMoveX * (1 - easeProgress);
                const currentY = logoMaxMoveY * (1 - easeProgress);
                
                // Da Colore Dinamico a Bianco (240, 240, 240)
                const baseR = window.siteAccentRGB ? window.siteAccentRGB.r : 226;
                const baseG = window.siteAccentRGB ? window.siteAccentRGB.g : 182;
                const baseB = window.siteAccentRGB ? window.siteAccentRGB.b : 89;

                const r = Math.round(baseR + (240 - baseR) * easeProgress);
                const g = Math.round(baseG + (240 - baseG) * easeProgress);
                const b = Math.round(baseB + (240 - baseB) * easeProgress);
                
                const shadowOpacity = 0.6 * (1 - easeProgress);
                
                // Usiamo scale3d invece di scale per forzare l'accelerazione GPU in modo aggressivo
                mainLogo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale3d(${currentScale}, ${currentScale}, 1)`;
                mainLogo.style.color = `rgb(${r}, ${g}, ${b})`;
                
                if (window.innerWidth > 768) {
                    mainLogo.style.textShadow = `0 0 40px rgba(${baseR}, ${baseG}, ${baseB}, ${shadowOpacity})`;
                } else {
                    mainLogo.style.textShadow = 'none';
                }
            }
        } else {
            // Allinea perfettamente a fine movimento per evitare calcoli infiniti su decimali piccolissimi
            currentLerpedScrollY = targetScrollY;
        }
        
        requestAnimationFrame(renderLoop);
    }
    
    requestAnimationFrame(renderLoop);

    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        // Evita bug su mobile quando la barra degli indirizzi scompare durante lo scroll
        if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            initLogoAnim();
        }
    });
    
    if (document.fonts) {
        document.fonts.ready.then(initLogoAnim);
    } else {
        setTimeout(initLogoAnim, 100);
    }

    // 5. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        document.querySelectorAll('.bento-item, .gallery-item, .image-box').forEach(el => {
            el.addEventListener('click', () => {
                const img = el.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    // Hide the custom cursor text temporarily so it doesn't overlap weirdly
                    document.getElementById('cursor-follower').classList.remove('view-mode');
                    document.getElementById('cursor-follower').removeAttribute('data-text');
                }
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // 5. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-text, .scroll-reveal-scale');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 6. Form Submission & Email
    const form = document.getElementById('reservation-form');
    if (form) {
        // Imposta min e max per il campo data
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date();
            const yearLater = new Date();
            yearLater.setFullYear(today.getFullYear() + 1);
            
            const formatDate = (date) => date.toISOString().split('T')[0];
            
            dateInput.min = formatDate(today);
            dateInput.max = formatDate(yearLater);
            
            // Rendi l'intero campo cliccabile per aprire il calendario (anziché solo la piccola icona)
            dateInput.addEventListener('click', function() {
                try { this.showPicker(); } catch(e) {}
            });
        }
        
        const timeInput = document.getElementById('time');
        if (timeInput) {
            timeInput.addEventListener('click', function() {
                try { this.showPicker(); } catch(e) {}
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const method = document.getElementById('contact-method').value;
            
            const subject = `Nuova Prenotazione AURA: ${name}`;
            const body = `Dettagli Prenotazione:\n\nNome: ${name}\nData: ${date}\nOra: ${time}\nNumero di Ospiti: ${guests}`;
            
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.style.backgroundColor = 'var(--accent)';
            btn.style.color = 'var(--bg-color)';
            
            if (method === 'whatsapp') {
                btn.textContent = 'Apertura WhatsApp...';
                const whatsappUrl = `https://wa.me/393454697846?text=${encodeURIComponent(body)}`;
                window.open(whatsappUrl, '_blank');
            } else {
                btn.textContent = 'Apertura Mail...';
                window.location.href = `mailto:frociovillani@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }
            
            setTimeout(() => {
                form.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--accent)';
            }, 3000);
        });
    }
});

// --- HELMET GALLERY STYLE (MENU PAGE) ---

window.openLightbox = function(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        const follower = document.getElementById('cursor-follower');
        if (follower) {
            follower.classList.remove('view-mode');
            follower.removeAttribute('data-text');
        }
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.style.opacity = '1';
        }
    }
};

// Initialize GSAP for Menu Grid if loaded
function initMenuGsap() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const grid = document.querySelector('.dishes-grid');
        if (grid) {
            const items = document.querySelectorAll('.dish-item');
            
            // 1. Entry Animation
            items.forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%", // trigger when 15% from bottom
                        toggleActions: "play none none reverse"
                    },
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });

            // 2. Dual Vertical Parallax (Left down, Right up)
            if (window.innerWidth > 768) {
                const leftColItems = document.querySelectorAll('.dish-item:nth-child(odd)');
                const rightColItems = document.querySelectorAll('.dish-item:nth-child(even)');
                
                // Colonna Sinistra Scende
                gsap.to(leftColItems, {
                    y: 120, 
                    ease: "none",
                    scrollTrigger: {
                        trigger: grid,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                });

                // Colonna Destra Sale
                gsap.to(rightColItems, {
                    y: -120, 
                    ease: "none",
                    scrollTrigger: {
                        trigger: grid,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                });
            }
        }
    }
}

// --- FETCH AND RENDER DYNAMIC MENU (FIREBASE CLOUD) ---
async function fetchAndRenderMenu() {
    try {
        let dishes = [];
        
        // Verifica se le chiavi sono state impostate (se no usa fallback per evitare crash fatali)
        if (firebaseConfig.apiKey !== "INSERISCI_LA_TUA_API_KEY" && db) {
            const querySnapshot = await db.collection("dishes").get();
            querySnapshot.forEach((doc) => {
                dishes.push({ id: doc.id, ...doc.data() });
            });
            
            // Ordina lato client (in ordine crescente) in base al campo 'order'
            dishes.sort((a, b) => (a.order || 0) - (b.order || 0));
            
            // Fallback: se non hai ancora inserito piatti dal pannello admin, mostro 3 piatti di default
            if (dishes.length === 0) {
                dishes = [
                    { title: "Risotto Zafferano & Oro", description: "Riso Carnaroli riserva, pistilli di zafferano iraniano, foglia d'oro 24k.", price: "€ 45", image_url: "assets/risotto.png" },
                    { title: "Astice & Tartufo", description: "Astice blu bretone, burro nocciola, tartufo nero pregiato.", price: "€ 60", image_url: "assets/astice.png" },
                    { title: "Polpo Arrostito", description: "Polpo croccante, crema di patate affumicate, polvere di olive.", price: "€ 38", image_url: "assets/dish_octopus_1777058446156.png" }
                ];
            }
        } else {
            console.warn("ATTENZIONE: Configurazione Firebase non trovata. Il menu dinamico non verrà caricato finché non inserisci le chiavi.");
        }

        // 1. Il Render nella Homepage è stato rimosso in quanto lo slider ora è statico.
        // I piatti dinamici popoleranno SOLO la pagina del Menu Completo (menu.html).

        // 2. Render in Full Menu Page
        const fullMenuContainer = document.getElementById('dynamic-menu-full');
        if (fullMenuContainer) {
            fullMenuContainer.innerHTML = dishes.map((dish, idx) => `
                <div class="dish-item">
                    <div class="dish-card" onclick="this.classList.toggle('show-ingredients')" onmouseenter="document.getElementById('cursor-follower').classList.add('view-mode'); document.getElementById('cursor-follower').setAttribute('data-text', 'SCOPRI'); document.getElementById('cursor').style.opacity = '0';" onmouseleave="document.getElementById('cursor-follower').classList.remove('view-mode'); document.getElementById('cursor-follower').removeAttribute('data-text'); document.getElementById('cursor').style.opacity = '1';">
                        <div class="dish-card-inner">
                            <div class="dish-front">
                                <img src="${dish.image_url}" alt="${dish.title}" data-slot="dish-${idx}" class="dish-img">
                                <svg class="dish-border-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M 0 0 L 100 0 L 100 85 L 70 85 L 65 100 L 0 100 Z" />
                                </svg>
                            </div>
                            <div class="dish-back">
                                <div class="dish-ingredients-overlay">
                                    <h4>Ingredienti</h4>
                                    <p>${dish.description}</p>
                                </div>
                                <svg class="dish-border-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M 0 0 L 100 0 L 100 85 L 70 85 L 65 100 L 0 100 Z" />
                                </svg>
                            </div>
                        </div>
                        <span class="dish-price">${dish.price}</span>
                    </div>
                    <div class="dish-info">
                        <span class="dish-name">${dish.title}</span>
                    </div>
                </div>
            `).join('');
            
            // Re-init GSAP for the new grid items
            initMenuGsap();
        }

    } catch (err) {
        console.error("Errore nel caricamento del menu da Firebase:", err);
    }
}

// --- FETCH AND APPLY SITE TEXTS (FIREBASE CLOUD) ---
async function fetchAndApplySiteTexts() {
    if (firebaseConfig.apiKey !== "INSERISCI_LA_TUA_API_KEY" && db) {
        try {
            const textsDoc = await db.collection("settings").doc("texts").get();
            let restaurantName = "AURA"; // Default
            
            if (textsDoc.exists) {
                const data = textsDoc.data();
                if (data.restaurant_name) {
                    restaurantName = data.restaurant_name;
                }
            }

            if (restaurantName !== "AURA") {
                localStorage.setItem('aura_restaurant_name', restaurantName);
            } else {
                localStorage.removeItem('aura_restaurant_name');
            }

            document.querySelectorAll('.preloader-text, .logo-text').forEach(el => {
                el.textContent = restaurantName;
            });
            document.title = restaurantName + ' | Ristorante Moderno';

        } catch (err) {
            console.error("Errore nel caricamento dei testi dal Firebase:", err);
        }
    }
}

// --- FUNZIONE PER CONVERTIRE HEX IN RGB ---
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 226, g: 182, b: 89 };
}

// --- FETCH AND APPLY SITE COLORS (FIREBASE CLOUD) ---
async function fetchAndApplySiteColors() {
    if (firebaseConfig.apiKey !== "INSERISCI_LA_TUA_API_KEY" && db) {
        try {
            const colorsDoc = await db.collection("settings").doc("colors").get();
            if (colorsDoc.exists) {
                const data = colorsDoc.data();
                if (data.primary_color) {
                    document.documentElement.style.setProperty('--accent', data.primary_color);
                    window.siteAccentRGB = hexToRgb(data.primary_color);
                    localStorage.setItem('aura_primary_color', data.primary_color);
                }
            } else {
                // Remove local fallback if deleted remotely
                localStorage.removeItem('aura_primary_color');
                document.documentElement.style.removeProperty('--accent');
                window.siteAccentRGB = { r: 226, g: 182, b: 89 };
            }
        } catch (err) {
            console.error("Errore nel caricamento dei colori da Firebase:", err);
            applyLocalColorFallback();
        }
    } else {
        applyLocalColorFallback();
    }
}

function applyLocalColorFallback() {
    const savedColor = localStorage.getItem('aura_primary_color');
    if (savedColor) {
        document.documentElement.style.setProperty('--accent', savedColor);
        window.siteAccentRGB = hexToRgb(savedColor);
    } else {
        document.documentElement.style.removeProperty('--accent');
        window.siteAccentRGB = { r: 226, g: 182, b: 89 };
    }
}

// --- FETCH AND APPLY SITE IMAGES (FIREBASE CLOUD) ---
async function fetchAndApplySiteImages() {
    if (firebaseConfig.apiKey !== "INSERISCI_LA_TUA_API_KEY" && db) {
        try {
            const imagesDoc = await db.collection("settings").doc("images").get();
            const data = imagesDoc.exists ? imagesDoc.data() : {};
            
            // Check if main logo exists in firebase, if not remove from local storage and UI
            if (!data.main_logo) {
                localStorage.removeItem('aura_main_logo');
                document.querySelectorAll('[data-image-slot="main_logo"]').forEach(el => {
                    if (el.tagName === 'IMG') {
                        el.style.display = 'none';
                        el.src = '';
                        const textLogo = el.parentElement.querySelector('.logo-text');
                        if (textLogo) textLogo.style.display = 'inline-block';
                        
                        el.parentElement.style.letterSpacing = '';
                        el.parentElement.style.fontSize = '';
                    }
                });
            }

            for (const [slot, base64Url] of Object.entries(data)) {
                const elements = document.querySelectorAll(`[data-image-slot="${slot}"]`);
                elements.forEach(el => {
                    if (el.tagName === 'IMG') {
                        el.src = base64Url;
                        if (slot === 'main_logo') {
                            el.style.display = 'inline-block';
                            const textLogo = el.parentElement.querySelector('.logo-text');
                            if (textLogo) textLogo.style.display = 'none';
                            
                            // Rimuovi stili di testo dal contenitore per evitare spazi vuoti "fantasma" che sballano il centro
                            el.parentElement.style.letterSpacing = '0';
                            el.parentElement.style.fontSize = '0';
                            el.parentElement.style.paddingLeft = '0';
                            
                            localStorage.setItem('aura_main_logo', base64Url);
                            
                            // Ricalcola il centro del logo una volta che l'immagine ha dimensioni definitive
                            el.onload = () => {
                                if (typeof initLogoAnim === 'function') {
                                    initLogoAnim();
                                }
                            };
                        }
                    } else {
                        el.style.backgroundImage = `url('${base64Url}')`;
                    }
                });
            }
        } catch (err) {
            console.error("Errore nel caricamento delle immagini del sito da Firebase:", err);
        }
    }
}

// --- FETCH AND RENDER DYNAMIC GALLERY (FIREBASE CLOUD) ---
async function fetchAndRenderGallery() {
    try {
        if (firebaseConfig.apiKey !== "INSERISCI_LA_TUA_API_KEY" && db) {
            const galleryContainer = document.getElementById('dynamic-gallery-full');
            if (galleryContainer) {
                const querySnapshot = await db.collection("gallery").get();
                let galleryPhotos = [];
                querySnapshot.forEach((doc) => {
                    galleryPhotos.push({ id: doc.id, ...doc.data() });
                });

                galleryPhotos.sort((a, b) => (a.order || 0) - (b.order || 0));

                if (galleryPhotos.length > 0) {
                    galleryContainer.innerHTML = galleryPhotos.map((photo, index) => {
                        const delayClass = index % 3 === 1 ? 'delay-1' : (index % 3 === 2 ? 'delay-2' : '');
                        return `
                            <div class="gallery-item scroll-reveal ${delayClass}">
                                <img src="${photo.image_url}" alt="Gallery Photo ${index + 1}" class="gallery-img">
                            </div>
                        `;
                    }).join('');

                    // Ri-applica la logica del lightbox e cursore
                    const lightbox = document.getElementById('lightbox');
                    const lightboxImg = document.getElementById('lightbox-img');
                    
                    if (lightbox) {
                        const newGalleryItems = galleryContainer.querySelectorAll('.gallery-item');
                        newGalleryItems.forEach(el => {
                            el.addEventListener('click', () => {
                                const img = el.querySelector('img');
                                if (img) {
                                    lightboxImg.src = img.src;
                                    lightbox.classList.add('active');
                                    const follower = document.getElementById('cursor-follower');
                                    if(follower) {
                                        follower.classList.remove('view-mode');
                                        follower.removeAttribute('data-text');
                                    }
                                }
                            });
                            
                            // Effetti hover del cursore e 3D Tilt
                            if (window.innerWidth > 768) {
                                const follower = document.getElementById('cursor-follower');
                                el.addEventListener('mouseenter', () => {
                                    if(follower) {
                                        follower.classList.add('view-mode');
                                        follower.setAttribute('data-text', 'VEDI');
                                        document.getElementById('cursor').style.opacity = '0';
                                    }
                                    el.style.transition = 'transform 0.15s ease-out';
                                });
                                el.addEventListener('mousemove', (e) => {
                                    const rect = el.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    const centerX = rect.width / 2;
                                    const centerY = rect.height / 2;
                                    const rotateX = ((y - centerY) / centerY) * -5;
                                    const rotateY = ((x - centerX) / centerX) * 5;
                                    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
                                });
                                el.addEventListener('mouseleave', () => {
                                    if(follower) {
                                        follower.classList.remove('view-mode');
                                        follower.removeAttribute('data-text');
                                        document.getElementById('cursor').style.opacity = '1';
                                    }
                                    el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                                    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                                });
                            }
                        });
                    }
                    
                    // Ri-applica Scroll Reveal
                    if (window.IntersectionObserver) {
                        const revealElements = galleryContainer.querySelectorAll('.scroll-reveal');
                        const revealCallback = (entries, observer) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    entry.target.classList.add('visible');
                                    observer.unobserve(entry.target);
                                }
                            });
                        };
                        const revealObserver = new IntersectionObserver(revealCallback, {
                            threshold: 0.1,
                            rootMargin: "0px 0px -50px 0px"
                        });
                        revealElements.forEach(el => {
                            revealObserver.observe(el);
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error("Errore nel caricamento della galleria da Firebase:", err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderMenu();
    fetchAndRenderGallery();
    fetchAndApplySiteTexts();
    fetchAndApplySiteImages();
    fetchAndApplySiteColors();
});
