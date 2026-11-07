/**
 * Dada Milktea - Core Shell, Navigation & UI System
 * Quản lý router màn hình, header top, footer dock, modal dialog, toast và cài đặt
 */

import { S, xpBar, save, reset, replaceState, inArena } from '../state.js';
import { makeCode, readCode } from '../backup.js';
import { onboard, termsDlg } from './onboard.js';
import { applyAwn } from './street.js';
import { rankDlg } from './rank.js';
import { lbForget, lbReady, lbPush } from '../lb.js';
import { jp } from '../joyup.js';
import { accountDlg } from './account.js';
import { giftOn, giftOff, setGiftOff } from '../gift.js';
import { fmt } from '../data.js';
import { rankOf } from '../progress.js';
import { ICON } from '../art.js';
import { sfx, buzz, toggleMusic, toggleSfx, nextTrack, MUSIC_CREDIT } from '../audio.js';
import { countTo, applyCalm, sysCalm, clearFx } from '../fx.js';

export const $ = (id) => document.getElementById(id);

export function h(htmlStr) {
  const t = document.createElement('template');
  t.innerHTML = htmlStr.trim();
  return t.content.firstElementChild;
}

export function on(container, selector, handler, eventType = 'click') {
  container.querySelectorAll(selector).forEach((el) => {
    el.addEventListener(eventType, (e) => handler(el, e));
  });
}

export function onSend(formEl, callback) {
  formEl.addEventListener('submit', (e) => e.preventDefault());
  formEl.querySelector('.btn')?.addEventListener('click', () => callback());
  formEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing || !e.target.matches('input')) return;
    e.preventDefault();
    callback();
  });
}

let shownMoney = null;

export function renderTop() {
  const xpInfo = xpBar();
  $('top').innerHTML = `
    <span class="pill">
      ${ICON.coin}
      <span id="money">${fmt(shownMoney ?? S.money)}</span>
    </span>
    <span class="pill">
      ${ICON.cup}
      <span>${S.day}</span>
    </span>
    <div id="lvwrap" title="${xpInfo.txt}">
      <b>Cấp ${xpInfo.l} · ${rankOf(xpInfo.l)}</b>
      <div class="xpbar" role="img" aria-label="Kinh nghiệm ${xpInfo.pct}%">
        <i style="width:${xpInfo.pct}%"></i>
      </div>
    </div>
    ${lbReady() ? `<button class="iconbtn" id="btn-lb" aria-label="Bảng xếp hạng">${ICON.book}</button>` : ''}
    <button class="iconbtn" id="btn-opt" aria-label="Cài đặt">${ICON.cog}</button>
  `;

  $('btn-lb')?.addEventListener('click', rankDlg);
  $('btn-opt')?.addEventListener('click', settings);
  updMoney();
}

export function updMoney() {
  const moneyEl = $('money');
  if (!moneyEl) return;
  const startVal = shownMoney ?? S.money;
  shownMoney = S.money;
  countTo(moneyEl, startVal, S.money, fmt);
}

const screens = {};

export function register(name, module) {
  screens[name] = module;
}

export let current = '';
let leaving = null;

export async function go(screenName, params) {
  if (leaving) {
    leaving();
    leaving = null;
  }
  current = screenName;
  close();
  $('toast').innerHTML = '';
  clearFx();

  const viewEl = $('view');
  viewEl.scrollTop = 0;
  viewEl.innerHTML = '';
  $('bottom').innerHTML = '';
  $('bottom').hidden = true;

  const targetScreen = screens[screenName];
  if (!targetScreen) {
    viewEl.textContent = 'Thiếu màn: ' + screenName;
    return;
  }

  $('top').hidden = targetScreen.chrome === false;
  leaving = targetScreen.render(viewEl, $('bottom'), params) || null;

  if (!$('top').hidden) {
    renderTop();
  }

  viewEl.classList.remove('enter');
  void viewEl.offsetWidth;
  viewEl.classList.add('enter');
}

export function bottom(htmlContent, handlers = {}) {
  const b = $('bottom');
  b.hidden = false;
  b.innerHTML = htmlContent;
  Object.entries(handlers).forEach(([id, fn]) => {
    $(id)?.addEventListener('click', fn);
  });
  return b;
}

