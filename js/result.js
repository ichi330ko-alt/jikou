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

