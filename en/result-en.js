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

    { key: "感", description: "Intuition" },

    { key: "現", description: "Expression" },

    { key: "関", description: "Connection" },

    { key: "信", description: "Trust" },

    { key: "理", description: "Understanding" },

    { key: "動", description: "Action" },

    { key: "境", description: "Boundary" },

    { key: "放", description: "Release" },

    { key: "安", description: "Belonging" },

    { key: "受", description: "Receiving" },

    { key: "時", description: "Timing" },

    { key: "情", description: "Emotion" }

  ];

  const JEWEL_DATA = {

    "天響の座": {

      axis: "感", action: "響く",

      description: "This Jewel Seat expresses the quality of 響く within the JIKŌ cycle.",

      cycle: "天響 → 降光 → 透解 → 天響…",

      x: 44, y: 82

    },

    "降光の座": {

      axis: "感", action: "降りてくる",

      description: "This Jewel Seat expresses the quality of 降りてくる within the JIKŌ cycle.",

      cycle: "天響 → 降光 → 透解 → 天響…",

      x: 68, y: 73

    },

    "透解の座": {

      axis: "感", action: "見通す",

      description: "This Jewel Seat expresses the quality of 見通す within the JIKŌ cycle.",

      cycle: "天響 → 降光 → 透解 → 天響…",

      x: 31, y: 58

    },

    "言霊の座": {

      axis: "現", action: "届ける",

      description: "This Jewel Seat expresses the quality of 届ける within the JIKŌ cycle.",

      cycle: "現心 → 詠唱 → 言霊 → 現心…",

      x: 79, y: 24

    },

    "詠唱の座": {

      axis: "現", action: "表現する",

      description: "This Jewel Seat expresses the quality of 表現する within the JIKŌ cycle.",

      cycle: "現心 → 詠唱 → 言霊 → 現心…",

      x: 67, y: 43

    },

    "現心の座": {

      axis: "現", action: "現す",

      description: "This Jewel Seat expresses the quality of 現す within the JIKŌ cycle.",

      cycle: "現心 → 詠唱 → 言霊 → 現心…",

      x: 42, y: 20

    },

    "結縁の座": {

      axis: "関", action: "つながる",

      description: "This Jewel Seat expresses the quality of つながる within the JIKŌ cycle.",

      cycle: "結縁 → 絆広 → 共歩 → 結縁…",

      x: 82, y: 68

    },

    "絆広の座": {

      axis: "関", action: "広がる",

      description: "This Jewel Seat expresses the quality of 広がる within the JIKŌ cycle.",

      cycle: "結縁 → 絆広 → 共歩 → 結縁…",

      x: 87, y: 49

    },

    "共歩の座": {

      axis: "関", action: "共に進む",

      description: "This Jewel Seat expresses the quality of 共に進む within the JIKŌ cycle.",

      cycle: "結縁 → 絆広 → 共歩 → 結縁…",

      x: 78, y: 24

    },

    "天門の座": {

      axis: "信", action: "開く",

      description: "This Jewel Seat expresses the quality of 開く within the JIKŌ cycle.",

      cycle: "天門 → 信閃 → 道標 → 天門…",

      x: 63, y: 78

    },

    "道標の座": {

      axis: "信", action: "定める",

      description: "This Jewel Seat expresses the quality of 定める within the JIKŌ cycle.",

      cycle: "天門 → 信閃 → 道標 → 天門…",

      x: 52, y: 35

    },

    "信閃の座": {

      axis: "信", action: "灯る",

      description: "This Jewel Seat expresses the quality of 灯る within the JIKŌ cycle.",

      cycle: "天門 → 信閃 → 道標 → 天門…",

      x: 37, y: 68

    },

    "心眼の座": {

      axis: "理", action: "見る",

      description: "This Jewel Seat expresses the quality of 見る within the JIKŌ cycle.",

      cycle: "心眼 → 明鏡 → 知泉 → 心眼…",

      x: 22, y: 65

    },

    "明鏡の座": {

      axis: "理", action: "映す",

      description: "This Jewel Seat expresses the quality of 映す within the JIKŌ cycle.",

      cycle: "心眼 → 明鏡 → 知泉 → 心眼…",

      x: 34, y: 43

    },

    "知泉の座": {

      axis: "理", action: "湧く",

      description: "This Jewel Seat expresses the quality of 湧く within the JIKŌ cycle.",

      cycle: "心眼 → 明鏡 → 知泉 → 心眼…",

      x: 31, y: 78

    },

    "飛翔の座": {

      axis: "動", action: "動き出す",

      description: "This Jewel Seat expresses the quality of 動き出す within the JIKŌ cycle.",

      cycle: "飛翔 → 現化 → 開頁 → 飛翔…",

      x: 59, y: 27

    },

    "現化の座": {

      axis: "動", action: "現実にする",

      description: "This Jewel Seat expresses the quality of 現実にする within the JIKŌ cycle.",

      cycle: "飛翔 → 現化 → 開頁 → 飛翔…",

      x: 50, y: 14

    },

    "開頁の座": {

      axis: "動", action: "次を始める",

      description: "This Jewel Seat expresses the quality of 次を始める within the JIKŌ cycle.",

      cycle: "飛翔 → 現化 → 開頁 → 飛翔…",

      x: 64, y: 34

    },

    "調律の座": {

      axis: "境", action: "距離を整える",

      description: "This Jewel Seat expresses the quality of 距離を整える within the JIKŌ cycle.",

      cycle: "清界 → 共別 → 調律 → 清界…",

      x: 50, y: 22

    },

    "清界の座": {

      axis: "境", action: "輪郭をつくる",

      description: "This Jewel Seat expresses the quality of 輪郭をつくる within the JIKŌ cycle.",

      cycle: "清界 → 共別 → 調律 → 清界…",

      x: 27, y: 31

    },

    "共別の座": {

      axis: "境", action: "違いを認識する",

      description: "This Jewel Seat expresses the quality of 違いを認識する within the JIKŌ cycle.",

      cycle: "清界 → 共別 → 調律 → 清界…",

      x: 70, y: 34

    },

    "解放の座": {

      axis: "放", action: "離す",

      description: "This Jewel Seat expresses the quality of 離す within the JIKŌ cycle.",

      cycle: "解放 → 還元 → 新巡 → 解放…",

      x: 32, y: 42

    },

    "還元の座": {

      axis: "放", action: "還す",

      description: "This Jewel Seat expresses the quality of 還す within the JIKŌ cycle.",

      cycle: "解放 → 還元 → 新巡 → 解放…",

      x: 62, y: 48

    },

    "新巡の座": {

      axis: "放", action: "巡り始める",

      description: "This Jewel Seat expresses the quality of 巡り始める within the JIKŌ cycle.",

      cycle: "解放 → 還元 → 新巡 → 解放…",

      x: 68, y: 66

    },

    "安息の座": {

      axis: "安", action: "身を置く",

      description: "This Jewel Seat expresses the quality of 身を置く within the JIKŌ cycle.",

      cycle: "還憧 → 安息 → 灯火 → 還憧…",

      x: 28, y: 49

    },

    "還憧の座": {

      axis: "安", action: "帰る場所を知る",

      description: "This Jewel Seat expresses the quality of 帰る場所を知る within the JIKŌ cycle.",

      cycle: "還憧 → 安息 → 灯火 → 還憧…",

      x: 22, y: 70

    },

    "灯火の座": {

      axis: "安", action: "居場所にする",

      description: "This Jewel Seat expresses the quality of 居場所にする within the JIKŌ cycle.",

      cycle: "還憧 → 安息 → 灯火 → 還憧…",

      x: 57, y: 34

    },

    "和心の座": {

      axis: "受", action: "共存させる",

      description: "This Jewel Seat expresses the quality of 共存させる within the JIKŌ cycle.",

      cycle: "掌心 → 溶心 → 和心 → 掌心…",

      x: 42, y: 54

    },

    "溶心の座": {

      axis: "受", action: "内側に通す",

      description: "This Jewel Seat expresses the quality of 内側に通す within the JIKŌ cycle.",

      cycle: "掌心 → 溶心 → 和心 → 掌心…",

      x: 29, y: 72

    },

    "掌心の座": {

      axis: "受", action: "受け取る",

      description: "This Jewel Seat expresses the quality of 受け取る within the JIKŌ cycle.",

      cycle: "掌心 → 溶心 → 和心 → 掌心…",

      x: 76, y: 46

    },

    "天巡の座": {

      axis: "時", action: "流れを見る",

      description: "This Jewel Seat expresses the quality of 流れを見る within the JIKŌ cycle.",

      cycle: "天巡 → 時極 → 暁鐘 → 天巡…",

      x: 58, y: 67

    },

    "時極の座": {

      axis: "時", action: "今を見極める",

      description: "This Jewel Seat expresses the quality of 今を見極める within the JIKŌ cycle.",

      cycle: "天巡 → 時極 → 暁鐘 → 天巡…",

      x: 43, y: 28

    },

    "暁鐘の座": {

      axis: "時", action: "時を告げる",

      description: "This Jewel Seat expresses the quality of 時を告げる within the JIKŌ cycle.",

      cycle: "天巡 → 時極 → 暁鐘 → 天巡…",

      x: 66, y: 22

    },

    "共鳴の座": {

      axis: "情", action: "響く",

      description: "This Jewel Seat expresses the quality of 響く within the JIKŌ cycle.",

      cycle: "共鳴 → 心波 → 漣見 → 共鳴…",

      x: 78, y: 74

    },

    "心波の座": {

      axis: "情", action: "波になる",

      description: "This Jewel Seat expresses the quality of 波になる within the JIKŌ cycle.",

      cycle: "共鳴 → 心波 → 漣見 → 共鳴…",

      x: 32, y: 78

    },

    "漣見の座": {

      axis: "情", action: "波紋を見る",

      description: "This Jewel Seat expresses the quality of 波紋を見る within the JIKŌ cycle.",

      cycle: "共鳴 → 心波 → 漣見 → 共鳴…",

      x: 65, y: 57

    }

  };

  const JEWEL_EN = {
  "天響の座": {
    "en": "Seat of Heavenly Resonance",
    "action": "Resonate",
    "desc": "You tend to notice subtle signals before they become fully visible, allowing intuition to resonate through you.",
    "cycle": "Heavenly Resonance → Descending Light → Clear Insight → Heavenly Resonance…"
  },
  "降光の座": {
    "en": "Seat of Descending Light",
    "action": "Receive Insight",
    "desc": "Insight often arrives as something received rather than forced, becoming clearer when you give it space to descend.",
    "cycle": "Heavenly Resonance → Descending Light → Clear Insight → Heavenly Resonance…"
  },
  "透解の座": {
    "en": "Seat of Clear Insight",
    "action": "See Through",
    "desc": "You are inclined to look through surface appearances and find the structure or meaning beneath them.",
    "cycle": "Heavenly Resonance → Descending Light → Clear Insight → Heavenly Resonance…"
  },
  "言霊の座": {
    "en": "Seat of Word-Spirit",
    "action": "Deliver",
    "desc": "Your expression gains power when inner meaning is carried outward through words, voice, or form.",
    "cycle": "Inner Expression → Chanting → Word-Spirit → Inner Expression…"
  },
  "詠唱の座": {
    "en": "Seat of Chanting",
    "action": "Express",
    "desc": "You give shape to what lives inside you by expressing it in a form that can be felt or understood by others.",
    "cycle": "Inner Expression → Chanting → Word-Spirit → Inner Expression…"
  },
  "現心の座": {
    "en": "Seat of Inner Expression",
    "action": "Manifest",
    "desc": "What is held within you tends to seek visible form, turning inner intention into something present in the world.",
    "cycle": "Inner Expression → Chanting → Word-Spirit → Inner Expression…"
  },
  "結縁の座": {
    "en": "Seat of Forming Bonds",
    "action": "Connect",
    "desc": "New movement begins for you through meaningful encounters and the bonds created between people.",
    "cycle": "Forming Bonds → Widening Bonds → Walking Together → Forming Bonds…"
  },
  "絆広の座": {
    "en": "Seat of Widening Bonds",
    "action": "Expand",
    "desc": "Connections tend to widen your world, opening perspectives and possibilities that were not available alone.",
    "cycle": "Forming Bonds → Widening Bonds → Walking Together → Forming Bonds…"
  },
  "共歩の座": {
    "en": "Seat of Walking Together",
    "action": "Move Together",
    "desc": "You often create momentum by moving alongside others, sharing a path without erasing individual differences.",
    "cycle": "Forming Bonds → Widening Bonds → Walking Together → Forming Bonds…"
  },
  "天門の座": {
    "en": "Seat of the Heavenly Gate",
    "action": "Open",
    "desc": "Trust can function as a gate for you, allowing a new direction or possibility to become accessible.",
    "cycle": "Heavenly Gate → Flash of Trust → Guiding Sign → Heavenly Gate…"
  },
  "道標の座": {
    "en": "Seat of the Guiding Sign",
    "action": "Set Direction",
    "desc": "You strengthen trust by giving it direction, turning a vague sense of possibility into a path you can follow.",
    "cycle": "Heavenly Gate → Flash of Trust → Guiding Sign → Heavenly Gate…"
  },
  "信閃の座": {
    "en": "Seat of the Flash of Trust",
    "action": "Ignite",
    "desc": "Trust may appear suddenly as a spark of certainty that lights up what had previously been unclear.",
    "cycle": "Heavenly Gate → Flash of Trust → Guiding Sign → Heavenly Gate…"
  },
  "心眼の座": {
    "en": "Seat of the Inner Eye",
    "action": "See",
    "desc": "Understanding begins by looking carefully, including at what cannot be recognized from surface information alone.",
    "cycle": "Inner Eye → Clear Mirror → Spring of Knowledge → Inner Eye…"
  },
  "明鏡の座": {
    "en": "Seat of the Clear Mirror",
    "action": "Reflect",
    "desc": "You understand by reflecting reality clearly, separating what is present from what has merely been assumed.",
    "cycle": "Inner Eye → Clear Mirror → Spring of Knowledge → Inner Eye…"
  },
  "知泉の座": {
    "en": "Seat of the Spring of Knowledge",
    "action": "Emerge",
    "desc": "Knowledge tends to gather until understanding rises naturally, like water emerging from a spring.",
    "cycle": "Inner Eye → Clear Mirror → Spring of Knowledge → Inner Eye…"
  },
  "飛翔の座": {
    "en": "Seat of Flight",
    "action": "Begin Moving",
    "desc": "Movement begins when you allow yourself to leave the ground and act before every detail is settled.",
    "cycle": "Flight → Manifestation → New Page → Flight…"
  },
  "現化の座": {
    "en": "Seat of Manifestation",
    "action": "Make Real",
    "desc": "You are oriented toward turning ideas and intentions into concrete reality that can be seen and used.",
    "cycle": "Flight → Manifestation → New Page → Flight…"
  },
  "開頁の座": {
    "en": "Seat of the New Page",
    "action": "Begin the Next",
    "desc": "Action for you often means opening the next page once the present stage has reached its limit.",
    "cycle": "Flight → Manifestation → New Page → Flight…"
  },
  "調律の座": {
    "en": "Seat of Attunement",
    "action": "Adjust Distance",
    "desc": "You create balance by adjusting distance and relationship until each part can exist without unnecessary strain.",
    "cycle": "Clear Boundary → Shared Difference → Attunement → Clear Boundary…"
  },
  "清界の座": {
    "en": "Seat of the Clear Boundary",
    "action": "Define Boundaries",
    "desc": "Clarity comes from knowing where your own responsibility, space, and identity begin and end.",
    "cycle": "Clear Boundary → Shared Difference → Attunement → Clear Boundary…"
  },
  "共別の座": {
    "en": "Seat of Shared Difference",
    "action": "Recognize Difference",
    "desc": "You can remain connected while recognizing that two people or things do not need to become the same.",
    "cycle": "Clear Boundary → Shared Difference → Attunement → Clear Boundary…"
  },
  "解放の座": {
    "en": "Seat of Release",
    "action": "Let Go",
    "desc": "You move forward by loosening your hold on what has completed its role rather than carrying it indefinitely.",
    "cycle": "Release → Return → New Cycle → Release…"
  },
  "還元の座": {
    "en": "Seat of Return",
    "action": "Return",
    "desc": "What is released is not simply lost; it can be returned to a wider flow where its value may take another form.",
    "cycle": "Release → Return → New Cycle → Release…"
  },
  "新巡の座": {
    "en": "Seat of the New Cycle",
    "action": "Begin a New Cycle",
    "desc": "Once space has been created, you naturally begin to notice where the next cycle wants to start.",
    "cycle": "Release → Return → New Cycle → Release…"
  },
  "安息の座": {
    "en": "Seat of Rest",
    "action": "Settle",
    "desc": "Your strength grows when you can place yourself somewhere that feels safe enough to stop constantly adapting.",
    "cycle": "Return Home → Rest → Guiding Light → Return Home…"
  },
  "還憧の座": {
    "en": "Seat of Returning Home",
    "action": "Know Where You Belong",
    "desc": "A sense of belonging comes from recognizing the place, people, or values to which you genuinely want to return.",
    "cycle": "Return Home → Rest → Guiding Light → Return Home…"
  },
  "灯火の座": {
    "en": "Seat of the Guiding Light",
    "action": "Make a Place Your Own",
    "desc": "You create belonging by tending a place until it becomes warm, recognizable, and able to support life.",
    "cycle": "Return Home → Rest → Guiding Light → Return Home…"
  },
  "和心の座": {
    "en": "Seat of Harmonious Heart",
    "action": "Let Things Coexist",
    "desc": "You are capable of holding different feelings or realities together without forcing one to erase the other.",
    "cycle": "Open Palm → Melting Heart → Harmonious Heart → Open Palm…"
  },
  "溶心の座": {
    "en": "Seat of the Melting Heart",
    "action": "Let It Pass Inward",
    "desc": "Experience becomes meaningful when you allow it to pass inward and be processed rather than stopping at the surface.",
    "cycle": "Open Palm → Melting Heart → Harmonious Heart → Open Palm…"
  },
  "掌心の座": {
    "en": "Seat of the Open Palm",
    "action": "Receive",
    "desc": "Receiving is one of your important movements: allowing support, experience, or feeling to enter before deciding what it means.",
    "cycle": "Open Palm → Melting Heart → Harmonious Heart → Open Palm…"
  },
  "天巡の座": {
    "en": "Seat of the Heavenly Cycle",
    "action": "Read the Flow",
    "desc": "You tend to notice larger movement and timing, sensing where events are heading before choosing how to respond.",
    "cycle": "Heavenly Cycle → Peak of Time → Dawn Bell → Heavenly Cycle…"
  },
  "時極の座": {
    "en": "Seat of the Peak of Time",
    "action": "Discern the Present",
    "desc": "Your judgment becomes strongest when you identify what this particular moment is asking for, rather than relying only on general rules.",
    "cycle": "Heavenly Cycle → Peak of Time → Dawn Bell → Heavenly Cycle…"
  },
  "暁鐘の座": {
    "en": "Seat of the Dawn Bell",
    "action": "Announce the Time",
    "desc": "You may become the one who recognizes that a turning point has arrived and gives that change a clear signal.",
    "cycle": "Heavenly Cycle → Peak of Time → Dawn Bell → Heavenly Cycle…"
  },
  "共鳴の座": {
    "en": "Seat of Resonance",
    "action": "Resonate",
    "desc": "Emotion often begins as resonance: something in the world touches you and produces a clear inner response.",
    "cycle": "Resonance → Heart-Wave → Seeing the Ripples → Resonance…"
  },
  "心波の座": {
    "en": "Seat of the Heart-Wave",
    "action": "Become a Wave",
    "desc": "Feeling becomes movement when it is allowed to travel through you instead of remaining fixed in one place.",
    "cycle": "Resonance → Heart-Wave → Seeing the Ripples → Resonance…"
  },
  "漣見の座": {
    "en": "Seat of Seeing the Ripples",
    "action": "See the Ripples",
    "desc": "You often understand emotion by observing the effects it creates in yourself, in relationships, and in the surrounding world.",
    "cycle": "Resonance → Heart-Wave → Seeing the Ripples → Resonance…"
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

      const data = window.getFlowerCycleDataEN(axisKey, cycle);

      if (!data?.[fieldName]) {

        throw new Error(`${axisKey}の${cycle}巡データを確認できませんでした。`);

      }

      createTextParagraphs(byId(`${prefix}-${cycle}`), data[fieldName]);

    });

  }


  function jewelDisplay(jewelName) {
    const meta = JEWEL_EN[jewelName];
    return meta ? `${jewelName} — ${meta.en}` : jewelName;
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

      throw new Error("The Jewel Seat coordinate data could not be found.");

    }

    const point = byId("jewel-map-point");

    point.style.left = `${jewel.x}%`;

    point.style.top = `${jewel.y}%`;

    const jewelEn = JEWEL_EN[jewel.name];

    byId("jewel-map-point-label").textContent = jewelDisplay(jewel.name);

    const axisEnglish = AXIS_PROFILE.find((item) => item.key === jewel.axis)?.description || jewel.axis;
    byId("jewel-action").textContent = `${jewel.axis} · ${axisEnglish} cycle | ${jewelEn?.action || jewel.action}`;

    byId("jewel-description-title").textContent = jewelDisplay(jewel.name);

    createTextParagraphs(
      byId("jewel-description-text"),
      jewelEn?.desc || jewel.description
    );

    byId("jewel-cycle").textContent = jewelEn?.cycle || jewel.cycle;

    point.setAttribute(

      "aria-label",

      `${jewelDisplay(jewel.name)}. Displayed between inner and outer orientation, and between creativity and manifestation.`

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

      throw new Error("The Seat data for this result could not be found.");

    }

    const image = byId("gem-card-image");

    const imagePath = String(axisData.image || "");
    image.src = imagePath.startsWith("../") ? imagePath : `../${imagePath}`;
    image.alt = `${axisData.name} Jewel Card`;

    byId("symbol-name").textContent = jewelDisplay(symbolData.symbolName);

    byId("symbol-romaji").textContent = symbolData.romaji;

    const rankedAxisKeys = getRankedAxisKeys(result, primaryAxisKey);

    if (rankedAxisKeys.length < 3) {

      throw new Error("The top three Seats could not be retrieved.");

    }

    setSectionHeading("flower-heading", "../img/icon-kan.png", "How your flower grows");

    const movementIcon = String(axisData.icon || "");
    setSectionHeading(
      "movement-heading",
      movementIcon.startsWith("../") ? movementIcon : `../${movementIcon}`,
      "How your pattern tends to move"
    );

    renderThreeCycleSection("flower-text", rankedAxisKeys, "flower");

    renderThreeCycleSection("movement-text", rankedAxisKeys, "movement");

    renderJewelPosition(symbolData, primaryAxisKey, selectedCycle);

    renderAxisProfile(result);

    byId("result-loading").hidden = true;

    byId("result-error").hidden = true;

    byId("result-content").hidden = false;

    document.title = `${jewelDisplay(symbolData.symbolName)} | JIKŌ Reading`;

  }

  function init() {

    if (

      !window.RESONANCE_DATA ||

      !window.FLOWER_DATA_EN ||

      typeof window.getResonanceAxisData !== "function" ||

      typeof window.getResonanceCycleData !== "function" ||

      typeof window.getFlowerCycleDataEN !== "function"

    ) {

      showError(

        "The reading dictionaries could not be loaded."

      );

      return;

    }

    const storedResult = readStoredResult();

    if (!storedResult) {

      showError("No saved reading was found. Please calculate from the Reading page.");

      return;

    }

    const axisCandidate = getAxisCandidate(storedResult);

    const primaryAxisKey = resolveAxisKey(axisCandidate);

    const selectedCycle = getCycleCandidate(storedResult);

    if (!primaryAxisKey) {

      showError(

        "The primary Seat could not be determined from the saved result."

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
