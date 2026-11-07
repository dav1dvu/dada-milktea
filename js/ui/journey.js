/**
 * Dada Milktea - Journey / Story Campaign Screen (Hành trình Ly Trà Vàng)
 * Quản lý các chương vượt ải, đấu trùm và phần thưởng công thức
 */

import { ING, STAFF, PRICE, menuById, fmt } from '../data.js';
import { S, save } from '../state.js';
import { achCheck } from '../progress.js';
import { JR, CH, WHO, jrBy, best, starsIn, starsAll, stampOf, chOpen, lvOpen, chNeed, prizeOf, goalTxt, jrRecord, jrCost, pickable } from '../journey.js';
import { cup, ingIcon, mascot, ICON } from '../art.js';
import { $, go, ask, close, toast, bottom, on } from './shell.js';
import { sfx, setMood } from '../audio.js';
import { confetti, bump } from '../fx.js';

const esc = (text) =>
  String(text).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));

const starRow = (count, max = 3) =>
  `<span class="jst" aria-label="${count}/${max} sao">${'★'.repeat(count)}<i>${'★'.repeat(max - count)}</i></span>`;

let tabCh = 1;

function face(whoKey) {
  const char = WHO[whoKey];
  return whoKey === 'masc'
    ? `<span class="dface jm">${mascot('happy')}</span>`
    : `<span class="dface"><i class="fimg im-${char.img}"></i></span>`;
}

const talk = (dialogues) =>
  `<div class="jtalk">` +
  dialogues
    .map(
      ([who, line]) =>
        `<div class="jl">${face(who)}<p><b>${WHO[who].n}</b>${esc(line)}</p></div>`
    )
    .join('') +
  `</div>`;

function storyCard(chapter, dialogues, titleText, onFinish) {
  sfx.pop();
  ask(
    `<div class="drama"><span class="dtag jtag" style="--c:${chapter.c}">Chương ${chapter.id}</span><h2>${chapter.n}</h2><p class="sub" style="text-align:center">${titleText}</p></div>` +
    talk(dialogues),
    [['Lên đường', onFinish || null, 1]]
  );
}

export function render(container, shell, params) {
  setMood('prep');
  const openChapters = CH.filter((c) => chOpen(c.id)).map((c) => c.id);
  tabCh = params?.ch || tabCh || openChapters[openChapters.length - 1] || 1;
  if (!chOpen(tabCh)) tabCh = openChapters[openChapters.length - 1] || 1;

  paint(container);

  bottom(
    `<div class="dock"><button class="btn dim wide" id="j-home">${ICON.back}Về quán</button></div>`,
    {
      'j-home': () => {
        sfx.tap();
        go('prep');
      }
    }
  );

  const curCh = CH[tabCh - 1];
  if (S.jr.c < tabCh) {
    S.jr.c = tabCh;
    save();
    setTimeout(
      () =>
        storyCard(
          curCh,
          curCh.intro,
          curCh.n + ': ' + curCh.t,
          params?.open ? () => levelDlg(jrBy(params.open)) : null
        ),
      250
    );
  } else if (params?.open && lvOpen(jrBy(params.open))) {
    setTimeout(() => levelDlg(jrBy(params.open)), 200);
  }
}

