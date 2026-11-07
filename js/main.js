import { initErrors } from './errors.js';
import { register, go, $ } from './ui/shell.js';
import * as authUI from './ui/auth.js';
import * as splashUI from './ui/splash.js';
import * as prepUI from './ui/prep.js';
import * as sellUI from './ui/sell.js';
import * as reportUI from './ui/report.js';
import * as tourUI from './ui/tour.js';
import * as journeyUI from './ui/journey.js';
import { save } from './state.js';
import { unlock, musicStart, musicStop } from './audio.js';
import { initNative } from './native.js';
import { cloudSync } from './cloud.js';
import { initOrient } from './orient.js';

// Đăng ký các màn hình giao diện chính của game
register('auth', authUI);
register('splash', splashUI);
register('prep', prepUI);
register('sell', sellUI);
register('report', reportUI);
register('tour', tourUI);
register('journey', journeyUI);
register('jrdone', journeyUI.done);

// Khởi tạo các phân hệ lỗi, định hướng màn hình và môi trường native
initErrors();
initOrient();
initNative();

// Điều hướng tới màn hình khởi động
go('auth');

// Mở khóa Web Audio context sau cử chỉ tương tác đầu tiên của người dùng
const firstTouch = () => {
  unlock();
  document.removeEventListener('pointerdown', firstTouch);
  document.removeEventListener('touchstart', firstTouch);
  document.removeEventListener('click', firstTouch);
};
document.addEventListener('pointerdown', firstTouch, { passive: true });
document.addEventListener('touchstart', firstTouch, { passive: true });
document.addEventListener('click', firstTouch, { passive: true });

// Xử lý vòng đời: Tự động lưu LocalStorage và tạm dừng nhạc khi ẩn tab/ứng dụng
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    save();
    cloudSync();
    musicStop();
  } else {
    unlock();
    musicStart();
  }
});

// Đảm bảo dữ liệu luôn được lưu vào LocalStorage khi đóng trang
window.addEventListener('pagehide', save);

// Xử lý lớp CSS khi cuộn màn hình xem chính
const viewEl = $('view');
let scrollTimer = 0;
viewEl.addEventListener('scroll', () => {
  if (!scrollTimer) {
    viewEl.classList.add('scrolling');
  }
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    viewEl.classList.remove('scrolling');
    scrollTimer = 0;
  }, 140);
}, { passive: true });
