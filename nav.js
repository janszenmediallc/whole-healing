/* Whole Healing — lightweight responsive nav behavior.
   Wraps the existing toggle + menu in a drawer and adds a hamburger button.
   No dependencies. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var toggle = nav.querySelector('.nav-toggle');
    var menu = nav.querySelector('.nav-menu');
    if (!toggle && !menu) return;

    // Build the drawer wrapper once, place it after the brand/hamburger area.
    var drawer = document.createElement('div');
    drawer.className = 'nav-drawer';

    // Place drawer where the toggle currently sits, then move toggle & menu into it.
    var firstMovable = toggle || menu;
    firstMovable.parentNode.insertBefore(drawer, firstMovable);
    if (toggle) drawer.appendChild(toggle);
    if (menu) drawer.appendChild(menu);

    // Hamburger button (hidden on desktop via CSS).
    var hamburger = document.createElement('button');
    hamburger.type = 'button';
    hamburger.className = 'nav-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(hamburger);

    var SESSION_KEY = 'wh_mobile_menu_open';
    var TOGGLE_KEY = 'wh_toggle_side';

    var HUB_MENUS = {
      fi: {
        color: 'gold',
        items: [
          { href: 'foundation.html', label: 'Foundation' },
          { href: 'institute.html', label: 'Institute' }
        ]
      },
      lw: {
        color: 'navy',
        items: [
          { href: 'wellness.html', label: 'Wellness' },
          { href: 'fluidfit.html', label: 'FluidFIT\u00AE' },
          { href: 'perfor-lab.html', label: 'PerformanceLAB\u00AE' },
          { href: 'lymph-lab.html', label: 'LymphLAB\u00AE' }
        ]
      }
    };

    // Persist which hub the user is on (fi / lw). Restore it on shared pages (team/contact)
    // so the toggle remains visually selected instead of collapsing to neutral,
    // and rebuild the associated hub menu items ahead of Team/Contact.
    try {
      if (toggle) {
        if (toggle.classList.contains('fi')) {
          sessionStorage.setItem(TOGGLE_KEY, 'fi');
        } else if (toggle.classList.contains('lw')) {
          sessionStorage.setItem(TOGGLE_KEY, 'lw');
        } else if (toggle.classList.contains('neutral')) {
          var saved = sessionStorage.getItem(TOGGLE_KEY);
          if (saved === 'fi' || saved === 'lw') {
            toggle.classList.remove('neutral');
            toggle.classList.add(saved);
            var toggleLinks = toggle.querySelectorAll('a');
            if (toggleLinks.length >= 2) {
              toggleLinks[saved === 'fi' ? 0 : 1].classList.add('active');
            }
            if (menu && !menu.classList.contains('gold') && !menu.classList.contains('navy')) {
              var hub = HUB_MENUS[saved];
              menu.classList.add(hub.color);
              hub.items.slice().reverse().forEach(function (item) {
                var a = document.createElement('a');
                a.href = item.href;
                a.textContent = item.label;
                menu.insertBefore(a, menu.firstChild);
              });
            }
          }
        }
      }
    } catch (err) {}

    function setOpen(open) {
      nav.classList.toggle('nav-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', function () {
      setOpen(!nav.classList.contains('nav-open'));
    });

    // Close the drawer when a menu link is clicked — but NOT when the toggle is clicked.
    // Toggle clicks navigate to the other hub and should leave the drawer open on arrival.
    if (menu) {
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
      });
    }
    if (toggle) {
      toggle.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          // Persist "drawer open" across the navigation triggered by the toggle.
          try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (err) {}
          // Deliberately do NOT call setOpen(false) here.
        });
      });
    }

    // On page load, reopen the drawer if the toggle was just used.
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        sessionStorage.removeItem(SESSION_KEY);
        // Only reopen on mobile viewports.
        if (window.matchMedia('(max-width: 900px)').matches) {
          setOpen(true);
        }
      }
    } catch (err) {}

    // Close on Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) setOpen(false);
    });

    // Reset drawer state if viewport grows back to desktop.
    var mq = window.matchMedia('(min-width: 901px)');
    mq.addEventListener ? mq.addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    }) : mq.addListener(function (e) {
      if (e.matches) setOpen(false);
    });
  });
})();
