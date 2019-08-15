const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const multiplier = 1.2;
export const chromeModifier = resolution => (resolution * (isChrome ? multiplier : 1));