function paint(container) {
  const curCh = CH[tabCh - 1];
  const lvList = JR.filter((lvl) => lvl.ch === curCh.id);
  const curStars = starsIn(curCh.id);
  const xCoords = [18, 50, 82, 64, 30, 18, 50, 82, 64, 36];
  const getY = (idx) => 6 + idx * 9.7;

  container.innerHTML = `
    <div class="jhead">
      <h1>Hành trình Ly Trà Vàng · Dada Milktea</h1>
      <p class="sub">${starRow(1, 1)} ${starsAll()}/150 sao</p>
      <div class="jstamps">
        ${CH.map((c) => `<span class="jsp ${stampOf(c.id) ? 'on' : ''}" style="--c:${c.c}" title="${c.stamp}">${stampOf(c.id) ? ICON.ok : c.id}</span>`).join('')}
      </div>
    </div>

    <nav class="jtabs">
      ${CH.map((c) => `<button class="${c.id === tabCh ? 'on' : ''} ${chOpen(c.id) ? '' : 'lk'}" data-ch="${c.id}" style="--c:${c.c}">${c.id}. ${c.n}</button>`).join('')}
    </nav>

    <div class="jch" style="--c:${curCh.c};--c2:${curCh.c2}">
      <div class="jct">
        <b>${curCh.n}</b>
        <small>${curCh.t} · đi cùng: ${curCh.mate}</small>
      </div>
      <span class="jcs">${curStars}/30★</span>
    </div>

    <div class="jpath" style="--c:${curCh.c};--c2:${curCh.c2}">
      <svg class="jline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="${lvList.map((l, i) => `${xCoords[i]},${getY(i)}`).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>
      </svg>
      ${lvList
        .map((lvl, idx) => {
          const st = best(lvl.id);
          const isOpen = lvOpen(lvl);
          return `
            <button class="jn ${lvl.boss ? ' boss' : ''} ${isOpen ? '' : 'lk'} ${st ? ' done' : ''}"
              data-id="${lvl.id}"
              style="--x:${xCoords[idx]}%;--y:${getY(idx)}%"
              aria-label="Màn ${lvl.id}: ${esc(lvl.n)}${st ? `, ${st} sao` : isOpen ? '' : ', chưa mở'}">
              <span class="jb">${lvl.boss ? '👑' : lvl.id}</span>
              <span class="jnm">${esc(lvl.boss ? lvl.n.replace(/^(Trùm|Chung kết): /, '') : lvl.n)}</span>
              ${isOpen ? starRow(st) : ''}
            </button>
          `;
        })
        .join('')}
    </div>

    ${
      chOpen(curCh.id + 1) || curCh.id === 5
        ? ''
        : `<p class="note jnext">Mở chương ${curCh.id + 1}: thắng màn trùm${stampOf(curCh.id) ? ' ✓' : ''} và có ${chNeed(curCh.id + 1)}★ ở chương này (đang có ${curStars}★).</p>`
    }
  `;

  on(container, '[data-ch]', (btn) => {
    const chId = +btn.dataset.ch;
    if (!chOpen(chId)) {
      sfx.nope();
      bump(btn, 'nope');
      toast(`Cần thắng màn trùm và có ${chNeed(chId)}★ ở chương ${chId - 1}`);
      return;
    }
    if (chId === tabCh) return;
    sfx.tap();
    tabCh = chId;
    paint(container);
    const targetCh = CH[chId - 1];
    if (S.jr.c < chId) {
      S.jr.c = chId;
      save();
      storyCard(targetCh, targetCh.intro, targetCh.n + ': ' + targetCh.t);
    }
  });

  on(container, '[data-id]', (btn) => {
    const lvl = jrBy(+btn.dataset.id);
    if (!lvOpen(lvl)) {
      sfx.nope();
      bump(btn, 'nope');
      toast('Qua màn trước để mở màn này');
      return;
    }
    sfx.tap();
    levelDlg(lvl);
  });
}

const menuStrip = (menuList) =>
  `<div class="tmenu">` +
  menuList
    .map((id) => {
      const item = menuById(id);
      return `<span>${cup({ color: item.c, cream: item.cream, pearls: item.base.includes('tranchau'), straw: false, lid: false, fill: 0.8 })}<small>${item.sn || item.n}</small></span>`;
    })
    .join('') +
  `</div>`;

const topStrip = (topList) =>
  topList.length
    ? `<div class="tmenu tops">` +
      topList
        .map((tId) => `<span>${ingIcon(tId, ING[tId].c)}<small>${ING[tId].sn || ING[tId].n}</small></span>`)
        .join('') +
      `</div>`
    : '';

