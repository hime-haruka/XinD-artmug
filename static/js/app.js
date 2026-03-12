const INTRO_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPjPP4XzUAq6W9scWLedDUiphUPOgjXhxnLKvnIm29PSHt-5ub2dgYkVjZkXtXY-E1IdKY1cJgCUKs/pub?gid=0&single=true&output=csv";

const SLOT_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPjPP4XzUAq6W9scWLedDUiphUPOgjXhxnLKvnIm29PSHt-5ub2dgYkVjZkXtXY-E1IdKY1cJgCUKs/pub?gid=1140772196&single=true&output=csv";

const SLOT_QUICK_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPjPP4XzUAq6W9scWLedDUiphUPOgjXhxnLKvnIm29PSHt-5ub2dgYkVjZkXtXY-E1IdKY1cJgCUKs/pub?gid=1801992964&single=true&output=csv";

const EVENT_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPjPP4XzUAq6W9scWLedDUiphUPOgjXhxnLKvnIm29PSHt-5ub2dgYkVjZkXtXY-E1IdKY1cJgCUKs/pub?gid=1671143871&single=true&output=csv";

const NOTICE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPjPP4XzUAq6W9scWLedDUiphUPOgjXhxnLKvnIm29PSHt-5ub2dgYkVjZkXtXY-E1IdKY1cJgCUKs/pub?gid=745819399&single=true&output=csv";

const SAMPLE_CATEGORY_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPjPP4XzUAq6W9scWLedDUiphUPOgjXhxnLKvnIm29PSHt-5ub2dgYkVjZkXtXY-E1IdKY1cJgCUKs/pub?gid=1221302868&single=true&output=csv";

const SAMPLE_PRICE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPjPP4XzUAq6W9scWLedDUiphUPOgjXhxnLKvnIm29PSHt-5ub2dgYkVjZkXtXY-E1IdKY1cJgCUKs/pub?gid=948720182&single=true&output=csv";

const SAMPLE_IMAGE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPjPP4XzUAq6W9scWLedDUiphUPOgjXhxnLKvnIm29PSHt-5ub2dgYkVjZkXtXY-E1IdKY1cJgCUKs/pub?gid=176554798&single=true&output=csv";

const NOTICE_GROUP_IMAGES = {
  "컨펌 및 수정": [
    "https://lh3.googleusercontent.com/d/1N-Z_-k26DFvev7nDN0Tj2TPV5o5FVeOr",
    "https://lh3.googleusercontent.com/d/1ocYmFrxRXyJxkR75R10arEqe5NkZ_6-2"
  ]
};

const SAMPLE_NOTES = {
  "sub_badge::움짤뱃지": [
    "움짤뱃지는 gif가 아닌 apng로 전달드립니다.",
    "치지직에서만 적용됩니다."
  ],
  "profile::프로필": [
    "손 추가 무료!"
  ],
  "banner::하단배너": [
    "고정형 배너는 구도 고정, 아이콘과 표정 등만 변경됩니다.",
    "배경은 단색 또는 없음으로 작업됩니다."
  ],
  "ziptok::짚톡": [
    "책상 세트는 키보드 또는 게임패드 + 소품 구성입니다."
  ]
};

const SAMPLE_THUMB_LIMITS = {
  sub_emote: 10,
  sub_badge: 12,
  profile: 2,
  banner: 2,
  ziptok: 1,
  illust: 1
};

document.addEventListener("DOMContentLoaded", async () => {
  await renderIntroSection();
  await renderSlotSection();
  await renderNoticeSection();
  await renderSampleSection();
});

/* =========================
   Intro
========================= */

async function renderIntroSection() {
  const target = document.querySelector("#intro");
  if (!target) return;

  try {
    const rows = await fetchCsv(INTRO_CSV_URL);
    if (!rows.length) {
      target.innerHTML = `
        <div class="ui-window">
          <div class="ui-window__body">인트로 데이터를 불러오지 못했습니다.</div>
        </div>
      `;
      return;
    }

    const data = rows[0];

    const name = (data.name || "").trim();
    const badge = (data.badge || "").trim();
    const tags = parseTags(data.tags || "");
    const time = (data.time || "").trim();
    const imgUrl = convertGoogleImageUrl((data.img_url || "").trim());

    target.innerHTML = createIntroMarkup({
      name,
      badge,
      tags,
      time,
      imgUrl
    });
  } catch (error) {
    console.error("인트로 섹션 렌더링 실패:", error);
    target.innerHTML = `
      <div class="ui-window">
        <div class="ui-window__body">인트로 데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    `;
  }
}

