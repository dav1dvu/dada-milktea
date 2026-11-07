/**
 * Dada Milktea - Authentication & Initial Boot Screen
 * Khởi tạo dữ liệu người chơi, nạp dữ liệu LocalStorage và chào đón vào Tiệm Trà Sữa DADA
 */

import { load, setSaveUser, adoptSave, replaceState, carrySave } from '../state.js';
import { jp } from '../joyup.js';
import { cloudBoot, cloudHad, cloudPush, takeCarry, pullErr, errText } from '../cloud.js';
import { lbPush, flush } from '../lb.js';
import { cleanOld } from '../clean.js';
import { touchShop } from '../gift.js';
import { mascot } from '../art.js';
import { applyCalm } from '../fx.js';
import { applyAwn } from './street.js';
import { go, toast } from './shell.js';

export const chrome = false;

function oldUid() {
  for (const store of [() => sessionStorage, () => localStorage]) {
    try {
      const data = JSON.parse(store().getItem('tiemTraSua_auth'));
      if (data?.uid) return String(data.uid);
    } catch (e) {}
  }
  return '';
}

function carry() {
  if (!jp.member || cloudHad() === null) return false;
  if (!takeCarry() || cloudHad() || !carrySave()) return false;
  load();
  applyCalm();
  applyAwn();
  cloudPush(true).catch(() => {});
  return true;
}

let booted = false;

export function render(container) {
  container.innerHTML = `
    <div id="splash">
      ${mascot('happy', 'splashM')}
      <h1>Dada Milktea</h1>
      <p>Đang mở cửa tiệm trà sữa DADA…</p>
    </div>
  `;
  if (booted) {
    go('splash');
    return;
  }
  booted = true;
  boot();
}

async function boot() {
  const user = await jp.init();
  setSaveUser(user ? user.playerCode : '');
  const needAuth = !user && jp.wantSdk && !jp.anon;
  const adopted = needAuth ? false : adoptSave(oldUid(), user ? !user.guest : !jp.canLogin);
  load();
  applyCalm();
  applyAwn();
  
  const remote = user ? await cloudBoot() : null;
  if (remote) {
    replaceState(remote.s, true);
    applyCalm();
    applyAwn();
  }
  
  const carried = carry();
  if (remote || adopted || carried) {
    lbPush();
  }
  
  go('splash');
  if (carried) {
    toast('Đã lưu dữ liệu vào tài khoản máy', 'good');
  } else if (remote) {
    toast('Đã đồng bộ tiến trình quán Dada Milktea', 'good');
  } else if (pullErr()) {
    toast(errText(pullErr()), 'bad');
  }
  
  setTimeout(flush, 1500);
  setTimeout(touchShop, 4000);
  setTimeout(() => cleanOld().catch(() => {}), 8000);
}
