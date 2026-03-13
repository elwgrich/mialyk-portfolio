(function() {
  function detectMobileBlock() {
    var ua = navigator.userAgent || '';
    var uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    var uaDataMobile = !!(navigator.userAgentData && navigator.userAgentData.mobile);
    var coarsePointer = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(any-pointer: coarse)').matches;
    var noHover = window.matchMedia('(hover: none)').matches || window.matchMedia('(any-hover: none)').matches;
    var mobileViewport = Math.min(window.innerWidth, window.innerHeight) <= 900;
    return uaMobile || uaDataMobile || (coarsePointer && (noHover || mobileViewport));
  }

  function applyMobileBlock() {
    var isBlocked = detectMobileBlock();
    document.documentElement.classList.toggle('mobile-block-mode', isBlocked);
    document.body.classList.toggle('mobile-block-mode', isBlocked);
    if (isBlocked) {
      var footerCopy = document.querySelector('.footer-copy, .foot-copy');
      if (footerCopy) {
        footerCopy.innerHTML = '2026 <span>mialyk</span> // All rights reserved';
      }
    }
    window.__MIALYK_MOBILE_BLOCK__ = isBlocked;
  }

  if (document.body) {
    applyMobileBlock();
  } else {
    document.addEventListener('DOMContentLoaded', applyMobileBlock, { once: true });
  }

  window.addEventListener('resize', applyMobileBlock);
})();