function createIntroMarkup({ name, badge, tags, time, imgUrl }) {
  return `
    <div class="intro-wrap">
      <div class="intro-card">
        <div class="ui-cloud is-2 top-left"></div>
        <div class="ui-cloud is-4 bottom-right"></div>

        <div class="intro-avatar-wrap">
          <img class="intro-avatar" src="${escapeHtml(imgUrl)}" alt="${escapeHtml(name)} 프로필 이미지">
        </div>

        <div class="intro-badge">
          <span class="intro-badge__dot"></span>
          <span>${escapeHtml(badge)}</span>
        </div>

        <h1 class="intro-name">${escapeHtml(name)}</h1>

        <div class="intro-tags">
          ${tags.map((tag) => `<span class="intro-tag">${escapeHtml(tag)}</span>`).join("")}
        </div>

        <div class="intro-actions">
          <a class="ui-btn is-fill intro-btn" href="#form">문의하기</a>
          <a class="ui-btn is-soft intro-btn" href="#sample">작업물 보기</a>
        </div>

        ${time ? `<p class="intro-time">${escapeHtml(time)}</p>` : ""}
      </div>
    </div>
  `;
}

/* =========================
   Slot / Event
========================= */

async function renderSlotSection() {
  const target = document.querySelector("#slot");
  if (!target) return;

  try {
    const [slotRows, quickRows, eventRows] = await Promise.all([
      fetchCsv(SLOT_CSV_URL),
      fetchCsv(SLOT_QUICK_CSV_URL),
      fetchCsv(EVENT_CSV_URL)
    ]);

    target.innerHTML = createSlotMarkup({
      slotRows,
      quick: quickRows[0] || {},
      events: eventRows
    });
  } catch (error) {
    console.error("슬롯 섹션 렌더링 실패:", error);
    target.innerHTML = `
      <div class="slot-grid">
        <div class="ui-window">
          <div class="ui-window__body">슬롯 데이터를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </div>
    `;
  }
}

function createSlotMarkup({ slotRows, quick, events }) {
  const quickTitle = (quick.title || "").trim();
  const quickValue = (quick.slot || "").trim().toUpperCase();
  const quickOn = quickValue === "ON";

  return `
    <div class="slot-grid">
      <section class="slot-panel ui-window">
        <div class="ui-cloud is-1 top-left"></div>

        <div class="ui-window__bar">
          <div class="ui-window__title">
            <span class="ui-window__dots">
              <span class="ui-dot is-sky"></span>
              <span class="ui-dot is-blue"></span>
              <span class="ui-dot is-white"></span>
            </span>
            <span>슬롯</span>
          </div>
        </div>

        <div class="ui-window__body slot-panel__body">
          <div class="slot-table">
            ${slotRows.map(createSlotRow).join("")}
          </div>

          ${
            quickTitle
              ? `
            <div class="slot-quick ${quickOn ? "is-on" : "is-off"}">
              <span class="slot-quick__label">${escapeHtml(quickTitle)}</span>
              <span class="slot-quick__value">${escapeHtml(quickValue || "OFF")}</span>
            </div>
          `
              : ""
          }
        </div>
      </section>

      <section class="slot-panel ui-window">
        <div class="ui-cloud is-5 bottom-right"></div>

        <div class="ui-window__bar">
          <div class="ui-window__title">
            <span class="ui-window__dots">
              <span class="ui-dot is-sky"></span>
              <span class="ui-dot is-blue"></span>
              <span class="ui-dot is-white"></span>
            </span>
            <span>이벤트</span>
          </div>
        </div>

        <div class="ui-window__body slot-panel__body">
          <div class="event-list">
            ${
              events.length
                ? events.map(createEventCard).join("")
                : `<div class="event-empty">진행 중인 이벤트가 없습니다.</div>`
            }
          </div>
        </div>
      </section>
    </div>
  `;
}

function createSlotRow(row) {
  const month = escapeHtml((row.month || "").trim());
  const week = escapeHtml((row.week || "").trim());

  const slots = ["slot 1", "slot 2", "slot 3", "slot 4"]
    .map((key) => {
      const value = String(row[key] || "").trim().toLowerCase();
      const isOpen = value === "open";

      return `
        <div class="slot-cell ${isOpen ? "is-open" : "is-closed"}">
          <span class="slot-status">${isOpen ? "○ OPEN" : "● CLOSED"}</span>
        </div>
      `;
    })
    .join("");

  return `
    <div class="slot-row">
      <div class="slot-row__title">${month}월 ${week}주차</div>
      <div class="slot-row__cells">${slots}</div>
    </div>
  `;
}

