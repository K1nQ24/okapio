// Berechnet WCAG-2.x-Kontraste für die Token-Paare. Aufruf: node tools/contrast.mjs
const lin = c => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
const L = h => { const n=parseInt(h.slice(1),16); return 0.2126*lin(n>>16&255)+0.7152*lin(n>>8&255)+0.0722*lin(n&255); };
export const cr = (a,b) => { const [x,y]=[L(a),L(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
const T = {
 night950:'#0A1117', night900:'#0F1A23', night800:'#15232E', night700:'#1D303D', night600:'#2B4252',
 bone50:'#FBF8F3', bone100:'#F5F0E7', bone200:'#EBE3D5', bone300:'#D8CDB9',
 ink900:'#0F1A23', ink700:'#3A4954', ink600:'#4B5A65',
 clay300:'#F0A07C', clay500:'#D2603A', clay600:'#B84A26', clay700:'#9C3C1B',
 sig300:'#7FD6C8', sig500:'#3FB3A3', sig700:'#1B6F65',
 mist300:'#A9B7C0', mist400:'#8FA0AB',
};
const pairs = [
 ['ink900','bone100','Text auf Hell'],['ink900','bone200','Text auf Sand'],['ink700','bone100','Text gedämpft auf Hell'],['ink600','bone100','Text gedämpft2 auf Hell'],['ink700','bone200','Text gedämpft auf Sand'],
 ['bone50','night900','Text auf Dunkel'],['mist300','night900','Text gedämpft auf Dunkel'],['mist300','night800','gedämpft auf Dunkel-Fläche'],['mist400','night900','mist400 auf night900'],
 ['clay700','bone100','Akzent-Text auf Hell'],['clay600','bone100','clay600 auf Hell'],['clay600','bone200','clay600 auf Sand'],['clay700','bone200','clay700 auf Sand'],['clay500','bone100','clay500 auf Hell'],
 ['clay300','night900','Akzent-Text auf Dunkel'],['clay500','night900','clay500 auf Dunkel'],['clay500','night800','clay500 auf night800'],
 ['night900','clay500','Button-Text night900 auf clay500'],['bone50','clay500','bone50 auf clay500'],['bone50','clay600','bone50 auf clay600'],['bone50','clay700','bone50 auf clay700'],
 ['sig700','bone100','Teal-Text auf Hell'],['sig300','night900','Teal-Text auf Dunkel'],['sig500','night900','sig500 auf Dunkel (Grafik)'],
 ['clay500','bone100','Grafik-Terrakotta auf Hell (3:1)'],['sig500','bone100','Grafik-Teal auf Hell (3:1)'],['sig700','bone50','sig700 auf bone50'],
 ['night600','night900','Linie auf Dunkel (dekorativ)'],['bone300','bone100','Linie auf Hell (dekorativ)'],
 ['ink600','bone50','ink600 auf bone50'],['ink900','bone50','ink900 auf bone50'],['clay700','bone50','clay700 auf bone50'],
 ['ink900','clay300','ink900 auf clay300'],['bone50','night700','bone50 auf night700'],['mist300','night700','mist300 auf night700'],
];
if ((process.argv[1]||'').endsWith('contrast.mjs')) for (const [a,b,n] of pairs) { const r=cr(T[a],T[b]); console.log(r.toFixed(2).padStart(6), r>=7?'AAA':r>=4.5?'AA ':r>=3?'AA-large/UI':'FAIL', n, T[a], T[b]); }