export function levelDlg(lvl) {
  const chapter = CH[lvl.ch - 1];
  const curBest = best(lvl.id);

  ask(
    `<div class="drama"><span class="dtag jtag" style="--c:${chapter.c}">Chương ${chapter.id} · Màn ${lvl.id}${lvl.boss ? ' · Trùm' : ''}</span><h2>${esc(lvl.n)}</h2><p class="sub" style="text-align:center">${esc(lvl.d)}</p></div>
     <p class="jrule"><b>Luật:</b> ${esc(lvl.r)}</p>
     ${lvl.R?.pickMenu ? '' : menuStrip(lvl.menu) + topStrip(lvl.tops)}
     <ul class="jrgl">
       ${lvl.g.map((goal, idx) => `<li class="${curBest > idx ? 'ok' : ''}"><i>${'★'.repeat(idx + 1)}</i><span>${goalTxt(goal)}</span></li>`).join('')}
     </ul>
     <div class="kpis">
       <div><b>${lvl.sec || chapter.sec}</b><small>giây</small></div>
       <div><b>${curBest ? `Tốt nhất ${curBest}★` : `Thưởng ${fmt(prizeOf(lvl))}${lvl.boss ? ', ' + chapter.stamp : ''}`}</b><small>${curBest ? 'đã hoàn thành' : 'qua màn lần đầu'}</small></div>
     </div>`,
    [
      ['Bắt đầu', () => start(lvl), 1, 1],
      ['Đóng', null]
    ],
    { dismiss: true }
  );
}

function start(lvl, opts = {}) {
  const rRules = lvl.R || {};

  if (rRules.bribe && opts.bribe == null) {
    sfx.pop();
    ask(
      `<div class="drama"><span class="dtag">Phong bì</span><h2>Tùng gõ cửa</h2><p class="sub" style="text-align:center">"Mai chung kết rồi. Anh nhường tôi một lần thôi, phong bì này đủ anh mở thêm quán nữa."</p></div>` +
      face('tung'),
      [
        ['Từ chối<small>tự thắng bằng tay nghề</small>', () => start(lvl, { ...opts, bribe: false }), 1, 1],
        ['Nhận phong bì<small>màn này tối đa 1★, khách biết chuyện thì bỏ đi</small>', () => start(lvl, { ...opts, bribe: true }), 0, 1]
      ]
    );
    return;
  }

  if ((rRules.budget || rRules.pick || rRules.price || rRules.pickMenu) && !opts.ready) {
    prepDlg(lvl, opts);
    return;
  }

  close();
  go('sell', { jr: { id: lvl.id, ...opts } });
}

