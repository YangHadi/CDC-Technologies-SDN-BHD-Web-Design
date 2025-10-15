/**
* main.js
* Author: YangHadi
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: true,
      offset: 0
    });
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }
  window.addEventListener('load', aosInit);

  /**
 * Initiate glightbox
 */
const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: false,
  zoomable: true,
});



  /**
   * Init swiper sliders
   */

  const _swiperInstances = [];

  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      if (swiperElement._inited) return;

      const config = JSON.parse(
        swiperElement.querySelector(".swiper-config").textContent.trim()
      );
      
      let instance;
      if (swiperElement.classList.contains("swiper-tab")) {
        instance = initSwiperWithCustomPagination(swiperElement, config);
      } else {
        instance = new Swiper(swiperElement, config);
      }

      swiperElement._inited = true;
      swiperElement._swiper = instance;
      _swiperInstances.push(instance);

      setTimeout(() => instance.update(), 300);
    });
  }

  window.addEventListener("load", initSwiper);

  window.addEventListener("resize", () => {
    _swiperInstances.forEach(sw => sw && sw.update());
  });

    document.addEventListener('aos:in', (e) => {
    const el = e.detail;
    if (!el) return;
    const swipersInside = el.querySelectorAll('.init-swiper');
    swipersInside.forEach(swEl => {
      if (swEl._swiper) swEl._swiper.update();
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  // Animate stat numbers when visible
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers.forEach(el => {
    // Set PureCounter attributes
    const target = el.getAttribute("data-target") || el.textContent.replace(/\D/g, "");
    el.setAttribute("data-purecounter-start", "0");
    el.setAttribute("data-purecounter-end", target);
    el.setAttribute("data-purecounter-duration", "2"); // duration in seconds
    el.classList.add("purecounter");
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll('#datacentreTabs button');
    const progressBar = document.querySelector('.tab-progress-bar');
    const datacentreSection = document.querySelector('#datacentre');
    if (!datacentreSection || !tabButtons.length || !progressBar) return; // safety check

    const allImages = datacentreSection.querySelectorAll('img');
    const switchDuration = 10000; // 10 seconds per tab

    const lightbox = GLightbox({ selector: '.glightbox' });

    let currentIndex = 0;
    let paused = false;
    let startTime = null;
    let elapsedTime = 0;
    let animationFrame;
    let isLightboxOpen = false;

    // ------------------------------------
    // Helper Functions
    // ------------------------------------
    function showTab(index) {
      if (isLightboxOpen) return;
      const activePane = document.querySelector('.tab-pane.active');
      const nextButton = tabButtons[index];
      const nextTab = new bootstrap.Tab(nextButton);

      if (activePane) {
        activePane.classList.remove('show');
        setTimeout(() => nextTab.show(), 300);
      } else {
        nextTab.show();
      }
    }

    function resetProgress() {
      progressBar.style.width = '0%';
      startTime = null;
      elapsedTime = 0;
    }

    // ------------------------------------
    // Progress Bar Animation
    // ------------------------------------
    function animateProgress(timestamp) {
      if (isLightboxOpen) {
        animationFrame = requestAnimationFrame(animateProgress);
        return;
      }

      if (!startTime) startTime = timestamp;

      if (paused) {
        animationFrame = requestAnimationFrame(animateProgress);
        return;
      }

      const runtime = timestamp - startTime + elapsedTime;
      const progress = Math.min((runtime / switchDuration) * 100, 100);
      progressBar.style.width = `${progress}%`;

      if (runtime >= switchDuration) {
        currentIndex = (currentIndex + 1) % tabButtons.length;
        showTab(currentIndex);
        resetProgress();
      }

      animationFrame = requestAnimationFrame(animateProgress);
    }

    // ------------------------------------
    // Control Functions
    // ------------------------------------
    function pauseAutoSwitch() {
      if (!paused) {
        paused = true;
        elapsedTime += performance.now() - startTime;
        progressBar.parentElement.classList.add('paused');
      }
    }

    function resumeAutoSwitch() {
      if (paused && !isLightboxOpen) {
        paused = false;
        startTime = performance.now();
        progressBar.parentElement.classList.remove('paused');
      }
    }

    function startAutoSwitch() {
      cancelAnimationFrame(animationFrame);
      paused = false;
      resetProgress();
      animationFrame = requestAnimationFrame(animateProgress);
    }

    // ------------------------------------
    // Event Listeners
    // ------------------------------------
    allImages.forEach(img => {
      img.addEventListener('mouseenter', pauseAutoSwitch);
      img.addEventListener('mouseleave', resumeAutoSwitch);
      img.addEventListener('click', () => {
        isLightboxOpen = true;
        pauseAutoSwitch();
        cancelAnimationFrame(animationFrame);
      });
    });

    // GLightbox events
    function handleLightboxClose() {
      isLightboxOpen = false;
      paused = false;

      progressBar.style.width = '0%';
      progressBar.parentElement.classList.remove('paused');

      setTimeout(() => {
        const stillOpen = document.querySelector('.glightbox-container')?.classList.contains('glightbox-open');
        if (!stillOpen) {
          startTime = null;
          elapsedTime = 0;
          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(animateProgress);
        } else {
          document.querySelector('.glightbox-container')?.classList.remove('glightbox-open');
          isLightboxOpen = false;
          startAutoSwitch();
        }
      }, 800);
    }

    lightbox.on('open', () => {
      isLightboxOpen = true;
      pauseAutoSwitch();
      cancelAnimationFrame(animationFrame);
    });
    lightbox.on('close', handleLightboxClose);
    lightbox.on('onClose', handleLightboxClose);

    tabButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        if (isLightboxOpen) return;
        currentIndex = index;
        startAutoSwitch();
      });
    });

    // Start auto-switch
    startAutoSwitch();

    // Safety watcher for stuck GLightbox
    setInterval(() => {
      const openBox = document.querySelector('.glightbox-container.glightbox-open');
      if (!openBox && isLightboxOpen) {
        isLightboxOpen = false;
        startAutoSwitch();
      }
    }, 1000);
  });

})();
