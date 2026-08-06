(() => {

  "use strict";

 

  const DATA_PATHS = {

    axis: "data/axis.json",

    western: "data/western.json",

    eastern: "data/eastern.json",

    kabbalah: "data/kabbalah.json",

    katakamuna: "data/katakamuna.json"

  };

 

  const DEPENDENCIES = {

    astronomy: "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js",

    lunar: "https://cdn.jsdelivr.net/npm/lunar-javascript@1.7.7/lunar.js"

  };

 

  const PLANETS = [

    ["太陽", "Sun"], ["月", "Moon"], ["水星", "Mercury"], ["金星", "Venus"],

    ["火星", "Mars"], ["木星", "Jupiter"], ["土星", "Saturn"],

    ["天王星", "Uranus"], ["海王星", "Neptune"], ["冥王星", "Pluto"]

  ];

 

  const ZODIAC = [

    "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座",

    "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"

  ];

 

  const STEM_INFO = {

    "甲": { element: "木", polarity: "陽" }, "乙": { element: "木", polarity: "陰" },

    "丙": { element: "火", polarity: "陽" }, "丁": { element: "火", polarity: "陰" },

    "戊": { element: "土", polarity: "陽" }, "己": { element: "土", polarity: "陰" },

    "庚": { element: "金", polarity: "陽" }, "辛": { element: "金", polarity: "陰" },

    "壬": { element: "水", polarity: "陽" }, "癸": { element: "水", polarity: "陰" }

  };

 

  const BRANCH_MAIN_STEM = {

    "子": "癸", "丑": "己", "寅": "甲", "卯": "乙", "辰": "戊", "巳": "丙",

    "午": "丁", "未": "己", "申": "庚", "酉": "辛", "戌": "戊", "亥": "壬"

  };

 

  const GENERATES = { "木": "火", "火": "土", "土": "金", "金": "水", "水": "木" };

  const CONTROLS = { "木": "土", "土": "水", "水": "火", "火": "金", "金": "木" };

 

  const FLOWER_ORDER = ["感", "受", "理", "時", "動", "境", "安", "関", "現", "情", "信", "放"];

  const FLOWER_NAMES = {

    "感": "直感", "受": "受容", "理": "理解", "時": "時", "動": "行動", "境": "境界",

    "安": "安心", "関": "関係", "現": "表現", "情": "感情", "信": "信頼", "放": "手放し"

  };

 

  const TAROT_MAJOR = [

    "愚者", "魔術師", "女教皇", "女帝", "皇帝", "教皇", "恋人", "戦車", "力", "隠者",

    "運命の輪", "正義", "吊るされた男", "死神", "節制", "悪魔", "塔", "星", "月", "太陽", "審判", "世界"

  ];

 

  const state = { data: null, result: null };

  const byId = (id) => document.getElementById(id);

 

  function round(value, digits = 2) {

    const unit = 10 ** digits;

    return Math.round((Number(value) + Number.EPSILON) * unit) / unit;

  }

 

  function normalizeDegrees(value) {

    return ((Number(value) % 360) + 360) % 360;

  }

 

  function zodiacFromLongitude(longitude) {

    return ZODIAC[Math.floor(normalizeDegrees(longitude) / 30)];

  }

 

  function degreeInSign(longitude) {

    return round(normalizeDegrees(longitude) % 30, 2);

  }

 

  function emptyAxisMap(axes) {

    return Object.fromEntries(axes.map((axis) => [axis.id, 0]));

  }

 

  function addScores(target, scores) {

    Object.entries(scores || {}).forEach(([axisId, value]) => {

      if (Object.hasOwn(target, axisId)) target[axisId] += Number(value) || 0;

    });

  }

 

  function normalizeAxisMap(raw, targetTotal) {

    const rawTotal = Object.values(raw).reduce((sum, value) => sum + value, 0);

    if (rawTotal === 0) {

      return { total: 0, values: Object.fromEntries(Object.keys(raw).map((key) => [key, 0])) };

    }

    const factor = targetTotal / rawTotal;

    return {

      total: targetTotal,

      values: Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, round(value * factor)]))

    };

  }

 

  function loadScript(url, readyTest) {

    return new Promise((resolve, reject) => {

      if (readyTest()) return resolve();

      const existing = [...document.scripts].find((script) => script.src === url);

      if (existing) {

        existing.addEventListener("load", resolve, { once: true });

        existing.addEventListener("error", () => reject(new Error(`${url} を読み込めませんでした。`)), { once: true });

        return;

      }

      const script = document.createElement("script");

      script.src = url;

      script.async = true;

      script.crossOrigin = "anonymous";

      script.addEventListener("load", () => readyTest() ? resolve() : reject(new Error(`${url} の機能を確認できませんでした。`)), { once: true });

      script.addEventListener("error", () => reject(new Error(`${url} を読み込めませんでした。`)), { once: true });

      document.head.appendChild(script);

    });

  }

 

  async function loadDependencies() {

    await loadScript(DEPENDENCIES.astronomy, () => Boolean(window.Astronomy?.GeoVector));

    await loadScript(DEPENDENCIES.lunar, () => Boolean(window.Solar?.fromYmdHms));

  }

 

  async function loadJson(path) {

    const response = await fetch(new URL(path, document.baseURI), { cache: "no-store" });

    if (!response.ok) throw new Error(`${path}（HTTP ${response.status}）を読み込めませんでした。`);

    try { return await response.json(); }

    catch { throw new Error(`${path} のJSON形式を確認してください。`); }

  }

 

  async function loadData() {

    const [axis, western, eastern, kabbalah, katakamuna] = await Promise.all([

      loadJson(DATA_PATHS.axis), loadJson(DATA_PATHS.western), loadJson(DATA_PATHS.eastern),

      loadJson(DATA_PATHS.kabbalah), loadJson(DATA_PATHS.katakamuna)

    ]);

    state.data = { axis, western, eastern, kabbalah, katakamuna };

  }

 

  function validateRuleData() {

    const axes = state.data.axis.axes;

    if (!Array.isArray(axes) || axes.length !== 12) throw new Error("12座定義が12件ではありません。");

    if (new Set(axes.map((axis) => axis.id)).size !== 12) throw new Error("12座IDが重複しています。");

    state.data.western.elements.forEach((item) => {

      if (Object.values(item.scores).reduce((sum, value) => sum + Number(value), 0) !== 20) {

        throw new Error(`西洋変換表 ${item.name} の合計が20ではありません。`);

      }

    });

    state.data.eastern.elements.forEach((item) => {

      if (Object.values(item.scores).reduce((sum, value) => sum + Number(value), 0) !== 20) {

        throw new Error(`東洋変換表 ${item.name} の合計が20ではありません。`);

      }

    });

  }

 

  function parseBirthInput() {

    const dateValue = byId("birth-date").value;

    const timeValue = byId("birth-time").value;

    const timezone = Number(byId("timezone").value);

    if (!dateValue) throw new Error("生年月日を入力してください。");

    if (!Number.isFinite(timezone)) throw new Error("UTC時差を確認してください。");

    const [year, month, day] = dateValue.split("-").map(Number);

    const [hour, minute] = timeValue ? timeValue.split(":").map(Number) : [12, 0];

    const utcMilliseconds = Date.UTC(year, month - 1, day, hour, minute, 0) - timezone * 60 * 60 * 1000;

    return { year, month, day, hour, minute, hasBirthTime: Boolean(timeValue), timezone, utcDate: new Date(utcMilliseconds) };

  }

 

  function planetLongitude(bodyName, date) {

    if (!window.Astronomy) throw new Error("西洋計算ライブラリを読み込めませんでした。");

    let longitude;

    if (bodyName === "Sun") longitude = Astronomy.SunPosition(date).elon;

    else if (bodyName === "Moon") longitude = Astronomy.EclipticGeoMoon(date).lon;

    else {

      const body = Astronomy.Body[bodyName];

      if (!body) throw new Error(`${bodyName} の天体定義を確認できませんでした。`);

      longitude = Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;

    }

    if (!Number.isFinite(longitude)) throw new Error(`${bodyName} の黄経を取得できませんでした。`);

    return normalizeDegrees(longitude);

  }

 

  function calculateWesternElements(birth) {

    return PLANETS.map(([label, bodyName]) => {

      const longitude = planetLongitude(bodyName, birth.utcDate);

      return { label, key: bodyName, longitude: round(longitude), sign: zodiacFromLongitude(longitude), degree: degreeInSign(longitude) };

    });

  }

 

  function tenGodToStar(dayStem, targetStem) {

    const day = STEM_INFO[dayStem];

    const target = STEM_INFO[targetStem];

    if (!day || !target) throw new Error("十大主星の算定に使う干を確認してください。");

    const samePolarity = day.polarity === target.polarity;

    if (day.element === target.element) return samePolarity ? "貫索星" : "石門星";

    if (GENERATES[day.element] === target.element) return samePolarity ? "鳳閣星" : "調舒星";

    if (CONTROLS[day.element] === target.element) return samePolarity ? "禄存星" : "司禄星";

    if (CONTROLS[target.element] === day.element) return samePolarity ? "車騎星" : "牽牛星";

    if (GENERATES[target.element] === day.element) return samePolarity ? "玉堂星" : "龍高星";

    throw new Error(`${dayStem}と${targetStem}の関係を判定できませんでした。`);

  }

 

  function calculateEasternElements(birth) {

    if (!window.Solar || typeof Solar.fromYmdHms !== "function") throw new Error("東洋計算ライブラリを読み込めませんでした。");

    const lunar = Solar.fromYmdHms(birth.year, birth.month, birth.day, birth.hour, birth.minute, 0).getLunar();

    const yearGan = lunar.getYearGanExact();

    const yearZhi = lunar.getYearZhiExact();

    const monthGan = lunar.getMonthGanExact();

    const monthZhi = lunar.getMonthZhiExact();

    const dayGan = lunar.getDayGanExact2();

    const dayZhi = lunar.getDayZhiExact2();

    const targetStems = [

      { source: "年干", stem: yearGan }, { source: "月干", stem: monthGan },

      { source: "年支本元", stem: BRANCH_MAIN_STEM[yearZhi] },

      { source: "月支本元", stem: BRANCH_MAIN_STEM[monthZhi] },

      { source: "日支本元", stem: BRANCH_MAIN_STEM[dayZhi] }

    ];

    if (targetStems.some((item) => !item.stem)) throw new Error("地支本元の対応を確認できませんでした。");

    return {

      pillars: { year: `${yearGan}${yearZhi}`, month: `${monthGan}${monthZhi}`, day: `${dayGan}${dayZhi}` },

      dayMaster: dayGan,

      targets: targetStems,

      stars: targetStems.map((item) => ({ ...item, star: tenGodToStar(dayGan, item.stem) }))

    };

  }

 

  function calculateLookupSystem(elements, selections, axes, targetTotal) {

    const raw = emptyAxisMap(axes);

    const elementMap = new Map(elements.map((item) => [item.name, item]));

    selections.forEach((selection) => {

      const item = elementMap.get(selection);

      if (item) addScores(raw, item.scores);

    });

    const normalized = normalizeAxisMap(raw, targetTotal);

    return {

      selections, raw,

      rawTotal: Object.values(raw).reduce((sum, value) => sum + value, 0),

      normalized: normalized.values, normalizedTotal: normalized.total

    };

  }

 

  function reduceNumerology(value) {

    let number = Math.abs(Number(value)) || 0;

    while (number > 9 && ![11, 22, 33].includes(number)) {

      number = String(number).split("").reduce((sum, digit) => sum + Number(digit), 0);

    }

    return number;

  }

 

  function calculateKabbalahNumbers(birth) {

    const month = reduceNumerology(birth.month);

    const day = reduceNumerology(birth.day);

    const year = reduceNumerology(birth.year);

    return { month, day, year, total: reduceNumerology(month + day + year) };

  }

 

  function calculateKabbalah(birth, axes) {

    const numbers = calculateKabbalahNumbers(birth);

    const raw = emptyAxisMap(axes);

    const numberMap = new Map(state.data.kabbalah.numbers.map((item) => [Number(item.number), item]));

    Object.values(numbers).forEach((number) => {

      const item = numberMap.get(number);

      if (item) addScores(raw, item.scores);

    });

    const values100 = Object.fromEntries(Object.entries(raw).map(([axisId, value]) => [axisId, round((value / 20) * 100)]));

    return { numbers, raw, values100 };

  }

 

  function hiraganaToKatakana(text) {

    return text.replace(/[ぁ-ゖ]/g, (character) => String.fromCharCode(character.charCodeAt(0) + 0x60));

  }

 

  function normalizeKatakamunaName(value) {

    return hiraganaToKatakana((value || "").trim())

      .replace(/[・･\s]/g, "").replace(/[ァ]/g, "ア").replace(/[ィ]/g, "イ")

      .replace(/[ゥ]/g, "ウ").replace(/[ェ]/g, "エ").replace(/[ォ]/g, "オ")

      .replace(/[ヵ]/g, "カ").replace(/[ヶ]/g, "ケ").replace(/[ッ]/g, "ツ")

      .replace(/[ャ]/g, "ヤ").replace(/[ュ]/g, "ユ").replace(/[ョ]/g, "ヨ").replace(/ー/g, "");

  }

 

  function calculateKatakamuna(nameValue, axes) {

    const raw = emptyAxisMap(axes);

    const normalizedName = normalizeKatakamunaName(nameValue);

    if (!normalizedName) return { name: "", normalizedName: "", sounds: [], unknownSounds: [], raw };

    const soundMap = new Map(state.data.katakamuna.sounds.map((item) => [item.sound, item]));

    const sounds = [];

    const unknownSounds = [];

    let previousMappedSound = null;

    [...normalizedName].forEach((sound) => {

      let item = soundMap.get(sound);

      if (sound === "ン" && previousMappedSound) item = soundMap.get(previousMappedSound);

      if (!item) { unknownSounds.push(sound); return; }

      addScores(raw, item.distribution);

      sounds.push({ input: sound, used: item.sound, no: item.no });

      if (sound !== "ン") previousMappedSound = sound;

    });

    return {

      name: nameValue, normalizedName, sounds, unknownSounds,

      raw: Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, round(value)]))

    };

  }

 

  function calculateAll() {

    const axes = state.data.axis.axes;

    const axisIds = axes.map((axis) => axis.id);

    const birth = parseBirthInput();

    const westernElements = calculateWesternElements(birth);

    const easternElements = calculateEasternElements(birth);

    const western = calculateLookupSystem(state.data.western.elements, westernElements.map((item) => item.sign), axes, 400);

    const eastern = calculateLookupSystem(state.data.eastern.elements, easternElements.stars.map((item) => item.star), axes, 400);

    const heavenEarth = Object.fromEntries(axisIds.map((axisId) => [

      axisId, round((western.normalized[axisId] + eastern.normalized[axisId]) / 2)

    ]));

    const kabbalah = calculateKabbalah(birth, axes);

    const katakamuna = calculateKatakamuna(byId("nickname").value, axes);

    const ranking = axes.map((axis) => ({ ...axis, value: heavenEarth[axis.id] })).sort((a, b) => b.value - a.value);

    return {

      createdAt: new Date().toISOString(), savedAt: new Date().toISOString(), cycle: 1,

      primaryAxis: ranking[0]?.short || ranking[0]?.name || "",

      person: {

        birthDate: byId("birth-date").value, birthTime: byId("birth-time").value,

        birthPlace: byId("birth-place").value.trim(), timezone: birth.timezone,

        nickname: byId("nickname").value.trim(),

        gender: document.querySelector('input[name="gender"]:checked')?.value || ""

      },

      birth, westernElements, easternElements, western, eastern, heavenEarth, kabbalah, katakamuna, ranking,

      tarot: readTarot(), notes: byId("notes").value.trim()

    };

  }

 

  function escapeHtml(value) {

    return String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));

  }

 

  function renderCalculationSummary(result) {

    byId("western-elements").textContent = result.westernElements

      .map((item) => `${item.label}：${item.sign} ${item.degree}°`).join(" ／ ");

    byId("eastern-pillars").textContent = `干支：年柱 ${result.easternElements.pillars.year} ／ 月柱 ${result.easternElements.pillars.month} ／ 日柱 ${result.easternElements.pillars.day}`;

    byId("eastern-stars").textContent = `十大主星5点：${result.easternElements.stars.map((item) => item.star).join("・")}`;

  }

 

  function renderSeats(result) {

    const axes = state.data.axis.axes;

    byId("seat-grid").innerHTML = axes.map((axis) => {

      const id = axis.id;

      return `<article class="seat-box" data-axis-id="${escapeHtml(id)}">

        <div class="seat-heading">

          <span class="seat-short">${escapeHtml(axis.short || id)}</span>

          <span><strong>${escapeHtml(axis.name || FLOWER_NAMES[id] || id)}</strong><small>${escapeHtml(axis.nature || axis.type || "")}</small></span>

        </div>

        <div class="seat-main-value">${result.heavenEarth[id].toFixed(1)}</div>

        <dl class="seat-details">

          <div><dt>西洋</dt><dd>${result.western.normalized[id].toFixed(1)}</dd></div>

          <div><dt>東洋</dt><dd>${result.eastern.normalized[id].toFixed(1)}</dd></div>

          <div><dt>カバラ</dt><dd>${result.kabbalah.values100[id].toFixed(1)}</dd></div>

          <div><dt>名前音</dt><dd>${Number(result.katakamuna.raw[id] || 0).toFixed(1)}</dd></div>

        </dl>

      </article>`;

    }).join("");

 

    const top = result.ranking.slice(0, 3).map((axis) => `${axis.short || axis.id}${axis.name} ${axis.value.toFixed(1)}`).join(" ／ ");

    byId("ranking-summary").textContent = `天地統合の上位：${top}`;

    const n = result.kabbalah.numbers;

    byId("kabbalah-summary").textContent = `カバラ4秘数：月${n.month}・日${n.day}・年${n.year}・総数${n.total}`;

    byId("katakamuna-summary").textContent = result.katakamuna.normalizedName

      ? `名前音：${result.katakamuna.normalizedName}${result.katakamuna.unknownSounds.length ? `（未対応：${result.katakamuna.unknownSounds.join("・")}）` : ""}`

      : "名前音：未入力";

  }

 

  function polarPoint(cx, cy, radius, index) {

    const angle = (-90 + index * 30) * Math.PI / 180;

    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };

  }

 

  function closedCatmullRomPath(points, tension = 1) {

    if (points.length < 3) return "";

    const count = points.length;

    let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    for (let i = 0; i < count; i += 1) {

      const p0 = points[(i - 1 + count) % count];

      const p1 = points[i];

      const p2 = points[(i + 1) % count];

      const p3 = points[(i + 2) % count];

      const c1 = { x: p1.x + ((p2.x - p0.x) / 6) * tension, y: p1.y + ((p2.y - p0.y) / 6) * tension };

      const c2 = { x: p2.x - ((p3.x - p1.x) / 6) * tension, y: p2.y - ((p3.y - p1.y) / 6) * tension };

      path += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;

    }

    return `${path} Z`;

  }

 

  function drawFlowerWave(values) {

    const root = byId("flower-wave");

    if (!root) return;

    const size = 620;

    const cx = size / 2;

    const cy = size / 2;

    const innerRadius = 62;

    const outerRadius = 220;

    const labelRadius = 260;

    const observedMax = Math.max(60, ...FLOWER_ORDER.map((id) => Number(values[id]) || 0));

    const points = FLOWER_ORDER.map((id, index) => {

      const value = Math.max(0, Number(values[id]) || 0);

      const radius = innerRadius + (value / observedMax) * (outerRadius - innerRadius);

      return { ...polarPoint(cx, cy, radius, index), id, value };

    });

    const wavePath = closedCatmullRomPath(points, 0.9);

    const guides = [0.25, 0.5, 0.75, 1].map((ratio) => {

      const radius = innerRadius + ratio * (outerRadius - innerRadius);

      return `<circle cx="${cx}" cy="${cy}" r="${radius.toFixed(1)}" class="flower-guide"/>`;

    }).join("");

    const axes = FLOWER_ORDER.map((id, index) => {

      const end = polarPoint(cx, cy, outerRadius, index);

      return `<line x1="${cx}" y1="${cy}" x2="${end.x.toFixed(1)}" y2="${end.y.toFixed(1)}" class="flower-axis"/>`;

    }).join("");

    const labels = FLOWER_ORDER.map((id, index) => {

      const point = polarPoint(cx, cy, labelRadius, index);

      const anchor = point.x < cx - 20 ? "end" : point.x > cx + 20 ? "start" : "middle";

      return `<g class="flower-label"><text x="${point.x.toFixed(1)}" y="${(point.y - 4).toFixed(1)}" text-anchor="${anchor}">${id}・${FLOWER_NAMES[id]}</text><text class="flower-label-value" x="${point.x.toFixed(1)}" y="${(point.y + 17).toFixed(1)}" text-anchor="${anchor}">${Number(values[id] || 0).toFixed(1)}</text></g>`;

    }).join("");

    const dots = points.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.5" class="flower-point"><title>${point.id}・${FLOWER_NAMES[point.id]} ${point.value.toFixed(1)}</title></circle>`).join("");

    root.innerHTML = `<svg class="flower-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="12座の花波形">

      ${guides}${axes}<path d="${wavePath}" class="flower-wave-shape"/>${dots}${labels}

      <circle cx="${cx}" cy="${cy}" r="4" class="flower-center"/>

    </svg>`;

  }

 

  function readTarot() {

    return {

      current: { card: byId("tarot-current-card").value, direction: byId("tarot-current-direction").value },

      challenge: { card: byId("tarot-challenge-card").value, direction: byId("tarot-challenge-direction").value },

      key: { card: byId("tarot-key-card").value, direction: byId("tarot-key-direction").value }

    };

  }

 

  function populateTarot() {

    ["tarot-current-card", "tarot-challenge-card", "tarot-key-card"].forEach((id) => {

      const select = byId(id);

      TAROT_MAJOR.forEach((card) => {

        const option = document.createElement("option");

        option.value = card;

        option.textContent = card;

        select.appendChild(option);

      });

    });

  }

 

  function saveResult(result) {

    const serialized = JSON.stringify(result);

    sessionStorage.setItem("jikouStudioData", serialized);

    localStorage.setItem("jikouStudioData", serialized);

  }

 

  function setStatus(id, message, isError = false) {

    const element = byId(id);

    if (!element) return;

    element.textContent = message;

    element.classList.toggle("error", isError);

  }

 

  function setCalculateBusy(isBusy) {

    const button = byId("calculate-seats");

    button.disabled = isBusy;

    button.textContent = isBusy ? "算定しています…" : "12座を算定";

  }

 

  async function prepareEngine() {

    if (state.data) return;

    setStatus("engine-status", "算定エンジンを読み込んでいます…");

    await loadDependencies();

    await loadData();

    validateRuleData();

    setStatus("engine-status", "算定エンジンを読み込みました。");

  }

 

  async function handleCalculate() {

    if (!byId("studio-form").reportValidity()) {

      setStatus("seat-status", "入力内容を確認してください。", true);

      return;

    }

    setCalculateBusy(true);

    setStatus("seat-status", "12座を算定しています…");

    try {

      await prepareEngine();

      state.result = calculateAll();

      renderCalculationSummary(state.result);

      renderSeats(state.result);

      drawFlowerWave(state.result.heavenEarth);

      saveResult(state.result);

      setStatus("seat-status", "12座と花波形を表示しました。");

      byId("flower-wave-panel").hidden = false;

      byId("flower-wave-panel").scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (error) {

      console.error(error);

      setStatus("seat-status", error.message || "算定中にエラーが発生しました。", true);

    } finally {

      setCalculateBusy(false);

    }

  }

 

  function handleCreateResult() {

    if (!state.result) {

      setStatus("result-status", "先に「12座を算定」を押してください。", true);

      return;

    }

    state.result.tarot = readTarot();

    state.result.notes = byId("notes").value.trim();

    saveResult(state.result);

    setStatus("result-status", "解析結果を保存しました。結果ページへ移動します。");

    window.location.href = "result.html";

  }

 

  function setupNicknameValidation() {

    byId("nickname").addEventListener("input", (event) => {

      const value = event.currentTarget.value;

      event.currentTarget.setCustomValidity(value === "" || /^[ぁ-ゖー\s]+$/.test(value) ? "" : "呼び名は、ひらがなで入力してください。");

    });

  }

 

  async function init() {

    populateTarot();

    setupNicknameValidation();

    byId("calculate-seats").addEventListener("click", handleCalculate);

    byId("create-result").addEventListener("click", handleCreateResult);

    try { await prepareEngine(); }

    catch (error) {

      console.error(error);

      setStatus("engine-status", error.message || "算定エンジンを読み込めませんでした。", true);

    }

  }

 

  document.addEventListener("DOMContentLoaded", init);

})();
