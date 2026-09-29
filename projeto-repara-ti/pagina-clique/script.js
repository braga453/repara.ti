/* ═══════════════════════════════════════
   Repara.TI — script.js
   ═══════════════════════════════════════ */

// Efeito ripple ao clicar no botão
document.getElementById('cta-btn').addEventListener('click', function (e) {
  var btn = this;
  var ripple = document.createElement('span');
  ripple.className = 'ripple';

  var rect = btn.getBoundingClientRect();
  var size = Math.max(rect.width, rect.height);

  ripple.style.cssText =
    'width:'  + size + 'px;' +
    'height:' + size + 'px;' +
    'left:'   + (e.clientX - rect.left - size / 2) + 'px;' +
    'top:'    + (e.clientY - rect.top  - size / 2) + 'px;';

  btn.appendChild(ripple);
  setTimeout(function () { ripple.remove(); }, 700);
});
