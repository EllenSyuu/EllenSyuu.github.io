/*
 * The site follows Montréal's seasons. One switch changes the cover plate, the falling
 * particles and the cursor companion together:
 *   'autumn'      — full maples, warm watercolour clouds, falling leaves
 *   'first-frost' — late November: bare maples with the last leaves, snow on Mont Royal and
 *                   the roofs, ice on the river, light snow with the odd leaf
 */
export const SEASON = 'first-frost';
export const isFrost = SEASON !== 'autumn';

export const FROST = '#8ea6bd';
export const FROST_LIGHT = '#c5d2de';
export const SNOW = '#fdfdfb';