function prepDlg(lvl, opts) {
  const r = lvl.R;
  const state = {
    buy: { ...(opts.buy || {}) },
    pick: [...(opts.pick || [])],
    menu: [...(opts.menu || [])],
    price: { ...(opts.price || {}) }
  };

  const cost = () =>
    (r.buy || []).reduce((acc, ing) => acc + (state.buy[ing] || 0) * jrCost(lvl, ing), 0);

  const pickPool = r.pick ? pickable(lvl) : [];

  const renderHtml = () => `
    <h2>Chuẩn bị</h2>
    <p class="sub" style="text-align:center">Màn ${lvl.id} · ${esc(lvl.n)}</p>
    
    ${r.pickMenu ? `
      <h3 class="hd">Chọn ${r.pickMenu} món thi · ${state.menu.length}/${r.pickMenu}</h3>
      <div class="jpick">
        ${lvl.menu.map((mId) => {
          const item = menuById(mId);
          return `<button class="jpk ${state.menu.includes(mId) ? 'on' : ''}" data-pm="${mId}">${cup({ color: item.c, cream: item.cream, pearls: item.base.includes('tranchau'), straw: false, lid: false, fill: 0.8 })}<small>${item.sn || item.n}</small></button>`;
        }).join('')}
      </div>
    ` : ''}

    ${r.pick ? `
      <h3 class="hd">Chọn ${r.pick} nhân viên · ${state.pick.length}/${r.pick}</h3>
      <div class="jpick">
        ${pickPool.map((sId) => {
          const st = STAFF.find((x) => x.id === sId);
          return `<button class="jpk ${state.pick.includes(sId) ? 'on' : ''}" data-ps="${sId}"><i class="fimg im-${st.img}"></i><small>${st.n}</small></button>`;
        }).join('')}
      </div>
    ` : ''}

    ${r.price ? `
      <h3 class="hd">Giá bán</h3>
      <div class="jrows">
        ${lvl.menu.map((mId) => {
          const item = menuById(mId);
          const pr = state.price[mId] ?? item.price;
          return `<div class="jrow"><span>${item.sn || item.n}<small>gợi ý ${fmt(item.price)}</small></span><button class="btn sm dim" data-pr="${mId}:-1">−</button><b>${fmt(pr)}</b><button class="btn sm dim" data-pr="${mId}:1">+</button></div>`;
        }).join('')}
      </div>
      <p class="note">Khách du lịch và menu in màu: giá cao hơn gợi ý chút vẫn được. Quá tay là khách chê đắt.</p>
    ` : ''}

    ${r.budget ? `
      <h3 class="hd">Nhập hàng · còn <b class="${r.budget - cost() < 0 ? 'neg' : ''}">${fmt(r.budget - cost())}</b> / ${fmt(r.budget)}</h3>
      <p class="note">Ly và đường có sẵn. Đồ tươi ghi "trong ngày" còn thừa cuối ca là bỏ phí.</p>
      <div class="jrows">
        ${r.buy.map((ing) => {
          const qty = state.buy[ing] || 0;
          return `<div class="jrow"><span>${ingIcon(ing, ING[ing].c)}${ING[ing].sn || ING[ing].n}<small>${fmt(jrCost(lvl, ing))}/phần${ING[ing].life === 1 ? ' · trong ngày' : ''}</small></span><button class="btn sm dim" data-bq="${ing}:-5">−5</button><b>${qty}</b><button class="btn sm dim" data-bq="${ing}:5">+5</button></div>`;
        }).join('')}
      </div>
    ` : ''}
  `;

  const isValid = () =>
    (!r.pickMenu || state.menu.length === r.pickMenu) &&
    (!r.pick || state.pick.length === Math.min(r.pick, pickPool.length)) &&
    (!r.budget || cost() <= r.budget);

  const showDlg = () => {
    const dlg = ask(renderHtml(), [
      ['Bắt đầu', () => {
        if (!isValid()) {
          sfx.nope();
          toast(r.budget && cost() > r.budget ? 'Nhập quá ngân sách rồi' : 'Chọn cho đủ đã nha');
          return;
        }
        start(lvl, {
          ...opts,
          ...(r.budget ? { buy: state.buy } : {}),
          ...(r.pick ? { pick: state.pick } : {}),
          ...(r.pickMenu ? { menu: state.menu } : {}),
          ...(r.price ? { price: state.price } : {}),
          ready: true
        });
      }, 1, 1],
      ['Để sau', null]
    ], { dismiss: true });

    dlg.querySelector('.sheet')?.classList.add('jprep');

    on(dlg, '[data-pm]', (btn) => {
      sfx.tap();
      const val = btn.dataset.pm;
      const idx = state.menu.indexOf(val);
      if (idx >= 0) state.menu.splice(idx, 1);
      else if (state.menu.length < r.pickMenu) state.menu.push(val);
      else { state.menu.shift(); state.menu.push(val); }
      showDlg();
    });

    on(dlg, '[data-ps]', (btn) => {
      sfx.tap();
      const val = btn.dataset.ps;
      const idx = state.pick.indexOf(val);
      if (idx >= 0) state.pick.splice(idx, 1);
      else if (state.pick.length < r.pick) state.pick.push(val);
      showDlg();
    });

    on(dlg, '[data-pr]', (btn) => {
      const [mId, diff] = btn.dataset.pr.split(':');
      const def = menuById(mId).price;
      const cur = (state.price[mId] ?? def) + +diff * 1000;
      state.price[mId] = Math.max(Math.floor(def * PRICE.min / 1000) * 1000, Math.min(Math.ceil(def * PRICE.max / 1000) * 1000, cur));
      if (state.price[mId] === def) delete state.price[mId];
      sfx.tap();
      showDlg();
    });

    on(dlg, '[data-bq]', (btn) => {
      const [ing, diff] = btn.dataset.bq.split(':');
      const nextQty = Math.max(0, (state.buy[ing] || 0) + +diff);
      if (+diff > 0 && cost() + 5 * jrCost(lvl, ing) > r.budget) {
        sfx.nope();
        toast('Hết ngân sách rồi');
        return;
      }
      state.buy[ing] = nextQty;
      sfx.tap();
      showDlg();
    });
  };

  showDlg();
}

