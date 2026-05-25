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
// → SP用ブラッシュアップによりナビゲーション削除のため不要
// ============================================

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
// 成分セクション：全成分アコーディオン
// ボタンクリックで展開・閉じる
// ============================================
function toggleIngredients(btn) {
  // ボタンの親要素（.ingredients-all）にopenクラスを付け外し
  const wrapper = btn.closest('.ingredients-all');
  wrapper.classList.toggle('open');
}

// ============================================
// スマホ固定CTAバーの表示制御
// FVのボタンが消えたら表示、CTAセクション到達で非表示
// ============================================
const stickyCta  = document.getElementById('stickyCta');
const fvBtn      = document.querySelector('.fv-btn');
const ctaSection = document.getElementById('cta');

if (stickyCta && fvBtn && ctaSection) {
  let fvBtnVisible  = true;
  let ctaVisible    = false;

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

// ============================================
// PC固定CTAバーの表示制御
// SP版と同じロジック：
//   ・FVのボタンが画面から消えたら表示
//   ・CTAセクションが見えたら非表示
// ============================================
const stickyCtaPc = document.getElementById('stickyCtaPc');

// SP版と同じ fvBtn・ctaSection を再利用
if (stickyCtaPc && fvBtn && ctaSection) {
  let fvBtnVisiblePc = true; // FVボタンが見えているか
  let ctaVisiblePc   = false; // CTAセクションが見えているか

  // 表示・非表示を切り替える関数
  function updateStickyPcVisibility() {
    if (!fvBtnVisiblePc && !ctaVisiblePc) {
      // FVボタンが消えて、かつCTAセクションがまだ見えていない → 表示
      stickyCtaPc.classList.remove('hidden');
    } else {
      // それ以外 → 非表示
      stickyCtaPc.classList.add('hidden');
    }
  }

  // 初期状態は非表示
  stickyCtaPc.classList.add('hidden');

  // FVボタンの監視（SP版とは別のObserverインスタンスを使う）
  const fvObserverPc = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      fvBtnVisiblePc = entry.isIntersecting;
      updateStickyPcVisibility();
    });
  }, { threshold: 0 });

  // CTAセクションの監視
  const ctaObserverPc = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      ctaVisiblePc = entry.isIntersecting;
      updateStickyPcVisibility();
    });
  }, { threshold: 0.1 });

  fvObserverPc.observe(fvBtn);
  ctaObserverPc.observe(ctaSection);
}
