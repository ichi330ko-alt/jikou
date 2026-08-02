(() => {

  "use strict";

 

  const DATA_PATHS = {

    axis: "data/axis.json",

    western: "data/western.json",

    eastern: "data/eastern.json",

    kabbalah: "data/kabbalah.json",

    katakamuna: "data/katakamuna.json",

    rules: "data/seat-rules.json"

  };

 

  const DEPENDENCIES = {

    astronomy: "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js",

    lunar: "https://cdn.jsdelivr.net/npm/lunar-javascript@1.7.7/lunar.js"

  };

 

  const TAROT_CARDS = [

    "愚者", "魔術師", "女教皇", "女帝", "皇帝", "法王", "恋人",

    "戦車", "力", "隠者", "運命の輪", "正義", "吊るされた男",

    "死神", "節制", "悪魔", "塔", "星", "月", "太陽", "審判", "世界"

  ];

 

  const PLANETS = [

    ["太陽", "Sun"],

    ["月", "Moon"],

    ["水星", "Mercury"],

    ["金星", "Venus"],

    ["火星", "Mars"],

    ["木星", "Jupiter"],

    ["土星", "Saturn"],

    ["天王星", "Uranus"],

    ["海王星", "Neptune"],

    ["冥王星", "Pluto"]

  ];

 

  const ZODIAC = [

    "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座",

    "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"

  ];

 

  const STEM_INFO = {

    "甲": { element: "木", polarity: "陽" },

    "乙": { element: "木", polarity: "陰" },

    "丙": { element: "火", polarity: "陽" },

    "丁": { element: "火", polarity: "陰" },

    "戊": { element: "土", polarity: "陽" },

    "己": { element: "土", polarity: "陰" },

    "庚": { element: "金", polarity: "陽" },

    "辛": { element: "金", polarity: "陰" },

    "壬": { element: "水", polarity: "陽" },

    "癸": { element: "水", polarity: "陰" }

  };

 

  const BRANCH_MAIN_STEM = {

    "子": "癸",

    "丑": "己",

    "寅": "甲",

    "卯": "乙",

    "辰": "戊",

    "巳": "丙",

    "午": "丁",

    "未": "己",

    "申": "庚",

    "酉": "辛",

    "戌": "戊",

    "亥": "壬"

  };

 

  const GENERATES = {

    "木": "火",

    "火": "土",

    "土": "金",

    "金": "水",

    "水": "木"

  };

 

  const CONTROLS = {

    "木": "土",

    "土": "水",

    "水": "火",

    "火": "金",

    "金": "木"

  };

 

  const state = {

    data: null,

    lastResult: null

  };

 

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

      if (Object.hasOwn(target, axisId)) {

        target[axisId] += Number(value) || 0;

      }

    });

  }

 

  function normalizeAxisMap(raw, targetTotal) {

    const rawTotal = Object.values(raw).reduce((sum, value) => sum + value, 0);

 

    if (rawTotal === 0) {

      return {

        total: 0,

        values: Object.fromEntries(Object.keys(raw).map((key) => [key, 0]))

      };

    }

 

    const factor = targetTotal / rawTotal;

 

    return {

      total: targetTotal,

      values: Object.fromEntries(

        Object.entries(raw).map(([key, value]) => [

          key,

          round(value * factor)

        ])

      )

    };

  }

 

  function loadScript(url, readyTest) {

    return new Promise((resolve, reject) => {

      if (readyTest()) {

        resolve();

        return;

      }

 

      const existing = [...document.scripts].find((script) => script.src === url);

 

      if (existing) {

        existing.addEventListener("load", () => resolve(), { once: true });

        existing.addEventListener(

          "error",

          () => reject(new Error(`${url} を読み込めませんでした。`)),

          { once: true }

        );

        return;

      }

 

      const script = document.createElement("script");

      script.src = url;

      script.async = true;

      script.crossOrigin = "anonymous";

      script.addEventListener("load", () => {

        if (readyTest()) {

          resolve();

        } else {

          reject(new Error(`${url} の読み込み後に必要な機能を確認できませんでした。`));

        }

      }, { once: true });

      script.addEventListener(

        "error",

        () => reject(new Error(`${url} を読み込めませんでした。`)),

        { once: true }

      );

      document.head.appendChild(script);

    });

  }

 

  async function loadDependencies() {

    await loadScript(

      DEPENDENCIES.astronomy,

      () => Boolean(window.Astronomy?.GeoVector && window.Astronomy?.Ecliptic)

    );

 

    await loadScript(

      DEPENDENCIES.lunar,

      () => Boolean(window.Solar?.fromYmdHms)

    );

  }

 

  async function loadJson(path) {

    const url = new URL(path, document.baseURI);

    const response = await fetch(url, { cache: "no-store" });

 

    if (!response.ok) {

      throw new Error(`${path}（HTTP ${response.status}）を読み込めませんでした。`);

    }

 

    try {

      return await response.json();

    } catch {

      throw new Error(`${path} のJSON形式を確認してください。`);

    }

  }

 

  async function loadData() {

    const [axis, western, eastern, kabbalah, katakamuna, rules] =

      await Promise.all([

        loadJson(DATA_PATHS.axis),

        loadJson(DATA_PATHS.western),

        loadJson(DATA_PATHS.eastern),

        loadJson(DATA_PATHS.kabbalah),

        loadJson(DATA_PATHS.katakamuna),

        loadJson(DATA_PATHS.rules)

      ]);

 

    state.data = { axis, western, eastern, kabbalah, katakamuna, rules };

  }

 

  function appendTarotOptions() {

    [

      "tarot-current-card",

      "tarot-challenge-card",

      "tarot-key-card"

    ].forEach((id) => {

      const select = byId(id);

 

      TAROT_CARDS.forEach((card) => {

        const option = document.createElement("option");

        option.value = card;

        option.textContent = card;

        select.appendChild(option);

      });

    });

  }

 

  function buildSeatGrid() {

    const grid = byId("seat-grid");

    grid.innerHTML = "";

 

    state.data.axis.axes.forEach((axis) => {

      const box = document.createElement("div");

      box.className = "seat-box";

      box.dataset.axisId = axis.id;

 

      box.innerHTML = `

        <div class="seat-heading">

          <span class="seat-short">${axis.short}</span>

          <span>

            <strong>${axis.name}</strong>

            <small>${axis.fourNature}</small>

          </span>

        </div>

        <div class="seat-main-value">未算定</div>

        <dl class="seat-details">

          <div><dt>西洋</dt><dd data-value="western">—</dd></div>

          <div><dt>東洋</dt><dd data-value="eastern">—</dd></div>

          <div><dt>カバラ</dt><dd data-value="kabbalah">—</dd></div>

          <div><dt>名前音</dt><dd data-value="katakamuna">—</dd></div>

        </dl>

      `;

 

      grid.appendChild(box);

    });

  }

 

  function parseBirthInput() {

    const dateValue = byId("birth-date").value;

    const timeValue = byId("birth-time").value;

    const timezone = Number(byId("timezone").value);

 

    if (!dateValue) {

      throw new Error("生年月日を入力してください。");

    }

 

    if (!Number.isFinite(timezone)) {

      throw new Error("UTC時差を確認してください。");

    }

 

    const [year, month, day] = dateValue.split("-").map(Number);

    const [hour, minute] = timeValue

      ? timeValue.split(":").map(Number)

      : [12, 0];

 

    const utcMilliseconds =

      Date.UTC(year, month - 1, day, hour, minute, 0) -

      timezone * 60 * 60 * 1000;

 

    return {

      year,

      month,

      day,

      hour,

      minute,

      hasBirthTime: Boolean(timeValue),

      utcDate: new Date(utcMilliseconds),

      timezone,

      latitude:

        byId("latitude").value === ""

          ? null

          : Number(byId("latitude").value),

      longitude:

        byId("longitude").value === ""

          ? null

          : Number(byId("longitude").value)

    };

  }

 

  function planetLongitude(bodyName, date) {

    if (!window.Astronomy) {

      throw new Error("西洋計算ライブラリを読み込めませんでした。");

    }

 

    let longitude;

 

    if (bodyName === "Sun") {

      longitude = Astronomy.SunPosition(date).elon;

    } else if (bodyName === "Moon") {

      longitude = Astronomy.EclipticGeoMoon(date).lon;

    } else {

      const body = Astronomy.Body[bodyName];

 

      if (!body) {

        throw new Error(`${bodyName} の天体定義を確認できませんでした。`);

      }

 

      const geocentricVector = Astronomy.GeoVector(body, date, true);

      longitude = Astronomy.Ecliptic(geocentricVector).elon;

    }

 

    if (!Number.isFinite(longitude)) {

      throw new Error(`${bodyName} の黄経を取得できませんでした。`);

    }

 

    return normalizeDegrees(longitude);

  }

 

  function meanObliquity(date) {

    const julianDate = date.getTime() / 86400000 + 2440587.5;

    const t = (julianDate - 2451545.0) / 36525;

    return 23.4392911111

      - 0.0130041667 * t

      - 0.0000001639 * t * t

      + 0.0000005036 * t * t * t;

  }

 

  function calculateAngles(date, latitude, longitude) {

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {

      return null;

    }

 

    if (!window.Astronomy || typeof Astronomy.SiderealTime !== "function") {

      throw new Error("ASC・MC計算に必要な恒星時を取得できませんでした。");

    }

 

    const theta = normalizeDegrees(

      Astronomy.SiderealTime(date) * 15 + longitude

    );

 

    const radians = Math.PI / 180;

    const thetaRad = theta * radians;

    const latitudeRad = latitude * radians;

    const obliquityRad = meanObliquity(date) * radians;

 

    const mc = normalizeDegrees(

      Math.atan2(

        Math.sin(thetaRad),

        Math.cos(thetaRad) * Math.cos(obliquityRad)

      ) / radians

    );

 

    const asc = normalizeDegrees(

      Math.atan2(

        -Math.cos(thetaRad),

        Math.sin(obliquityRad) * Math.tan(latitudeRad)

          + Math.cos(obliquityRad) * Math.sin(thetaRad)

      ) / radians + 180

    );

 

    return { asc, mc };

  }

 

  function calculateWesternElements(birth) {

    const elements = PLANETS.map(([label, bodyName]) => {

      const longitude = planetLongitude(bodyName, birth.utcDate);

 

      return {

        label,

        key: bodyName,

        longitude: round(longitude),

        sign: zodiacFromLongitude(longitude),

        degree: degreeInSign(longitude)

      };

    });

 

    if (

      birth.hasBirthTime &&

      Number.isFinite(birth.latitude) &&

      Number.isFinite(birth.longitude)

    ) {

      const angles = calculateAngles(

        birth.utcDate,

        birth.latitude,

        birth.longitude

      );

 

      elements.push(

        {

          label: "ASC",

          key: "ASC",

          longitude: round(angles.asc),

          sign: zodiacFromLongitude(angles.asc),

          degree: degreeInSign(angles.asc)

        },

        {

          label: "MC",

          key: "MC",

          longitude: round(angles.mc),

          sign: zodiacFromLongitude(angles.mc),

          degree: degreeInSign(angles.mc)

        }

      );

    }

 

    return elements;

  }

 

  function tenGodToStar(dayStem, targetStem) {

    const day = STEM_INFO[dayStem];

    const target = STEM_INFO[targetStem];

 

    if (!day || !target) {

      throw new Error(`十大主星の算定に使う干を確認してください。`);

    }

 

    const samePolarity = day.polarity === target.polarity;

 

    if (day.element === target.element) {

      return samePolarity ? "貫索星" : "石門星";

    }

 

    if (GENERATES[day.element] === target.element) {

      return samePolarity ? "鳳閣星" : "調舒星";

    }

 

    if (CONTROLS[day.element] === target.element) {

      return samePolarity ? "禄存星" : "司禄星";

    }

 

    if (CONTROLS[target.element] === day.element) {

      return samePolarity ? "車騎星" : "牽牛星";

    }

 

    if (GENERATES[target.element] === day.element) {

      return samePolarity ? "玉堂星" : "龍高星";

    }

 

    throw new Error(`${dayStem}と${targetStem}の関係を判定できませんでした。`);

  }

 

  function calculateEasternElements(birth) {

    if (!window.Solar || typeof Solar.fromYmdHms !== "function") {

      throw new Error("東洋計算ライブラリを読み込めませんでした。");

    }

 

    const solar = Solar.fromYmdHms(

      birth.year,

      birth.month,

      birth.day,

      birth.hour,

      birth.minute,

      0

    );

 

    const lunar = solar.getLunar();

 

    const yearGan = lunar.getYearGanExact();

    const yearZhi = lunar.getYearZhiExact();

    const monthGan = lunar.getMonthGanExact();

    const monthZhi = lunar.getMonthZhiExact();

    const dayGan = lunar.getDayGanExact2();

    const dayZhi = lunar.getDayZhiExact2();

 

    const targetStems = [

      { source: "年干", stem: yearGan },

      { source: "月干", stem: monthGan },

      { source: "年支本元", stem: BRANCH_MAIN_STEM[yearZhi] },

      { source: "月支本元", stem: BRANCH_MAIN_STEM[monthZhi] },

      { source: "日支本元", stem: BRANCH_MAIN_STEM[dayZhi] }

    ];

 

    if (targetStems.some((item) => !item.stem)) {

      throw new Error("地支本元の対応を確認できませんでした。");

    }

 

    const stars = targetStems.map((item) => ({

      ...item,

      star: tenGodToStar(dayGan, item.stem)

    }));

 

    return {

      pillars: {

        year: `${yearGan}${yearZhi}`,

        month: `${monthGan}${monthZhi}`,

        day: `${dayGan}${dayZhi}`

      },

      dayMaster: dayGan,

      targets: targetStems,

      stars

    };

  }

 

  function calculateLookupSystem(elements, selections, axes, targetTotal) {

    const raw = emptyAxisMap(axes);

    const elementMap = new Map(elements.map((item) => [item.name, item]));

 

    selections.forEach((selection) => {

      const item = elementMap.get(selection);

      if (item) {

        addScores(raw, item.scores);

      }

    });

 

    const normalized = normalizeAxisMap(raw, targetTotal);

 

    return {

      selections,

      raw,

      rawTotal: Object.values(raw).reduce((sum, value) => sum + value, 0),

      normalized: normalized.values,

      normalizedTotal: normalized.total

    };

  }

 

  function reduceNumerology(value) {

    let number = Math.abs(Number(value)) || 0;

 

    while (number > 9 && ![11, 22, 33].includes(number)) {

      number = String(number)

        .split("")

        .reduce((sum, digit) => sum + Number(digit), 0);

    }

 

    return number;

  }

 

  function calculateKabbalahNumbers(birth) {

    return {

      month: reduceNumerology(birth.month),

      day: reduceNumerology(birth.day),

      year: reduceNumerology(birth.year),

      total: reduceNumerology(

        reduceNumerology(birth.month)

          + reduceNumerology(birth.day)

          + reduceNumerology(birth.year)

      )

    };

  }

 

  function calculateKabbalah(birth, axes) {

    const numbers = calculateKabbalahNumbers(birth);

    const raw = emptyAxisMap(axes);

    const numberMap = new Map(

      state.data.kabbalah.numbers.map((item) => [Number(item.number), item])

    );

 

    Object.values(numbers).forEach((number) => {

      const item = numberMap.get(number);

      if (item) addScores(raw, item.scores);

    });

 

    const values100 = Object.fromEntries(

      Object.entries(raw).map(([axisId, value]) => [

        axisId,

        round((value / 20) * 100)

      ])

    );

 

    return { numbers, raw, values100 };

  }

 

  function hiraganaToKatakana(text) {

    return text.replace(/[ぁ-ゖ]/g, (character) =>

      String.fromCharCode(character.charCodeAt(0) + 0x60)

    );

  }

 

  function normalizeKatakamunaName(value) {

    return hiraganaToKatakana((value || "").trim())

      .replace(/[・･\s]/g, "")

      .replace(/[ァ]/g, "ア")

      .replace(/[ィ]/g, "イ")

      .replace(/[ゥ]/g, "ウ")

      .replace(/[ェ]/g, "エ")

      .replace(/[ォ]/g, "オ")

      .replace(/[ヵ]/g, "カ")

      .replace(/[ヶ]/g, "ケ")

      .replace(/[ッ]/g, "ツ")

      .replace(/[ャ]/g, "ヤ")

      .replace(/[ュ]/g, "ユ")

      .replace(/[ョ]/g, "ヨ")

      .replace(/ー/g, "");

  }

 

  function calculateKatakamuna(nameValue, axes) {

    const raw = emptyAxisMap(axes);

    const normalizedName = normalizeKatakamunaName(nameValue);

 

    if (!normalizedName) {

      return {

        name: "",

        normalizedName: "",

        sounds: [],

        unknownSounds: [],

        raw

      };

    }

 

    const soundMap = new Map(

      state.data.katakamuna.sounds.map((item) => [item.sound, item])

    );

 

    const sounds = [];

    const unknownSounds = [];

    let previousMappedSound = null;

 

    [...normalizedName].forEach((sound) => {

      let item = soundMap.get(sound);

 

      if (sound === "ン" && previousMappedSound) {

        item = soundMap.get(previousMappedSound);

      }

 

      if (!item) {

        unknownSounds.push(sound);

        return;

      }

 

      addScores(raw, item.distribution);

 

      sounds.push({

        input: sound,

        used: item.sound,

        no: item.no

      });

 

      if (sound !== "ン") {

        previousMappedSound = sound;

      }

    });

 

    return {

      name: nameValue,

      normalizedName,

      sounds,

      unknownSounds,

      raw: Object.fromEntries(

        Object.entries(raw).map(([key, value]) => [key, round(value)])

      )

    };

  }

 

  function assertCondition(condition, message) {

    if (!condition) {

      throw new Error(`算定エンジン検証エラー：${message}`);

    }

  }

 

  function validateRuleData() {

    const axes = state.data.axis.axes;

    assertCondition(axes.length === 12, "12座定義が12件ではありません。");

    assertCondition(new Set(axes.map((axis) => axis.id)).size === 12, "12座IDが重複しています。");

 

    for (const item of state.data.western.elements) {

      const total = Object.values(item.scores).reduce((sum, value) => sum + Number(value), 0);

      assertCondition(total === 20, `西洋変換表 ${item.name} の合計が20ではありません。`);

    }

 

    for (const item of state.data.eastern.elements) {

      const total = Object.values(item.scores).reduce((sum, value) => sum + Number(value), 0);

      assertCondition(total === 20, `東洋変換表 ${item.name} の合計が20ではありません。`);

    }

  }

 

  function validateEasternReference() {

    const reference = calculateEasternElements({

      year: 2010,

      month: 4,

      day: 1,

      hour: 12,

      minute: 0

    });

 

    assertCondition(reference.pillars.year === "庚寅", "2010-04-01の年柱が庚寅になりません。");

    assertCondition(reference.pillars.month === "己卯", "2010-04-01の月柱が己卯になりません。");

    assertCondition(reference.pillars.day === "辛巳", "2010-04-01の日柱が辛巳になりません。");

 

    const actualStars = reference.stars.map((item) => item.star).sort().join("|");

    const expectedStars = ["石門星", "玉堂星", "司禄星", "禄存星", "牽牛星"].sort().join("|");

    assertCondition(actualStars === expectedStars, "2010-04-01の十大主星5点が検証記録と一致しません。");

  }

 

  function angularDifference(a, b) {

    const difference = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));

    return Math.min(difference, 360 - difference);

  }

 

  function validateWesternReference() {

    const referenceDate = new Date(Date.UTC(2010, 3, 1, 0, 0, 0));

    const expected = {

      Sun: 11.15,

      Moon: 216.67,

      Mercury: 27.52,

      Venus: 30.32,

      Mars: 122.80,

      Jupiter: 347.25,

      Saturn: 180.50,

      Uranus: 357.40,

      Neptune: 327.73,

      Pluto: 275.42

    };

 

    for (const [bodyName, expectedLongitude] of Object.entries(expected)) {

      const actualLongitude = planetLongitude(bodyName, referenceDate);

      assertCondition(

        angularDifference(actualLongitude, expectedLongitude) <= 0.25,

        `${bodyName}の黄経が検証値から外れています。`

      );

    }

  }

 

  function validateEngine() {

    validateRuleData();

    validateEasternReference();

    validateWesternReference();

  }

 

  function calculateAll() {

    const axes = state.data.axis.axes;

    const axisIds = axes.map((axis) => axis.id);

    const birth = parseBirthInput();

 

    const westernElements = calculateWesternElements(birth);

    const easternElements = calculateEasternElements(birth);

 

    const western = calculateLookupSystem(

      state.data.western.elements,

      westernElements.map((item) => item.sign),

      axes,

      400

    );

 

    const eastern = calculateLookupSystem(

      state.data.eastern.elements,

      easternElements.stars.map((item) => item.star),

      axes,

      400

    );

 

    const heavenEarth = Object.fromEntries(

      axisIds.map((axisId) => [

        axisId,

        round(

          (western.normalized[axisId] + eastern.normalized[axisId]) / 2

        )

      ])

    );

 

    const kabbalah = calculateKabbalah(birth, axes);

    const katakamuna = calculateKatakamuna(byId("nickname").value, axes);

 

    const ranking = axes

      .map((axis) => ({

        ...axis,

        value: heavenEarth[axis.id]

      }))

      .sort((a, b) => b.value - a.value);

 

    return {

      createdAt: new Date().toISOString(),

      person: {

        birthDate: byId("birth-date").value,

        birthTime: byId("birth-time").value,

        birthPlace: byId("birth-place").value.trim(),

        latitude: birth.latitude,

        longitude: birth.longitude,

        timezone: birth.timezone,

        nickname: byId("nickname").value.trim(),

        gender:

          document.querySelector('input[name="gender"]:checked')?.value || ""

      },

      birth,

      westernElements,

      easternElements,

      western,

      eastern,

      heavenEarth,

      kabbalah,

      katakamuna,

      ranking,

      tarot: {

        current: {

          card: byId("tarot-current-card").value,

          direction: byId("tarot-current-direction").value

        },

        challenge: {

          card: byId("tarot-challenge-card").value,

          direction: byId("tarot-challenge-direction").value

        },

        key: {

          card: byId("tarot-key-card").value,

          direction: byId("tarot-key-direction").value

        }

      },

      notes: byId("notes").value.trim()

    };

  }

 

  function updateElementSummaries(result) {

    byId("western-elements").textContent = result.westernElements

      .map((item) => `${item.label}：${item.sign} ${item.degree}°`)

      .join(" ／ ");

 

    const pillars = result.easternElements.pillars;

 

    byId("eastern-pillars").textContent =

      `干支：年柱 ${pillars.year}・月柱 ${pillars.month}・日柱 ${pillars.day}（日干 ${result.easternElements.dayMaster}）`;

 

    byId("eastern-stars").textContent =

      `十大主星5点：${result.easternElements.stars

        .map((item) => `${item.star}（${item.source} ${item.stem}）`)

        .join("・")}`;

  }

 

  function updateSeatGrid(result) {

    state.data.axis.axes.forEach((axis) => {

      const box = document.querySelector(

        `.seat-box[data-axis-id="${axis.id}"]`

      );

 

      box.querySelector(".seat-main-value").textContent =

        result.heavenEarth[axis.id].toFixed(1);

 

      box.querySelector('[data-value="western"]').textContent =

        result.western.normalized[axis.id].toFixed(1);

 

      box.querySelector('[data-value="eastern"]').textContent =

        result.eastern.normalized[axis.id].toFixed(1);

 

      box.querySelector('[data-value="kabbalah"]').textContent =

        result.kabbalah.values100[axis.id].toFixed(1);

 

      box.querySelector('[data-value="katakamuna"]').textContent =

        result.katakamuna.raw[axis.id].toFixed(1);

    });

 

    const topThree = result.ranking

      .slice(0, 3)

      .map((item) => `${item.short}${item.name} ${item.value.toFixed(1)}`)

      .join(" ／ ");

 

    byId("ranking-summary").textContent =

      `天地統合の上位：${topThree}`;

 

    const numbers = result.kabbalah.numbers;

    byId("kabbalah-summary").textContent =

      `カバラ4秘数：月 ${numbers.month}・日 ${numbers.day}・年 ${numbers.year}・総数 ${numbers.total}`;

 

    const katakamunaText = result.katakamuna.normalizedName

      ? `名前音：${result.katakamuna.normalizedName}`

      : "名前音：未入力";

 

    const unknownText = result.katakamuna.unknownSounds.length

      ? `（未対応音：${result.katakamuna.unknownSounds.join("、")}）`

      : "";

 

    byId("katakamuna-summary").textContent =

      katakamunaText + unknownText;

  }

 

  function createCandidateText(result) {

    const [first, second, third] = result.ranking.slice(0, 3);

 

    const lines = [

      "【12座・候補文】",

      `天地統合では「${first.name}」が最も高く、次に「${second.name}」「${third.name}」が続いています。`,

      `この配置からは、${first.name}を起点に、${second.name}と${third.name}へ光が流れやすい可能性があります。`,

      "",

      `西洋出生要素：${result.westernElements.map((item) => `${item.label}${item.sign}`).join("・")}`,

      `東洋5主星：${result.easternElements.stars.map((item) => item.star).join("・")}`,

      "",

      "※これは算定値から作った初期候補です。人物像を断定せず、三体系の一致・差・ねじれと、本人の経験を重ねて編集してください。"

    ];

 

    return lines.join("\n");

  }

 

  function saveStudioResult(result) {

    sessionStorage.setItem("jikouStudioData", JSON.stringify(result));

  }

 

  async function ensureDataLoaded() {

    if (state.data) return;

 

    const status = byId("engine-status");

    status.textContent = "算定エンジンを読み込んでいます…";

 

    await loadDependencies();

    await loadData();

    validateEngine();

    buildSeatGrid();

 

    status.textContent = "算定エンジンの読込と検証が完了しました。";

  }

 

  async function init() {

    const status = byId("engine-status");

    appendTarotOptions();

 

    try {

      await ensureDataLoaded();

 

      status.textContent = "算定エンジンは正常です。";

    } catch (error) {

      console.error(error);

      status.textContent = error.message;

      status.classList.add("error");

    }

 

    byId("calculate-seats").addEventListener("click", async () => {

      const seatStatus = byId("seat-status");

      seatStatus.classList.remove("error");

 

      try {

        await ensureDataLoaded();

 

        if (!byId("studio-form").reportValidity()) {

          seatStatus.textContent = "入力内容を確認してください。";

          return;

        }

 

        const result = calculateAll();

        state.lastResult = result;

 

        updateElementSummaries(result);

        updateSeatGrid(result);

        saveStudioResult(result);

 

        seatStatus.textContent =

          "出生情報から西洋・東洋を計算し、12座を算定しました。";

      } catch (error) {

        console.error(error);

        seatStatus.textContent = error.message;

        seatStatus.classList.add("error");

      }

    });

 

    byId("create-result").addEventListener("click", async () => {

      const resultStatus = byId("result-status");

      resultStatus.classList.remove("error");

 

      try {

        await ensureDataLoaded();

 

        if (!byId("studio-form").reportValidity()) {

          resultStatus.textContent = "入力内容を確認してください。";

          return;

        }

 

        const result = state.lastResult || calculateAll();

        result.candidateText = createCandidateText(result);

 

        state.lastResult = result;

        saveStudioResult(result);

        updateElementSummaries(result);

        updateSeatGrid(result);

 

        const candidate = byId("candidate-text");

        candidate.value = result.candidateText;

        candidate.hidden = false;

 

        resultStatus.textContent =

          "候補文を作成し、解析データを一時保存しました。";

      } catch (error) {

        console.error(error);

        resultStatus.textContent = error.message;

        resultStatus.classList.add("error");

      }

    });

  }

 

  window.JikouEngine = {

    calculate: calculateAll,

    validate: validateEngine,

    getLastResult: () => state.lastResult

  };

 

  document.addEventListener("DOMContentLoaded", init);

})();