export const done = {
  render(container, shell, result) {
    setMood('prep');
    const lvl = result && jrBy(result.id);
    if (!lvl) {
      go('journey');
      return;
    }

    const chapter = CH[lvl.ch - 1];
    const prevBest = best(lvl.id);
    const hadNextCh = chOpen(lvl.ch + 1);
    const rec = result.stars > 0 ? jrRecord(lvl, result.stars) : { first: false, gifts: [] };
    save();
    achCheck();

    const isWin = result.stars > 0;
    const nextLvl = jrBy(lvl.id + 1);
    const [who, quote] = lvl.w;

    container.innerHTML = `
      <div class="card jres" style="text-align:center;--c:${chapter.c}">
        <div class="rpmasc">${mascot(isWin ? 'happy' : 'sad')}</div>
        <span class="dtag jtag" style="--c:${chapter.c}">Chương ${chapter.id} · Màn ${lvl.id}</span>
        <h3>${esc(lvl.n)}</h3>
        <div class="jbig">
          ${[0, 1, 2].map((i) => `<i class="${i < result.stars ? 'on' : ''}" style="--d:${i * 220}ms">★</i>`).join('')}
        </div>
        <p class="sub">
          ${isWin ? (result.stars > prevBest ? (prevBest ? `Kỷ lục mới! Trước đây ${prevBest}★.` : 'Qua màn!') : `Tốt nhất vẫn là ${prevBest}★.`) : 'Chưa đạt mục tiêu chính. Thử lại nha!'}
        </p>
        ${isWin ? `<div class="jl win">${face(who)}<p><b>${WHO[who].n}</b>: "${esc(quote)}"</p></div>` : ''}
        <ul class="jrgl">
          ${lvl.g.map((g, i) => `<li class="${result.got[i] ? 'ok' : 'bad'}"><i>${'★'.repeat(i + 1)}</i><span>${goalTxt(g)}</span><small>${result.rows[i] || ''}</small></li>`).join('')}
        </ul>
        <div class="kpis">
          <div><b>${result.served}</b><small>ly bán được</small></div>
          <div><b class="${result.lost ? 'neg' : ''}">${result.lost}</b><small>khách bỏ về</small></div>
          <div><b>${result.rival != null ? result.rival : (result.avg ? result.avg.toFixed(1).replace('.', ',') : '–')}</b><small>${result.rival != null ? 'ly của Tùng' : 'sao trung bình'}</small></div>
        </div>
        ${rec.gifts?.length ? `<div class="card jgift"><b>Quà qua màn lần đầu</b><ul class="news">${rec.gifts.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>` : ''}
      </div>
    `;

    if (isWin) {
      setTimeout(() => {
        sfx.levelup();
        confetti(20 + result.stars * 12);
      }, 300);
    } else {
      sfx.bad();
    }

    const hasNext = nextLvl && lvOpen(nextLvl) && nextLvl.ch === lvl.ch;

    bottom(
      `<div class="dock tdock">
        <button class="btn dim" id="j-again">Chơi lại</button>
        <button class="btn dim" id="j-map">Bản đồ</button>
        ${hasNext ? `<button class="btn pri" id="j-next">Màn ${nextLvl.id} ${ICON.ok}</button>` : ''}
      </div>`,
      {
        'j-again': () => {
          sfx.tap();
          go('journey', { ch: lvl.ch, open: lvl.id });
        },
        'j-map': () => {
          sfx.tap();
          go('journey', { ch: nextLvl && chOpen(nextLvl.ch) && lvl.boss ? nextLvl.ch : lvl.ch });
        },
        'j-next': () => {
          sfx.tap();
          go('journey', { ch: lvl.ch, open: nextLvl.id });
        }
      }
    );

    if (rec.first && lvl.boss) {
      setTimeout(() => {
        storyCard(
          chapter,
          chapter.outro,
          lvl.id === 50 ? 'Ly Trà Vàng!' : chapter.stamp + '!',
          () => {
            if (lvl.ch < 5 && !hadNextCh) {
              toast(
                chOpen(lvl.ch + 1)
                  ? `Đủ sao rồi! Đã mở chương ${lvl.ch + 1}: ${CH[lvl.ch].n}!`
                  : `Cần ${chNeed(lvl.ch + 1)}★ ở chương này để mở ${CH[lvl.ch].n} (đang có ${starsIn(lvl.ch)}★)`,
                'good'
              );
            }
          }
        );
      }, 900);
    } else if (isWin && lvl.ch < 5 && !hadNextCh && chOpen(lvl.ch + 1)) {
      setTimeout(() => {
        toast(`Đã mở chương ${lvl.ch + 1}: ${CH[lvl.ch].n}`, 'good');
      }, 900);
    }
  }
};
