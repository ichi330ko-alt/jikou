analysis.js

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

  const WESTERN_POINTS = [
    { id: "sun", label: "太陽" },
    { id: "moon", label: "月" },
    { id: "mercury", label: "水星" },
    { id: "venus", label: "金星" },
    { id: "mars", label: "火星" },
    { id: "jupiter", label: "木星" },
    { id: "saturn", label: "土星" },
    { id: "uranus", label: "天王星" },
    { id: "neptune", label: "海王星" },
    { id: "pluto", label: "冥王星" },
    { id: "asc", label: "ASC" },
    { id: "mc", label: "MC" }
  ];

  const EASTERN_POINTS = [
    { id: "eastern-1", label: "主星1" },
    { id: "eastern-2", label: "主星2" },
    { id: "eastern-3", label: "主星3" },
    { id: "eastern-4", label: "主星4" },
    { id: "eastern-5", label: "主星5" }
  ];

  const TAROT_CARDS = [
    "愚者", "魔術師", "女教皇", "女帝", "皇帝", "法王", "恋人",
    "戦車", "力", "隠者", "運命の輪", "正義", "吊るされた男",
    "死神", "節制", "悪魔", "塔", "星", "月", "太陽", "審判", "世界"
  ];

  const state = {
    data: null,
    lastResult: null
  };

  const byId = (id) => document.getElementById(id);

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

  function round(value, digits = 2) {
    const unit = 10 ** digits;
    return Math.round((Number(value) + Number.EPSILON) * unit) / unit;
  }

  function normalizeAxisMap(raw, targetTotal) {
    const rawTotal = Object.values(raw).reduce((sum, value) => sum + value, 0);

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
        Object.entries(raw).map(([key, value]) => [key, round(value * factor)])
      )
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

  function calculateKabbalahNumbers(dateValue) {
    if (!dateValue) {
      return null;
    }

    const [yearText, monthText, dayText] = dateValue.split("-");
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);

    const monthNumber = reduceNumerology(month);
    const dayNumber = reduceNumerology(day);
    const yearNumber = reduceNumerology(year);
    const totalNumber = reduceNumerology(
      monthNumber + dayNumber + yearNumber
    );

    return {
      month: monthNumber,
      day: dayNumber,
      year: yearNumber,
      total: totalNumber
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

  async function loadJson(path) {
    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`${path} を読み込めませんでした。`);
    }

    return response.json();
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

    state.data = {
      axis,
      western,
      eastern,
      kabbalah,
      katakamuna,
      rules
    };
  }

  function appendOptions(select, values) {
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function buildWesternInputs() {
    const container = byId("western-grid");
    const signs = state.data.western.elements.map((item) => item.name);

    WESTERN_POINTS.forEach((point) => {
      const field = document.createElement("div");
      field.className = "field";

      const label = document.createElement("label");
      label.htmlFor = `western-${point.id}`;
      label.textContent = point.label;

      const select = document.createElement("select");
      select.id = `western-${point.id}`;
      select.name = `western-${point.id}`;
      select.className = "form-control";

      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent =
        point.id === "asc" || point.id === "mc"
          ? "不明・未入力"
          : "選択してください";
      select.appendChild(blank);

      appendOptions(select, signs);
      field.append(label, select);
      container.appendChild(field);
    });
  }

  function buildEasternInputs() {
    const container = byId("eastern-grid");
    const stars = state.data.eastern.elements.map((item) => item.name);

    EASTERN_POINTS.forEach((point) => {
      const field = document.createElement("div");
      field.className = "field";

      const label = document.createElement("label");
      label.htmlFor = point.id;
      label.textContent = point.label;

      const select = document.createElement("select");
      select.id = point.id;
      select.name = point.id;
      select.className = "form-control";

      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "選択してください";
      select.appendChild(blank);

      appendOptions(select, stars);
      field.append(label, select);
      container.appendChild(field);
    });
  }

  function buildTarotInputs() {
    [
      "tarot-current-card",
      "tarot-challenge-card",
      "tarot-key-card"
    ].forEach((id) => appendOptions(byId(id), TAROT_CARDS));
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

  function getSelectedValues(ids) {
    return ids
      .map((id) => byId(id)?.value || "")
      .filter(Boolean);
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

  function calculateKabbalah(dateValue, axes) {
    const numbers = calculateKabbalahNumbers(dateValue);
    const raw = emptyAxisMap(axes);

    if (!numbers) {
      return {
        numbers: null,
        raw,
        values100: emptyAxisMap(axes)
      };
    }

    const numberMap = new Map(
      state.data.kabbalah.numbers.map((item) => [Number(item.number), item])
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

  function calculateAll() {
    const axes = state.data.axis.axes;
    const axisIds = axes.map((axis) => axis.id);

    const westernSelections = getSelectedValues(
      WESTERN_POINTS.map((point) => `western-${point.id}`)
    );

    const easternSelections = getSelectedValues(
      EASTERN_POINTS.map((point) => point.id)
    );

    if (westernSelections.length < 10) {
      throw new Error(
        "西洋は10天体をすべて選択してください。ASC・MCは不明でも算定できます。"
      );
    }

    if (easternSelections.length !== 5) {
      throw new Error("東洋は十大主星を5つすべて選択してください。");
    }

    const western = calculateLookupSystem(
      state.data.western.elements,
      westernSelections,
      axes,
      400
    );

    const eastern = calculateLookupSystem(
      state.data.eastern.elements,
      easternSelections,
      axes,
      400
    );

    const heavenEarth = Object.fromEntries(
      axisIds.map((axisId) => [
        axisId,
        round((western.normalized[axisId] + eastern.normalized[axisId]) / 2)
      ])
    );

    const kabbalah = calculateKabbalah(byId("birth-date").value, axes);
    const katakamuna = calculateKatakamuna(byId("nickname").value, axes);

    const ranking = [...axes]
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
        nickname: byId("nickname").value.trim(),
        gender:
          document.querySelector('input[name="gender"]:checked')?.value || ""
      },
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

    const kabbalahNumbers = result.kabbalah.numbers;
    byId("kabbalah-summary").textContent = kabbalahNumbers
      ? `カバラ4秘数：月 ${kabbalahNumbers.month}・日 ${kabbalahNumbers.day}・年 ${kabbalahNumbers.year}・総数 ${kabbalahNumbers.total}`
      : "カバラ4秘数：生年月日未入力";

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
    const top = result.ranking.slice(0, 3);
    const first = top[0];
    const second = top[1];
    const third = top[2];

    const lines = [
      "【12座・候補文】",
      `天地統合では「${first.name}」が最も高く、次に「${second.name}」「${third.name}」が続いています。`,
      `この配置からは、${first.name}を起点に、${second.name}と${third.name}へ光が流れやすい可能性があります。`,
      "",
      "※これは点数から作った初期候補です。人物像の断定ではなく、三体系の一致・差・ねじれと併せて確認してください。"
    ];

    if (result.kabbalah.numbers) {
      lines.push(
        "",
        `カバラ4秘数は、${result.kabbalah.numbers.month}・${result.kabbalah.numbers.day}・${result.kabbalah.numbers.year}・${result.kabbalah.numbers.total}です。`
      );
    }

    if (result.katakamuna.normalizedName) {
      const nameTop = state.data.axis.axes
        .map((axis) => ({
          name: axis.name,
          value: result.katakamuna.raw[axis.id]
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .map((item) => item.name)
        .join("・");

      lines.push(
        `呼び名の音では、${nameTop}への加点が比較的強く出ています。`
      );
    }

    return lines.join("\n");
  }

  function saveStudioResult(result) {
    sessionStorage.setItem("jikouStudioData", JSON.stringify(result));
  }

  async function init() {
    const status = byId("engine-status");

    try {
      status.textContent = "算定データを読み込んでいます…";
      await loadData();

      buildWesternInputs();
      buildEasternInputs();
      buildTarotInputs();
      buildSeatGrid();

      byId("calculate-seats").disabled = false;
      byId("create-result").disabled = false;
      status.textContent = "算定データを読み込みました。";
    } catch (error) {
      console.error(error);
      status.textContent =
        "算定データの読み込みに失敗しました。GitHub Pages上で開き、dataフォルダの配置を確認してください。";
    }

    byId("calculate-seats").addEventListener("click", () => {
      const seatStatus = byId("seat-status");

      try {
        const form = byId("studio-form");

        if (!form.reportValidity()) {
          seatStatus.textContent = "入力内容を確認してください。";
          return;
        }

        const result = calculateAll();
        state.lastResult = result;
        updateSeatGrid(result);
        saveStudioResult(result);

        seatStatus.textContent =
          "12座を算定しました。天地統合・カバラ・名前音は別列で表示しています。";
      } catch (error) {
        seatStatus.textContent = error.message;
      }
    });

    byId("create-result").addEventListener("click", () => {
      const resultStatus = byId("result-status");

      try {
        const form = byId("studio-form");

        if (!form.reportValidity()) {
          resultStatus.textContent = "入力内容を確認してください。";
          return;
        }

        const result = state.lastResult || calculateAll();
        result.candidateText = createCandidateText(result);

        state.lastResult = result;
        saveStudioResult(result);
        updateSeatGrid(result);

        const candidate = byId("candidate-text");
        candidate.value = result.candidateText;
        candidate.hidden = false;

        resultStatus.textContent =
          "候補文を作成し、解析データを一時保存しました。";
      } catch (error) {
        resultStatus.textContent = error.message;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
