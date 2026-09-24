// Berechnet WCAG-2.x-Kontraste für die Token-Paare. Aufruf: node tools/contrast.mjs
const lin = c => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
const L = h => { const n=parseInt(h.slice(1),16); return 0.2126*lin(n>>16&255)+0.7152*lin(n>>8&255)+0.0722*lin(n&255); };
export const cr = (a,b) => { const [x,y]=[L(a),L(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
const T = {
 night950:'#060E1A', night900:'#0A1628', night800:'#11213A', night700:'#1A2D4A', night600:'#2A4062',
 frost50:'#FCFDFE', frost100:'#F3F5F8', frost200:'#E7EBF1', frost300:'#D3DAE4',
 ink900:'#0A1628', ink700:'#3B4A5E', ink600:'#4B5B70',
 clay300:'#F0A07C', clay500:'#D2603A', clay600:'#B84A26', clay700:'#9C3C1B',
 sig300:'#7FD6C8', sig500:'#3FB3A3', sig700:'#1B6F65',
 mist300:'#A6B4C7', mist400:'#8A9BB2', slate400:'#6F86A0', slate500:'#66758A',
 haze50:'#F7F9FC', haze100:'#E8EEF6',
 dusk950:'#07101E', dusk900:'#0C1A2E', dusk800:'#13243C', dusk700:'#1B3050',
};
const pairs = [
 ['ink900','frost100','Text auf Hell'],['ink900','frost200','Text auf Sand'],['ink700','frost100','Text gedämpft auf Hell'],['ink600','frost100','Text gedämpft2 auf Hell'],['ink700','frost200','Text gedämpft auf Sand'],
 ['frost50','night900','Text auf Dunkel'],['mist300','night900','Text gedämpft auf Dunkel'],['mist300','night800','gedämpft auf Dunkel-Fläche'],['mist400','night900','mist400 auf night900'],
 ['clay700','frost100','Akzent-Text auf Hell'],['clay600','frost100','clay600 auf Hell'],['clay600','frost200','clay600 auf Sand'],['clay700','frost200','clay700 auf Sand'],['clay500','frost100','clay500 auf Hell'],
 ['clay300','night900','Akzent-Text auf Dunkel'],['clay500','night900','clay500 auf Dunkel'],['clay500','night800','clay500 auf night800'],
 ['night900','clay500','Button-Text night900 auf clay500'],['frost50','clay500','frost50 auf clay500'],['frost50','clay600','frost50 auf clay600'],['frost50','clay700','frost50 auf clay700'],
 ['sig700','frost100','Teal-Text auf Hell'],['sig300','night900','Teal-Text auf Dunkel'],['sig500','night900','sig500 auf Dunkel (Grafik)'],
 ['clay500','frost100','Grafik-Terrakotta auf Hell (3:1)'],['sig500','frost100','Grafik-Teal auf Hell (3:1)'],['sig700','frost50','sig700 auf frost50'],
 ['night600','night900','Linie auf Dunkel (dekorativ)'],['frost300','frost100','Linie auf Hell (dekorativ)'],
 ['ink600','frost50','ink600 auf frost50'],['ink900','frost50','ink900 auf frost50'],['clay700','frost50','clay700 auf frost50'],
 ['ink900','clay300','ink900 auf clay300'],['ink700','haze100','Text gedämpft auf Dunst'],['clay700','haze100','Akzent-Text auf Dunst'],['slate500','haze100','Grafiklinie auf Dunst'],['mist300','night950','Text gedämpft auf night-950'],['mist300','dusk700','Text gedämpft auf dusk-700'],['clay300','dusk800','Akzent-Text auf dusk-800'],['mist400','dusk700','Linie stark auf dusk-700'],['slate400','night800','Grafiklinie auf night-800'],['slate500','frost200','Grafiklinie auf frost-200'],['frost50','night700','frost50 auf night700'],['mist300','night700','mist300 auf night700'],
];
if ((process.argv[1]||'').endsWith('contrast.mjs')) for (const [a,b,n] of pairs) { const r=cr(T[a],T[b]); console.log(r.toFixed(2).padStart(6), r>=7?'AAA':r>=4.5?'AA ':r>=3?'AA-large/UI':'FAIL', n, T[a], T[b]); }
