// @/utils/chat/anonymize.js

import "server-only"
import crypto from "crypto";

/**
 * @typedef {import("@/utils/chat/types").Sender} Sender
 * @typedef {import("@/utils/chat/types").ChatMsg} ChatMsg
 * @typedef {import("@/utils/chat/types").AnnChat} AnnChatMsg
 */

const CHAT_ANONYMIZE_SECRET = process.env.CHAT_ANONYMIZE_SECRET;

const ADJECTIVES = [
  "휘날리는",
  "피로한",
  "뛰어노는",
  "신난",
  "졸린",
  "용감한",
  "차분한",
  "즐거운",
  "바쁜",
  "엉뚱한",
  "진지한",
  "느긋한",
];

const SCHOLARS = [
  "뢴트겟",
  "로렌츠",
  "퀴리",
  "레일리",
  "레나르트",
  "톰슨",
  "마이컬슨",
  "리프만",
  "브라운",
  "반데르발스",
  "빌헬름 빈",
  "브래그",
  "막스 플랑크",
  "슈타르크",
  "아인슈타인",
  "보어",
  "밀리컨",
  "시그반",
  "헤르츠",
  "페렝",
  "드브로이",
  "라만",
  "하이젠베르크",
  "슈뢰딩거",
  "디랙",
  "채드윅",
  "데이비슨",
  "페르미",
  "슈테른",
  "파울리",
  "애플턴",
  "윌슨",
  "유카와",
  "보른",
  "체렌코프",
  "바빌로프",
  "체임벌린",
  "위그너",
  "피인만",
  "도모나가",
  "베테",
  "에사키",
  "윌슨",
  "암페르",
  "노이만",
  "페르미",
  "튜링",
  "가우스",
  "오일러",
  "푸리에",
  "볼츠만",
  "힐베르트",
  "라마누잔",
];

/**
 * 送信者情報から匿名識別用ハッシュを生成します。
 *
 * @param {Sender} sender
 * @returns {string}
 */
export function hashSender(sender) {
  if (!sender?.email) {
    throw new Error("sender.email is required" ); }
  if (!CHAT_ANONYMIZE_SECRET) {
    throw new Error("CHAT_ANONYMIZE_SECRET is not configured"); }
  const payload = JSON.stringify({
    email: sender.email,
    name: sender.name || 'blank',
    major: sender.major || 'blank',
  });
  return crypto
    .createHmac("sha256", CHAT_ANONYMIZE_SECRET)
    .update(payload)
    .digest("hex");
}

/**
 * ハッシュ値から決定的なニックネームを生成します。
 * 同じハッシュ値に対しては常に同じニックネームを返します。
 *
 * @param {string} hash
 * @returns {string}
 */
export function createNickname(hash) {
  if (!hash) {
    throw new Error("hash is required"); }
  const adjectiveValue = parseInt(hash.slice(0, 8), 16);
  const scholarValue = parseInt(hash.slice(8, 16), 16);
  const adjective =
    ADJECTIVES[adjectiveValue % ADJECTIVES.length];
  const scholar =
    SCHOLARS[scholarValue % SCHOLARS.length];
  return `${adjective}${scholar}`;
}

/**
 * 送信者情報を匿名化します。
 *
 * @param {Sender} sender
 * @returns {AnnSender}
 */
export function anonymizeSender(sender) {
  if (!sender) {
    throw new Error("sender is required"); }
  const hash = hashSender(sender);
  const nickname = createNickname(hash);
  return { hash, nickname, major: sender.major };
}

/**
 * チャットメッセージを匿名化します。
 *
 * @param {ChatMsg} chat
 * @returns {AnnChatMsg}
 */
export function anonymizeChat(chat) {
  if (!chat?.sender) {
    throw new Error("chat.sender is required"); }
  return { ...chat, sender: anonymizeSender(chat.sender) };
}
