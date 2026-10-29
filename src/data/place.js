/**
 * A place may optionally provide phone, email and an explicit mapUrl.
 * Missing contact details remain undefined; they are never inferred.
 * @typedef {Object} Place
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} [address]
 * @property {string} [website]
 * @property {string} [phone]
 * @property {string} [email]
 * @property {string} [mapUrl]
 * @property {Object} [photo]
 */

/** @param {Place} place @returns {Place} */
export function definePlace(place) {
  return { ...place }
}