function createEventCard(event) {
  const title = (event.title || "").trim();
  const url = (event.url || "").trim();
  const desc = (event.desc || "").trim();
  const imageUrl = convertGoogleImageUrl(url);
  const hasImage = !!imageUrl;

  return `
    <article class="event-card">
      ${
        hasImage
          ? `
        <a class="event-card__thumb" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}">
        </a>
      `
          : ""
      }

      <div class="event-card__body">
        <h3 class="event-card__title">${escapeHtml(title)}</h3>
        ${desc ? `<p class="event-card__desc">${escapeHtml(desc).replace(/\n/g, "<br>")}</p>` : ""}
      </div>
    </article>
  `;
}

/* =========================
   Notice
========================= */

async function renderNoticeSection() {
  const target = document.querySelector("#notice");
  if (!target) return;

  try {
    const rows = await fetchCsv(NOTICE_CSV_URL);
    const groups = groupNoticeRows(rows);

    target.innerHTML = createNoticeMarkup(groups);
  } catch (error) {
    console.error("공지사항 섹션 렌더링 실패:", error);
    target.innerHTML = `
      <div class="notice-wrap">
        <div class="ui-window">
          <div class="ui-window__body">공지사항 데이터를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </div>
    `;
  }
}

function groupNoticeRows(rows) {
  const map = new Map();

  rows.forEach((row) => {
    const group = String(row.group || "").trim();
    const order = toNumber(row.order, 0);
    const desc = String(row.desc || "").trim();

    if (!group || !desc) return;

    if (!map.has(group)) {
      map.set(group, []);
    }

    map.get(group).push({
      order,
      desc
    });
  });

  const groupOrderMap = {
    "기본 공지사항": 1,
    "슬롯과 일정": 2,
    "컨펌 및 수정": 4
  };

  return Array.from(map.entries())
    .map(([group, items], index) => ({
      group,
      index,
      fixedOrder: groupOrderMap[group] || 99,
      items: items.sort((a, b) => a.order - b.order),
      images: NOTICE_GROUP_IMAGES[group] || []
    }))
    .sort((a, b) => a.fixedOrder - b.fixedOrder);
}

function createNoticeMarkup(groups) {
  const basicGroup = groups.find((group) => group.group === "기본 공지사항");
  const slotGroup = groups.find((group) => group.group === "슬롯과 일정");
  const confirmGroup = groups.find((group) => group.group === "컨펌 및 수정");

  return `
    <div class="notice-wrap">
      <section class="notice-hero">
        <div class="notice-hero__cloud"></div>

        <div class="notice-hero__inner">
          <span class="notice-hero__eyebrow">CHECK POINT</span>
          <h2 class="notice-hero__title">공지사항</h2>
          <p class="notice-hero__desc">신청 전 꼭 확인 부탁드립니다.</p>
        </div>
      </section>

      <div class="notice-list">
        ${basicGroup ? createNoticeGroupCard(basicGroup) : ""}
        ${slotGroup ? createNoticeGroupCard(slotGroup) : ""}
      </div>

      ${createNoticeProcessWindow()}

      <div class="notice-list">
        ${confirmGroup ? createNoticeGroupCard(confirmGroup) : ""}
      </div>
    </div>
  `;
}

