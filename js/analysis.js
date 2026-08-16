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


    astronomy:


      "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js",


    lunar:


      "https://cdn.jsdelivr.net/npm/lunar-javascript@1.7.7/lunar.js"


  };


 


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


 


  const JAPAN_TIMEZONE = 9;


 


  const state = {


    data: null


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


    const rawTotal = Object.values(raw).reduce(


      (sum, value) => sum + value,


      0


    );


 


    if (rawTotal === 0) {


      return {


        total: 0,


        values: Object.fromEntries(


          Object.keys(raw).map((key) => [key, 0])


        )


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


 


      const existing = [...document.scripts].find(


        (script) => script.src === url


      );


 


      if (existing) {


        existing.addEventListener("load", resolve, { once: true });


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


 


      script.addEventListener(


        "load",


        () => {


          if (readyTest()) {


            resolve();


          } else {


            reject(


              new Error(


                `${url} の読み込み後に必要な機能を確認できませんでした。`


              )


            );


          }


        },


        { once: true }


      );


 


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


      () => Boolean(window.Astronomy?.GeoVector)


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


      throw new Error(


        `${path}（HTTP ${response.status}）を読み込めませんでした。`


      );


    }


 


    try {


      return await response.json();


    } catch (error) {


      throw new Error(`${path} のJSON形式を確認してください。`);


    }


  }


 


  async function loadData() {


    const [axis, western, eastern, kabbalah, katakamuna] =


      await Promise.all([


        loadJson(DATA_PATHS.axis),


        loadJson(DATA_PATHS.western),


        loadJson(DATA_PATHS.eastern),


        loadJson(DATA_PATHS.kabbalah),


        loadJson(DATA_PATHS.katakamuna)


      ]);


 


    state.data = {


      axis,


      western,


      eastern,


      kabbalah,


      katakamuna


    };


  }


 


  function parseBirthInput() {


    const dateValue = byId("birth-date").value;


    const timeValue = byId("birth-time").value;


 


    if (!dateValue) {


      throw new Error("生年月日を入力してください。");


    }


 


    const [year, month, day] = dateValue.split("-").map(Number);


    const [hour, minute] = timeValue


      ? timeValue.split(":").map(Number)


      : [12, 0];


 


    const utcMilliseconds =


      Date.UTC(year, month - 1, day, hour, minute, 0) -


      JAPAN_TIMEZONE * 60 * 60 * 1000;


 


    return {


      year,


      month,


      day,


      hour,


      minute,


      hasBirthTime: Boolean(timeValue),


      timezone: JAPAN_TIMEZONE,


      utcDate: new Date(utcMilliseconds)


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


 


      const vector = Astronomy.GeoVector(body, date, true);


      longitude = Astronomy.Ecliptic(vector).elon;


    }


 


    if (!Number.isFinite(longitude)) {


      throw new Error(`${bodyName} の黄経を取得できませんでした。`);


    }


 


    return normalizeDegrees(longitude);


  }


 


  function calculateWesternElements(birth) {


    return PLANETS.map(([label, bodyName]) => {


      const longitude = planetLongitude(bodyName, birth.utcDate);


 


      return {


        label,


        key: bodyName,


        longitude: round(longitude),


        sign: zodiacFromLongitude(longitude),


        degree: degreeInSign(longitude)


      };


    });


  }


 


  function tenGodToStar(dayStem, targetStem) {


    const day = STEM_INFO[dayStem];


    const target = STEM_INFO[targetStem];


 


    if (!day || !target) {


      throw new Error("十大主星の算定に使う干を確認してください。");


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


    const elementMap = new Map(


      elements.map((item) => [item.name, item])


    );


 


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


      rawTotal: Object.values(raw).reduce(


        (sum, value) => sum + value,


        0


      ),


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


    const month = reduceNumerology(birth.month);


    const day = reduceNumerology(birth.day);


    const year = reduceNumerology(birth.year);


 


    return {


      month,


      day,


      year,


      total: reduceNumerology(month + day + year)


    };


  }


 


  function calculateKabbalah(birth, axes) {


    const numbers = calculateKabbalahNumbers(birth);


    const raw = emptyAxisMap(axes);


    const numberMap = new Map(


      state.data.kabbalah.numbers.map((item) => [


        Number(item.number),


        item


      ])


    );


 


    Object.values(numbers).forEach((number) => {


      const item = numberMap.get(number);


 


      if (item) {


        addScores(raw, item.scores);


      }


    });


 


    const values100 = Object.fromEntries(


      Object.entries(raw).map(([axisId, value]) => [


        axisId,


        round((value / 20) * 100)


      ])


    );


 


    return {


      numbers,


      raw,


      values100


    };


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


      state.data.katakamuna.sounds.map((item) => [


        item.sound,


        item


      ])


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


 


  function validateRuleData() {


    const axes = state.data.axis.axes;


 


    if (axes.length !== 12) {


      throw new Error("12座定義が12件ではありません。");


    }


 


    if (new Set(axes.map((axis) => axis.id)).size !== 12) {


      throw new Error("12座IDが重複しています。");


    }


 


    state.data.western.elements.forEach((item) => {


      const total = Object.values(item.scores).reduce(


        (sum, value) => sum + Number(value),


        0


      );


 


      if (total !== 20) {


        throw new Error(


          `西洋変換表 ${item.name} の合計が20ではありません。`


        );


      }


    });


 


    state.data.eastern.elements.forEach((item) => {


      const total = Object.values(item.scores).reduce(


        (sum, value) => sum + Number(value),


        0


      );


 


      if (total !== 20) {


        throw new Error(


          `東洋変換表 ${item.name} の合計が20ではありません。`


        );


      }


    });


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


    const katakamuna = calculateKatakamuna(


      byId("nickname").value,


      axes


    );


 


    const ranking = axes


      .map((axis) => ({


        ...axis,


        value: heavenEarth[axis.id]


      }))


      .sort((a, b) => b.value - a.value);


 


    return {


      createdAt: new Date().toISOString(),


      savedAt: new Date().toISOString(),


      cycle:

        Number(

          document.querySelector('input[name="cycle"]:checked')?.value

        ) || 1,


      primaryAxis: ranking[0]?.short || ranking[0]?.name || "",


      person: {


        birthDate: byId("birth-date").value,


        birthTime: byId("birth-time").value,


        birthPlace: byId("birth-place").value.trim(),


        timezone: JAPAN_TIMEZONE,


        nickname: byId("nickname").value.trim(),


        gender:


          document.querySelector('input[name="gender"]:checked')?.value || "",


        cycleChoice:

          Number(

            document.querySelector('input[name="cycle"]:checked')?.value

          ) || 1


      },


      birth,


      westernElements,


      easternElements,


      western,


      eastern,


      heavenEarth,


      kabbalah,


      katakamuna,


      ranking


    };


  }


 


  function saveResult(result) {


    const serialized = JSON.stringify(result);


 


    sessionStorage.setItem("jikouStudioData", serialized);


    localStorage.setItem("jikouStudioData", serialized);


  }


 


  function setStatus(message, isError = false) {


    const status = byId("analysis-status");


    status.textContent = message;


    status.style.color = isError ? "#9c2f2f" : "";


  }


 


  function setButtonBusy(isBusy) {


    const button = byId("analysis-submit-button");


    button.disabled = isBusy;


    button.textContent = isBusy


      ? "解析しています…"


      : "時光解析を始める";


  }


 


  function setupFadeAnimation() {


    if (!("IntersectionObserver" in window)) {


      document.querySelectorAll(".fade").forEach((element) => {


        element.classList.add("show");


      });


      return;


    }


 


    const observer = new IntersectionObserver(


      (entries) => {


        entries.forEach((entry) => {


          if (entry.isIntersecting) {


            entry.target.classList.add("show");


          }


        });


      },


      { threshold: 0.12 }


    );


 


    document.querySelectorAll(".fade").forEach((element) => {


      observer.observe(element);


    });


  }


 


  function setupNicknameValidation() {


    const nickname = byId("nickname");


 


    nickname.addEventListener("input", () => {


      const value = nickname.value;


 


      if (value === "" || /^[ぁ-ゖー\s]+$/.test(value)) {


        nickname.setCustomValidity("");


      } else {


        nickname.setCustomValidity(


          "呼び名は、ひらがなで入力してください。"


        );


      }


    });


  }


 


  async function prepareEngine() {


    if (state.data) {


      return;


    }


 


    await loadDependencies();


    await loadData();


    validateRuleData();


  }


 


  async function handleSubmit(event) {


    event.preventDefault();


 


    const form = byId("analysis-form");


 


    if (!form.reportValidity()) {


      setStatus("入力内容を確認してください。", true);


      return;


    }


 


    setButtonBusy(true);


    setStatus("算定データを読み込んでいます…");


 


    try {


      await prepareEngine();


      setStatus("12座を算定しています…");


 


      const result = calculateAll();


      saveResult(result);


 


      setStatus("解析結果を表示します。");


      window.location.href = "result.html";


    } catch (error) {


      console.error(error);


      setStatus(


        error.message || "解析中にエラーが発生しました。",


        true


      );


      setButtonBusy(false);


    }


  }


 


  function init() {


    setupFadeAnimation();


    setupNicknameValidation();


    byId("analysis-form").addEventListener("submit", handleSubmit);


  }


 


  document.addEventListener("DOMContentLoaded", init);


})();