export function toast(msg, type = '') {
  const toastBox = $('toast');
  const t = h(`<div class="tst ${type}"></div>`);
  t.textContent = msg;
  toastBox.appendChild(t);

  while (toastBox.children.length > 3) {
    toastBox.firstElementChild.remove();
  }

  setTimeout(() => t.classList.add('out'), 1700);
  setTimeout(() => t.remove(), 2050);
}

export function fly(text, x, y, cls = '') {
  const el = h(`<div class="fly ${cls}">${text}</div>`);
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.transform = 'translateX(-50%)';
  $('app').appendChild(el);
  setTimeout(() => el.remove(), 1050);
}

export function modal(contentHtml, opts = {}) {
  close();
  const m = h(`
    <div id="modal"${opts.dismiss !== false ? ' data-dismiss="1"' : ''}>
      <div class="sheet" id="card">
        ${contentHtml}
      </div>
    </div>
  `);
  $('app').appendChild(m);

  if (opts.dismiss !== false) {
    m.addEventListener('click', (e) => {
      if (e.target === m) close();
    });
  }
  return m;
}

export function close() {
  $('modal')?.remove();
  clearTimeout(lockT);
}

export function ask(bodyHtml, buttons = [['Đóng', null, 1]], opts = {}) {
  const dlg = modal(`
    ${bodyHtml}
    <div class="btns">
      ${buttons
        .map(([txt, , isPri], i) => `<button class="btn wide ${isPri ? 'pri' : 'dim'}" data-i="${i}">${txt}</button>`)
        .join('')}
    </div>
  `, { dismiss: opts.dismiss ?? false });

  on(dlg, '.btns button', (btn) => {
    const [, fn, , keepOpen] = buttons[+btn.dataset.i];
    sfx.tap();
    if (!keepOpen) close();
    if (fn) fn();
  });

  setTimeout(() => dlg.querySelector('.btns .pri')?.focus(), 30);
  return dlg;
}

let lockT = 0;

export function lockCard(ms = 1000) {
  const card = $('#card');
  if (!card) return;
  const btns = [...card.querySelectorAll('.btns button')];
  btns.forEach((b) => (b.disabled = true));
  card.style.setProperty('--lock', ms + 'ms');
  card.classList.add('lock');
  clearTimeout(lockT);
  lockT = setTimeout(() => {
    btns.forEach((b) => (b.disabled = false));
    card.classList.remove('lock');
    card.querySelector('.btns .pri')?.focus();
  }, ms);
}

const FX_OPT = [
  ['auto', 'Theo máy'],
  ['on', 'Bật'],
  ['off', 'Tắt']
];

