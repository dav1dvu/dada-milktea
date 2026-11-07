/**
 * Dada Milktea - Daily Business Report Screen
 * Báo cáo tài chính cuối ngày, tổng kết doanh thu, chi phí, XP và sự kiện tiếp theo
 */

import { fmt, EVS } from '../data.js';
import { S, closeDay, save, minOpenCost, loanLeft, loanAmt, xpBar } from '../state.js';
import { rankOf } from '../progress.js';
import { rvWaiting } from '../reviews.js';
import { mascot, ICON } from '../art.js';
import { go, bottom } from './shell.js';
import { sfx, setMood } from '../audio.js';
import { confetti } from '../fx.js';
import { billHTML, brokeCard, loanOffer } from './prep.js';
import { evText } from '../economy.js';
import { lbPush, lbOn } from '../lb.js';
import { cloudSync } from '../cloud.js';
import { rankDlg } from './rank.js';
import { crewReportHTML, bindCrewReport } from './crew.js';

const sgn = (val) => (val < 0 ? '−' : '+') + fmt(Math.abs(val));

const esc = (text) =>
  String(text).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));

const lrow = (label, val, cls = '') =>
  `<div class="ledger ${cls}"><span>${label}</span>${val}</div>`;

export function render(container, shell, dayStats) {
  setMood('prep');

  dayStats = {
    served: 0,
    perfect: 0,
    lost: 0,
    gross: 0,
    tip: 0,
    xp: 0,
    stars: [],
    waste: 0,
    wasteV: 0,
    priceLost: 0,
    ...dayStats
  };

  const report = closeDay(dayStats);
  lbPush();
  cloudSync();

  const netProfit = report.rev - report.cost;
  const isBroke = report.broke || report.stuck;
  const avgStarStr = report.avg ? report.avg.toFixed(1).replace('.', ',') : '–';
  const totalLost = dayStats.lost + dayStats.priceLost;
  const xpInfo = xpBar();
  const goalsTotal = S.goals.length;
  const goalsDone = S.goals.filter((g) => g.done).length;

  const brokeMsg = report.broke
    ? 'Két âm tiền sau khi trả mặt bằng và điện nước.'
    : `Két chỉ còn ${fmt(S.money)}, không đủ ${fmt(minOpenCost())} để nhập ly và nguyên liệu cho ngày mai.`;

  container.innerHTML = `
    <div class="card" style="text-align:center">
      <div class="rpmasc">
        ${mascot(isBroke || (netProfit < 0 && !dayStats.rest) ? 'sad' : 'happy')}
      </div>
      <h3 style="margin:0;font-size:20px;color:var(--brown)">
        ${isBroke ? (loanLeft() ? 'Két cạn rồi!' : 'Phá sản rồi') : (dayStats.rest ? 'Nghỉ Tết · ngày ' : 'Hết ngày ') + report.day}
      </h3>
      <div class="sub">${esc(S.name || 'Dada Milktea')}</div>
      <div class="sub">
        Bán ${dayStats.served} ly · trung bình <i class="star">★</i>${avgStarStr}
        ${totalLost ? `<br><b class="neg">${totalLost}</b> khách bỏ về` : ''}
      </div>
      <div class="lvline">
        <b>Cấp ${xpInfo.l} · ${rankOf(xpInfo.l)}</b>
        <span class="xpbar"><i style="width:${xpInfo.pct}%"></i></span>
        <small>+${dayStats.xp} XP hôm nay · ${xpInfo.txt} ${goalsTotal ? `· ${goalsDone}/${goalsTotal} nhiệm vụ` : ''}</small>
      </div>
    </div>

    <div class="card">
      <div class="kpis">
        <div><b>${dayStats.served}</b><small>ly bán được</small></div>
        <div><b class="${totalLost ? 'neg' : ''}">${totalLost}</b><small>khách bỏ về</small></div>
        <div><b>${avgStarStr}</b><small>sao trung bình</small></div>
      </div>

      ${lrow('Tổng thu', `<b class="pos">+${fmt(report.rev)}</b>`)}
      ${lrow('Tổng chi', `<b class="neg">−${fmt(report.cost)}</b>`)}
      ${lrow(netProfit >= 0 ? 'Lãi hôm nay' : 'Lỗ hôm nay', `<b class="${netProfit >= 0 ? 'pos' : 'neg'}">${sgn(netProfit)}</b>`, 'tot')}
      ${lrow('Tiền trong két', `<b>${fmt(S.money)}</b>`, 'tot')}

      <details class="bill" id="r-bill" ${S.billOpen ? 'open' : ''}>
        <summary>
          <span class="bo">Xem chi tiết thu chi</span>
          <span class="bc">Thu gọn chi tiết</span>
        </summary>
        ${billHTML(report)}
        ${dayStats.waste ? `<div class="sub">Ly đổ bỏ: ${dayStats.waste} ly (${fmt(dayStats.wasteV)} nguyên liệu)</div>` : ''}
        ${dayStats.priceLost ? `<div class="sub">${dayStats.priceLost} khách chê giá đắt, không vào quán</div>` : ''}
        ${dayStats.regs ? `<div class="sub">Khách quen ghé: ${dayStats.regs} lượt</div>` : ''}
      </details>
    </div>

    ${report.chal ? `
      <div class="card chalr ${report.chal.ok ? 'ok' : ''}">
        <b>Ngày thử thách: ${report.chal.ok ? 'hoàn thành!' : 'chưa đạt'}</b>
        <small>${report.chal.served}/${report.chal.n} ly · trung bình ${report.chal.avg ? report.chal.avg.toFixed(1).replace('.', ',') : '–'}★${report.chal.ok ? ` · thưởng ${fmt(report.chal.v)} vào két sáng mai` : ''}</small>
      </div>
    ` : ''}

    ${crewReportHTML(dayStats)}

    ${!isBroke && S.ev && S.evDay === S.day ? `
      <div class="evc ${S.ev.id}">
        <span class="dot"></span>
        <div><b>Ngày mai: ${EVS[S.ev.id].n}</b><small>${evText(S.ev)}</small></div>
      </div>
    ` : ''}

    ${report.d?.taxDue || report.d?.tax ? `
      <div class="evc tax ${report.d.taxDue > report.d.tax ? 'bad' : ''}">
        <span class="dot"></span>
        <div>
          <b>Đã nộp thuế khoán tuần: ${fmt(report.d.tax || 0)}</b>
          <small>${report.d.taxDue > report.d.tax ? `Két không đủ, còn nợ ${fmt(report.d.taxDue - report.d.tax)}. Mai cán bộ thuế sẽ ghé thu.` : 'Nộp đủ, sổ sách rõ ràng.'}</small>
        </div>
      </div>
    ` : ''}

    ${!isBroke && rvWaiting() ? `
      <p class="note rvtip">Có ${rvWaiting()} đánh giá chưa tốt đang chờ quán trả lời trong tab Đánh giá.</p>
    ` : ''}

    ${!isBroke && lbOn() ? `
      <button class="btn dim sm wide" id="r-rank">Xem bảng xếp hạng</button>
    ` : ''}

    ${isBroke ? `
      <div class="card">
        <p class="sub" style="margin:0">${brokeMsg} ${loanLeft() ? loanOffer(loanAmt()) : `Quán trụ được ${report.day} ngày.`}</p>
      </div>
    ` : ''}
  `;

  container.querySelector('#r-rank')?.addEventListener('click', rankDlg);

  const crewEl = container.querySelector('#r-crew');
  if (crewEl) bindCrewReport(crewEl, dayStats);

  const billEl = container.querySelector('#r-bill');
  billEl?.addEventListener('toggle', () => {
    if (S.billOpen !== billEl.open) {
      S.billOpen = billEl.open;
      save();
    }
  });

  if (!isBroke && netProfit > 0) {
    setTimeout(() => confetti(20 + Math.min(40, Math.round(netProfit / 8000))), 250);
  }

  if (isBroke) {
    bottom('<button class="btn pri wide" id="r-next">Tiếp tục</button>', {
      'r-next': () => brokeCard(brokeMsg)
    });
  } else {
    bottom(`<button class="btn pri wide" id="r-next">Chuẩn bị ngày ${S.day} ${ICON.ok}</button>`, {
      'r-next': () => {
        sfx.day();
        go('prep');
      }
    });
  }
}
