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
  let ctaVisiblePc = false; // CTAセクションが見えているか

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

// ============================================================
// モーダル（ポップアップフォーム）制御
// ============================================================

// ▼▼▼ GASのWebアプリURLをここに貼り付けてください ▼▼▼
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzQ3Z3401zVdpH5bLiynbpq-J6Fz49syTChj27rTcjO7giDy3ElF22xBmT1cqYiMko/exec';
// ▲▲▲ ここまで変更してください ▲▲▲


// ---- DOM要素の取得 ----
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const formSubmitBtn = document.getElementById('formSubmitBtn');
const formSuccess = document.getElementById('formSuccess');
const formErrorMsg = document.getElementById('formErrorMsg');


// ---- モーダルを開く ----
function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // デフォルトで「定期コース」カードを選択済み表示にする
  updatePlanCard();

  setTimeout(() => {
    const firstInput = contactForm.querySelector('input, textarea');
    if (firstInput) firstInput.focus();
  }, 350);
}


// ---- モーダルを閉じる ----
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}


// ---- コース選択カードの選択状態を切り替える ----
// ラジオボタンが変わるたびに呼ばれる（HTML側のonchangeから呼び出し）
function updatePlanCard() {
  // すべてのカードラベルから .selected クラスを外す
  document.querySelectorAll('.form-plan-card').forEach(card => {
    card.classList.remove('selected');
  });

  // チェックされているラジオボタンの親ラベルに .selected を付ける
  const checkedRadio = document.querySelector('.form-plan-radio:checked');
  if (checkedRadio) {
    checkedRadio.closest('.form-plan-card').classList.add('selected');
  }
}


// ---- 閉じるボタン（×）クリックで閉じる ----
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}


// ---- オーバーレイ（背景の暗い部分）クリックで閉じる ----
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}


// ---- Escキーで閉じる ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
    closeModal();
  }
});


// ============================================================
// バリデーション（入力チェック）機能
// ============================================================

// ---- エラーメッセージを表示する関数 ----
// id：入力欄のid、msg：エラー文言（空文字でエラー解除）
function showError(id, msg) {
  const input = document.getElementById(id);
  if (!input) return;

  // 既存のエラー表示を探す（input の次の兄弟要素）
  let errorEl = input.nextElementSibling;

  // エラー表示用の<span>がなければ作る
  if (!errorEl || !errorEl.classList.contains('input-error')) {
    errorEl = document.createElement('span');
    errorEl.classList.add('input-error');
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  }

  if (msg) {
    // エラーあり：赤枠＋メッセージ表示
    input.classList.add('input-invalid');
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  } else {
    // エラーなし：リセット
    input.classList.remove('input-invalid');
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

// ---- 各フィールドのバリデーションルール ----
// 戻り値：エラーメッセージ文字列（問題なければ空文字）
const validators = {

  // お名前：未入力チェック
  formName: (v) => v ? '' : 'お名前を入力してください',

  // フリガナ：カタカナ・スペースのみ許可
  // /^[ァ-ヶー\s　]+$/ ← カタカナと全角・半角スペースのみOK
  formKana: (v) => {
    if (!v) return 'フリガナを入力してください';
    if (!/^[ァ-ヶー\s　]+$/.test(v)) return 'カタカナで入力してください';
    return '';
  },

  // メールアドレス：形式チェック
  // /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ← 「文字@文字.文字」の形式
  formEmail: (v) => {
    if (!v) return 'メールアドレスを入力してください';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return '正しいメールアドレスを入力してください';
    return '';
  },

  // 電話番号：数字とハイフンのみ・10〜13桁
  formPhone: (v) => {
    if (!v) return '電話番号を入力してください';
    // ハイフンを除いた数字が10〜11桁かチェック
    const digits = v.replace(/-/g, '');
    if (!/^\d{10,11}$/.test(digits)) return '正しい電話番号を入力してください（例：090-0000-0000）';
    return '';
  },

  // 郵便番号：000-0000 または 0000000 形式
  formZip: (v) => {
    if (!v) return '郵便番号を入力してください';
    if (!/^\d{3}-?\d{4}$/.test(v)) return '正しい郵便番号を入力してください（例：123-4567）';
    return '';
  },

  // 住所：未入力チェック
  formAddress: (v) => v ? '' : '住所を入力してください',
};

// ---- 入力欄からフォーカスが外れたときにリアルタイムチェック ----
// 'blur'イベント：入力欄から離れたときに発火
if (contactForm) {
  Object.keys(validators).forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    // フォーカスが外れたときにチェック
    input.addEventListener('blur', () => {
      const msg = validators[id](input.value.trim());
      showError(id, msg);
    });

    // 入力中にエラーが出ていたらリアルタイムで解除
    input.addEventListener('input', () => {
      const msg = validators[id](input.value.trim());
      showError(id, msg);
    });
  });
}

// ---- 全フィールドをまとめてチェックする関数 ----
// 戻り値：エラーがあれば false、全部OKなら true
function validateAll() {
  let isValid = true;

  // テキスト入力欄のチェック
  Object.keys(validators).forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    const msg = validators[id](input.value.trim());
    showError(id, msg);
    if (msg) isValid = false;
  });

  // 同意チェックボックスのチェック
  const agreeEl = document.getElementById('formAgree');
  const agreeError = document.getElementById('agreeError');
  if (agreeEl && !agreeEl.checked) {
    if (agreeError) agreeError.style.display = 'block';
    isValid = false;
  } else {
    if (agreeError) agreeError.style.display = 'none';
  }

  return isValid;
}


// ---- フォーム送信処理（購入フォーム版） ----
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ---- バリデーション実行（全項目チェック） ----
    if (!validateAll()) {
      // エラーがある場合：最初のエラー欄までスクロール
      const firstError = contactForm.querySelector('.input-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return; // 送信を止める
    }

    // ---- 入力値を取得 ----
    const plan = document.querySelector('.form-plan-radio:checked')?.value || '';
    const name = document.getElementById('formName').value.trim();
    const kana = document.getElementById('formKana').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const zip = document.getElementById('formZip').value.trim();
    const address = document.getElementById('formAddress').value.trim();
    const address2 = document.getElementById('formAddress2').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked')?.value || '';
    const note = document.getElementById('formNote').value.trim();
    const agree = document.getElementById('formAgree').checked ? '同意済み' : '';

    // 送信中状態にする
    formSubmitBtn.classList.add('sending');
    formErrorMsg.classList.remove('visible');

    // ---- GASにデータを送信 ----
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan, name, kana, email, phone,
          zip, address, address2, payment, note, agree
        })
      });

      showSuccess();

    } catch (error) {
      console.error('送信エラー:', error);
      formErrorMsg.classList.add('visible');
      formSubmitBtn.classList.remove('sending');
    }
  });
}


// ---- 送信成功後の表示切り替え ----
function showSuccess() {
  contactForm.style.display = 'none';
  formSuccess.classList.add('visible');
  contactForm.reset();
  formSubmitBtn.classList.remove('sending');
}