function settings() {
  if (inArena()) return;
  sfx.tap();
  const reRender = () => settings();
  const dlg = modal('', { dismiss: true });
  const sheet = dlg.querySelector('.sheet');
  sheet.classList.add('opts');

  const sw = (id, checked) =>
    `<button class="sw" id="${id}" role="switch" aria-checked="${!!checked}" aria-label="Bật/tắt"></button>`;

  const optTile = (id, iconName, title, sub = '', cls = '') =>
    `<button class="optt ${cls}" id="${id}">${ICON[iconName]}<span>${title}${sub ? `<small>${sub}</small>` : ''}</span></button>`;

  const renderSheet = () => {
    const scroll = sheet.scrollTop;
    const calmNotice = S.opts?.fx === 'auto' && sysCalm() ? '<small>Máy đang giảm chuyển động nên hiệu ứng tắt</small>' : '';

    sheet.innerHTML = `
      <h2>Cài đặt</h2>
      <div class="hd">Âm thanh & hiển thị</div>
      <div class="optl">
        <div class="optr">
          <span>Nhạc nền</span>
          ${S.opts?.music ? '<button class="btn sm dim" id="o-next">Đổi bài</button>' : ''}
          ${sw('o-music', S.opts?.music)}
        </div>
        <div class="optr">
          <span>Tiếng động</span>
          ${sw('o-sfx', S.opts?.sfx)}
        </div>
        <div class="optr">
          <span>Rung phản hồi</span>
          ${sw('o-hap', S.opts?.haptic)}
        </div>
        <div class="optr wrap">
          <span>Hiệu ứng ${calmNotice}</span>
          <div class="seg" role="group" aria-label="Hiệu ứng">
            ${FX_OPT.map(([val, label]) => `<button data-fx="${val}" aria-pressed="${S.opts?.fx === val}">${label}</button>`).join('')}
          </div>
        </div>
        ${S.lv < 3 ? `
          <div class="optr">
            <span>Gợi ý bước pha<small>Chỉ dẫn từng bước khi pha (cấp 1–2)</small></span>
            ${sw('o-hint', S.opts?.hint)}
          </div>
        ` : ''}
        ${giftOn() ? `
          <div class="optr">
            <span>Nhận quà từ quán khác<small>Quà tốt và trò chọc, kèm tên quán gửi</small></span>
            ${sw('o-gift', !giftOff())}
          </div>
        ` : ''}
      </div>

      <div class="hd">Tiến trình</div>
      <div class="optg">
        ${jp.member ? optTile('o-acc', 'user', esc(jp.user?.name || 'Tài khoản'), 'Mã quán, lưu lên máy chủ', 'full') : (jp.canLogin || jp.user ? optTile('o-acc', 'user', jp.user ? 'Tài khoản khách' : 'Chưa đăng nhập', jp.user ? 'Đăng nhập JoyUp để giữ quán, lên bảng xếp hạng' : 'Tiến độ chỉ lưu trên máy này · Đăng nhập JoyUp', 'full') : '')}
        ${optTile('o-bk', 'save', 'Sao lưu', S.lastBackup ? `Gần nhất: ngày ${S.lastBackup}` : 'Chưa sao lưu')}
        ${optTile('o-rs', 'book', 'Khôi phục', 'Dán mã sao lưu')}
        ${lbReady() ? optTile('o-lb', 'rank', 'Bảng xếp hạng', 'Top quán giàu nhất', 'full') : ''}
      </div>

      <div class="hd">Trợ giúp</div>
      <div class="optg">
        ${optTile('o-how', 'card', 'Cách chơi')}
        ${optTile('o-terms', 'doc', 'Điều khoản')}
      </div>

      <button class="btn wide pri" id="o-close">Đóng</button>
      <button class="optreset" id="o-reset">Chơi lại từ đầu</button>
      <p class="sub credit">Dada Milktea · Tiệm Trà Sữa DADA v2.0<br>${MUSIC_CREDIT}</p>
    `;

    sheet.scrollTop = scroll;

    const bind = (id, fn) => sheet.querySelector('#' + id)?.addEventListener('click', fn);
    const toggleOpt = (fn) => () => {
      fn();
      sfx.tap();
      renderSheet();
    };

    bind('o-music', toggleOpt(toggleMusic));
    bind('o-next', () => {
      sfx.tap();
      nextTrack();
    });
    bind('o-sfx', toggleOpt(toggleSfx));
    bind('o-hap', toggleOpt(() => {
      S.opts.haptic = !S.opts.haptic;
      save();
      buzz(20);
    }));
    bind('o-hint', toggleOpt(() => {
      S.opts.hint = !S.opts.hint;
      save();
    }));

    bind('o-gift', () => {
      sfx.tap();
      const nextOff = !giftOff();
      setGiftOff(nextOff).then(
        () => {
          toast(nextOff ? 'Đã tắt nhận quà, quà đang chờ được bỏ qua' : 'Đã bật nhận quà từ quán khác', 'good');
          if (sheet.isConnected) renderSheet();
        },
        () => toast('Chưa đổi được vì mạng chập chờn, thử lại sau nha', 'bad')
      );
    });

    on(sheet, '[data-fx]', (btn) => {
      sfx.tap();
      S.opts.fx = btn.dataset.fx;
      save();
      applyCalm();
      renderSheet();
    });

    bind('o-acc', () => {
      sfx.tap();
      accountDlg(reRender);
    });
    bind('o-lb', rankDlg);
    bind('o-bk', () => {
      sfx.tap();
      backupDlg();
    });
    bind('o-rs', () => {
      sfx.tap();
      restoreDlg();
    });
    bind('o-how', () => {
      sfx.tap();
      close();
      onboard(false);
    });
    bind('o-terms', () => {
      sfx.tap();
      termsDlg(null, true);
    });
    bind('o-close', () => {
      sfx.tap();
      close();
    });
    bind('o-reset', () => {
      sfx.tap();
      ask(
        `<h2>Chơi lại?</h2><p class="sub" style="text-align:center">Toàn bộ tiến độ tiệm trà sữa sẽ mất và không lấy lại được.</p>`,
        [
          ['Giữ lại', reRender, 1, 1],
          ['<span style="color:var(--bad)">Xoá và chơi lại</span>', () => {
            reset();
            lbForget();
            go('splash');
          }]
        ]
      );
    });
  };

  renderSheet();
  setTimeout(() => sheet.querySelector('#o-close')?.focus({ preventScroll: true }), 30);
}

