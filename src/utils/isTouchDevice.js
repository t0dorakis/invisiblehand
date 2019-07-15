// export const isTouchDevice = () => {
//     const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
//     const mq = (query) => window.matchMedia(query).matches;
//
//     if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
//         return true;
//     }
//     // include the 'heartz' as a way to have a non matching MQ to help terminate the join
//     // https://git.io/vznFH
//     const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
//     return mq(query);
// }

export const isTouchDevice = () => 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);