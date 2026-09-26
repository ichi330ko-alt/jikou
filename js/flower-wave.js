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

    ["å¤ªé™½", "Sun"], ["æœˆ", "Moon"], ["æ°´æ˜Ÿ", "Mercury"], ["é‡‘æ˜Ÿ", "Venus"],

    ["ç«æ˜Ÿ", "Mars"], ["æœ¨æ˜Ÿ", "Jupiter"], ["åœŸæ˜Ÿ", "Saturn"],

    ["å¤©çŽ‹æ˜Ÿ", "Uranus"], ["æµ·çŽ‹æ˜Ÿ", "Neptune"], ["å†¥çŽ‹æ˜Ÿ", "Pluto"]

  ];

 

  const ZODIAC = [

    "ç‰¡ç¾Šåº§", "ç‰¡ç‰›åº§", "åŒå­åº§", "èŸ¹åº§", "ç…å­åº§", "ä¹™å¥³åº§",

    "å¤©ç§¤åº§", "è åº§", "å°„æ‰‹åº§", "å±±ç¾Šåº§", "æ°´ç“¶åº§", "é­šåº§"

  ];

 

  const STEM_INFO = {

    "ç”²": { element: "æœ¨", polarity: "é™½" }, "ä¹™": { element: "æœ¨", polarity: "é™°" },

    "ä¸™": { element: "ç«", polarity: "é™½" }, "ä¸": { element: "ç«", polarity: "é™°" },

    "æˆŠ": { element: "åœŸ", polarity: "é™½" }, "å·±": { element: "åœŸ", polarity: "é™°" },

    "åºš": { element: "é‡‘", polarity: "é™½" }, "è¾›": { element: "é‡‘", polarity: "é™°" },

    "å£¬": { element: "æ°´", polarity: "é™½" }, "ç™¸": { element: "æ°´", polarity: "é™°" }

  };

 

  const BRANCH_MAIN_STEM = {

    "å­": "ç™¸", "ä¸‘": "å·±", "å¯…": "ç”²", "å¯": "ä¹™", "è¾°": "æˆŠ", "å·³": "ä¸™",

    "åˆ": "ä¸", "æœª": "å·±", "ç”³": "åºš", "é…‰": "è¾›", "æˆŒ": "æˆŠ", "äº¥": "å£¬"

  };

 

  const GENERATES = { "æœ¨": "ç«", "ç«": "åœŸ", "åœŸ": "é‡‘", "é‡‘": "æ°´", "æ°´": "æœ¨" };

  const CONTROLS = { "æœ¨": "åœŸ", "åœŸ": "æ°´", "æ°´": "ç«", "ç«": "é‡‘", "é‡‘": "æœ¨" };

 

  const FLOWER_ORDER = ["æ„Ÿ", "å—", "ç†", "æ™‚", "å‹•", "å¢ƒ", "å®‰", "é–¢", "ç¾", "æƒ…", "ä¿¡", "æ”¾"];

  const FLOWER_NAMES = {

    "æ„Ÿ": "ç›´æ„Ÿ", "å—": "å—å®¹", "ç†": "ç†è§£", "æ™‚": "æ™‚", "å‹•": "è¡Œå‹•", "å¢ƒ": "å¢ƒç•Œ",

    "å®‰": "å®‰å¿ƒ", "é–¢": "é–¢ä¿‚", "ç¾": "è¡¨ç¾", "æƒ…": "æ„Ÿæƒ…", "ä¿¡": "ä¿¡é ¼", "æ”¾": "æ‰‹æ”¾ã—"

  };

 

  const TAROT_MAJOR = [

    "æ„šè€…", "é­”è¡“å¸«", "å¥³æ•™çš‡", "å¥³å¸", "çš‡å¸", "æ•™çš‡", "æ‹äºº", "æˆ¦è»Š", "åŠ›", "éš è€…",

    "é‹å‘½ã®è¼ª", "æ­£ç¾©", "åŠã‚‹ã•ã‚ŒãŸç”·", "æ­»ç¥ž", "ç¯€åˆ¶", "æ‚ªé­”", "å¡”", "æ˜Ÿ", "æœˆ", "å¤ªé™½", "å¯©åˆ¤", "ä¸–ç•Œ"

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

        existing.addEventListener("error", () => reject(new Error(`${url} ã‚’èª­ã¿è¾¼ã‚ã¾ã›ã‚“ã§ã—ãŸã€‚`)), { once: true });

        return;

      }

      const script = document.createElement("script");

      script.src = url;

      script.async = true;

      script.crossOrigin = "anonymous";

      script.addEventListener("load", () => readyTest() ? resolve() : reject(new Error(`${url} ã®æ©Ÿèƒ½ã‚’ç¢ºèªã§ãã¾ã›ã‚“ã§ã—ãŸã€‚`)), { once: true });

      script.addEventListener("error", () => reject(new Error(`${url} ã‚’èª­ã¿è¾¼ã‚ã¾ã›ã‚“ã§ã—ãŸã€‚`)), { once: true });

      document.head.appendChild(script);

    });

  }

 

  async function loadDependencies() {

    await loadScript(DEPENDENCIES.astronomy, () => Boolean(window.Astronomy?.GeoVector));

    await loadScript(DEPENDENCIES.lunar, () => Boolean(window.Solar?.fromYmdHms));

  }

 

  async function loadJson(path) {

    const response = await fetch(new URL(path, document.baseURI), { cache: "no-store" });

    if (!response.ok) throw new Error(`${path}ï¼ˆHTTP ${response.status}ï¼‰ã‚’èª­ã¿è¾¼ã‚ã¾ã›ã‚“ã§ã—ãŸã€‚`);

    try { return await response.json(); }

    catch { throw new Error(`${path} ã®JSONå½¢å¼ã‚’ç¢ºèªã—ã¦ãã ã•ã„ã€‚`); }

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

    if (!Array.isArray(axes) || axes.length !== 12) throw new Error("12åº§å®šç¾©ãŒ12ä»¶ã§ã¯ã‚ã‚Šã¾ã›ã‚“ã€‚");

    if (new Set(axes.map((axis) => axis.id)).size !== 12) throw new Error("12åº§IDãŒé‡è¤‡ã—ã¦ã„ã¾ã™ã€‚");

    state.data.western.elements.forEach((item) => {

      if (Object.values(item.scores).reduce((sum, value) => sum + Number(value), 0) !== 20) {

        throw new Error(`è¥¿æ´‹å¤‰æ›è¡¨ ${item.name} ã®åˆè¨ˆãŒ20ã§ã¯ã‚ã‚Šã¾ã›ã‚“ã€‚`);

      }

    });

    state.data.eastern.elements.forEach((item) => {

      if (Object.values(item.scores).reduce((sum, value) => sum + Number(value), 0) !== 20) {

        throw new Error(`æ±æ´‹å¤‰æ›è¡¨ ${item.name} ã®åˆè¨ˆãŒ20ã§ã¯ã‚ã‚Šã¾ã›ã‚“ã€‚`);

      }

    });

  }

 

  function parseBirthInput() {

    const dateValue = byId("birth-date").value;

    const timeValue = byId("birth-time").value;

    const timezone = Number(byId("timezone").value);

    if (!dateValue) throw new Error("ç”Ÿå¹´æœˆæ—¥ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„ã€‚");

    if (!Number.isFinite(timezone)) throw new Error("UTCæ™‚å·®ã‚’ç¢ºèªã—ã¦ãã ã•ã„ã€‚");

    const [year, month, day] = dateValue.split("-").map(Number);

    const [hour, minute] = timeValue ? timeValue.split(":").map(Number) : [12, 0];

    const utcMilliseconds = Date.UTC(year, month - 1, day, hour, minute, 0) - timezone * 60 * 60 * 1000;

    return { year, month, day, hour, minute, hasBirthTime: Boolean(timeValue), timezone, utcDate: new Date(utcMilliseconds) };

  }

 

  function planetLongitude(bodyName, date) {

    if (!window.Astronomy) throw new Error("è¥¿æ´‹è¨ˆç®—ãƒ©ã‚¤ãƒ–ãƒ©ãƒªã‚’èª­ã¿è¾¼ã‚ã¾ã›ã‚“ã§ã—ãŸã€‚");

    let longitude;

    if (bodyName === "Sun") longitude = Astronomy.SunPosition(date).elon;

    else if (bodyName === "Moon") longitude = Astronomy.EclipticGeoMoon(date).lon;

    else {

      const body = Astronomy.Body[bodyName];

      if (!body) throw new Error(`${bodyName} ã®å¤©ä½“å®šç¾©ã‚’ç¢ºèªã§ãã¾ã›ã‚“ã§ã—ãŸã€‚`);

      longitude = Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;

    }

    if (!Number.isFinite(longitude)) throw new Error(`${bodyName} ã®é»„çµŒã‚’å–å¾—ã§ãã¾ã›ã‚“ã§ã—ãŸã€‚`);

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

    if (!day || !target) throw new Error("åå¤§ä¸»æ˜Ÿã®ç®—å®šã«ä½¿ã†å¹²ã‚’ç¢ºèªã—ã¦ãã ã•ã„ã€‚");

    const samePolarity = day.polarity === target.polarity;

    if (day.element === target.element) return samePolarity ? "è²«ç´¢æ˜Ÿ" : "çŸ³é–€æ˜Ÿ";

    if (GENERATES[day.element] === target.element) return samePolarity ? "é³³é–£æ˜Ÿ" : "èª¿èˆ’æ˜Ÿ";

    if (CONTROLS[day.element] === target.element) return samePolarity ? "ç¦„å­˜æ˜Ÿ" : "å¸ç¦„æ˜Ÿ";

    if (CONTROLS[target.element] === day.element) return samePolarity ? "è»Šé¨Žæ˜Ÿ" : "ç‰½ç‰›æ˜Ÿ";

    if (GENERATES[target.element] === day.element) return samePolarity ? "çŽ‰å ‚æ˜Ÿ" : "é¾é«˜æ˜Ÿ";

    throw new Error(`${dayStem}ã¨${targetStem}ã®é–¢ä¿‚ã‚’åˆ¤å®šã§ãã¾ã›ã‚“ã§ã—ãŸã€‚`);

  }

 

  function calculateEasternElements(birth) {

    if (!window.Solar || typeof Solar.fromYmdHms !== "function") throw new Error("æ±æ´‹è¨ˆç®—ãƒ©ã‚¤ãƒ–ãƒ©ãƒªã‚’èª­ã¿è¾¼ã‚ã¾ã›ã‚“ã§ã—ãŸã€‚");

    const lunar = Solar.fromYmdHms(birth.year, birth.month, birth.day, birth.hour, birth.minute, 0).getLunar();

    const yearGan = lunar.getYearGanExact();

    const yearZhi = lunar.getYearZhiExact();

    const monthGan = lunar.getMonthGanExact();

    const monthZhi = lunar.getMonthZhiExact();

    const dayGan = lunar.getDayGanExact2();

    const dayZhi = lunar.getDayZhiExact2();

    const targetStems = [

      { source: "å¹´å¹²", stem: yearGan }, { source: "æœˆå¹²", stem: monthGan },

      { source: "å¹´æ”¯æœ¬å…ƒ", stem: BRANCH_MAIN_STEM[yearZhi] },

      { source: "æœˆæ”¯æœ¬å…ƒ", stem: BRANCH_MAIN_STEM[monthZhi] },

      { source: "æ—¥æ”¯æœ¬å…ƒ", stem: BRANCH_MAIN_STEM[dayZhi] }

    ];

    if (targetStems.some((item) => !item.stem)) throw new Error("åœ°æ”¯æœ¬å…ƒã®å¯¾å¿œã‚’ç¢ºèªã§ãã¾ã›ã‚“ã§ã—ãŸã€‚");

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

    return text.replace(/[ã-ã‚–]/g, (character) => String.fromCharCode(character.charCodeAt(0) + 0x60));

  }

 

  function normalizeKatakamunaName(value) {

    return hiraganaToKatakana((value || "").trim())

      .replace(/[ãƒ»ï½¥\s]/g, "").replace(/[ã‚¡]/g, "ã‚¢").replace(/[ã‚£]/g, "ã‚¤")

      .replace(/[ã‚¥]/g, "ã‚¦").replace(/[ã‚§]/g, "ã‚¨").replace(/[ã‚©]/g, "ã‚ª")

      .replace(/[ãƒµ]/g, "ã‚«").replace(/[ãƒ¶]/g, "ã‚±").replace(/[ãƒƒ]/g, "ãƒ„")

      .replace(/[ãƒ£]/g, "ãƒ¤").replace(/[ãƒ¥]/g, "ãƒ¦").replace(/[ãƒ§]/g, "ãƒ¨").replace(/ãƒ¼/g, "");

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

      if (sound === "ãƒ³" && previousMappedSound) item = soundMap.get(previousMappedSound);

      if (!item) { unknownSounds.push(sound); return; }

      addScores(raw, item.distribution);

      sounds.push({ input: sound, used: item.sound, no: item.no });

      if (sound !== "ãƒ³") previousMappedSound = sound;

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

      .map((item) => `${item.label}ï¼š${item.sign} ${item.degree}Â°`).join(" ï¼ ");

    byId("eastern-pillars").textContent = `å¹²æ”¯ï¼šå¹´æŸ± ${result.easternElements.pillars.year} ï¼ æœˆæŸ± ${result.easternElements.pillars.month} ï¼ æ—¥æŸ± ${result.easternElements.pillars.day}`;

    byId("eastern-stars").textContent = `åå¤§ä¸»æ˜Ÿ5ç‚¹ï¼š${result.easternElements.stars.map((item) => item.star).join("ãƒ»")}`;

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

          <div><dt>è¥¿æ´‹</dt><dd>${result.western.normalized[id].toFixed(1)}</dd></div>

          <div><dt>æ±æ´‹</dt><dd>${result.eastern.normalized[id].toFixed(1)}</dd></div>

          <div><dt>ã‚«ãƒãƒ©</dt><dd>${result.kabbalah.values100[id].toFixed(1)}</dd></div>

          <div><dt>åå‰éŸ³</dt><dd>${Number(result.katakamuna.raw[id] || 0).toFixed(1)}</dd></div>

        </dl>

      </article>`;

    }).join("");

 

    const top = result.ranking.slice(0, 3).map((axis) => `${axis.short || axis.id}${axis.name} ${axis.value.toFixed(1)}`).join(" ï¼ ");

    byId("ranking-summary").textContent = `å¤©åœ°çµ±åˆã®ä¸Šä½ï¼š${top}`;

    const n = result.kabbalah.numbers;

    byId("kabbalah-summary").textContent = `ã‚«ãƒãƒ©4ç§˜æ•°ï¼šæœˆ${n.month}ãƒ»æ—¥${n.day}ãƒ»å¹´${n.year}ãƒ»ç·æ•°${n.total}`;

    byId("katakamuna-summary").textContent = result.katakamuna.normalizedName

      ? `åå‰éŸ³ï¼š${result.katakamuna.normalizedName}${result.katakamuna.unknownSounds.length ? `ï¼ˆæœªå¯¾å¿œï¼š${result.katakamuna.unknownSounds.join("ãƒ»")}ï¼‰` : ""}`

      : "åå‰éŸ³ï¼šæœªå…¥åŠ›";

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

    // heavenEarth ã¯ axis.json ã®è‹±èªžIDã§ä¿å­˜ã•ã‚Œã¦ã„ã¾ã™ã€‚
    // èŠ±ã®å¾ªç’°ã¯ä¸€æ–‡å­—ã‚­ãƒ¼ã§ç®¡ç†ã—ã¦ã„ã‚‹ãŸã‚ã€ã“ã“ã§å¯¾å¿œä»˜ã‘ã¾ã™ã€‚
    const axisIdByShort = Object.fromEntries(
      state.data.axis.axes.map((axis) => [axis.short, axis.id])
    );

    const flowerValues = Object.fromEntries(
      FLOWER_ORDER.map((short) => [
        short,
        Number(values[axisIdByShort[short]]) || 0
      ])
    );

    const root = byId("flower-wave");

    if (!root) return;

    const size = 620;

    const cx = size / 2;

    const cy = size / 2;

    const innerRadius = 62;

    const outerRadius = 220;

    const labelRadius = 260;

    const observedMax = Math.max(60, ...FLOWER_ORDER.map((id) => flowerValues[id]));

    const points = FLOWER_ORDER.map((id, index) => {

      const value = Math.max(0, flowerValues[id]);

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

      return `<g class="flower-label"><text x="${point.x.toFixed(1)}" y="${(point.y - 4).toFixed(1)}" text-anchor="${anchor}">${id}ãƒ»${FLOWER_NAMES[id]}</text><text class="flower-label-value" x="${point.x.toFixed(1)}" y="${(point.y + 17).toFixed(1)}" text-anchor="${anchor}">${flowerValues[id].toFixed(1)}</text></g>`;

    }).join("");

    const dots = points.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.5" class="flower-point"><title>${point.id}ãƒ»${FLOWER_NAMES[point.id]} ${point.value.toFixed(1)}</title></circle>`).join("");

    root.innerHTML = `<svg class="flower-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="12åº§ã®èŠ±æ³¢å½¢">

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

    button.textContent = isBusy ? "ç®—å®šã—ã¦ã„ã¾ã™â€¦" : "12åº§ã‚’ç®—å®š";

  }

 

  async function prepareEngine() {

    if (state.data) return;

    setStatus("engine-status", "ç®—å®šã‚¨ãƒ³ã‚¸ãƒ³ã‚’èª­ã¿è¾¼ã‚“ã§ã„ã¾ã™â€¦");

    await loadDependencies();

    await loadData();

    validateRuleData();

    setStatus("engine-status", "ç®—å®šã‚¨ãƒ³ã‚¸ãƒ³ã‚’èª­ã¿è¾¼ã¿ã¾ã—ãŸã€‚");

  }

 

  async function handleCalculate() {

    if (!byId("studio-form").reportValidity()) {

      setStatus("seat-status", "å…¥åŠ›å†…å®¹ã‚’ç¢ºèªã—ã¦ãã ã•ã„ã€‚", true);

      return;

    }

    setCalculateBusy(true);

    setStatus("seat-status", "12åº§ã‚’ç®—å®šã—ã¦ã„ã¾ã™â€¦");

    try {

      await prepareEngine();

      state.result = calculateAll();

      renderCalculationSummary(state.result);

      renderSeats(state.result);

      drawFlowerWave(state.result.heavenEarth);

      document.dispatchEvent(new CustomEvent("jikou:calculated", { detail: {
        axis: state.result.ranking[0]?.short,
        birthDate: state.result.person.birthDate
      } }));

      saveResult(state.result);

      setStatus("seat-status", "12åº§ã¨èŠ±æ³¢å½¢ã‚’è¡¨ç¤ºã—ã¾ã—ãŸã€‚");

      byId("flower-wave-panel").hidden = false;

      byId("flower-wave-panel").scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (error) {

      console.error(error);

      setStatus("seat-status", error.message || "ç®—å®šä¸­ã«ã‚¨ãƒ©ãƒ¼ãŒç™ºç”Ÿã—ã¾ã—ãŸã€‚", true);

    } finally {

      setCalculateBusy(false);

    }

  }

 

  function handleCreateResult() {

    if (!state.result) {

      setStatus("result-status", "å…ˆã«ã€Œ12åº§ã‚’ç®—å®šã€ã‚’æŠ¼ã—ã¦ãã ã•ã„ã€‚", true);

      return;

    }

    state.result.birthGem = byId("birth-gem").value;

    state.result.tarot = readTarot();

    state.result.notes = byId("notes").value.trim();

    saveResult(state.result);

    setStatus("result-status", "è§£æžçµæžœã‚’ä¿å­˜ã—ã¾ã—ãŸã€‚çµæžœãƒšãƒ¼ã‚¸ã¸ç§»å‹•ã—ã¾ã™ã€‚");

    window.location.href = "result.html";

  }

 

  function setupNicknameValidation() {

    byId("nickname").addEventListener("input", (event) => {

      const value = event.currentTarget.value;

      event.currentTarget.setCustomValidity(value === "" || /^[ã-ã‚–ãƒ¼\s]+$/.test(value) ? "" : "å‘¼ã³åã¯ã€ã²ã‚‰ãŒãªã§å…¥åŠ›ã—ã¦ãã ã•ã„ã€‚");

    });

  }

 

  async function init() {

    populateTarot();

    setupNicknameValidation();

    byId("calculate-seats").addEventListener("click", handleCalculate);

    byId("create-result").addEventListener("click", handleCreateResult);

    byId("birth-gem").addEventListener("change", () => {
      if (!state.result) return;
      state.result.birthGem = byId("birth-gem").value;
      saveResult(state.result);
    });

    try { await prepareEngine(); }

    catch (error) {

      console.error(error);

      setStatus("engine-status", error.message || "ç®—å®šã‚¨ãƒ³ã‚¸ãƒ³ã‚’èª­ã¿è¾¼ã‚ã¾ã›ã‚“ã§ã—ãŸã€‚", true);

    }

  }

 

  document.addEventListener("DOMContentLoaded", init);

})();
