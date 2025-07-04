// @/utils/exam/viewStats.js

import { getDriveId, getDriveText, updateDriveText, putDriveText } from "@/utils/drive/text";

// 試験ごとの閲覧統計データ（KST基準）
const viewStats = {};

const statsFileName = `server/stats/viewStats.json`
let statsFileId = null;
let isUpdated = -1;

const ttl = (process.env.TTL_EXAM_STATUS).split("*").map(Number).reduce((a, b) => a * b, 1);
function nowKST() {
  const kst = new Date(new Date().getTime() + 9*60*60*1000); return kst.getTime(); }
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * @function syncViewStats
 * @description TTLに基づき、viewStatsの読み込みまたは保存を行う
 * @param {number} now - 現在のKST時間
 */
async function syncViewStats(now) {
  if (isUpdated === -1) {
    try {
      statsFileId = await getDriveId(statsFileName);
      const text = await getDriveText(statsFileId);
      if (text) {
        const parsed = JSON.parse(text);
        for (const [name, arr] of Object.entries(parsed)) viewStats[name] = arr; }
    } catch {}
    isUpdated = now; return;
  }
  if (now - isUpdated > ttl) {
    const json = JSON.stringify(viewStats);
    if (statsFileId) { await updateDriveText(statsFileId, json); }
    else { statsFileId = await putDriveText("server/stats", "viewStats.json", json); }
    isUpdated = now; return;
  }
}

/**
 * @function countView
 * @description 指定された試験名に対して閲覧を1件記録し、統計データがなければ新規作成する
 * @param {string} name - 試験の識別名
 */
export async function countView(name) {
  const now = nowKST();
  console.log(`[examStats] count view call : ${JSON.stringify(viewStats)}`);
  await syncViewStats(now);
  if (!viewStats[name]) viewStats[name] = [];
  viewStats[name].push(now);
}

/**
 * @function refineViewStats
 * @description すべての試験の閲覧記録を確認し、24時間を超えた古いデータを末尾から削除する
 */
export function refineViewStats() {
  const now = nowKST();
  for (const q of Object.values(viewStats)) {
    while (q.length && now - q[q.length - 1] > DAY_MS) q.pop();
  }
}

/**
 * @function getHotExams
 * @description 閲覧数が多い注目試験を返す（閲覧統計を更新してから判定を行う）
 * @returns {string[]} - 該当する試験名の配列
 */
export function getHotExams() {
  refineViewStats();
  const examViews = Object.entries(viewStats).map(([name, q]) => ({
    name,
    count: q.length,
  }));
  console.log(`[examStats] get hot exam call 1 : ${JSON.stringify(examViews)}`);
  const over30 = examViews.filter(e => e.count >= 30).map(e => decodeURIComponent(e.name));
  const sorted = [...examViews].sort((a, b) => b.count - a.count);
  const top2 = sorted.slice(0, 2).filter(e => e.count >= 10).map(e => decodeURIComponent(e.name));
  console.log(`[examStats] get hot exam call 2 : ${JSON.stringify(Array.from(new Set([...over30, ...top2])))}`);
  return Array.from(new Set([...over30, ...top2]));
}

/**
 * @function getViews
 * @description 現在の全試験における閲覧数（すでに整理されたデータに基づく）を返す
 * @returns {Object} - 各試験名とその閲覧数のマップ
 */
export function getViews() {
  const result = {};
  for (const [name, q] of Object.entries(viewStats)) result[name] = q.length;
  return result;
}