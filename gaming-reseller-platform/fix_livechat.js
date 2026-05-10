const fs = require('fs');
const p = 'client/src/pages/dashboard/LiveChat.js';
let c = fs.readFileSync(p, 'utf8');
if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
// The backtick template literal got converted to form feed (char 12) + 'loat s'
const animOld = 'animation: ' + String.fromCharCode(12) + 'loat s ease-in-out infinite';
const animNew = 'animation: (0.5 + i * 0.15) + ' + JSON.stringify('s ease-in-out infinite');
c = c.split(animOld).join(animNew);
console.log('Fixed:', !c.includes(String.fromCharCode(12)));
fs.writeFileSync(p, c, 'utf8');
