// ============================================================
// LUMEA SHIFT LP - 購入フォーム処理
// Google Apps Script（GAS）で動かすファイルです
//
// 【このスクリプトができること】
//  1. 購入データをスプレッドシートに記録
//  2. 管理者（あなた）にメールで通知
//  3. お客様に自動返信メールを送信
// ============================================================

// ============================================================
// ▼▼▼ ここを必ず自分の情報に書き換えてください ▼▼▼
// ============================================================

// 管理者（あなた）のメールアドレス
const ADMIN_EMAIL = 'your-email@example.com';

// 管理者通知メールの件名
const ADMIN_SUBJECT_PREFIX = '【LUMEA SHIFT】新規ご注文が届きました';

// お客様への自動返信メール件名
const REPLY_SUBJECT = '【LUMEA SHIFT】ご注文を受け付けました';

// ============================================================
// ▲▲▲ ここまで書き換えてください ▲▲▲
// ============================================================


// ============================================================
// doPost：POSTリクエストを受け取るメインの関数
// ============================================================
function doPost(e) {
  try {

    // ----- 1. 送信データを取り出す -----
    const params   = JSON.parse(e.postData.contents);

    const plan     = params.plan     || '';  // コース選択
    const name     = params.name     || '';  // お名前
    const kana     = params.kana     || '';  // フリガナ
    const email    = params.email    || '';  // メールアドレス
    const phone    = params.phone    || '';  // 電話番号
    const zip      = params.zip      || '';  // 郵便番号
    const address  = params.address  || '';  // 住所
    const address2 = params.address2 || '';  // マンション名など
    const payment  = params.payment  || '';  // 支払い方法
    const note     = params.note     || '';  // 備考
    const agree    = params.agree    || '';  // 同意

    // 受信日時（日本時間）
    const now       = new Date();
    const timestamp = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');


    // ----- 2. スプレッドシートに記録する -----
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // ヘッダー行がなければ自動生成
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '受注日時', 'コース', 'お名前', 'フリガナ',
        'メールアドレス', '電話番号', '郵便番号', '住所', 'マンション名等',
        '支払い方法', '備考', '同意', '対応状況'
      ]);
      // ヘッダー行を太字・背景色で見やすくする
      const headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#D4BFA3');
    }

    // データ行を追記
    sheet.appendRow([
      timestamp, plan, name, kana,
      email, phone, zip, address, address2,
      payment, note, agree, '未対応'   // 最後に「対応状況」列を追加
    ]);


    // ----- 3. 管理者に通知メールを送る -----
    const adminBody = `
LUMEA SHIFT LPより新規ご注文が届きました。

■ 受注日時　：${timestamp}
■ コース　　：${plan}
■ お名前　　：${name}（${kana}）様
■ メール　　：${email}
■ 電話番号　：${phone}
■ 郵便番号　：${zip}
■ 住所　　　：${address} ${address2}
■ 支払い方法：${payment}
■ 備考　　　：${note || 'なし'}

----
スプレッドシートで確認：
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

このメールはLPの購入フォームから自動送信されています。
`;

    MailApp.sendEmail({
      to:      ADMIN_EMAIL,
      subject: ADMIN_SUBJECT_PREFIX,
      body:    adminBody
    });


    // ----- 4. お客様に自動返信メールを送る -----
    const replyBody = `
${name} 様

この度はLUMEA SHIFTをご注文いただき、誠にありがとうございます。
以下の内容でご注文を受け付けました。

━━━━━━━━━━━━━━━━━━━━
  ご注文内容
━━━━━━━━━━━━━━━━━━━━
■ コース　　：${plan}
■ お名前　　：${name}（${kana}）様
■ 電話番号　：${phone}
■ お届け先　：〒${zip} ${address} ${address2}
■ 支払い方法：${payment}
■ 備考　　　：${note || 'なし'}
━━━━━━━━━━━━━━━━━━━━

ご注文の確認後、2〜3営業日以内に発送いたします。
発送時に改めてご連絡いたします。

ご不明な点がございましたら、下記までお問い合わせください。

----
LUMEA BEAUTY株式会社
LUMEA SHIFT サポートチーム
https://lumea-shift.jp/
（このメールは自動送信です。返信はお受けできません）
`;

    MailApp.sendEmail({
      to:      email,
      subject: REPLY_SUBJECT,
      body:    replyBody
    });


    // ----- 5. 成功レスポンスを返す -----
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ============================================================
// doGet：ブラウザで直接URLを開いたときの対処
// ============================================================
function doGet(e) {
  return ContentService
    .createTextOutput('このURLはフォーム送信専用です。')
    .setMimeType(ContentService.MimeType.TEXT);
}
