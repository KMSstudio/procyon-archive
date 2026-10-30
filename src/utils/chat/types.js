/* @/utils/chat/types.js */

/**
 * @typedef {Object} Sender
 * @property {string} email
 * @property {string} name
 * @property {string} major
 */

/**
 * @typedef {Object} AnnSender
 * @property {string} hash
 * @property {string} nickname
 * @property {string} major
 */

/**
 * @typedef {Object} Chat
 * @property {string} version
 * @property {string} id
 * @property {string} text
 * @property {string} createdAt
 * @property {Sender} sender
 */

/**
 * @typedef {Object} AnnChat
 * @property {string} version
 * @property {string} id
 * @property {string} text
 * @property {string} createdAt
 * @property {AnnSender} sender
 */

/**
 * @typedef {Object} AnnChatGroup
 * @property {AnnSender} sender
 * @property {AnnChat[]} messages
 */

/**
 * @typedef {Object} ChatRoom
 * @property {string} id
 * @property {string} roomName
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [lastMessage]
 * @property {string} [lastMessageSenderName]
 * @property {string|null} [lastMessageCreatedAt]
 * @property {{token: string, startedAt: string}|null} [_messageDeletion]
 */

/**
 * @typedef {Object} MessageCursor
 * @property {string} createdAt
 * @property {string} id
 */

/**
 * @typedef {Object} MessageQuery
 * @property {string} [before]
 * @property {string} [after]
 * @property {number} [limit]
 */

/**
 * @typedef {Object} MessagePage
 * @property {Chat[]} messages
 * @property {boolean} hasMore
 * @property {{oldest: string|null, latest: string|null}} cursor
 */

/**
 * @typedef {Object} RecentSnapshot
 * @property {Chat[]} messages
 * @property {boolean} hasOlder
 */

/**
 * @typedef {Object} TimeRange
 * @property {string} from
 * @property {string} to
 */

/**
 * @typedef {Object} DeleteResult
 * @property {number} deletedCount
 */

export {};
