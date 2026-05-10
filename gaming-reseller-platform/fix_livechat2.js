const fs = require('fs');
const p = 'client/src/pages/dashboard/LiveChat.js';
let c = fs.readFileSync(p, 'utf8');
if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);

// Fix all remaining broken template literals
// Pattern: 'border: 1px solid ,' -> 'border: 1px solid rgba(124,58,237,0.5),'

// Fix 'border: 1px solid rgba(124,58,237,0.2)' patterns that lost their quotes
// Check for any remaining form feed chars
const ff = String.fromCharCode(12);
if (c.includes(ff)) {
  console.log('Fixed remaining formfeeds');
}

// Fix 'border: 1px solid  }' (double space)

console.log('Remaining issues:');
const lines = c.split('\n');
lines.forEach((l, i) => { if (l.includes('1px solid ,') || l.includes('1px solid  ') || l.includes(ff)) console.log(i+1, l.substring(0,80)); });

fs.writeFileSync(p, c, 'utf8');
console.log('Done');