export function useState(newState, keepUser) {
  replaceState(newState, keepUser);
  lbPush();
  applyCalm();
  applyAwn();
  shownMoney = null;
  go('prep');
}

const esc = (text) =>
  String(text).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));

export async function backupDlg() {
  let code;
  try {
    code = await makeCode();
  } catch (e) {
    toast('Không tạo được mã sao lưu, thử lại nhé', 'bad');
    return;
  }
  S.lastBackup = S.day;
  save();

  const dlg = ask(
    `<h2>Mã sao lưu</h2>
     <p class="sub" style="text-align:center">Chép mã này cất vào Ghi chú hoặc gửi Zalo cho chính mình.<br>
     Lỡ mất tiến trình thì vào Cài đặt, chọn <b>Khôi phục từ mã</b> và dán mã vào.</p>
     <textarea id="code-out" class="codebox" readonly aria-label="Mã sao lưu">${code}</textarea>
     <p class="sub" style="text-align:center;font-size:11.5px">Ngày ${S.day}, két <b>${fmt(S.money)}</b>, cấp <b>${S.lv}</b> · ${code.length} ký tự</p>`,
    [
      ['Chép mã', () => copyCode(code), 1, 1],
      ['Xong', null]
    ],
    { dismiss: true }
  );

  dlg.querySelector('#code-out')?.addEventListener('focus', (e) => e.target.select());
}

function copyCode(codeStr) {
  const box = $('#code-out');
  const fallback = () => {
    if (box) {
      box.focus();
      box.select();
      try {
        box.setSelectionRange(0, box.value.length);
      } catch (e) {}
    }
    toast('Mã đã được bôi đen, bấm giữ rồi chọn Sao chép');
  };

  try {
    navigator.clipboard.writeText(codeStr).then(
      () => {
        sfx.good?.() || sfx.tap();
        toast('Đã chép mã sao lưu', 'good');
      },
      fallback
    );
  } catch (e) {
    fallback();
  }
}

export function restoreDlg() {
  const dlg = ask(
    `<h2>Khôi phục tiến trình</h2>
     <p class="sub" style="text-align:center">Dán mã sao lưu bắt đầu bằng TRASUA2 vào ô dưới.</p>
     <textarea id="code-in" class="codebox" aria-label="Dán mã sao lưu" placeholder="TRASUA2.z..."></textarea>
     <p id="code-err" class="sub" style="color:var(--bad);text-align:center;min-height:1.2em;margin:4px 0 0"></p>`,
    [
      ['Khôi phục', async () => {
        const errEl = $('#code-err');
        errEl.textContent = '';
        let st;
        try {
          st = await readCode($('#code-in').value);
        } catch (err) {
          errEl.textContent =
            err.message === 'nodecomp'
              ? 'Máy này chưa đọc được mã nén. Thử cập nhật trình duyệt hoặc app.'
              : err.message === 'checksum'
              ? 'Mã bị thiếu hoặc sai vài ký tự. Chép lại đầy đủ nhé.'
              : 'Mã không đúng. Mã sao lưu phải bắt đầu bằng TRASUA2.';
          sfx.nope();
          return;
        }

        ask(
          `<h2>Dùng bản sao lưu này?</h2>
           <p class="sub" style="text-align:center">Bản sao lưu: <b>ngày ${st.day}</b>, két <b>${fmt(st.money)}</b>, cấp <b>${st.lv}</b>.<br>
           Tiến trình hiện tại (ngày ${S.day}, két <b>${fmt(S.money)}</b>) sẽ bị thay thế.</p>`,
          [
            ['Huỷ', null],
            ['Khôi phục', () => {
              useState(st);
              toast('Đã khôi phục tiến trình', 'good');
            }, 1]
          ]
        );
      }, 1, 1],
      ['Huỷ', null]
    ],
    { dismiss: true }
  );

  setTimeout(() => dlg.querySelector('#code-in')?.focus(), 50);
}
