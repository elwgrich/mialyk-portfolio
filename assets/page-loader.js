(function() {
  var html = document.documentElement;
  html.classList.add('page-loader-active');

  var registeredPromises = [];
  var trackedImages = new WeakSet();

  function buildOverlayMarkup() {
    return '' +
      '<div class="page-loader" data-page-loader>' +
        '<header class="page-loader__header header">' +
          '<a class="page-loader__logo nav-logo" href="index.html">mialyk<span class="page-loader__slash slash">//</span><sub>building something creative</sub></a>' +
          '<nav>' +
            '<div class="nav-item">' +
              '<a class="nav-link" href="index.html">Projects</a>' +
              '<div class="nav-dropdown">' +
                '<a href="helpurr.html" class="dropdown-item"><span class="dropdown-dot"></span>Helpurr</a>' +
                '<a href="#" class="dropdown-item dropdown-locked" tabindex="-1" aria-disabled="true"><span class="dropdown-dot"></span>Le.social</a>' +
                '<a href="ora.html" class="dropdown-item"><span class="dropdown-dot"></span>ORA</a>' +
                '<a href="meed.html" class="dropdown-item"><span class="dropdown-dot"></span>Meed</a>' +
                '<a href="cheddar.html" class="dropdown-item"><span class="dropdown-dot"></span>Cheddar Verse</a>' +
                '<a href="hamartia.html" class="dropdown-item"><span class="dropdown-dot"></span>Hamartia</a>' +
                '<a href="vfx.html" class="dropdown-item"><span class="dropdown-dot"></span>VFX</a>' +
                '<a href="https://www.artstation.com/mialyk" target="_blank" rel="noopener noreferrer" class="dropdown-item"><span class="dropdown-dot"></span>Illustration</a>' +
              '</div>' +
            '</div>' +
            '<a class="nav-link" href="about.html">About</a>' +
          '</nav>' +
        '</header>' +
        '<div class="page-loader__main">' +
          '<div class="page-loader__media-wrap">' +
            '<img class="page-loader__media" src="assets/images/loading.gif" alt="Loading">' +
            '<div class="page-loader__label">Loading</div>' +
          '</div>' +
        '</div>' +
        '<footer class="page-loader__footer">' +
          '<div class="page-loader__copy">2026 <span>mialyk</span> // All rights reserved</div>' +
          '<div class="page-loader__socials" aria-hidden="true">' +
            '<span class="page-loader__social"><svg class="page-loader__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg></span>' +
            '<span class="page-loader__social"><svg class="page-loader__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"></path></svg></span>' +
            '<span class="page-loader__social"><svg class="page-loader__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.164-1.333H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z"></path></svg></span>' +
            '<span class="page-loader__social"><svg class="page-loader__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.213 5.567 5.95-5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></span>' +
          '</div>' +
        '</footer>' +
      '</div>';
  }

  function ensureOverlay() {
    if (document.querySelector('[data-page-loader]')) return;
    if (!document.body) return;
    document.body.insertAdjacentHTML('afterbegin', buildOverlayMarkup());
  }

  ensureOverlay();

  function waitForDomReadyOrTimeout() {
    if (document.readyState !== 'loading') return Promise.resolve();
    return Promise.race([
      new Promise(function(resolve) {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
      }),
      new Promise(function(resolve) {
        window.setTimeout(resolve, 1200);
      })
    ]);
  }

  function safeResolve(promise) {
    return Promise.resolve(promise).catch(function() {
    });
  }

  function withTimeout(promise, timeoutMs) {
    return Promise.race([
      safeResolve(promise),
      new Promise(function(resolve) {
        setTimeout(resolve, timeoutMs);
      })
    ]);
  }

  function waitForFonts() {
    if (!document.fonts || !document.fonts.ready) return Promise.resolve();
    return safeResolve(document.fonts.ready);
  }

  function isNearViewport(el) {
    if (!el || typeof el.getBoundingClientRect !== 'function') return false;
    var rect = el.getBoundingClientRect();
    var viewportHeight = window.innerHeight || 0;
    return rect.bottom >= -(viewportHeight * 0.25) && rect.top <= viewportHeight * 1.5;
  }

  function isRendered(el) {
    if (!el || typeof window.getComputedStyle !== 'function') return false;
    var styles = window.getComputedStyle(el);
    if (styles.display === 'none' || styles.visibility === 'hidden') return false;
    var rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    return true;
  }

  function shouldBlockLoaderForElement(el) {
    if (!el || el.closest('[data-page-loader]')) return false;
    if (!isRendered(el)) return false;
    if (el.hasAttribute('data-page-loader-critical')) return true;
    if (el.getAttribute('fetchpriority') === 'high') return true;
    if (el.getAttribute('loading') === 'lazy') return false;
    if (el.tagName === 'VIDEO' && (el.autoplay || el.getAttribute('preload') === 'auto')) {
      return isNearViewport(el);
    }
    return isNearViewport(el);
  }

  function waitForImage(img) {
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise(function(resolve) {
      var done = function() {
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
        resolve();
      };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  function waitForVideo(video) {
    if (!video) return Promise.resolve();
    if (!video.currentSrc && !video.src && !video.querySelector('source[src]')) return Promise.resolve();
    if (video.readyState >= 3) return Promise.resolve();
    return new Promise(function(resolve) {
      var settled = false;
      var finish = function() {
        if (settled) return;
        settled = true;
        video.removeEventListener('canplaythrough', finish);
        video.removeEventListener('canplay', finish);
        video.removeEventListener('loadeddata', finish);
        video.removeEventListener('error', finish);
        resolve();
      };
      video.preload = 'auto';
      video.addEventListener('canplaythrough', finish, { once: true });
      video.addEventListener('canplay', finish, { once: true });
      video.addEventListener('loadeddata', finish, { once: true });
      video.addEventListener('error', finish, { once: true });
      try {
        video.load();
      } catch (_) {
        finish();
      }
    });
  }

  function extractUrls(value) {
    if (!value || value === 'none') return [];
    var matches = [];
    var pattern = /url\((['"]?)(.*?)\1\)/g;
    var match;
    while ((match = pattern.exec(value))) {
      if (match[2]) matches.push(match[2]);
    }
    return matches;
  }

  function waitForCssImages() {
    var urls = new Set();
    var elements = document.body ? document.body.querySelectorAll('*') : [];
    Array.prototype.forEach.call(elements, function(el) {
      if (el.closest('[data-page-loader]')) return;
      if (!shouldBlockLoaderForElement(el)) return;
      var styles = window.getComputedStyle(el);
      extractUrls(styles.backgroundImage).forEach(function(url) {
        if (url.indexOf('data:') !== 0) urls.add(url);
      });
      extractUrls(styles.maskImage).forEach(function(url) {
        if (url.indexOf('data:') !== 0) urls.add(url);
      });
    });

    return Promise.all(Array.from(urls).map(function(url) {
      return new Promise(function(resolve) {
        var img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = url;
      });
    }));
  }

  function collectDomAssetPromises() {
    var images = Array.from(document.querySelectorAll('img')).filter(function(img) {
      return shouldBlockLoaderForElement(img);
    }).map(waitForImage);

    var videos = Array.from(document.querySelectorAll('video')).filter(function(video) {
      return shouldBlockLoaderForElement(video);
    }).map(waitForVideo);

    var posters = Array.from(document.querySelectorAll('video[poster]')).filter(function(video) {
      return shouldBlockLoaderForElement(video);
    }).map(function(video) {
      return new Promise(function(resolve) {
        var poster = new Image();
        poster.onload = resolve;
        poster.onerror = resolve;
        poster.src = video.getAttribute('poster');
      });
    });

    return images.concat(videos, posters, [waitForCssImages()]);
  }

  function hideLoader() {
    var overlay = document.querySelector('[data-page-loader]');
    if (!overlay) {
      html.classList.remove('page-loader-active');
      window.dispatchEvent(new CustomEvent('page-loader:hidden'));
      return;
    }

    overlay.classList.add('is-hidden');
    window.setTimeout(function() {
      overlay.remove();
      html.classList.remove('page-loader-active');
      window.dispatchEvent(new CustomEvent('page-loader:hidden'));
    }, 400);
  }

  function bootLoader() {
    var work = collectDomAssetPromises()
      .concat(registeredPromises)
      .concat([waitForFonts()]);

    withTimeout(Promise.all(work.map(safeResolve)), 10000).then(function() {
      return new Promise(function(resolve) {
        window.setTimeout(resolve, 180);
      });
    }).then(hideLoader);
  }

  window.__pageLoader = {
    register: function(promise) {
      var wrapped = safeResolve(promise);
      registeredPromises.push(wrapped);
      return wrapped;
    },
    trackImage: function(img) {
      if (!img || trackedImages.has(img)) return img;
      trackedImages.add(img);
      registeredPromises.push(waitForImage(img));
      return img;
    }
  };

  waitForDomReadyOrTimeout().then(bootLoader);
})();
