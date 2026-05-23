// ============================================
// ローディングアニメーション制御
// ページ読み込み後、2.5秒でフェードアウト
// ============================================
window.addEventListener('load', () => {
  // 【変更1】待機時間を 2800ms → 1200ms に短縮（直帰率改善）
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 1200);
});

// ============================================
// スクロールでナビゲーションスタイル変更
// 少しスクロールしたら背景を白に
// ============================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ============================================
// スクロールアニメーション
// Intersection Observer API：要素が画面に入ったらアニメーション発火
// ============================================
const observerOptions = {
  threshold: 0.15,      // 要素の15%が見えたら発火
  rootMargin: '0px 0px -50px 0px'  // 少し手前から発火
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// アニメーション対象を全て監視
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  observer.observe(el);
});

// ============================================
// FAQ アコーディオン
// ============================================
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ============================================
// スマホ固定CTAバーの表示制御
// FVのボタンが消えたら表示、CTAセクション到達で非表示
// ============================================
const stickyCta = document.getElementById('stickyCta');
const fvBtn = document.querySelector('.fv-btn');
const ctaSection = document.getElementById('cta');

if (stickyCta && fvBtn && ctaSection) {
  let fvBtnVisible = true;
  let ctaVisible = false;

  function updateStickyVisibility() {
    if (!fvBtnVisible && !ctaVisible) {
      stickyCta.classList.remove('hidden');
    } else {
      stickyCta.classList.add('hidden');
    }
  }

  stickyCta.classList.add('hidden');

  const fvObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      fvBtnVisible = entry.isIntersecting;
      updateStickyVisibility();
    });
  }, { threshold: 0 });

  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      ctaVisible = entry.isIntersecting;
      updateStickyVisibility();
    });
  }, { threshold: 0.1 });

  fvObserver.observe(fvBtn);
  ctaObserver.observe(ctaSection);
}
