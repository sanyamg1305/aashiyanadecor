/* ==========================================================================
   AASHIYANA DECOR - SHARED SCRIPT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Clean Smooth Scroll for In-Page Anchors (prevents URL hash pollution) --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* --- Mobile Navigation --- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* --- Scroll Progress & Header Shadow & Back to Top --- */
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      scrollProgress.style.width = progress + '%';
    }

    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Animated Numerical Counters --- */
  let countersAnimated = false;
  const counterElements = document.querySelectorAll('.counter');

  function animateCounters() {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
          countersAnimated = true;
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }

  /* --- Tiles Showcase Search & Category Filter --- */
  const filterBtns = document.querySelectorAll('.tile-filter-btn');
  const tileCards = document.querySelectorAll('.tile-card');
  const tileSearch = document.getElementById('tileSearch');
  const tileCount = document.getElementById('tileCount');

  let activeCategory = 'all';
  let activeQuery = '';

  function applyTileFilters() {
    let visibleCount = 0;
    tileCards.forEach(card => {
      const cat = card.getAttribute('data-cat') || '';
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const sub = (card.getAttribute('data-sub') || '').toLowerCase();

      const matchesCat = (activeCategory === 'all' || cat === activeCategory || (activeCategory === 'bathroom' && (cat === 'leather120' || sub.includes('bathroom') || sub.includes('non-slip'))));
      const matchesSearch = !activeQuery || name.includes(activeQuery) || sub.includes(activeQuery);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (tileCount) {
      tileCount.textContent = `Displaying ${visibleCount} tile${visibleCount === 1 ? '' : 's'}`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      applyTileFilters();
    });
  });

  if (tileSearch) {
    tileSearch.addEventListener('input', (e) => {
      activeQuery = e.target.value.trim().toLowerCase();
      applyTileFilters();
    });
  }

  /* --- Interactive Lightbox Modal --- */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxSub = document.getElementById('lightboxSub');
  const lightboxWaBtn = document.getElementById('lightboxWaBtn');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const inspectableSelector = '.tile-card, .granite-item, .swatch-item, .quartz-item, .gallery-item';
  let inspectableItems = [];
  let currentLightboxIdx = 0;

  function refreshInspectableItems() {
    inspectableItems = Array.from(document.querySelectorAll(inspectableSelector))
      .filter(el => !el.classList.contains('hidden'));
  }

  function openLightbox(index) {
    refreshInspectableItems();
    if (index < 0 || index >= inspectableItems.length) return;
    currentLightboxIdx = index;
    const item = inspectableItems[index];

    const src = item.getAttribute('data-src') || (item.querySelector('img') ? item.querySelector('img').src : '');
    const title = item.getAttribute('data-name') || item.querySelector('.tile-title, .granite-name, .swatch-label, .gallery-caption')?.textContent || 'Stone Sample';
    const sub = item.getAttribute('data-sub') || item.querySelector('.tile-subtitle, .granite-application')?.textContent || 'Aashiyana Decor Collection';

    if (lightboxImg) lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxSub) lightboxSub.textContent = sub;

    if (lightboxWaBtn) {
      const waMsg = encodeURIComponent(`Hi Aashiyana Decor, I am interested in knowing price and stock for: ${title} (${sub}).`);
      lightboxWaBtn.href = `https://wa.me/919468634597?text=${waMsg}`;
    }

    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function nextLightbox() {
    refreshInspectableItems();
    if (!inspectableItems.length) return;
    currentLightboxIdx = (currentLightboxIdx + 1) % inspectableItems.length;
    openLightbox(currentLightboxIdx);
  }

  function prevLightbox() {
    refreshInspectableItems();
    if (!inspectableItems.length) return;
    currentLightboxIdx = (currentLightboxIdx - 1 + inspectableItems.length) % inspectableItems.length;
    openLightbox(currentLightboxIdx);
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(inspectableSelector);
    if (trigger) {
      refreshInspectableItems();
      const idx = inspectableItems.indexOf(trigger);
      if (idx !== -1) {
        openLightbox(idx);
      }
    }
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
  });

  /* --- Testimonials Carousel --- */
  const reviews = [
    { text: "We renovated our entire duplex villa with Italian marble and leather-finish tiles from Aashiyana Decor. The quality is exceptional and the team was supportive throughout. Highly recommend!", name: "Rajesh Kumar", loc: "Mansarovar, Jaipur", init: "RK", stars: 5, badge: "Homeowner" },
    { text: "Best place to source tiles and granite in Jaipur. Stunning collection, very competitive pricing, and delivery arrived right on time with zero damage. Will definitely source again.", name: "Priya Sharma", loc: "Gopalpura, Jaipur", init: "PS", stars: 5, badge: "Homeowner" },
    { text: "As a contractor, I have been sourcing granite, marble and quartz from Aashiyana for years. Consistent lot quality, authentic wholesale pricing, and a team that truly understands trade schedules.", name: "Amit Meena", loc: "Contractor, Jaipur", init: "AM", stars: 5, badge: "Contractor" },
    { text: "Humne apne naye ghar ke liye yahan se Syncstone tiles liye - bilkul waise hi aaye jaise showroom mein dikhaye the. Bahut hi sundar finish aur staff bhi genuinely helpful tha!", name: "Sunita Verma", loc: "Vaishali Nagar, Jaipur", init: "SV", stars: 5, badge: "Homeowner" },
    { text: "Installed the 60×120 leather-finish tiles in my corporate office lobby - client response has been phenomenal. Everyone asks where we sourced them. Great product, punctual service.", name: "Vivek Joshi", loc: "C-Scheme, Jaipur", init: "VJ", stars: 5, badge: "Commercial Client" },
    { text: "Imported marble ki variety aur slabs dekh ke dil khush ho gaya. Mandot ji gave us transparent lot rates with no hidden costs. Aashiyana Decor se better option Jaipur mein milna mushkil hai.", name: "Neeraj Khandelwal", loc: "Pratap Nagar, Jaipur", init: "NK", stars: 5, badge: "Homeowner" },
    { text: "We were building our dream villa and required custom cut natural stone. Aashiyana offered the most curated range we found across Rajasthan. Punctual dispatch and zero breakage.", name: "Dr. Deepika Rathore", loc: "Jagatpura, Jaipur", init: "DR", stars: 5, badge: "Homeowner" },
    { text: "Kitchen ke liye Specta Quartz countertop liya - turmeric aur masala stains bilkul saaf ho jate hain without any marks. Finish ekdum smooth hai aur Mandot ji personally attended us.", name: "Meena Gupta", loc: "Tonk Road, Jaipur", init: "MG", stars: 5, badge: "Homeowner" },
    { text: "Managed a boutique hotel development in Jaipur and needed bulk granite slabs at genuine wholesale. Aashiyana gave us the best pricing in the city without compromising block quality.", name: "Harish Singhania", loc: "Hotel Developer, Jaipur", init: "HS", stars: 5, badge: "Hotel Developer" },
    { text: "Aashiyana Decor is my trusted first call for residential assignments. Their Syncstone range photographs beautifully in completed portfolios and clients love the tactile feel.", name: "Tanya Rajput", loc: "Principal Designer, Studio Tanya", init: "TR", stars: 5, badge: "Interior Designer" },
    { text: "I have specified Aashiyana's imported marble and natural stone across six residential and two commercial projects this year. Lead times are dependable and pricing fits luxury budgets.", name: "Karan Mathur", loc: "Principal Architect, KM Architects", init: "KM", stars: 5, badge: "Architect" },
    { text: "Maine apne multiple projects mein Aashiyana ka leather-finish tile aur quartz use kiya hai. Clients ka feedback always positive hota hai. Safe on-site delivery in Mansarovar.", name: "Shruti Pareek", loc: "Interior Designer, Mansarovar", init: "SP", stars: 5, badge: "Interior Designer" },
    { text: "When clients demand premium stone at a sensible budget, Aashiyana Decor solves that challenge effortlessly. From Calacatta to Black Galaxy granite - everything under one roof.", name: "Rohit Bhardwaj", loc: "Design Architect, RB Studio", init: "RB", stars: 5, badge: "Architect" },
    { text: "The Syncstone marble-look tiles saved our schedule - client desired an Italian look on an engineered budget. The end result was stunning and guests cannot tell the difference.", name: "Neha Agarwal", loc: "Founder, Neha A. Interiors", init: "NA", stars: 5, badge: "Interior Designer" }
  ];

  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');

  if (track && dotsWrap) {
    track.innerHTML = '';
    reviews.forEach(r => {
      const card = document.createElement('div');
      card.className = 'testi-card';
      const starsHtml = Array.from({length: 5}, (_, i) => `<i class="${i < r.stars ? 'fas' : 'far'} fa-star"></i>`).join('');

      card.innerHTML = `
        <span class="testi-badge"><i class="fas fa-certificate"></i> ${r.badge || 'Verified Client'}</span>
        <div class="testi-stars">${starsHtml}</div>
        <p class="testi-text">"${r.text}"</p>
        <div class="testi-author">
          <div class="testi-avatar">${r.init}</div>
          <div>
            <div class="testi-name">${r.name}</div>
            <div class="testi-loc">${r.loc}</div>
          </div>
        </div>
      `;
      track.appendChild(card);
    });

    let perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 991 ? 2 : 3;
    let currentTestiIdx = 0;
    const totalSlides = reviews.length;

    function updateDots() {
      dotsWrap.innerHTML = '';
      const numDots = Math.ceil(totalSlides / perView);
      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'testi-dot' + (Math.floor(currentTestiIdx / perView) === i ? ' active' : '');
        dot.setAttribute('aria-label', `Go to review slide ${i + 1}`);
        dot.addEventListener('click', () => goToTesti(i * perView));
        dotsWrap.appendChild(dot);
      }
    }

    function getCardStride() {
      const cards = track.querySelectorAll('.testi-card');
      if (!cards.length) return 0;
      return cards[0].offsetWidth + 24;
    }

    function goToTesti(idx) {
      const maxIdx = totalSlides - perView;
      currentTestiIdx = Math.max(0, Math.min(idx, maxIdx));
      track.style.transform = `translateX(-${currentTestiIdx * getCardStride()}px)`;

      dotsWrap.querySelectorAll('.testi-dot').forEach((dot, i) => {
        dot.classList.toggle('active', Math.floor(currentTestiIdx / perView) === i);
      });
    }

    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');
    if (prevBtn) prevBtn.addEventListener('click', () => goToTesti(currentTestiIdx - perView));
    if (nextBtn) nextBtn.addEventListener('click', () => goToTesti(currentTestiIdx + perView));

    updateDots();

    let testiTimer = setInterval(() => {
      const maxIdx = totalSlides - perView;
      goToTesti(currentTestiIdx + perView > maxIdx ? 0 : currentTestiIdx + perView);
    }, 5500);

    const carouselWrapper = document.querySelector('.testi-carousel-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', () => clearInterval(testiTimer));
      carouselWrapper.addEventListener('mouseleave', () => {
        testiTimer = setInterval(() => {
          const maxIdx = totalSlides - perView;
          goToTesti(currentTestiIdx + perView > maxIdx ? 0 : currentTestiIdx + perView);
        }, 5500);
      });
    }

    window.addEventListener('resize', () => {
      const newPerView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 991 ? 2 : 3;
      if (newPerView !== perView) {
        perView = newPerView;
        updateDots();
        goToTesti(0);
      }
    });
  }

  /* --- FAQ Accordion Toggle --- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      // Close all other FAQs in same accordion
      const accordion = item.closest('.faq-accordion');
      if (accordion) {
        accordion.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
      }

      item.classList.toggle('active', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });
});

/* --- WhatsApp Form Integration --- */
function sendViaWhatsApp() {
  const nameEl = document.getElementById('fName');
  const phoneEl = document.getElementById('fPhone');
  const emailEl = document.getElementById('fEmail');
  const catEl = document.getElementById('fCategory');
  const msgEl = document.getElementById('fMsg');

  const name = nameEl ? nameEl.value.trim() : '';
  const phone = phoneEl ? phoneEl.value.trim() : '';
  const email = emailEl ? emailEl.value.trim() : '';
  const category = catEl ? catEl.value : 'General Enquiry';
  const msg = msgEl ? msgEl.value.trim() : '';

  if (!name || !phone) {
    showToast('Please enter your Name and Mobile Number.');
    return;
  }

  let text = `*New Stone & Tile Enquiry - Aashiyana Decor*%0A`;
  text += `👤 *Name:* ${encodeURIComponent(name)}%0A`;
  text += `📞 *Phone:* ${encodeURIComponent(phone)}%0A`;
  if (email) text += `✉️ *Email:* ${encodeURIComponent(email)}%0A`;
  text += `🏷️ *Category:* ${encodeURIComponent(category)}%0A`;
  if (msg) text += `📝 *Requirements:* ${encodeURIComponent(msg)}%0A`;

  window.open(`https://wa.me/919468634597?text=${text}`, '_blank');
  showToast('Redirecting to WhatsApp with your details...');
}

function handleFormSubmit(e) {
  e.preventDefault();
  const nameEl = document.getElementById('fName');
  const phoneEl = document.getElementById('fPhone');
  if (!nameEl || !phoneEl || !nameEl.value.trim() || !phoneEl.value.trim()) {
    showToast('Please fill in your name and phone number.');
    return;
  }

  showToast('Enquiry received! Our stone specialist will call you shortly.');
  const form = document.getElementById('enquiryForm');
  if (form) form.reset();
}

function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

/* --- Vercel Web Analytics Fallback Initializer --- */
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
if (!document.querySelector('script[src*="/_vercel/insights/script.js"]')) {
  const vaScript = document.createElement('script');
  vaScript.defer = true;
  vaScript.src = '/_vercel/insights/script.js';
  document.head.appendChild(vaScript);
}
