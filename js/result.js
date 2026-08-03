(() => {

  "use strict";

 

  const STORAGE_KEYS = [

    "jikouResultData",

    "jikouStudioData",

    "resonanceResult"

  ];

 

  const DEFAULT_CYCLE = 1;

 

  const byId = (id) => document.getElementById(id);

 

  function readStoredResult() {

    const storageSources = [

      { name: "sessionStorage", storage: sessionStorage },

      { name: "localStorage", storage: localStorage }

    ];

 

    for (const source of storageSources) {

      for (const key of STORAGE_KEYS) {

        const raw = source.storage.getItem(key);

 

        if (!raw) {

          continue;

        }

 

        try {

          return JSON.parse(raw);

        } catch (error) {

          console.warn(

            `${source.name} の ${key} を読み込めませんでした。`,

            error

          );

        }

      }

    }

 

    return null;

  }

 

  function clampCycle(value) {

    const number = Number(value);

 

    if (!Number.isFinite(number)) {

      return DEFAULT_CYCLE;

    }

 

    return Math.min(3, Math.max(1, Math.round(number)));

  }

 

  function getAxisCandidate(result) {

    if (!result || typeof result !== "object") {

      return null;

    }

 

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

      if (typeof candidate === "string" && candidate.trim()) {

        return candidate.trim();

      }

 

      if (candidate && typeof candidate === "object") {

        const value =

          candidate.short ||

          candidate.key ||

          candidate.name ||

          candidate.axis;

 

        if (typeof value === "string" && value.trim()) {

          return value.trim();

        }

      }

    }

 

    if (Array.isArray(result.ranking) && result.ranking.length > 0) {

      const first = result.ranking[0];

 

      if (typeof first === "string") {

        return first;

      }

 

      if (first && typeof first === "object") {

        return first.short || first.key || first.name || first.axis || null;

      }

    }

 

    const sequenceCandidates = [

      result.circuit,

      result.route,

      result.flow,

      result.axes,

      result.seats

    ];

 

    for (const sequence of sequenceCandidates) {

      if (!Array.isArray(sequence) || sequence.length === 0) {

        continue;

      }

 

      const first = sequence[0];

 

      if (typeof first === "string") {

        return first;

      }

 

      if (first && typeof first === "object") {

        return first.short || first.key || first.name || first.axis || null;

      }

    }

 

    return null;

  }

 

  function getCycleCandidate(result) {

    if (!result || typeof result !== "object") {

      return DEFAULT_CYCLE;

    }

 

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

 

    if (result.primarySeat && typeof result.primarySeat === "object") {

      const nested =

        result.primarySeat.cycle ||

        result.primarySeat.round ||

        result.primarySeat.lap;

 

      if (nested !== undefined) {

        return clampCycle(nested);

      }

    }

 

    if (Array.isArray(result.ranking) && result.ranking.length > 0) {

      const first = result.ranking[0];

 

      if (first && typeof first === "object") {

        const nested = first.cycle || first.round || first.lap;

 

        if (nested !== undefined) {

          return clampCycle(nested);

        }

      }

    }

 

    return DEFAULT_CYCLE;

  }

 

  function resolveAxisKey(axisCandidate) {

    if (!axisCandidate || typeof axisCandidate !== "string") {

      return null;

    }

 

    const value = axisCandidate.trim();

 

    if (window.RESONANCE_DATA?.[value]) {

      return value;

    }

 

    if (window.RESONANCE_NAME_TO_KEY?.[value]) {

      return window.RESONANCE_NAME_TO_KEY[value];

    }

 

    const shortCharacter = value.charAt(0);

 

    if (window.RESONANCE_DATA?.[shortCharacter]) {

      return shortCharacter;

    }

 

    return null;

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

 

  function showError(message) {

    byId("result-loading").hidden = true;

    byId("result-content").hidden = true;

    byId("result-error").hidden = false;

    byId("result-error-message").textContent = message;

  }

 

  function renderResult(axisKey, selectedCycle) {

    const axisData = window.getResonanceAxisData(axisKey);

    const symbolData = window.getResonanceCycleData(axisKey, selectedCycle);

 

    if (!axisData || !symbolData) {

      throw new Error("解析結果に対応する座データを確認できませんでした。");

    }

 

    const image = byId("gem-card-image");

    image.src = axisData.image;

    image.alt = `${axisData.name}の宝石カード`;

 

    byId("symbol-name").textContent = symbolData.symbolName;

    byId("symbol-romaji").textContent = symbolData.romaji;

    const axisHeading = byId("axis-heading");

    axisHeading.innerHTML = "";

 

    const axisIcon = document.createElement("img");

    axisIcon.className = "axis-heading-icon";

    axisIcon.src = axisData.icon;

    axisIcon.alt = "";

    axisIcon.setAttribute("aria-hidden", "true");

 

    const axisName = document.createElement("span");

    axisName.textContent = axisData.name;

 

    axisHeading.append(axisIcon, axisName);

 

    [1, 2, 3].forEach((cycle) => {

      const data = window.getResonanceCycleData(axisKey, cycle);

      createTextParagraphs(byId(`cycle-text-${cycle}`), data.text);

    });

 

    byId("result-loading").hidden = true;

    byId("result-error").hidden = true;

    byId("result-content").hidden = false;

 

    document.title = `${symbolData.symbolName} | 時光解析`;

  }

 

  function init() {

    if (

      !window.RESONANCE_DATA ||

      typeof window.getResonanceAxisData !== "function" ||

      typeof window.getResonanceCycleData !== "function"

    ) {

      showError(

        "resonance-data.jsを読み込めませんでした。ファイルの配置と読み込み順を確認してください。"

      );

      return;

    }

 

    const storedResult = readStoredResult();

 

    if (!storedResult) {

      showError("保存された解析結果がありません。解析ページから算定してください。");

      return;

    }

 

    const axisCandidate = getAxisCandidate(storedResult);

    const axisKey = resolveAxisKey(axisCandidate);

    const selectedCycle = getCycleCandidate(storedResult);

 

    if (!axisKey) {

      showError(

        "解析結果から表示する座を取得できませんでした。analysis.jsの保存内容を確認してください。"

      );

      return;

    }

 

    try {

      renderResult(axisKey, selectedCycle);

    } catch (error) {

      console.error(error);

      showError(error.message || "解析結果の表示中にエラーが発生しました。");

    }

  }

 

  document.addEventListener("DOMContentLoaded", init);

})();
