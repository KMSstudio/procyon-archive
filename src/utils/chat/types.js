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

export {};
