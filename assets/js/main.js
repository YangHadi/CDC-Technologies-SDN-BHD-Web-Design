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

})();
