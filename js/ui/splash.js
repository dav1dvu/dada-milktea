/**
 * Dada Milktea - Splash & Start Game Screen
 * Màn hình trang chủ, chọn Chơi tiếp / Bắt đầu ván mới và hướng dẫn chơi
 */

import { hasSave, begin, reset, storeOk } from '../state.js';
import { mascot } from '../art.js';
import { lbForget } from '../lb.js';
import { jp } from '../joyup.js';
import { cloudAskDlg, guestDlg } from './account.js';
import { go, modal, close, ask, toast } from './shell.js';
import { termsOk, termsDlg, onboarded, onboard } from './onboard.js';
import { sfx, musicStart, setMood } from '../audio.js';

export const chrome = false;

const IN_APP = /Zalo|FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|Line\/|musical_ly|Bytedance|TikTok|MicroMessenger|Snapchat/i;
const inApp = () => !window.Capacitor?.isNativePlatform?.() && IN_APP.test(navigator.userAgent);
const isAndroid = () => /Android/i.test(navigator.userAgent);

function storeWarn() {
  if (!storeOk()) {
    return `<div class="swarn"><b>Trình duyệt đang chặn lưu dữ liệu</b><br>Tắt chế độ ẩn danh hoặc mở bằng Chrome / Safari để lưu tiệm trà sữa.</div>`;
  }
  if (!inApp()) return '';
  return `<div class="swarn"><b>Đang mở trong trình duyệt của app khác</b><br>Tiến trình có thể mất khi đóng app. ${
    isAndroid() ? 'Hãy mở bằng Chrome.' : 'Bấm ⋯ ở góc rồi chọn <i>Mở bằng Safari</i>.'
  }<button class="btn sm" id="s-chrome" style="margin-top:6px">${isAndroid() ? 'Mở bằng Chrome' : 'Chép link'}</button></div>`;
}

function openOutside() {
  const href = location.href;
  if (isAndroid()) {
    location.href = 'intent://' + href.replace(/^https?:\/\//, '') + '#Intent;scheme=' + location.protocol.slice(0, -1) + ';package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(href) + ';end';
    return;
  }
  navigator.clipboard?.writeText(href).then(
    () => toast('Đã chép link, dán vào Safari nhé', 'good'),
    () => toast(href)
  );
}

function openNaming() {
  const dlg = modal(`
    <h2>Tên quán</h2>
    <p class="sub" style="text-align:center;margin:0 0 10px">Đặt tên cho tiệm của bạn</p>
    <input id="n-name" maxlength="18" placeholder="Tiệm Trà Sữa DADA"
      style="width:100%;padding:11px 14px;border-radius:14px;border:2px solid var(--line);font:inherit;font-size:15px;text-align:center;background:#fff;-webkit-user-select:text;user-select:text">
    <button class="btn wide pri" id="n-ok" style="margin-top:12px">Mở quán</button>
  `, { dismiss: false });

  const inputEl = dlg.querySelector('#n-name');
  setTimeout(() => inputEl?.focus(), 60);

  const submit = () => {
    const raw = (inputEl?.value || '').trim().slice(0, 18);
    const shopName = raw || 'Tiệm Trà Sữa DADA';
    begin(shopName);
    close();
    sfx.day();
    go('prep');
  };

  dlg.querySelector('#n-ok').onclick = submit;
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
}

function startNew() {
  if (!termsOk()) {
    termsDlg(startNew);
    return;
  }
  if (!onboarded()) {
    onboard(true, (name) => {
      begin(name || 'Tiệm Trà Sữa DADA');
      sfx.day();
      go('prep');
    });
    return;
  }
  openNaming();
}

export function render(container) {
  setMood('prep');
  const saved = hasSave();

  container.innerHTML = `
    <div id="splash">
      <img src="./img/dada_logo.svg" alt="Dada Milktea Logo" class="logo" style="width:min(60vw,200px);height:auto;margin-bottom:2px">
      <h1 style="display:none">Dada Milktea</h1>
      <p style="margin-top:6px">Tiệm Trà Sữa DADA · Nhập hàng · Pha đúng đơn · Lên đời quán</p>
      
      ${saved ? '<button class="btn pri" id="s-cont">Chơi tiếp</button>' : ''}
      <button class="btn ${saved ? '' : 'pri'}" id="s-new">${saved ? 'Ván mới' : 'Bắt đầu'}</button>
      <button class="btn dim sm" id="s-help" style="margin-top:6px">Cách chơi</button>
      
      ${storeWarn()}
    </div>
  `;

  container.querySelector('#s-chrome')?.addEventListener('click', openOutside);

  container.querySelector('#s-cont')?.addEventListener('click', () => {
    sfx.tap();
    musicStart();
    if (!termsOk()) termsDlg(() => go('prep'));
    else go('prep');
  });

  container.querySelector('#s-new')?.addEventListener('click', () => {
    sfx.tap();
    musicStart();
    if (!saved) {
      startNew();
      return;
    }
    ask(
      `<h2>Bỏ ván cũ?</h2><p class="sub" style="text-align:center">Tiến độ đang lưu của quán sẽ bị ghi đè.</p>`,
      [
        ['Chơi ván mới', () => {
          reset();
          lbForget();
          startNew();
        }, 1],
        ['Quay lại', null]
      ],
      { dismiss: true }
    );
  });

  container.querySelector('#s-help')?.addEventListener('click', () => {
    sfx.tap();
    onboard(false);
  });
}