function createNoticeProcessWindow() {
  const steps = [
    "문의",
    "결제",
    "컬러러프 컨펌\n(구독티콘 제외)",
    "작업",
    "완성 전 컨펌",
    "완성 후 전달"
  ];

  return `
    <section class="notice-card ui-window notice-process-card">
      <div class="ui-cloud is-4 bottom-right"></div>

      <div class="ui-window__bar">
        <div class="ui-window__title">
          <span class="ui-window__dots">
            <span class="ui-dot is-sky"></span>
            <span class="ui-dot is-blue"></span>
            <span class="ui-dot is-white"></span>
          </span>
          <span>작업 과정</span>
        </div>
      </div>

      <div class="ui-window__body notice-card__body">
        <div class="notice-process-grid">
          ${steps
            .map(
              (label, index) => `
            <div class="notice-process-box">
              <span class="notice-process-box__num">${String(index + 1).padStart(2, "0")}</span>
              <span class="notice-process-box__label">${escapeHtml(label).replace(/\n/g, "<br>")}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function createNoticeGroupCard(groupData) {
  const { group, items, images, index } = groupData;
  const cloudClass = ["is-1", "is-3", "is-5"][index % 3];

  const imageMarkup =
    group === "컨펌 및 수정" && images.length
      ? `
        <div class="notice-figure-grid">
          <figure class="notice-figure">
            <div class="notice-figure__frame">
              <img src="${escapeHtml(convertGoogleImageUrl(images[0]))}" alt="컬러 러프 예시 전">
            </div>
            <figcaption>컬러 러프 예시 (전)</figcaption>
          </figure>

          <figure class="notice-figure">
            <div class="notice-figure__frame">
              <img src="${escapeHtml(convertGoogleImageUrl(images[1]))}" alt="컬러 러프 예시 후">
            </div>
            <figcaption>컬러 러프 예시 (후)</figcaption>
          </figure>
        </div>
      `
      : "";

  
return `
    <article class="notice-card ui-window">
      <div class="ui-cloud ${cloudClass} top-right"></div>

      <div class="ui-window__bar">
        <div class="ui-window__title">
          <span class="ui-window__dots">
            <span class="ui-dot is-sky"></span>
            <span class="ui-dot is-blue"></span>
            <span class="ui-dot is-white"></span>
          </span>
          <span>${escapeHtml(group)}</span>
        </div>
      </div>

      <div class="ui-window__body notice-card__body">
        ${imageMarkup}

        <ul class="notice-items">
          ${items
            .map(
              (item) => `
            <li class="notice-item">
              <span class="notice-item__dot" aria-hidden="true"></span>
              <p class="notice-item__desc">${escapeHtml(item.desc)}</p>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    </article>
  `;
}

/* =========================
   Sample
========================= */

async function renderSampleSection() {
  const target = document.querySelector("#sample");
  if (!target) return;

  try {
    const [categoryRows, priceRows, imageRows] = await Promise.all([
      fetchCsv(SAMPLE_CATEGORY_CSV_URL),
      fetchCsv(SAMPLE_PRICE_CSV_URL),
      fetchCsv(SAMPLE_IMAGE_CSV_URL)
    ]);

    const categories = categoryRows
      .map((row) => ({
        id: String(row.id || "").trim(),
        title: String(row.title || "").trim(),
        columns: toNumber(row.columns, 1),
        thumbCount: toNumber(row.thumb_count, 0),
        order: toNumber(row.order, 999)
      }))
      .filter((row) => row.id && row.title)
      .sort((a, b) => a.order - b.order);

    const prices = priceRows
      .map((row, index) => ({
        categoryId: String(row.category_id || "").trim(),
        group: String(row.group || "").trim(),
        option: String(row.options || "").trim(),
        price: String(row.price || "").trim(),
        _index: index
      }))
      .filter((row) => row.categoryId && row.group && row.price);

    const samples = imageRows
      .map((row, index) => ({
        sectionId: String(row.section_id || "").trim(),
        subSection: String(row.sub_section || "").trim(),
        sampleGroup: String(row.sample_group || "").trim(),
        groupOrder: toNumber(row.group_order, 999),
        sampleTitle: String(row.sample_title || "").trim(),
        sortDate: normalizeSortDate(row.sort_date),
        thumb: String(row.thumb || "").trim().toUpperCase() === "O",
        imageUrl: convertGoogleImageUrl(String(row.image_url || "").trim()),
        _index: index
      }))
      .filter((row) => row.sectionId && row.subSection && row.imageUrl);

    target.innerHTML = createSampleSectionMarkup({
      categories,
      prices,
      samples
    });
  } catch (error) {
    console.error("샘플 섹션 렌더링 실패:", error);
    target.innerHTML = `
      <div class="sec-frame">
        <div class="ui-window">
          <div class="ui-window__bar">
            <div class="ui-window__title">
              <span class="ui-window__dots">
                <span class="ui-dot is-sky"></span>
                <span class="ui-dot is-blue"></span>
                <span class="ui-dot is-white"></span>
              </span>
              <span>샘플</span>
            </div>
          </div>
          <div class="ui-window__body">샘플 데이터를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </div>
    `;
  }
}

function createSampleSectionMarkup({ categories, prices, samples }) {
  return `
    <div class="sample-wrap">
      <section class="sample-hero">
        <div class="sample-hero__cloud"></div>

        <div class="sample-hero__inner">
          <span class="sample-hero__eyebrow">PORTFOLIO</span>
          <h2 class="sample-hero__title">샘플</h2>
          <p class="sample-hero__desc">작업 유형별 대표 샘플과 전체 작업물을 확인하실 수 있습니다.</p>
        </div>
      </section>

      <div class="sample-nav-wrap">
        <div class="sample-nav">
        ${categories
          .map(
            (category) => `
          <a class="sample-nav__btn ui-btn is-soft" href="#sample-${escapeHtml(category.id)}">
            ${escapeHtml(category.title)}
          </a>
        `
          )
          .join("")}
      </div>
      </div>

      <div class="sample-list">
        ${categories
          .map((category) =>
            createSampleCategoryBlock({
              category,
              prices,
              samples
            })
          )
          .join("")}
      </div>
    </div>
  `;
}

function createSampleCategoryBlock({ category, prices, samples }) {
  const categorySamples = samples
    .filter((item) => item.sectionId === category.id)
    .sort(compareByGroupOrderThenDateDescThenIndex);

  const categoryPrices = prices.filter((item) => item.categoryId === category.id);

  const priceSubOrder = categoryPrices.map((item) => item.group).filter(Boolean);
  const sampleSubOrder = categorySamples.map((item) => item.subSection).filter(Boolean);
  const subSections = uniqueKeepOrder([...priceSubOrder, ...sampleSubOrder]);

  return `
    <section class="sample-category sec-frame" id="sample-${escapeHtml(category.id)}">
      <div class="ui-window has-cloud-top-right">
        <div class="ui-cloud is-2 top-right"></div>

        <div class="ui-window__bar">
          <div class="ui-window__title">
            <span class="ui-window__dots">
              <span class="ui-dot is-sky"></span>
              <span class="ui-dot is-blue"></span>
              <span class="ui-dot is-white"></span>
            </span>
            <span>${escapeHtml(category.title)}</span>
          </div>
        </div>

        <div class="ui-window__body sample-category__body">
          ${subSections
            .map((subSection) =>
              createSampleSubBlock({
                category,
                subSection,
                prices: categoryPrices.filter((item) => item.group === subSection),
                samples: categorySamples
                  .filter((item) => item.subSection === subSection)
                  .sort(compareByGroupOrderThenDateDescThenIndex)
              })
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function createSampleSubBlock({ category, subSection, prices, samples }) {
  const thumbLimit = SAMPLE_THUMB_LIMITS[category.id] ?? category.thumbCount ?? 0;
  const priceCols = category.id === "illust" ? 3 : 2;
  const useContain = ["ziptok", "illust"].includes(category.id);

  const thumbSamples = getRepresentativeSamples(samples, thumbLimit);

  const hasManualThumb = samples.some((item) => item.thumb);
  const detailBaseSamples = hasManualThumb
    ? samples.filter((item) => !item.thumb)
    : samples;

  const groupedSamples = groupSampleItems(detailBaseSamples, subSection);

const forceSingleColumn = ["ziptok", "illust"].includes(category.id);

const thumbCols = forceSingleColumn
  ? 1
  : Math.min(
      Math.max(1, Number(category.columns || 1)),
      Math.max(1, thumbSamples.length)
    );

const detailItemCount = groupedSamples.reduce((sum, group) => sum + group.items.length, 0);

const listCols = forceSingleColumn
  ? 1
  : Math.min(
      Math.max(1, Number(category.columns || 1)),
      Math.max(1, detailItemCount)
    );

  const notesKey = `${category.id}::${subSection}`;
  const notes =
    SAMPLE_NOTES[notesKey] ||
    SAMPLE_NOTES[`${category.id}::${category.title}`] ||
    [];

  return `
    <article class="sample-sub">
      <div class="sample-sub__head">
        <h3 class="sample-sub__title">${escapeHtml(subSection)}</h3>
      </div>

      <div class="sample-sub__price" style="--price-cols:${priceCols}">
        ${createSamplePriceMarkup(prices, notes)}
      </div>

      <div
        class="sample-thumb-grid ${thumbSamples.length ? "" : "is-empty"}"
        style="--sample-cols:${thumbCols}"
      >
        ${
          thumbSamples.length
            ? thumbSamples
                .map(
                  (item) => `
              <button
                type="button"
                class="sample-thumb ${useContain ? "is-contain" : ""}"
                onclick="window.open('${escapeHtml(item.imageUrl)}', '_blank', 'noopener')"
                aria-label="${escapeHtml(subSection)} 대표 샘플 보기"
              >
                <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(subSection)} 대표 샘플">
              </button>
            `
                )
                .join("")
            : `<div class="sample-empty">등록된 대표 샘플이 없습니다.</div>`
        }
      </div>

      <details class="sample-more">
        <summary class="sample-more__summary">
          <span>샘플 더보기</span>
          <span class="sample-more__arrow"></span>
        </summary>

        <div class="sample-more__body">
          ${
            groupedSamples.length
              ? `
            <div class="sample-group-list">
              ${groupedSamples
                .map((group) =>
                  createSampleGroupMarkup(group, listCols, subSection, useContain)
                )
                .join("")}
            </div>
          `
              : `<div class="sample-empty">추가 샘플이 없습니다.</div>`
          }
        </div>
      </details>
    </article>
  `;
}

function createSamplePriceMarkup(prices, notes = []) {
  if (!prices.length && !notes.length) {
    return `<div class="sample-price-empty">가격 정보가 없습니다.</div>`;
  }

  return `
    <div class="sample-price-list">
      ${prices
        .map((item) => {
          const label = item.option || item.group || "";
          const price = formatPrice(item.price);

          return `
            <div class="sample-price-row">
              <span class="sample-price-row__label">${escapeHtml(label)}</span>
              <strong class="sample-price-row__value">${escapeHtml(price)}</strong>
            </div>
          `;
        })
        .join("")}
    </div>

    ${
      notes.length
        ? `
      <ul class="sample-note-list">
        ${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
      </ul>
    `
        : ""
    }
  `;
}

function getRepresentativeSamples(samples, limit) {
  if (!samples.length || !limit) return [];

  const manualThumbs = samples.filter((item) => item.thumb);

  if (manualThumbs.length) {
    return [...manualThumbs]
      .sort(compareByDateDescThenIndex)
      .slice(0, limit);
  }

  return [...samples]
    .sort(compareByDateDescThenIndex)
    .slice(0, limit);
}

function groupSampleItems(samples, subSection) {
  if (!samples.length) return [];

  const hasExplicitGroup = samples.some((item) => item.sampleGroup);
  const hasGroupOrder = samples.some((item) => Number(item.groupOrder) !== 999);

  if (hasExplicitGroup) {
    const map = new Map();

    samples.forEach((item) => {
      const key = item.sampleGroup || subSection;

      if (!map.has(key)) {
        map.set(key, {
          title: key,
          groupOrder: item.groupOrder ?? 999,
          firstIndex: item._index,
          items: []
        });
      }

      map.get(key).items.push(item);
    });

    return Array.from(map.values())
      .map((group) => {
        group.items.sort(compareByDateDescThenIndex);
        group.latestDate = group.items.length ? group.items[0].sortDate : "000000";
        return group;
      })
      .sort((a, b) => {
        const aGroup = Number.isFinite(a.groupOrder) ? a.groupOrder : 999;
        const bGroup = Number.isFinite(b.groupOrder) ? b.groupOrder : 999;

        if (hasGroupOrder && aGroup !== bGroup) return aGroup - bGroup;

        const aDate = getDateNumber({ sortDate: a.latestDate });
        const bDate = getDateNumber({ sortDate: b.latestDate });

        if (bDate !== aDate) return bDate - aDate;
        return a.firstIndex - b.firstIndex;
      });
  }

  return [
    {
      title: "",
      groupOrder: 999,
      firstIndex: samples[0]?._index ?? 999999,
      items: [...samples].sort(compareByDateDescThenIndex)
    }
  ];
}

function createSampleGroupMarkup(group, columns, subSection, useContain = false) {
  const showTitle = group.title && group.title !== subSection;

  return `
    <section class="sample-group">
      ${
        showTitle
          ? `
        <div class="sample-group__head">
          <h4 class="sample-group__title">${escapeHtml(group.title)}</h4>
        </div>
      `
          : ""
      }

      <div
        class="sample-group__grid"
        style="--sample-cols:${Math.max(1, columns)}"
      >
        ${group.items
          .map(
            (item) => `
          <button
            type="button"
            class="sample-item ${useContain ? "is-contain" : ""}"
            onclick="window.open('${escapeHtml(item.imageUrl)}', '_blank', 'noopener')"
            aria-label="${escapeHtml(group.title || subSection)} 샘플 보기"
          >
            <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(group.title || subSection)} 샘플">
          </button>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

/* =========================
   Shared Utils
========================= */

async function fetchCsv(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`CSV 요청 실패: ${response.status}`);
  }

  const text = await response.text();
  return parseCsv(text);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0].map((v) => v.trim());

  return rows
    .slice(1)
    .filter((r) => r.some((v) => String(v).trim() !== ""))
    .map((r) => {
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = (r[idx] || "").trim();
      });
      return obj;
    });
}

