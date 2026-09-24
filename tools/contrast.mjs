// Berechnet WCAG-2.x-Kontraste für die Token-Paare. Aufruf: node tools/contrast.mjs
const lin = c => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
const L = h => { const n=parseInt(h.slice(1),16); return 0.2126*lin(n>>16&255)+0.7152*lin(n>>8&255)+0.0722*lin(n&255); };
export const cr = (a,b) => { const [x,y]=[L(a),L(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
const T = {
 night950:'#000F2B', night900:'#001842', night800:'#082453', night700:'#113065', night600:'#1D3F7A',
 white:'#FFFFFF', frost50:'#FCFDFE', frost100:'#F3F5F8', frost200:'#E7EBF1', frost300:'#D3DAE4',
 ink900:'#001842', ink700:'#3B4A5E', ink600:'#4B5B70',
 blue300:'#6AA8FF', blue400:'#4D94FF', blue500:'#0A6CFF', blue600:'#005BE6',
 cyan100:'#B3F4FB', cyan300:'#00DAF2', cyan700:'#006877',
 error300:'#FF9AA6', error600:'#C01F36',
 mist300:'#A6B4C7', mist400:'#8A9BB2', slate400:'#6F86A0', slate500:'#66758A',
 haze50:'#F7F9FC', haze100:'#E8EEF6',
 dusk950:'#000C24', dusk900:'#04183D', dusk800:'#0B234D', dusk700:'#132F60',
};
// [Vordergrund, Grund, Beschreibung, Mindestwert]
const pairs = [
 ['ink900','frost100','Text auf Hell',4.5],['ink900','frost200','Text auf Hell 2',4.5],['ink700','frost100','Text gedämpft auf Hell',4.5],['ink700','frost200','Text gedämpft auf Hell 2',4.5],['ink700','haze100','Text gedämpft auf Dunst',4.5],['ink600','frost50','Text gedämpft 2 auf Karte',4.5],
 ['frost50','night900','Text auf Dunkel',4.5],['mist300','night900','Text gedämpft auf Dunkel',4.5],['mist300','night800','Text gedämpft auf Karte dunkel',4.5],['mist300','night700','Text gedämpft auf night-700',4.5],['mist300','dusk700','Text gedämpft auf dusk-700',4.5],
 ['blue600','frost100','Akzent-Text auf Hell',4.5],['blue600','frost200','Akzent-Text auf Hell 2',4.5],['blue600','haze100','Akzent-Text auf Dunst',4.5],['blue600','frost50','Akzent-Text auf Karte',4.5],
 ['blue300','night900','Akzent-Text auf Dunkel',4.5],['blue300','night800','Akzent-Text auf Karte dunkel',4.5],['blue300','dusk700','Akzent-Text auf dusk-700',4.5],['blue300','dusk800','Akzent-Text auf dusk-800',4.5],
 ['white','blue500','Button-Text (Standard)',4.5],['white','blue600','Button-Text Hover',4.5],
 ['blue500','frost100','Grafik/Fokus auf Hell',3],['blue500','haze100','Grafik auf Dunst',3],['blue400','night900','Grafik auf Dunkel',3],['blue400','night800','Grafik auf Karte dunkel',3],['blue400','dusk800','Grafik auf dusk-800',3],['blue500','night900','Button-Fläche gegen Dunkel',3],
 ['cyan700','frost100','Geschützt auf Hell',4.5],['cyan700','frost200','Geschützt auf Hell 2',4.5],['cyan700','haze100','Geschützt auf Dunst',4.5],['cyan300','night900','Geschützt/Fokus auf Dunkel',4.5],['cyan300','night800','Geschützt auf Karte dunkel',4.5],['cyan300','dusk700','Geschützt auf dusk-700',4.5],
 ['night900','cyan100','Platzhalter-Markierung',4.5],['error600','frost50','Fehlertext auf Formular',4.5],['error600','frost100','Fehlertext auf Hell',4.5],['error300','night900','Fehlertext auf Dunkel',4.5],
 ['slate500','frost100','Grafiklinie auf Hell',3],['slate500','frost200','Grafiklinie auf Hell 2',3],['slate500','haze100','Grafiklinie auf Dunst',3],['slate400','night900','Grafiklinie auf Dunkel',3],['slate400','night800','Grafiklinie auf Karte dunkel',3],['mist400','dusk700','Linie stark auf dusk-700',3],
];
if ((process.argv[1]||'').endsWith('contrast.mjs')) for (const [a,b,n,min] of pairs) { const r=cr(T[a],T[b]); console.log(r.toFixed(2).padStart(6), r<min?'FAIL':r>=7?'AAA':r>=4.5?'AA ':'AA-large/UI', n, T[a], T[b]); }
