(() => {

  "use strict";

  const STORAGE_KEYS = [

    "jikouResultData",

    "jikouStudioData",

    "resonanceResult"

  ];

  const DEFAULT_CYCLE = 1;

  const byId = (id) => document.getElementById(id);

  const AXIS_PROFILE = [

    { key: "感", description: "感じ取り、ひらめく" },

    { key: "現", description: "内にあるものを外の世界へ翻訳する" },

    { key: "関", description: "人や世界、物事と繋がり、視野を広げる" },

    { key: "信", description: "信じることをエネルギーにする" },

    { key: "理", description: "理解し、意味を見つける" },

    { key: "動", description: "現実的に働きかけ、物事を進める" },

    { key: "境", description: "自他を分け、適切な距離と公平な視点を持つ" },

    { key: "放", description: "次へ繋ぐために手放す" },

    { key: "安", description: "居場所を見つけ、自分の領域にする" },

    { key: "受", description: "出来事や気持ちを自分のなかに一度受け入れる" },

    { key: "時", description: "見極め、適切な判断を下す" },

    { key: "情", description: "感じとり、巡らせる" }

  ];

  const JEWEL_DATA = {

    "天響の座": {

      axis: "感", action: "響く",

      description: "まだ形になっていないものを、直感的な響きとして捉える座です。言葉や理由になる前の気配を、自分の内側で受け取ります。",

      cycle: "天響 → 降光 → 透解 → 天響…",

      x: 44, y: 82

    },

    "降光の座": {

      axis: "感", action: "降りてくる",

      description: "自分の外から届くひらめきや気づきを受け取る座です。思いがけないところから差し込む光を、感覚として捉えます。",

      cycle: "天響 → 降光 → 透解 → 天響…",

      x: 68, y: 73

    },

    "透解の座": {

      axis: "感", action: "見通す",

      description: "感じ取ったものを自分の内側で透かし、その奥にある意味や本質を捉える座です。",

      cycle: "天響 → 降光 → 透解 → 天響…",

      x: 31, y: 58

    },

    "言霊の座": {

      axis: "現", action: "届ける",

      description: "内にある思いや意味を、言葉として外の世界へ届ける座です。内界のものを、相手に届く形へ翻訳します。",

      cycle: "現心 → 詠唱 → 言霊 → 現心…",

      x: 79, y: 24

    },

    "詠唱の座": {

      axis: "現", action: "表現する",

      description: "内にあるものへ言葉や響き、形を与え、表現として外へ向かわせる座です。",

      cycle: "現心 → 詠唱 → 言霊 → 現心…",

      x: 67, y: 43

    },

    "現心の座": {

      axis: "現", action: "現す",

      description: "自分の内側にあるものを、行動や姿、選択など現実のあり方として現す座です。",

      cycle: "現心 → 詠唱 → 言霊 → 現心…",

      x: 42, y: 20

    },

    "結縁の座": {

      axis: "関", action: "つながる",

      description: "人や世界、物事との新しい接点を結ぶ座です。まだなかった縁が生まれ、視野が外へ開き始めます。",

      cycle: "結縁 → 絆広 → 共歩 → 結縁…",

      x: 82, y: 68

    },

    "絆広の座": {

      axis: "関", action: "広がる",

      description: "つながりを通して、自分だけでは見えなかった世界や考え方へ視野を広げる座です。",

      cycle: "結縁 → 絆広 → 共歩 → 結縁…",

      x: 87, y: 49

    },

    "共歩の座": {

      axis: "関", action: "共に進む",

      description: "つながった相手や物事と、現実の中で歩みを進める座です。関係を実際の経験へ育てます。",

      cycle: "結縁 → 絆広 → 共歩 → 結縁…",

      x: 78, y: 24

    },

    "天門の座": {

      axis: "信", action: "開く",

      description: "まだ見えていないものや可能性に対して、自分を開く座です。確かめきれないものにも入口をつくります。",

      cycle: "天門 → 信閃 → 道標 → 天門…",

      x: 63, y: 78

    },

    "道標の座": {

      axis: "信", action: "定める",

      description: "信じるものを、自分が進む方向として定める座です。内側の信を、現実の選択へつなげます。",

      cycle: "天門 → 信閃 → 道標 → 天門…",

      x: 52, y: 35

    },

    "信閃の座": {

      axis: "信", action: "灯る",

      description: "何かを信じることで、自分の内側に進むための力が灯る座です。信がエネルギーへ変わる地点です。",

      cycle: "天門 → 信閃 → 道標 → 天門…",

      x: 37, y: 68

    },

    "心眼の座": {

      axis: "理", action: "見る",

      description: "表面に見えていることだけでなく、その奥にある本質を見ようとする座です。理解の入口となる地点にあります。",

      cycle: "心眼 → 明鏡 → 知泉 → 心眼…",

      x: 22, y: 65

    },

    "明鏡の座": {

      axis: "理", action: "映す",

      description: "物事を一度そのまま映し、整理して理解する座です。自分の思い込みだけに寄らず、構造を捉えます。",

      cycle: "心眼 → 明鏡 → 知泉 → 心眼…",

      x: 34, y: 43

    },

    "知泉の座": {

      axis: "理", action: "湧く",

      description: "理解したことを起点に、さらに新しい知や問いが内側から湧き出す座です。",

      cycle: "心眼 → 明鏡 → 知泉 → 心眼…",

      x: 31, y: 78

    },

    "飛翔の座": {

      axis: "動", action: "動き出す",

      description: "考えている状態から離れ、実際の動きへ踏み出す座です。今いる場所から現実を前へ動かします。",

      cycle: "飛翔 → 現化 → 開頁 → 飛翔…",

      x: 59, y: 27

    },

    "現化の座": {

      axis: "動", action: "現実にする",

      description: "意志や構想を、実際に存在する形へ変える座です。動の中でも特に現実化を強く担います。",

      cycle: "飛翔 → 現化 → 開頁 → 飛翔…",

      x: 50, y: 14

    },

    "開頁の座": {

      axis: "動", action: "次を始める",

      description: "ひとつの現実を踏まえ、次の展開を実際に始める座です。新しいページを開き、また動きを生みます。",

      cycle: "飛翔 → 現化 → 開頁 → 飛翔…",

      x: 64, y: 34

    },

    "調律の座": {

      axis: "境", action: "距離を整える",

      description: "自分と外界を分けたうえで、双方が成立する距離や関係へ調整する座です。",

      cycle: "清界 → 共別 → 調律 → 清界…",

      x: 50, y: 22

    },

    "清界の座": {

      axis: "境", action: "輪郭をつくる",

      description: "ここまでが自分の領域だと輪郭を明確にする座です。自分の責任や気持ちを、外界のものと分けます。",

      cycle: "清界 → 共別 → 調律 → 清界…",

      x: 27, y: 31

    },

    "共別の座": {

      axis: "境", action: "違いを認識する",

      description: "共に存在しながらも、自分と相手は別であると捉える座です。違いを保ったまま公平に見ます。",

      cycle: "清界 → 共別 → 調律 → 清界…",

      x: 70, y: 34

    },

    "解放の座": {

      axis: "放", action: "離す",

      description: "抱えていたものを、もう保持しないと決めて手放す座です。終わったものに余白をつくります。",

      cycle: "解放 → 還元 → 新巡 → 解放…",

      x: 32, y: 42

    },

    "還元の座": {

      axis: "放", action: "還す",

      description: "手放したものを、本来あるべき場所や流れへ還す座です。自分の手元から循環へ返します。",

      cycle: "解放 → 還元 → 新巡 → 解放…",

      x: 62, y: 48

    },

    "新巡の座": {

      axis: "放", action: "巡り始める",

      description: "空いた場所から、新しいものや流れが巡り始める座です。手放しを次の循環へつなげます。",

      cycle: "解放 → 還元 → 新巡 → 解放…",

      x: 68, y: 66

    },

    "安息の座": {

      axis: "安", action: "身を置く",

      description: "自分が安心できる場所や状態に身を置き、そこに落ち着く座です。",

      cycle: "還憧 → 安息 → 灯火 → 還憧…",

      x: 28, y: 49

    },

    "還憧の座": {

      axis: "安", action: "帰る場所を知る",

      description: "自分がどこに在りたいのか、どんな状態なら自分でいられるのかを内側で感じ取る座です。",

      cycle: "還憧 → 安息 → 灯火 → 還憧…",

      x: 22, y: 70

    },

    "灯火の座": {

      axis: "安", action: "居場所にする",

      description: "安心できる場所を、現実の中で自分の領域として成立させ、保っていく座です。",

      cycle: "還憧 → 安息 → 灯火 → 還憧…",

      x: 57, y: 34

    },

    "和心の座": {

      axis: "受", action: "共存させる",

      description: "自分の気持ちと受け取ったものを、どちらも消さずに自分の中へ置く座です。",

      cycle: "掌心 → 溶心 → 和心 → 掌心…",

      x: 42, y: 54

    },

    "溶心の座": {

      axis: "受", action: "内側に通す",

      description: "受け取った出来事や気持ちを、自分の内側へ一度通してみる座です。同意ではなく、まず触れさせます。",

      cycle: "掌心 → 溶心 → 和心 → 掌心…",

      x: 29, y: 72

    },

    "掌心の座": {

      axis: "受", action: "受け取る",

      description: "外界から来たものを、判断する前にまず手のひらへ乗せるように受け取る座です。",

      cycle: "掌心 → 溶心 → 和心 → 掌心…",

      x: 76, y: 46

    },

    "天巡の座": {

      axis: "時", action: "流れを見る",

      description: "時間や変化を一点ではなく、大きな流れとして捉える座です。今に至る動きと、その先の可能性を見渡します。",

      cycle: "天巡 → 時極 → 暁鐘 → 天巡…",

      x: 58, y: 67

    },

    "時極の座": {

      axis: "時", action: "今を見極める",

      description: "流れを踏まえて、今は何をするときなのかを見極める座です。待つ・動く・続ける・終えるを判断します。",

      cycle: "天巡 → 時極 → 暁鐘 → 天巡…",

      x: 43, y: 28

    },

    "暁鐘の座": {

      axis: "時", action: "時を告げる",

      description: "見極めた時機を、現実の動きへ切り替える合図となる座です。『今だ』という判断を次へ渡します。",

      cycle: "天巡 → 時極 → 暁鐘 → 天巡…",

      x: 66, y: 22

    },

    "共鳴の座": {

      axis: "情", action: "響く",

      description: "人や出来事、世界との接触によって感情が響き始める座です。外界との間に生まれた揺れを受け取ります。",

      cycle: "共鳴 → 心波 → 漣見 → 共鳴…",

      x: 78, y: 74

    },

    "心波の座": {

      axis: "情", action: "波になる",

      description: "響いたものが、自分自身の感情として内側で波立ち、巡り始める座です。",

      cycle: "共鳴 → 心波 → 漣見 → 共鳴…",

      x: 32, y: 78

    },

    "漣見の座": {

      axis: "情", action: "波紋を見る",

      description: "自分の中に生まれた感情が、どこから来てどこへ広がっているのかを見つめる座です。",

      cycle: "共鳴 → 心波 → 漣見 → 共鳴…",

      x: 65, y: 57

    }

  };

  const JEWEL_BY_AXIS_CYCLE = {

    "感": ["天響の座", "降光の座", "透解の座"],

    "現": ["言霊の座", "詠唱の座", "現心の座"],

    "関": ["結縁の座", "絆広の座", "共歩の座"],

    "信": ["天門の座", "道標の座", "信閃の座"],

    "理": ["心眼の座", "明鏡の座", "知泉の座"],

    "動": ["飛翔の座", "現化の座", "開頁の座"],

    "境": ["調律の座", "清界の座", "共別の座"],

    "放": ["解放の座", "還元の座", "新巡の座"],

    "安": ["安息の座", "還憧の座", "灯火の座"],

    "受": ["和心の座", "溶心の座", "掌心の座"],

    "時": ["天巡の座", "時極の座", "暁鐘の座"],

    "情": ["共鳴の座", "心波の座", "漣見の座"]

  };

  function readStoredResult() {

    const storageSources = [

      { name: "sessionStorage", storage: sessionStorage },

      { name: "localStorage", storage: localStorage }

    ];

    for (const source of storageSources) {

      for (const key of STORAGE_KEYS) {

        const raw = source.storage.getItem(key);

        if (!raw) continue;

        try {

          return JSON.parse(raw);

        } catch (error) {

          console.warn(`${source.name} の ${key} を読み込めませんでした。`, error);

        }

      }

    }

    return null;

  }

  function clampCycle(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) return DEFAULT_CYCLE;

    return Math.min(3, Math.max(1, Math.round(number)));

  }

  function axisValue(candidate) {

    if (typeof candidate === "string" && candidate.trim()) {

      return candidate.trim();

    }

    if (candidate && typeof candidate === "object") {

      return (

        candidate.short ||

        candidate.key ||

        candidate.name ||

        candidate.axis ||

        null

      );

    }

    return null;

  }

  function getAxisCandidate(result) {

    if (!result || typeof result !== "object") return null;

    const directCandidates = [

      result.axis,

      result.axisKey,

      result.primaryAxis,

      result.primarySeat,

      result.seat,

      result.topAxis,

      result.resultAxis

    ];

    for (const candidate of directCandidates) {

      const value = axisValue(candidate);

      if (value) return value;

    }

    if (Array.isArray(result.ranking) && result.ranking.length > 0) {

      const value = axisValue(result.ranking[0]);

      if (value) return value;

    }

    const sequenceCandidates = [

      result.circuit,

      result.route,

      result.flow,

      result.axes,

      result.seats

    ];

    for (const sequence of sequenceCandidates) {

      if (!Array.isArray(sequence) || sequence.length === 0) continue;

      const value = axisValue(sequence[0]);

      if (value) return value;

    }

    return null;

  }

  function getCycleCandidate(result) {

    if (!result || typeof result !== "object") return DEFAULT_CYCLE;

    const directCandidates = [

      result.cycle,

      result.round,

      result.lap,

      result.circulation,

      result.primaryCycle

    ];

    for (const candidate of directCandidates) {

      if (candidate !== undefined && candidate !== null && candidate !== "") {

        return clampCycle(candidate);

      }

    }

    return DEFAULT_CYCLE;

  }

  function resolveAxisKey(axisCandidate) {

    if (!axisCandidate || typeof axisCandidate !== "string") return null;

    const value = axisCandidate.trim();

    if (window.RESONANCE_DATA?.[value]) return value;

    if (window.RESONANCE_NAME_TO_KEY?.[value]) {

      return window.RESONANCE_NAME_TO_KEY[value];

    }

    const shortCharacter = value.charAt(0);

    return window.RESONANCE_DATA?.[shortCharacter] ? shortCharacter : null;

  }

  function getRankedAxisKeys(result, fallbackAxisKey) {

    const candidates = [];

    if (Array.isArray(result?.ranking)) {

      candidates.push(...result.ranking);

    }

    for (const sequence of [result?.circuit, result?.route, result?.flow, result?.axes, result?.seats]) {

      if (Array.isArray(sequence)) candidates.push(...sequence);

    }

    const keys = [];

    for (const candidate of candidates) {

      const key = resolveAxisKey(axisValue(candidate));

      if (key && !keys.includes(key)) keys.push(key);

      if (keys.length === 3) break;

    }

    if (fallbackAxisKey && !keys.includes(fallbackAxisKey)) {

      keys.unshift(fallbackAxisKey);

    }

    while (keys.length < 3 && fallbackAxisKey) {

      keys.push(fallbackAxisKey);

    }

    return keys.slice(0, 3);

  }

  function createTextParagraphs(container, text) {

    container.innerHTML = "";

    const blocks = String(text || "")

      .split(/\n\s*\n/)

      .map((block) => block.trim())

      .filter(Boolean);

    blocks.forEach((block) => {

      const paragraph = document.createElement("p");

      paragraph.textContent = block;

      container.appendChild(paragraph);

    });

  }

  function setSectionHeading(elementId, iconPath, title) {

    const heading = byId(elementId);

    heading.innerHTML = "";

    if (iconPath) {

      const icon = document.createElement("img");

      icon.className = "axis-heading-icon";

      icon.src = iconPath;

      icon.alt = "";

      icon.setAttribute("aria-hidden", "true");

      heading.appendChild(icon);

    }

    const label = document.createElement("span");

    label.textContent = title;

    heading.appendChild(label);

  }

  function renderThreeCycleSection(prefix, rankedAxisKeys, fieldName) {

    rankedAxisKeys.forEach((axisKey, index) => {

      const cycle = index + 1;

      const data = window.getFlowerCycleData(axisKey, cycle);

      if (!data?.[fieldName]) {

        throw new Error(`${axisKey}の${cycle}巡データを確認できませんでした。`);

      }

      createTextParagraphs(byId(`${prefix}-${cycle}`), data[fieldName]);

    });

  }

  function getJewelData(symbolName, axisKey, cycle) {

    const direct = JEWEL_DATA[String(symbolName || "").trim()];

    if (direct) return { name: String(symbolName).trim(), ...direct };

    const fallbackName = JEWEL_BY_AXIS_CYCLE?.[axisKey]?.[clampCycle(cycle) - 1];

    const fallback = fallbackName ? JEWEL_DATA[fallbackName] : null;

    return fallback ? { name: fallbackName, ...fallback } : null;

  }

  function renderJewelPosition(symbolData, primaryAxisKey, selectedCycle) {

    const jewel = getJewelData(symbolData?.symbolName, primaryAxisKey, selectedCycle);

    if (!jewel) {

      throw new Error("宝石の座標データを確認できませんでした。");

    }

    const point = byId("jewel-map-point");

    point.style.left = `${jewel.x}%`;

    point.style.top = `${jewel.y}%`;

    byId("jewel-map-point-label").textContent = jewel.name;

    byId("jewel-action").textContent = `${jewel.axis}の循環｜${jewel.action}`;

    byId("jewel-description-title").textContent = jewel.name;

    createTextParagraphs(byId("jewel-description-text"), symbolData?.text || jewel.description);

    byId("jewel-cycle").textContent = jewel.cycle;

    point.setAttribute(

      "aria-label",

      `${jewel.name}。内界領域から外界領域、創造性から現実化の座標上に表示しています。`

    );

  }

  function getAxisScore(result, axisKey) {

    const direct = Number(result?.heavenEarth?.[axisKey]);

    if (Number.isFinite(direct)) return direct;

    const ranked = Array.isArray(result?.ranking)

      ? result.ranking.find((item) => {

          const key = resolveAxisKey(axisValue(item));

          return key === axisKey;

        })

      : null;

    const rankedValue = Number(ranked?.value);

    return Number.isFinite(rankedValue) ? rankedValue : 0;

  }

  function renderAxisProfile(result) {

    const container = byId("axis-profile-list");

    container.innerHTML = "";

    const scores = AXIS_PROFILE.map((axis) => ({

      ...axis,

      value: getAxisScore(result, axis.key)

    }));

    const maxScore = Math.max(...scores.map((axis) => axis.value), 1);

    scores.forEach((axis) => {

      const row = document.createElement("div");

      row.className = "axis-profile-row";

      const name = document.createElement("div");

      name.className = "axis-profile-name";

      name.textContent = axis.key;

      const description = document.createElement("div");

      description.className = "axis-profile-description";

      description.textContent = axis.description;

      const value = document.createElement("div");

      value.className = "axis-profile-value";

      value.textContent = Number.isInteger(axis.value)

        ? String(axis.value)

        : axis.value.toFixed(1);

      const track = document.createElement("div");

      track.className = "axis-profile-track";

      track.setAttribute("aria-hidden", "true");

      const fill = document.createElement("div");

      fill.className = "axis-profile-fill";

      fill.style.width = `${Math.max(3, (axis.value / maxScore) * 100)}%`;

      track.appendChild(fill);

      row.append(name, description, value, track);

      container.appendChild(row);

    });

  }

  function showError(message) {

    byId("result-loading").hidden = true;

    byId("result-content").hidden = true;

    byId("result-error").hidden = false;

    byId("result-error-message").textContent = message;

  }

  function renderResult(result, primaryAxisKey, selectedCycle) {

    const axisData = window.getResonanceAxisData(primaryAxisKey);

    const symbolData = window.getResonanceCycleData(primaryAxisKey, selectedCycle);

    if (!axisData || !symbolData) {

      throw new Error("解析結果に対応する座データを確認できませんでした。");

    }

    const image = byId("gem-card-image");

    image.src = axisData.image;

    image.alt = `${axisData.name}の宝石カード`;

    byId("symbol-name").textContent = symbolData.symbolName;

    byId("symbol-romaji").textContent = symbolData.romaji;

    const rankedAxisKeys = getRankedAxisKeys(result, primaryAxisKey);

    if (rankedAxisKeys.length < 3) {

      throw new Error("上位3座の解析結果を取得できませんでした。");

    }

    setSectionHeading("flower-heading", "img/icon-kan.png", "あなたの花の育ち方");

    setSectionHeading("movement-heading", axisData.icon, "あなたに現れやすい動き");

    renderThreeCycleSection("flower-text", rankedAxisKeys, "flower");

    renderThreeCycleSection("movement-text", rankedAxisKeys, "movement");

    renderJewelPosition(symbolData, primaryAxisKey, selectedCycle);

    renderAxisProfile(result);

    byId("result-loading").hidden = true;

    byId("result-error").hidden = true;

    byId("result-content").hidden = false;

    document.title = `${symbolData.symbolName} | 時光解析`;

  }

  function init() {

    if (

      !window.RESONANCE_DATA ||

      !window.FLOWER_DATA ||

      typeof window.getResonanceAxisData !== "function" ||

      typeof window.getResonanceCycleData !== "function" ||

      typeof window.getFlowerCycleData !== "function"

    ) {

      showError(

        "解析結果の辞典データを読み込めませんでした。ファイルの配置と読み込み順を確認してください。"

      );

      return;

    }

    const storedResult = readStoredResult();

    if (!storedResult) {

      showError("保存された解析結果がありません。解析ページから算定してください。");

      return;

    }

    const axisCandidate = getAxisCandidate(storedResult);

    const primaryAxisKey = resolveAxisKey(axisCandidate);

    const selectedCycle = getCycleCandidate(storedResult);

    if (!primaryAxisKey) {

      showError(

        "解析結果から表示する座を取得できませんでした。analysis.jsの保存内容を確認してください。"

      );

      return;

    }

    try {

      renderResult(storedResult, primaryAxisKey, selectedCycle);

    } catch (error) {

      console.error(error);

      showError(error.message || "解析結果の表示中にエラーが発生しました。");

    }

  }

  document.addEventListener("DOMContentLoaded", init);

})();