function parseTags(tagString) {
  return String(tagString || "")
    .split(/\s+(?=#)/g)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function convertGoogleImageUrl(url) {
  if (!url) return "";

  if (url.includes("lh3.googleusercontent.com")) {
    return url;
  }

  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match?.[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  return url;
}

function normalizeSortDate(value) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/[^\d]/g, "");

  if (!digits) return "000000";
  if (digits.length >= 6) return digits.slice(0, 6);
  return digits.padStart(6, "0");
}

function getDateNumber(item) {
  return Number(String(item.sortDate || "0").replace(/[^\d]/g, "")) || 0;
}

function compareByDateDescThenIndex(a, b) {
  const aDate = getDateNumber(a);
  const bDate = getDateNumber(b);

  if (bDate !== aDate) return bDate - aDate;
  return a._index - b._index;
}

function compareByGroupOrderThenDateDescThenIndex(a, b) {
  const aGroup = Number.isFinite(a.groupOrder) ? a.groupOrder : 999;
  const bGroup = Number.isFinite(b.groupOrder) ? b.groupOrder : 999;

  if (aGroup !== bGroup) return aGroup - bGroup;

  const aDate = getDateNumber(a);
  const bDate = getDateNumber(b);

  if (bDate !== aDate) return bDate - aDate;
  return a._index - b._index;
}

function uniqueKeepOrder(arr) {
  const seen = new Set();
  return arr.filter((value) => {
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function toNumber(value, fallback = 0) {
  const num = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(num) ? num : fallback;
}

function formatPrice(value) {
  const num = Number(String(value).replace(/[^\d]/g, ""));
  if (!Number.isFinite(num) || !num) return String(value || "");
  return `${num.toLocaleString("ko-KR")}원`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}





(function initFormSection(){
  const checks = Array.from(document.querySelectorAll(".form-category-check"));
  const copyBtn = document.getElementById("copyFormBtn");
  const resetBtn = document.getElementById("resetFormBtn");
  const topBtn = document.getElementById("topBtn");

  const platformInput = document.getElementById("formPlatformNickname");
  const characterRef = document.getElementById("formCharacterRef");
  const requestContent = document.getElementById("formRequestContent");
  const etcRequest = document.getElementById("formEtcRequest");

  const optionConfigs = [
    { target: "option-sub-emote", label: "구독티콘", formatter: () => formatQtyLine("구독티콘", "subEmoteQty") },
    { target: "option-anim-emote", label: "움짤티콘", formatter: () => formatQtyLine("움짤티콘", "animEmoteQty") },
    { target: "option-sub-badge", label: "구독뱃지", formatter: () => formatQtyLine("구독뱃지", "subBadgeQty") },
    { target: "option-anim-badge", label: "움짤뱃지", formatter: () => formatQtyLine("움짤뱃지", "animBadgeQty") },
    { target: "option-profile", label: "프로필 사진", formatter: () => formatQtyLine("프로필 사진", "profileQty") },
    { target: "option-banner", label: "하단배너", formatter: formatBannerLines },
    { target: "option-ziptok", label: "짚톡", formatter: formatZiptokLines },
    { target: "option-illust", label: "일러스트", formatter: formatIllustLines }
  ];

  const illustTypeRadios = Array.from(document.querySelectorAll('input[name="illustType"]'));
  const illustSdPoseRadios = Array.from(document.querySelectorAll('input[name="illustSdPose"]'));
  const illustSdBranch = document.getElementById("illustSdBranch");
  const licenseChecks = [
    { check: document.getElementById("illustPersonalCheck"), wrap: document.getElementById("illustPersonalQtyWrap"), input: document.getElementById("illustPersonalQty"), label: "개인용" },
    { check: document.getElementById("illustStreamCheck"), wrap: document.getElementById("illustStreamQtyWrap"), input: document.getElementById("illustStreamQty"), label: "방송용" },
    { check: document.getElementById("illustCommercialCheck"), wrap: document.getElementById("illustCommercialQtyWrap"), input: document.getElementById("illustCommercialQty"), label: "상업용" }
  ];

  function getCheckedTarget(targetId){
    return document.querySelector(`.form-category-check[data-target="${targetId}"]`);
  }

  function getInputValue(id){
    return document.getElementById(id)?.value.trim() || "";
  }

  function getPositiveInt(id){
    const raw = getInputValue(id);
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  }

  function formatQtyLine(label, inputId){
    const qty = getPositiveInt(inputId);
    return [`- ${label}${qty ? ` / ${qty}개` : ""}`];
  }

  function formatBannerLines(){
    const lines = [];
    const fixed = getPositiveInt("bannerFixedQty");
    const free = getPositiveInt("bannerFreeQty");
    if (fixed) lines.push(`- 하단배너 / 고정형 / ${fixed}개`);
    if (free) lines.push(`- 하단배너 / 자유형 / ${free}개`);
    return lines.length ? lines : ["- 하단배너"];
  }

  function formatZiptokLines(){
    const lines = [];
    const stand = getPositiveInt("ziptokStandQty");
    const desk = getPositiveInt("ziptokDeskQty");
    if (stand) lines.push(`- 짚톡 / 차렷 / ${stand}개`);
    if (desk) lines.push(`- 짚톡 / 책상 세트 / ${desk}개`);
    return lines.length ? lines : ["- 짚톡"];
  }

  function getRadioValue(name){
    return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
  }

  function formatIllustLines(){
    const illustType = getRadioValue("illustType");
    const sdPose = illustType === "SD" ? getRadioValue("illustSdPose") : "";
    const prefix = ["일러스트", illustType, sdPose].filter(Boolean).join(" / ");
    const lines = [];

    licenseChecks.forEach(({ check, input, label }) => {
      if (!check?.checked) return;
      const qty = Number(input?.value || 0);
      lines.push(`- ${prefix || "일러스트"} / ${label}${qty > 0 ? ` / ${Math.floor(qty)}개` : ""}`);
    });

    return lines.length ? lines : [`- ${prefix || "일러스트"}`];
  }

  function syncOptionCards(){
    checks.forEach((check) => {
      const card = document.getElementById(check.dataset.target);
      if (card) card.hidden = !check.checked;
    });
  }

  function syncIllustState(){
    const type = getRadioValue("illustType");
    if (illustSdBranch) illustSdBranch.hidden = type !== "SD";
    if (type !== "SD") {
      illustSdPoseRadios.forEach((radio) => { radio.checked = false; });
    }
  }

  function syncLicenseQty(){
    licenseChecks.forEach(({ check, wrap, input }) => {
      if (!wrap || !input || !check) return;
      wrap.hidden = !check.checked;
      if (!check.checked) input.value = "";
    });
  }

  function getSelectedOptionsText(){
    const lines = [];
    optionConfigs.forEach((config) => {
      const checkbox = getCheckedTarget(config.target);
      if (!checkbox?.checked) return;
      const result = config.formatter();
      if (Array.isArray(result)) lines.push(...result);
    });
    return lines.length ? lines.join("\n") : "-";
  }

  function buildCopyText(){
    const platform = platformInput?.value.trim() || "-";
    const character = characterRef?.value.trim() || "-";
    const request = requestContent?.value.trim() || "-";
    const etc = etcRequest?.value.trim() || "-";
    const options = getSelectedOptionsText();

    return `[신청 양식]\n\n방송 플랫폼 / 닉네임\n${platform}\n\n신청하실 타입과 갯수\n${options}\n\n캐릭터 자료\n${character}\n\n신청 내용\n${request}\n\n기타 요청사항\n${etc}`;
  }

  function resetForm(){
    checks.forEach((check) => { check.checked = false; });
    document.querySelectorAll("#form input, #form textarea").forEach((el) => {
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      } else {
        el.value = "";
      }
    });
    syncOptionCards();
    syncIllustState();
    syncLicenseQty();
  }

  function syncTopButton(){
    if (!topBtn) return;
    topBtn.classList.toggle("is-visible", window.scrollY > 320);
  }

  checks.forEach((check) => check.addEventListener("change", syncOptionCards));
  illustTypeRadios.forEach((radio) => radio.addEventListener("change", syncIllustState));
  licenseChecks.forEach(({ check }) => check?.addEventListener("change", syncLicenseQty));

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(buildCopyText());
        const original = copyBtn.textContent;
        copyBtn.textContent = "복사 완료!";
        setTimeout(() => { copyBtn.textContent = original; }, 1400);
      } catch (error) {
        console.error(error);
        alert("복사에 실패했습니다. 다시 시도해주세요.");
      }
    });
  }

  if (resetBtn) resetBtn.addEventListener("click", resetForm);
  if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", syncTopButton, { passive: true });

  syncOptionCards();
  syncIllustState();
  syncLicenseQty();
  syncTopButton();
})();
