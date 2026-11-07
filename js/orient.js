/**
 * Dada Milktea - Orientation Guard Module
 * Quản lý hướng hiển thị & cảnh báo góc xoay màn hình cho Mobile/Tablet
 */

let orientOverlay = null;

/**
 * Lấy kích thước và toạ độ phần tử chuẩn xác
 * @param {HTMLElement} el
 * @returns {DOMRect}
 */
export function rect(el) {
  if (!el) return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0 };
  const r = el.getBoundingClientRect();
  return {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    right: r.right,
    bottom: r.bottom,
    x: r.x !== undefined ? r.x : r.left,
    y: r.y !== undefined ? r.y : r.top
  };
}

export const vw = () => window.innerWidth;
export const vh = () => window.innerHeight;

/**
 * Kiểm tra thiết bị có đang ở chế độ xoay ngang trên điện thoại di động
 * (màn hình hẹp xoay ngang gây hỏng bố cục 9:16 dọc)
 */
function isMobileLandscape() {
  const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const isLandscape = window.innerWidth > window.innerHeight;
  // Thiết bị di động có chiều cao khi nằm ngang nhỏ hơn 560px hoặc cảm ứng điện thoại
  return isLandscape && (window.innerHeight <= 560 || (isTouch && window.innerWidth < 960));
}

/**
 * Hiển thị hoặc ẩn màn hình nhắc nhở xoay dọc màn hình
 */
function updateOrientationGuard() {
  const needsGuard = isMobileLandscape();
  
  if (needsGuard) {
    if (!orientOverlay) {
      orientOverlay = document.createElement('div');
      orientOverlay.id = 'orient-guard';
      orientOverlay.className = 'orient-guard';
      orientOverlay.setAttribute('role', 'alertdialog');
      orientOverlay.setAttribute('aria-modal', 'true');
      orientOverlay.innerHTML = `
        <div class="orient-box">
          <div class="orient-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <rect x="12" y="4" width="24" height="40" rx="4" fill="#3E2A22" stroke="#F2B03D"/>
              <line x1="20" y1="8" x2="28" y2="8" stroke="#FFE08A" stroke-width="2"/>
              <circle cx="24" cy="38" r="2" fill="#FFE08A"/>
              <path d="M4 24 C4 14 10 8 16 6" stroke="#FFE08A" stroke-dasharray="3 3"/>
              <polyline points="12 4 16 6 14 10" fill="#FFE08A"/>
            </svg>
          </div>
          <h3>Vui lòng xoay dọc màn hình</h3>
          <p>để trải nghiệm Tiệm Trà Sữa DADA tốt nhất</p>
        </div>
      `;
      document.body.appendChild(orientOverlay);
    }
  } else if (orientOverlay) {
    orientOverlay.remove();
    orientOverlay = null;
  }
}

/**
 * Khởi tạo trình giám sát góc xoay màn hình
 */
export function initOrient() {
  // Thử khóa hướng xoay dọc qua Screen Orientation API nếu trình duyệt hỗ trợ
  try {
    if (window.screen && screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('portrait').catch(() => {
        // Một số trình duyệt chặn lock() nếu chưa fullscreen, bỏ qua an toàn
      });
    }
  } catch (e) {}

  updateOrientationGuard();

  window.addEventListener('resize', updateOrientationGuard, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(updateOrientationGuard, 100);
  }, { passive: true });

  if (window.screen && screen.orientation) {
    screen.orientation.addEventListener('change', updateOrientationGuard, { passive: true });
  }
}
