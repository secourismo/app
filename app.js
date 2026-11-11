firebase.initializeApp({apiKey:"AIzaSyA-Xk_1oD4D8aZKE6cFZyxTYl5p69hMfrk",authDomain:"secourismo.firebaseapp.com",projectId:"secourismo",storageBucket:"secourismo.firebasestorage.app",messagingSenderId:"949593384130",appId:"1:949593384130:web:800da6c06ff2f7b918c75b"});
const auth=firebase.auth(),db=firebase.firestore();
const API_URL='';
async function api(path,body){if(!API_URL)throw Error('serveur non configuré');const t=await auth.currentUser.getIdToken();
 const r=await fetch(API_URL+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})});
 if(!r.ok)throw Error((await r.json().catch(()=>({}))).error||r.status);return r.json()}
async function sendWelcomeMail(){try{await api('/welcome')}catch(x){}}
const A=document.getElementById('app');
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuf=a=>[...a].sort(()=>Math.random()-.5);
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const today=()=>new Date().toISOString().slice(0,10);
let U=null,P=null,QS=[],L=null,MODE='login',TAB='contacts';
const T=(a,b)=>P&&P.tu===false?b:a;
const setTheme=d=>document.documentElement.dataset.th=d?'dark':'light';
setTheme(localStorage.dark==='1');
const toast=m=>{const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),2500)};
const BADGES=[{id:'first',n:'Premiers pas',i:'🩹',f:p=>Object.keys(p.done).length>=1},{id:'s3',n:'Série de 3 jours',i:'🔥',f:p=>p.streak>=3},{id:'s7',n:'Série de 7 jours',i:'🚀',f:p=>p.streak>=7},{id:'x100',n:'100 XP',i:'⭐',f:p=>p.xp>=100},{id:'x500',n:'500 XP',i:'🏆',f:p=>p.xp>=500},{id:'perf',n:'Sans faute',i:'🎯',f:(p,f)=>f},{id:'d5',n:'5 paliers',i:'🗺️',f:p=>Object.keys(p.done).length>=5},{id:'s30',n:'30 jours',i:'👑',f:p=>p.streak>=30},{id:'x1k',n:'1000 XP',i:'💎',f:p=>p.xp>=1000},{id:'cmb',n:'Combo ×7',i:'⚡',f:()=>L&&L.best>=7}];
const TYPES={qcm:'QCM (1 réponse)',multi:'Choix multiples',vf:'Vrai / Faux',order:'Remettre dans l\'ordre',text:'Réponse courte'};

let READY=false;
auth.onAuthStateChanged(async u=>{U=null;P=null;
 if(u){try{const r=db.doc('users/'+u.uid);let s=await r.get();
  if(!s.exists){const n=JSON.parse(sessionStorage.nu||'{}');await r.set({name:n.name||u.email.split('@')[0],email:u.email,level:n.level||'PSE1',tu:n.tu!==false,dark:false,xp:0,streak:0,last:'',done:{},badges:[],isAdmin:false,created:Date.now()});s=await r.get();sendWelcomeMail()}
  P={id:u.uid,...s.data()};loadG();setTheme(P.dark);localStorage.dark=P.dark?1:0;
  try{QS=(await db.collection('questions').get()).docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.n||0)-(b.n||0))}catch(x){QS=[];toast('Questions illisibles : vérifie les règles Firestore')}
  U=u;if(location.hash==='#/auth')location.hash='#/'}catch(x){P=null;toast('Erreur de chargement : '+(x.code||x.message))}}
 READY=true;route()});
window.onhashchange=route;
function route(k){if(k!==1)document.body.classList.remove('dro');
 if(!READY){A.innerHTML='<div class=ld><img src=logo.svg alt=""></div>';return}
 const h=location.hash.slice(2).split('/'),v=h[0];
 if(!U||!P)return v==='auth'?authV():v==='contact'?pub(contactForm()):landing();
 const f={'':home,play:()=>play(h[1]),practice:()=>play('*'),review:()=>play('!'),quests,shop,ach,profile,admin,contact:()=>shell(contactForm(),'contact')}[v]||home;f()}
const IC=p=>`<svg viewBox="0 0 24 24" width=24 height=24 fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>${p}</svg>`;
const ICO={home:IC('<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),user:IC('<circle cx=12 cy=8 r=4 /><path d="M4 21a8 8 0 0 1 16 0"/>'),mail:IC('<rect x=3 y=5 width=18 height=14 rx=3 /><path d="M3 7l9 6 9-6"/>'),shield:IC('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>')};
const HEART='<svg viewBox="0 0 24 24" width=22 height=22 fill="#ff4d5e"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>';
const RK=['Novice','Secouriste','Équipier','Sauveteur','Expert','Maître'],SND=()=>localStorage.snd!=='0';
window.dr=o=>document.body.classList.toggle('dro',!!o);
window.togS=()=>{localStorage.snd=SND()?'0':'1';beep(660);route(1)};
window.togD=()=>{const v=!P.dark;setTheme(v);localStorage.dark=v?1:0;P.dark=v;db.doc('users/'+U.uid).update({dark:v}).catch(()=>{});route(1)};
function shell(c,tab){const lv=Math.floor(P.xp/100)+1,it=[['#/','home','Apprendre','🏠'],['#/practice','practice','Entraînement libre','⚡'],['#/review','review','Révision espacée','🔁'],['#/quests','quests','Défis du jour','🎯'],['#/shop','shop','Boutique','🛍️'],['#/ach','ach','Succès','🏆'],['#/profile','profile','Profil & succès','🏅'],['#/contact','contact','Contact','✉️'],...(P.isAdmin?[['#/admin','admin','Administration','🛡️']]:[])];
 A.innerHTML=`<div class=top><button class=bg onclick="dr(1)" aria-label=Menu><i></i><i></i><i></i></button><span class=pill>🔥 ${P.streak}</span><span class=pill>💎 ${G.gems}</span><span class=pill>❤️ ${hearts()}</span></div><div class=w>${c}</div><div class=ov onclick="dr(0)"></div><aside class=dw><div class=dh><div class=av>${e((P.name||'?')[0]).toUpperCase()}</div><b style="font-size:1.15rem">${e(P.name)}</b><span>Niv. ${lv} · ${RK[Math.min(lv-1,5)]}</span><div class=bar><div style="width:${P.xp%100}%"></div></div><small>${P.xp%100}/100 XP vers le niv. ${lv+1}</small></div>${it.map(([h,k,l,i])=>`<a href="${h}" class="${tab===k?'act':''}" onclick="dr(0)"><i>${i}</i>${l}</a>`).join('')}<hr><a onclick="togS()"><i>${SND()?'🔊':'🔇'}</i>Sons : ${SND()?'activés':'coupés'}</a><a onclick="togD()"><i>${P.dark?'☀️':'🌙'}</i>${P.dark?'Mode clair':'Mode sombre'}</a><a onclick="auth.signOut();location.hash='#/';dr(0)"><i>🚪</i>Se déconnecter</a></aside>`}
function pub(c){A.innerHTML=`<div class=w><a href="#/" class=m>← Accueil</a>${c}</div>`}
// ===== Public =====
function contactForm(){return`<div class=card id=cf><h2>Nous contacter</h2><input class=in id=cn placeholder="Nom" value="${e(P?.name||'')}"><input class=in id=ce type=email placeholder="E-mail" value="${e(U?.email||'')}"><textarea class=in id=cm rows=4 placeholder="Votre message"></textarea><button class=btn onclick="sendContact()">Envoyer</button></div>`}
window.sendContact=async()=>{const m=cm.value.trim(),em=ce.value.trim();if(!m||!em)return toast('Remplis tous les champs');await db.collection('contacts').add({name:cn.value,email:em,msg:m,t:Date.now()});cf.innerHTML='<h2>Merci ! ✅</h2><p class=m>Nous revenons vers vous vite.</p>'};
function landing(){A.innerHTML=`<div class=hero><img src=logo.svg alt=""><h1>Les gestes qui sauvent, version jeu.</h1><p>Apprends le secourisme PSE1 et PSE2 en quelques minutes par jour : défis, séries et badges.</p><a class=btn href="#/auth" onclick="MODE='signup';W.s=0">Commencer gratuitement</a><a href="#/auth" onclick="MODE='login'" style="color:#fff;font-weight:800">J'ai déjà un compte</a></div><div class=w><h2>Pourquoi ça marche</h2><div class=feat><div><i>🎮</i>Un parcours à paliers qui se débloquent</div><div><i>🔥</i>Une série quotidienne pour rester régulier</div><div><i>🏅</i>Des badges et des XP à collecter</div><div><i>🧠</i>QCM, ordre des gestes, vrai/faux…</div></div><h2>Comment ça marche</h2><div class=card><p><b>1.</b> Choisis ton niveau, PSE1 ou PSE2</p><p><b>2.</b> Enchaîne de courtes leçons de 8 questions</p><p><b>3.</b> Valide les paliers et gagne des badges</p></div>${contactForm()}</div>`}
let W={s:0,name:'',tu:true,level:'PSE1'};
window.wz=(o,n=1)=>{Object.assign(W,o);W.s+=n;authV()};
function authV(){
 if(MODE==='login')return pub(`<h1 style="margin:16px 0">Bon retour 👋</h1><div class="card step"><input class=in id=ae type=email placeholder="E-mail"><input class=in id=ap type=password placeholder="Mot de passe"><button class=btn onclick="doAuth()">Se connecter</button></div><p class=m style="text-align:center" onclick="MODE='signup';W.s=0;authV()"><u>Pas de compte ? Créer le mien</u></p>`);
 const s=W.s,x=(a,b)=>W.tu?a:b;let b;
 if(s===0)b=`<h1>Comment souhaitez-vous que nous parlions ?</h1><p class=m>Vous pourrez le changer plus tard.</p><button class=big onclick="wz({tu:true})"><i>🤝</i><span><b>Tutoiement</b>« Salut, prêt à sauver des vies ? »</span></button><button class=big onclick="wz({tu:false})"><i>🎩</i><span><b>Vouvoiement</b>« Bonjour, prêt à sauver des vies ? »</span></button>`;
 if(s===1)b=`<h1>${x("Comment tu t'appelles ?",'Comment vous appelez-vous ?')}</h1><input class=in id=an value="${e(W.name)}" placeholder="Prénom" style="font-size:1.3rem;margin:20px 0"><button class=btn onclick="an.value.trim()?wz({name:an.value.trim()}):toast('Un prénom, svp')">Continuer</button>`;
 if(s===2)b=`<h1>${x('Quel niveau veux-tu travailler ?','Quel niveau souhaitez-vous travailler ?')}</h1><button class=big onclick="wz({level:'PSE1'})"><i>🩹</i><span><b>PSE1</b>Premiers Secours en Équipe, niveau 1</span></button><button class=big onclick="wz({level:'PSE2'})"><i>🚑</i><span><b>PSE2</b>Premiers Secours en Équipe, niveau 2</span></button>`;
 if(s===3)b=`<h1>Dernière étape, ${e(W.name)} !</h1><p class=m>${x('Crée ton accès pour sauvegarder ta progression.','Créez votre accès pour sauvegarder votre progression.')}</p><input class=in id=ae type=email placeholder="E-mail"><input class=in id=ap type=password placeholder="Mot de passe (6 caractères min.)"><button class=btn onclick="doAuth()">Créer mon compte</button>`;
 pub(`<div class=row style="margin:14px 0">${s>0?`<button class=sm onclick="wz({},-1)">←</button>`:'<span></span>'}<div class=bar style="flex:1;margin:0 12px"><div style="width:${(s+1)*25}%"></div></div><span class=m>${s+1}/4</span></div><div class=step>${b}</div><p class=m style="text-align:center;margin-top:20px" onclick="MODE='login';authV()"><u>J'ai déjà un compte</u></p>`)}
window.doAuth=async()=>{const E={'auth/invalid-credential':'E-mail ou mot de passe incorrect','auth/email-already-in-use':'Cet e-mail est déjà utilisé','auth/weak-password':'Mot de passe trop court (6 min.)','auth/invalid-email':'E-mail invalide','auth/missing-password':'Mot de passe manquant'};
 try{if(MODE==='signup'){sessionStorage.nu=JSON.stringify({name:W.name,level:W.level,tu:W.tu});await auth.createUserWithEmailAndPassword(ae.value,ap.value)}else await auth.signInWithEmailAndPassword(ae.value,ap.value)}catch(x){toast(E[x.code]||x.code)}};

// ===== Parcours adaptatif entremêlé =====
function themes(){
 const raw=[];QS.filter(q=>q.level===P.level&&q.type!=='scenario').forEach(q=>{if(!raw.includes(q.theme))raw.push(q.theme)});
 const groups={};
 raw.forEach(t=>{const base=t.split(' - ')[0];if(!groups[base])groups[base]=[];groups[base].push(t)});
 const mixed=[],baseNames=Object.keys(groups);
 let maxL=Math.max(0,...baseNames.map(b=>groups[b].length));
 for(let i=0;i<maxL;i++){baseNames.forEach(b=>{if(groups[b][i])mixed.push(groups[b][i])})}
 return mixed;
}

let AC;const beep=(f,d=.12,t=0)=>{if(!SND())return;try{AC=AC||new(window.AudioContext||webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime+t;o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.15,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(AC.destination);o.start(n);o.stop(n+d)}catch(x){}};
const sfx=k=>k==='ok'?(beep(660),beep(880,.18,.1)):k==='ko'?beep(200,.3):(beep(523),beep(659,.12,.12),beep(784,.3,.24));
const fx=t=>{const d=document.createElement('div');d.className='fx';d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),1000)};
// ===== Etat de jeu (gemmes, cœurs, gels, répétition espacée) synchronisé Firestore + local =====
let G={};const REG=25*60*1e3,IV=[0,1,3,7,14],DAY=864e5;
function loadG(){let l=null;try{l=JSON.parse(localStorage['g'+P.id]||'null')}catch(x){}const r=P.g,b=r&&(!l||(r.t||0)>=(l.t||0))?r:l;G=Object.assign({gems:0,fz:0,h:5,ht:Date.now(),srs:{},st:{},ch:'',t:0},b||{})}
let GT;const gs=()=>{G.t=Date.now();localStorage['g'+P.id]=JSON.stringify(G);clearTimeout(GT);GT=setTimeout(()=>db.doc('users/'+U.uid).update({g:G}).catch(()=>{}),1500)};
const hearts=()=>{const n=Date.now();if(G.h>=5)G.ht=n;else{const k=Math.floor((n-G.ht)/REG);if(k>0){G.h=Math.min(5,G.h+k);G.ht=G.h>=5?n:G.ht+k*REG}}return G.h};
const stp=k=>G.st[k]=(G.st[k]||0)+1,addD=n=>new Date(Date.now()+n*DAY).toISOString().slice(0,10),dueId=i=>{const x=G.srs[i];return x&&x[1]<=today()};
const srsUp=(id,ok)=>{const b=ok?Math.min((G.srs[id]||[0])[0]+1,4):0;G.srs[id]=[b,addD(IV[b])]};
const FL=q=>q.type==='scenario'?(q.steps||[]).map((t,i)=>({...t,type:'qcm',id:q.id+'#'+i,level:q.level,theme:q.theme,ctx:q.q,sl:'Étape '+(i+1)+'/'+q.steps.length})):[q];
const isDue=q=>q.type==='scenario'?(q.steps||[]).some((t,i)=>dueId(q.id+'#'+i)):dueId(q.id);
const WR=()=>QS.filter(q=>q.level===P.level&&isDue(q));
const QST=[['⭐','Gagner 30 XP','xp',30],['✅','Réussir 15 questions','ok',15],['📚','Terminer 2 leçons','n',2]];
const QD0=()=>{let q={};try{q=JSON.parse(localStorage['q'+P.id]||'{}')}catch(x){}return q.d===today()?q:{d:today(),xp:0,ok:0,n:0}};
function qadd(xp,ok){const q=QD0(),b=QST.map(s=>q[s[2]]>=s[3]);q.xp+=xp;q.ok+=ok;q.n++;localStorage['q'+P.id]=JSON.stringify(q);QST.forEach((s,i)=>{if(!b[i]&&q[s[2]]>=s[3])setTimeout(()=>toast('🎯 Défi réussi : '+s[1]),900)})}
function quests(){const q=QD0(),all=QST.every(t=>q[t[2]]>=t[3]),cl=G.ch===today();shell(`<h1 style="margin:10px 0">Défis du jour 🎯</h1><p class=m>Ils se renouvellent chaque jour.</p>`+QST.map(t=>{const v=Math.min(q[t[2]],t[3]);return`<div class="card qc step"><span class=qi>${t[0]}</span><div style="flex:1"><b>${t[1]}</b><div class=bar><div style="width:${v/t[3]*100}%"></div></div></div><small>${v}/${t[3]}</small>${v>=t[3]?'✅':''}</div>`}).join('')+`<div class="card qc step"><span class=qi>🎁</span><div style="flex:1"><b>Coffre du jour</b><br><small>Termine les 3 défis</small></div><button class=sm ${all&&!cl?'':'disabled'} onclick="chest()">${cl?'Ouvert ✅':'Ouvrir'}</button></div>`,'quests')}
window.chest=()=>{if(G.ch===today())return;const g=15+Math.floor(Math.random()*26);G.ch=today();G.gems+=g;gs();sfx('win');document.body.insertAdjacentHTML('beforeend',confetti());toast('🎁 +'+g+' gemmes !');quests()};
const SHOP=[['🧊','Gel de série',"Sauve ta série après 1 jour d'absence",50,()=>G.fz++],['❤️','Recharge de cœurs','Remet tes 5 cœurs',30,()=>{G.h=5;G.ht=Date.now()}]];
window.buy=i=>{const t=SHOP[i];if(G.gems<t[3])return toast('Pas assez de gemmes 💎');if(i===0&&G.fz>=2)return toast('2 gels maximum');if(i===1&&hearts()>=5)return toast('Cœurs déjà pleins');G.gems-=t[3];t[4]();gs();sfx('win');toast(t[1]+' acheté ✅');shop()};
function shop(){const h=hearts();shell(`<h1 style="margin:10px 0">Boutique 🛍️</h1><div class="gc step"><div><small>Ton trésor</small><h2>💎 ${G.gems}</h2><p>❤️ ${h}/5${h<5?' · +1 cœur dans '+Math.max(1,Math.ceil((REG-(Date.now()-G.ht))/6e4))+' min':''} · 🧊 ${G.fz}</p></div></div><p class=m>Gagne des gemmes avec les leçons, les défis et le coffre du jour.</p>`+SHOP.map((t,i)=>`<div class="card qc step"><span class=qi>${t[0]}</span><div style="flex:1"><b>${t[1]}</b><br><small>${t[2]}</small></div><button class=sm onclick="buy(${i})">💎 ${t[3]}</button></div>`).join(''),'shop')}
const ACH=[['🎯','Précision','ok','bonnes réponses',[10,50,200]],['📚','Assidu','ans','questions répondues',[20,100,500]],['🚑','Urgentiste','scn','scénarios terminés',[1,5,20]],['🏅','Sans faute','perf','leçons parfaites',[1,5,20]]];
function ach(){shell(`<h1 style="margin:10px 0">Succès 🏆</h1>`+ACH.map(([i,n,k,u,T3])=>{const v=G.st[k]||0,t=T3.findIndex(x=>v<x),tg=t<0?T3[2]:T3[t];return`<div class="card qc step"><span class=qi>${i}</span><div style="flex:1"><b>${n}</b> ${t<0?'👑':t===0?'🔒':['🥉','🥈','🥇'][t-1]}<div class=bar><div style="width:${Math.min(v/tg,1)*100}%"></div></div><small>${v}/${tg} ${u}</small></div></div>`}).join(''),'ach')}
function wk(){const d=new Date(),w=(d.getDay()+6)%7,l=P.last?new Date(P.last):null;return`<div class=wk>${[...'LMMJVSD'].map((c,i)=>{const k=l?Math.round((l-new Date(new Date(d.getTime()+(i-w)*864e5).toISOString().slice(0,10)))/864e5):-1,on=k>=0&&k<P.streak;return`<div class="${on?'fl':''} ${i===w?'td':''}"><span>${on?'🔥':''}</span>${c}</div>`}).join('')}</div>`}
const GOAL=30;
function ring(v){const r=30,c=2*Math.PI*r;return`<svg width=78 height=78 viewBox="0 0 76 76"><circle cx=38 cy=38 r=${r} fill=none stroke="rgba(255,255,255,.3)" stroke-width=8 /><circle cx=38 cy=38 r=${r} fill=none stroke=#fff stroke-width=8 stroke-linecap=round stroke-dasharray=${c} stroke-dashoffset=${c*(1-Math.min(v/GOAL,1))} transform="rotate(-90 38 38)" /><text x=38 y=44 text-anchor=middle fill=#fff font-weight=800 font-size=17>${Math.min(v,GOAL)}</text></svg>`}
// ===== Mises en situation : débloquées selon la progression du parcours =====
const nz=x=>(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function scn(){const lv=P.level,reg=themes(),sc=[],dn=reg.filter(t=>P.done[lv+'|'+t]).length;
 QS.filter(q=>q.level===lv&&q.type==='scenario').forEach(q=>{let o=sc.find(x=>x.t===q.theme);if(!o)sc.push(o={t:q.theme,req:q.req||q.theme.split(' - ')[1]||'',n:0});o.n++});
 return sc.map((o,i)=>{const m=o.req&&reg.find(t=>nz(t).includes(nz(o.req))),need=Math.ceil((i+1)/sc.length*reg.length);
  return{...o,d:!!P.done[lv+'|'+o.t],ok:m?!!P.done[lv+'|'+m]:dn>=need,why:m?'Termine d’abord « '+m+' »':'Termine '+need+' palier(s) du parcours'}})}
function scs(){const sc=scn();return sc.length?`<div class=row style="margin-top:24px"><h2 style="margin:0">🚑 Mises en situation</h2><small>${sc.filter(x=>x.d).length}/${sc.length}</small></div>`+sc.map(x=>`<a class="card qc scn step ${x.ok?'':'lk'}" ${x.ok?`href="#/play/${encodeURIComponent(x.t)}"`:`data-w="${e(x.why)}" onclick="toast('🔒 '+this.dataset.w)"`}><span class=qi>${x.d?'✅':x.ok?'🚑':'🔒'}</span><div style="flex:1"><b>${e(x.t.split(' - ')[1]||x.t)}</b><br><small>${x.ok?x.n+' scénario'+(x.n>1?'s':''):e(x.why)}</small></div></a>`).join(''):''}
function home(){let ok=true;const th=themes(),tx=P.last===today()?(P.todayXp||0):0,dn=th.filter(t=>P.done[P.level+'|'+t]).length;
 shell(`<div class="gc step"><div><small>${T('Salut','Bonjour')} ${e(P.name)} 👋</small><h2>Objectif du jour</h2><p>${tx>=GOAL?'Objectif atteint, bravo ! 🎉':T('Encore '+(GOAL-tx)+' XP pour ta série','Encore '+(GOAL-tx)+' XP pour votre série')}</p></div>${ring(tx)}</div>${wk()}<div class=qa><a class=big href="#/practice"><i>⚡</i><span><b>Entraînement</b>10 questions</span></a><a class=big href="#/review"><i>🔁</i><span><b>Révision</b>${WR().length} à revoir</span></a></div>`+(th.length?`<div class=row style="margin-top:18px"><h2 style="margin:0">Parcours ${P.level}</h2><small>${dn}/${th.length} paliers</small></div><div class=path>${th.map((t,i)=>{const d=P.done[P.level+'|'+t],lock=!ok,c=d?'done':lock?'lock':'cur';if(!d)ok=false;return`<a class="node ${c}" style="margin-left:${[0,50,80,50,0,-50,-80,-50][i%8]}px;animation-delay:${i*.06}s" ${lock?'':`href="#/play/${encodeURIComponent(t)}"`}><b>${d?'✓':lock?'🔒':'★'}</b>${e(t)}</a>`}).join('')}</div>`:`<div class=card><p class=m>Aucune question pour ce niveau pour l'instant.</p></div>`)+scs(),'home')}
function play(t){t=decodeURIComponent(t);if(hearts()<1){toast('💔 Plus de cœurs : passe par la boutique');return location.hash='#/shop'}
 const lk=scn().filter(x=>!x.ok);if(lk.some(x=>x.t===t)){toast('🔒 '+lk.find(x=>x.t===t).why);return location.hash='#/'}
 let p=QS.filter(q=>q.level===P.level&&!lk.some(x=>x.t===q.theme));if(t==='!')p=p.filter(isDue);else if(t!=='*')p=p.filter(q=>q.theme===t);
 const qs=shuf(p).slice(0,t==='*'?10:8).flatMap(FL);if(!qs.length){toast(t==='!'?'Rien à réviser aujourd’hui 🎉':'Aucune question');return location.hash='#/'}
 L={t:t==='*'?'Entraînement libre':t==='!'?'Révision espacée':t,qs,i:0,h:hearts(),ok:0,combo:0,best:0,free:t==='*'||t==='!',rv:t==='!'};ask()}
function ask(){const x=L.qs[L.i];if(!x)return fin();L.sel=['multi','order'].includes(x.type)?[]:null;L.chk=false;L.sh=x.type==='order'?shuf(x.options):null;L.nw=1;draw();L.nw=0}
const INS=t=>({qcm:T('Choisis la bonne réponse','Choisissez la bonne réponse'),multi:T('Sélectionne toutes les bonnes réponses','Sélectionnez toutes les bonnes réponses'),vf:'Vrai ou faux ?',order:T('Remets dans le bon ordre','Remettez dans le bon ordre'),text:T('Écris ta réponse','Écrivez votre réponse')}[t]);
const corr=(x,i)=>x.type==='multi'?[].concat(x.answer).map(Number).includes(i):i===+x.answer;

function draw(){
 const x=L.qs[L.i],c=L.chk,K='ABCDEF';let b='';
 
 // Extraire proprement le texte nettoyé (au cas où il subsiste un crochet)
 let rawQ=x.q||'';
 let cleanQ=rawQ.replace(/^\[.*?\]\s*/,'');
 // Nettoyer aussi les références au niveau dans la question si présente (ex: (PSE1) ou (PSE2))
 cleanQ=cleanQ.replace(/\((PSE1|PSE2)\)/gi,'').replace(/\s+/g,' ').trim();

 if(x.type==='qcm'||x.type==='multi')b=x.options.map((o,i)=>{const sel=Array.isArray(L.sel)?L.sel.includes(i):L.sel===i,cl=c?(corr(x,i)?'ok':sel?'ko':''):sel?'on':'';return`<button class="opt ${cl}" onclick="pick(${i})"><span class=k>${K[i]}</span>${e(o)}</button>`}).join('');
 else if(x.type==='vf'){const an=x.answer===true||norm(x.answer)==='vrai';b=['Vrai','Faux'].map((o,i)=>{const v=i===0,cl=c?(v===an?'ok':L.sel===v?'ko':''):L.sel===v?'on':'';return`<button class="opt ${cl}" onclick="pick(${v})"><span class=k>${v?'✓':'✕'}</span>${o}</button>`}).join('')}
 else if(x.type==='order')b=`<div class=ans>${L.sel.map((s,i)=>`<button class="chip on" onclick="unpick(${i})">${e(s)}</button>`).join('')}</div>`+L.sh.filter(s=>!L.sel.includes(s)).map(s=>`<button class=chip data-s="${e(s)}" onclick="pickO(this.dataset.s)">${e(s)}</button>`).join('');
 else b=`<input id=tx class=in placeholder="${T('Ta','Votre')} réponse" value="${e(L.sel||'')}" oninput="L.sel=this.value" ${c?'disabled':''} autocomplete=off>`;
 const empty=L.sel===null||L.sel===''||(x.type==='order'?L.sel.length<x.options.length:Array.isArray(L.sel)&&!L.sel.length);
 const f=!c?`<div class=fb><div><button class=btn ${empty?'disabled':''} onclick="check()">Vérifier</button></div></div>`:`<div class="fb ${L.good?'ok':'ko'}"><div><h3>${L.good?['✅ Bravo !','🎉 Excellent !','💪 Bien joué !','🌟 Parfait !'][L.i%4]:'❌ Pas tout à fait'}</h3>${L.good&&L.combo>=3?`<span class=cmb>🔥 Combo ×${L.combo}</span>`:''}<p>${e(x.explain||'')}</p>${!L.good&&['text','order'].includes(x.type)?`<p><i>Réponse : ${e(x.type==='order'?x.options.join(' → '):String(x.answer).split('|')[0])}</i></p>`:''}<button class=rep onclick="report()">⚑ Signaler cette question</button><button class="btn ${L.good?'g':''}" onclick="next()">Continuer</button></div></div>`;
 
 // Badges visuels pour séparer Niveau, Thème et Question
 const metaHtml=`<div class="q-meta"><span class="q-tag lvl">🏷️ ${e(x.level||P.level)}</span><span class="q-tag">📚 ${e(x.theme||L.t)}</span></div>`;
 
 A.innerHTML=`<div class="w ${L.nw?'step':''}"><div class=lh><a href="#/" class=x>✕</a><div class=bar><div style="width:${(L.i+(c?1:0))/L.qs.length*100}%"></div></div><span class="hr ${L.chk&&!L.good?'hb':''}">${HEART}${L.h}</span></div><p class=ins>${INS(x.type)}</p>${metaHtml}${x.ctx?`<div class="card ctx"><small>🚑 ${x.sl}</small><p>${e(x.ctx)}</p></div>`:''}<h2 class=qt>${e(cleanQ)}</h2>${b}</div>${f}`
}

window.pick=v=>{if(L.chk)return;const x=L.qs[L.i];if(x.type==='multi'){const i=L.sel.indexOf(v);i<0?L.sel.push(v):L.sel.splice(i,1)}else L.sel=v;draw()};
window.pickO=s=>{if(!L.chk){L.sel.push(s);draw()}};window.unpick=i=>{if(!L.chk){L.sel.splice(i,1);draw()}};
function good(x){const s=L.sel;switch(x.type){case'qcm':return s===+x.answer;case'multi':return[...s].sort().join()===[].concat(x.answer).map(Number).sort().join();case'vf':return s===(x.answer===true||norm(x.answer)==='vrai');case'order':return s.join('|')===x.options.join('|');default:return String(x.answer).split('|').some(a=>norm(s||'')===norm(a))}}
window.check=()=>{const x=L.qs[L.i];L.chk=true;L.good=good(x);
 if(L.good){L.ok++;L.combo++;L.best=Math.max(L.best,L.combo);sfx('ok');fx('+10');stp('ok')}else{L.h--;G.h=Math.max(0,L.h);L.combo=0;sfx('ko')}
 srsUp(x.id,L.good);stp('ans');if(x.ctx&&L.good){const[a,b]=x.sl.split(' ')[1].split('/');if(a===b)stp('scn')}
 gs();navigator.vibrate&&navigator.vibrate(L.good?20:[60,40,60]);draw()};
window.next=()=>{if(L.h<=0)return fin(true);L.i++;ask()};
function sheet(h){closeSheet();const d=document.createElement('div');d.id='sh';d.className='shbg';d.innerHTML=`<div class=sh onclick="event.stopPropagation()">${h}</div>`;d.onclick=closeSheet;document.body.append(d)}
window.closeSheet=()=>document.getElementById('sh')?.remove();
window.report=()=>{window.RS='';sheet(`<h3>Signaler cette question</h3><p class=m>Que se passe-t-il ?</p><div>${['Réponse incorrecte','Question ambiguë','Faute ou typo','Autre'].map(r=>`<button class=chip onclick="RS='${r}';this.parentNode.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${r}</button>`).join('')}</div><textarea class=in id=rm rows=3 placeholder="Précisions (facultatif)"></textarea><button class=btn onclick="sendReport()">Envoyer</button>`)};
window.sendReport=async()=>{const x=L.qs[L.i];if(!RS&&!rm.value.trim())return toast('Choisissez un motif ou précisez');await db.collection('reports').add({qid:x.id,q:x.q,msg:(RS+' '+rm.value).trim(),uid:U.uid,email:U.email,t:Date.now()});closeSheet();toast('Merci, signalement envoyé 🙏')};
const confetti=()=>Array.from({length:44},()=>`<i class=cf style="left:${Math.random()*100}%;background:hsl(${Math.random()*360} 90% 60%);animation-delay:${Math.random()*.6}s;animation-duration:${1.8+Math.random()*1.6}s"></i>`).join('');
async function fin(dead){const n=L.qs.length,perf=!dead&&L.ok===n,xp=L.ok*10+(perf?10:0)+(L.best>=3?L.best:0),k=P.level+'|'+L.t,d=today(),y=new Date(Date.now()-864e5).toISOString().slice(0,10);
 const y2=addD(-2);let fz=0;const st=P.last===d?P.streak:P.last===y?P.streak+1:(P.last===y2&&G.fz>0&&(fz=1))?P.streak+1:1,tx=(P.last===d?(P.todayXp||0):0)+xp,np={...P,xp:P.xp+xp,streak:st,last:d,todayXp:tx,done:{...P.done}};
 const win=!dead&&L.ok/n>=.6;if(win&&!L.free)np.done[k]=Math.max(np.done[k]||0,L.ok);qadd(xp,L.ok);sfx(win?'win':'ko');G.fz-=fz;const gm=Math.round(xp/5)+(perf?5:0);G.gems+=gm;if(perf)stp('perf');G.h=Math.max(0,L.h);
 const nb=BADGES.filter(b=>!P.badges.includes(b.id)&&b.f(np,perf));np.badges=[...P.badges,...nb.map(b=>b.id)];
 await db.doc('users/'+U.uid).update({xp:np.xp,streak:st,last:d,todayXp:tx,done:np.done,badges:np.badges});const lu=Math.floor(np.xp/100)>Math.floor(P.xp/100);if(lu)G.gems+=20;gs();P=np;
 shell(`<div class=fin>${win?confetti():''}<div class=em>${dead?'💔':perf?'🏆':win?'🎉':'💪'}</div><h1>${dead?'Plus de cœurs':win?(L.free?'Bien joué !':'Palier validé !'):'Presque !'}</h1><p class=m>${dead?T('Reviens t\'entraîner, tu y es presque.','Revenez vous entraîner, vous y êtes presque.'):win?'Beau travail, continue comme ça.':'Il faut 60 % de réussite pour valider.'}</p><div class=stats><div><small>XP</small><b>+${xp}</b></div><div><small>Précision</small><b>${Math.round(L.ok/n*100)}%</b></div><div><small>Série</small><b>🔥 ${st}</b></div></div><div class=card>💎 <b>+${gm+(lu?20:0)}</b> gemmes${fz?' · 🧊 gel de série utilisé':''}</div>${L.best>=3?`<div class=card>🔥 Combo max : <b>×${L.best}</b> (+${L.best} XP bonus)</div>`:''}${lu?`<div class=card>🆙 Niveau <b>${Math.floor(np.xp/100)+1}</b> atteint : ${RK[Math.min(Math.floor(np.xp/100),5)]} !</div>`:''}${nb.map(b=>`<div class=card>${b.i} Nouveau badge : <b>${b.n}</b></div>`).join('')}<a class=btn href="#/">Continuer</a></div>`,'home')}
// ===== Profil =====
const seg=(o,cur,fn)=>`<div class=seg>${o.map(([v,l])=>`<button class="${v===cur?'on':''}" onclick="${fn}(${typeof v==='string'?`'${v}'`:v})">${l}</button>`).join('')}</div>`;
function profile(){const dn=Object.keys(P.done).length;shell(`<div class="card pf step"><div class=av>${e((P.name||'?')[0]).toUpperCase()}</div><div><h2 style="margin:0">${e(P.name)}</h2><span class=m>${e(P.email||'')}</span></div></div><div class=stats><div><small>XP</small><b>⭐ ${P.xp}</b></div><div><small>Série</small><b>🔥 ${P.streak}</b></div><div><small>Paliers</small><b>✅ ${dn}</b></div></div><div class=card><b>Comment souhaitez-vous que nous parlions ?</b>${seg([[true,'🤝 Tutoiement'],[false,'🎩 Vouvoiement']],P.tu!==false,'setTu')}</div><div class=card><b>${T('Quel est ton niveau ?','Quel est votre niveau ?')}</b>${seg([['PSE1','PSE1'],['PSE2','PSE2']],P.level,'setLv')}</div><div class=card><b>Apparence</b>${seg([[false,'☀️ Clair'],[true,'🌙 Sombre']],!!P.dark,'setDk')}</div><div class=card><h3 style="margin-bottom:12px">Badges</h3><div class=bd>${BADGES.map(b=>`<div class="${P.badges.includes(b.id)?'':'off'}"><b>${b.i}</b>${b.n}</div>`).join('')}</div></div><button class=btn style="background:var(--c2);color:var(--t);box-shadow:none" onclick="auth.signOut();location.hash='#/'">Se déconnecter</button>`,'profile')}
window.setTu=v=>sv({tu:v});window.setLv=v=>sv({level:v});window.setDk=v=>{setTheme(v);localStorage.dark=v?1:0;sv({dark:v})};
window.sv=async o=>{Object.assign(P,o);await db.doc('users/'+U.uid).update(o);profile()};
// ===== Admin =====
async function admin(){if(!P.isAdmin)return location.hash='#/';shell('<p class=m>Chargement…</p>','admin');
 const col={contacts:'Messages',reports:'Signalements',users:'Comptes',questions:'Questions'};
 const snap=await db.collection(TAB).get(),ds=snap.docs.map(d=>({id:d.id,...d.data()}));let h='';
 if(TAB==='contacts')h=ds.map(d=>`<div class=card><b>${e(d.name)}</b> <span class=m>${e(d.email)}</span><p>${e(d.msg)}</p><button class=sm onclick="del('contacts','${d.id}')">Supprimer</button></div>`).join('');
 if(TAB==='reports')h=ds.map(d=>`<div class=card><b>${e(d.q)}</b><p>⚑ ${e(d.msg)}</p><span class=m>${e(d.email)}</span><br><button class=sm onclick="del('reports','${d.id}')">Résolu</button></div>`).join('');
 if(TAB==='users')h=ds.map(d=>`<div class=card><div class=row><div><b>${e(d.name)}</b> ${d.isAdmin?'🛡️':''}<br><span class=m>${e(d.email)} · ${d.level} · ${d.xp} XP</span></div></div><button class=sm onclick="adm('${d.id}',${!d.isAdmin})">${d.isAdmin?'Retirer admin':'Rendre admin'}</button> <button class=sm onclick="del('users','${d.id}')">Supprimer</button></div>`).join('');
 if(TAB==='questions')h=`<button class=btn onclick="openQ()">＋ Nouvelle question</button><div class=row><button class=sm onclick="impQ()">📤 Importer un Excel</button><button class=sm onclick="dlTpl()">📥 Modèle Excel</button></div>`+ds.map(d=>`<div class=card><span class=m>${d.type} · ${d.level} · ${e(d.theme)}</span><p>${e(d.q)}</p><button class=sm onclick="del('questions','${d.id}')">Supprimer</button></div>`).join('');
 shell(`<h2>Administration</h2><div class=tabs>${Object.entries(col).map(([k,v])=>`<button class="${k===TAB?'on':''}" onclick="TAB='${k}';admin()">${v}</button>`).join('')}</div>${h||'<p class=m>Rien ici.</p>'}`,'admin')}
window.del=(c,id)=>sheet(`<h3>Confirmer la suppression ?</h3><p class=m>Cette action est définitive.</p><button class=btn onclick="doDel('${c}','${id}')">Supprimer</button><button class=btn style="background:var(--b);color:var(--t);box-shadow:none" onclick="closeSheet()">Annuler</button>`);
window.doDel=async(c,id)=>{closeSheet();try{if(c==='users'&&API_URL)await api('/admin/delete-user',{uid:id});else{await db.doc(c+'/'+id).delete();if(c==='users')toast('Profil supprimé, mais pas le compte de connexion (serveur non configuré)')}
 if(c==='questions')QS=QS.filter(q=>q.id!==id)}catch(x){toast('Échec : '+x.message)}admin()};
window.adm=async(id,v)=>{await db.doc('users/'+id).update({isAdmin:v});admin()};
const QI={qcm:'🔘',multi:'☑️',vf:'⚖️',order:'🔢',text:'✍️'},QD={qcm:'Une seule bonne réponse',multi:'Plusieurs bonnes réponses',vf:'Vrai ou faux ?',order:"Étapes à remettre dans l'ordre",text:'La personne tape la réponse'};
let AQ;
window.openQ=()=>{AQ={s:0,type:'',level:P.level,theme:'',q:'',o:['',''],a:[],explain:''};qw()};
window.qs2=(o,n=1)=>{Object.assign(AQ,o);AQ.s+=n;qw()};
window.qt2=k=>{AQ.type=k;AQ.o=k==='vf'?[]:['',''];AQ.a=[];qs2({})};
window.alv=l=>{AQ.theme=qth.value;AQ.level=l;qw()};
window.tg=i=>{if(AQ.type==='multi'){const k=AQ.a.indexOf(i);k<0?AQ.a.push(i):AQ.a.splice(k,1)}else AQ.a=[i];qw()};
window.addO=()=>{if(AQ.o.length<6){AQ.o.push('');qw()}};
window.q1=()=>{AQ.theme=qth.value.trim();AQ.theme?qs2({}):toast('Choisissez un thème')};
window.q2=()=>{AQ.q=qq.value.trim();AQ.q?qs2({}):toast('Écrivez la question')};
window.q3=()=>{const t=AQ.type;if(t==='text')AQ.a=[qa.value.trim()];
 const ok=t==='vf'?AQ.a.length:t==='text'?AQ.a[0]:t==='order'?AQ.o.every(Boolean):AQ.o.every(Boolean)&&AQ.a.length;
 ok?qs2({}):toast('Complétez tous les champs')};
window.saveQ=async()=>{const t=AQ.type;AQ.explain=qx.value.trim();
 const d={type:t,level:AQ.level,theme:AQ.theme,q:AQ.q,options:t==='vf'||t==='text'?[]:AQ.o,answer:t==='multi'?AQ.a:t==='order'?'':AQ.a[0],explain:AQ.explain,n:Date.now()};
 const r=await db.collection('questions').add(d);QS.push({id:r.id,...d});closeSheet();toast('Question ajoutée ✅');admin()};
function qw(){const s=AQ.s,t=AQ.type;let b='';
 if(s===0)b=`<h3>Quel type de question ?</h3>`+Object.entries(TYPES).map(([k,v])=>`<button class=big onclick="qt2('${k}')"><i>${QI[k]}</i><span><b>${v}</b>${QD[k]}</span></button>`).join('');
 if(s===1)b=`<h3>Niveau et thème</h3><div class=seg>${['PSE1','PSE2'].map(l=>`<button class="${AQ.level===l?'on':''}" onclick="alv('${l}')">${l}</button>`).join('')}</div><p class=m style="margin-top:14px">Thème</p><div>${[...new Set(QS.filter(q=>q.level===AQ.level).map(q=>q.theme))].map(h=>`<button class=chip data-t="${e(h)}" onclick="qth.value=this.dataset.t">${e(h)}</button>`).join('')}</div><input class=in id=qth value="${e(AQ.theme)}" placeholder="Ou créer un nouveau thème"><button class=btn onclick="q1()">Continuer</button>`;
 if(s===2)b=`<h3>Quelle est la question ?</h3><textarea class=in id=qq rows=4 placeholder="Ex. Que faire face à un saignement abondant ?">${e(AQ.q)}</textarea><button class=btn onclick="q2()">Continuer</button>`;
 if(s===3){if(t==='vf')b=[['Vrai',true],['Faux',false]].map(([l,v])=>`<button class="big ${AQ.a[0]===v?'on':''}" onclick="AQ.a=[${v}];qw()"><i>${v?'✅':'❌'}</i><span><b>${l}</b>est la bonne réponse</span></button>`).join('');
  else if(t==='text')b=`<input class=in id=qa value="${e(AQ.a[0]||'')}" placeholder="Réponse attendue">`;
  else b=`<p class=m>${t==='order'?'Saisissez les étapes dans le BON ordre.':'Touchez ✓ pour marquer la bonne réponse'+(t==='multi'?' (plusieurs possibles).':'.')}</p>`+AQ.o.map((o,i)=>`<div class=row><input class=in value="${e(o)}" placeholder="${t==='order'?'Étape '+(i+1):'Option '+(i+1)}" oninput="AQ.o[${i}]=this.value">${t==='order'?'':`<button class="sm ${AQ.a.includes(i)?'on':''}" onclick="tg(${i})">✓</button>`}</div>`).join('')+`<button class=sm onclick="addO()">＋ Ajouter</button>`;
  b=`<h3>Les réponses</h3>`+b+`<button class=btn onclick="q3()">Continuer</button>`}
 if(s===4)b=`<h3>Une explication ?</h3><p class=m>Affichée après la réponse.</p><textarea class=in id=qx rows=4>${e(AQ.explain)}</textarea><button class="btn g" onclick="saveQ()">Enregistrer la question</button>`;
 sheet(`<div class=row style="margin-bottom:14px"><button class=sm onclick="${s?'qs2({},-1)':'closeSheet()'}">${s?'←':'✕'}</button><div class=bar style="flex:1;margin:0 12px"><div style="width:${(s+1)*20}%"></div></div></div>`+b)}
// ===== Import / export Excel =====
const XH=['type','niveau','theme','question','option1','option2','option3','option4','option5','option6','reponse','explication'];
const TM={qcm:'qcm',multi:'multi',multiple:'multi',vf:'vf','vrai/faux':'vf',vraifaux:'vf',ordre:'order',order:'order',texte:'text',text:'text'};
const qkey=q=>norm(q.level+'|'+q.theme+'|'+q.q);let IMP=[];
window.dlTpl=()=>{
 const ex=[['qcm','PSE1','Hémorragies','Que faire en premier face à un saignement abondant ?','Appuyer directement sur la plaie','Faire un garrot','Rincer la plaie','','','',1,'La compression directe est le premier geste.'],
 ['multi','PSE1','Arrêt cardiaque','Quels signes montrent un arrêt cardiaque ?','Inconscient','Ne respire pas','Parle normalement','','','','1;2','Inconscience + absence de respiration.'],
 ['vf','PSE1','Hémorragies',"La compression doit durer jusqu'à l'arrivée des secours.",'','','','','','','vrai',"On ne relâche pas la compression."],
 ['ordre','PSE1','Alerte',"Remets dans l'ordre les étapes d'une alerte.",'Se présenter',"Localiser l'accident",'Décrire la victime','Suivre les consignes','','','','Toujours dans cet ordre.'],
 ['texte','PSE2','Généralités',"Quel est le numéro d'urgence européen ?",'','','','','','','112|le 112','']];
 const ws=XLSX.utils.aoa_to_sheet([XH,...ex]);ws['!cols']=XH.map((h,i)=>({wch:i===3?55:i>=4&&i<10?26:i===11?40:14}));
 const hp=[["MODE D'EMPLOI : import de questions Secourismo"],[],
 ["1. Onglet « Questions » : une ligne = une question. Supprimez les lignes d'exemple et ajoutez les vôtres. Ne modifiez pas la ligne d'en-tête."],
 ['2. type : qcm | multi | vf | ordre | texte'],['3. niveau : PSE1 ou PSE2'],
 ["4. theme : nom du palier (ex. Hémorragies). Les questions d'un même thème et niveau forment un palier ; les paliers suivent l'ordre de première apparition dans le fichier."],
 ['5. option1 à option6 : les choix proposés (laisser vide si inutile).'],['6. reponse :'],
 ['    qcm : numéro de la bonne option (1 = option1). Ex. 2'],['    multi : numéros séparés par un point-virgule. Ex. 1;3'],['    vf : vrai ou faux'],
 ["    ordre : laisser vide. Saisissez les étapes dans le BON ordre dans option1, option2… (l'app les mélange)"],
 ['    texte : la réponse attendue ; variantes séparées par | (ex. 112|le 112). Accents et majuscules ignorés.'],
 ['7. explication : texte affiché après la réponse (facultatif).'],
 ['8. Import : Admin > Questions > Importer un Excel. Les questions déjà présentes (même niveau, thème et énoncé) sont ignorées.']];
 const w2=XLSX.utils.aoa_to_sheet(hp);w2['!cols']=[{wch:130}];
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Questions');XLSX.utils.book_append_sheet(wb,w2,"Mode d'emploi");
 XLSX.writeFile(wb,'modele-questions-secourismo.xlsx')};
function parseRows(rows){const ok=[],err=[],seen=new Set(QS.map(qkey));
 rows.forEach((r0,i)=>{const ln=i+2,r=Object.fromEntries(Object.entries(r0).map(([k,v])=>[norm(k),v])),g=k=>String(r[k]??'').trim();
  if(!g('question')&&!g('type'))return;
  const bad=m=>err.push(`Ligne ${ln} : ${m}`),t=TM[norm(g('type')).replace(/\s/g,'')],lv=g('niveau').toUpperCase().replace(/\s/g,''),th=g('theme'),q=g('question'),a=g('reponse'),o=[1,2,3,4,5,6].map(n=>g('option'+n)).filter(Boolean);
  if(!t)return bad('type inconnu (qcm, multi, vf, ordre, texte)');if(!['PSE1','PSE2'].includes(lv))return bad('niveau : PSE1 ou PSE2');if(!th)return bad('thème manquant');if(!q)return bad('question vide');
  const d={type:t,level:lv,theme:th,q,options:[],answer:'',explain:g('explication')};
  if(t==='qcm'||t==='multi'){if(o.length<2)return bad('au moins 2 options');
   const ix=a.split(/[,;\s]+/).filter(Boolean).map(x=>+x-1);
   if(!ix.length||ix.some(x=>!Number.isInteger(x)||x<0||x>=o.length))return bad('réponse invalide (numéros des bonnes options, ex. 2 ou 1;3)');
   if(t==='qcm'&&ix.length>1)return bad("un QCM n'a qu'une bonne réponse");d.options=o;d.answer=t==='qcm'?ix[0]:ix}
  else if(t==='vf'){const v=norm(a);if(v!=='vrai'&&v!=='faux')return bad('réponse : vrai ou faux');d.answer=v==='vrai'}
  else if(t==='order'){if(o.length<2)return bad('au moins 2 étapes');d.options=o}
  else{if(!a)return bad('réponse attendue manquante');d.answer=a}
  const k=qkey(d);if(seen.has(k))return bad('déjà présente, ignorée');seen.add(k);ok.push(d)});
 return{ok,err}}
window.impQ=()=>sheet(`<h3>Importer des questions</h3><p class=m>Choisissez votre fichier Excel rempli.</p><label class=big for=xf><i>📤</i><span><b>Choisir un fichier</b>.xlsx ou .csv</span></label><input type=file id=xf accept=".xlsx,.xls,.csv" hidden onchange="readX(this.files[0])"><button class=sm onclick="dlTpl()">📥 Télécharger le modèle</button>`);
window.readX=async f=>{if(!f)return;let rows;
 try{const wb=XLSX.read(await f.arrayBuffer());rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''})}catch(x){return toast('Fichier illisible')}
 const{ok,err}=parseRows(rows);IMP=ok;
 sheet(`<h3>Aperçu de l'import</h3><div class=card>✅ <b>${ok.length}</b> question(s) prête(s)</div>${err.length?`<div class=card>⚠️ <b>${err.length}</b> ligne(s) ignorée(s)<div class=m style="max-height:30vh;overflow:auto;font-size:.85rem">${err.slice(0,60).map(m=>`<p>${e(m)}</p>`).join('')}</div></div>`:''}${ok.length?`<button class="btn g" onclick="doImp()">Importer ${ok.length} question(s)</button>`:''}<button class=sm onclick="impQ()">Choisir un autre fichier</button>`)};
window.doImp=async()=>{const base=Date.now();let n=0;
 try{for(let i=0;i<IMP.length;i+=400){const b=db.batch(),part=[];IMP.slice(i,i+400).forEach((d,j)=>{const ref=db.collection('questions').doc();d.n=base+i+j;b.set(ref,d);part.push({id:ref.id,...d})});await b.commit();QS.push(...part);n+=part.length}}
 catch(x){toast('Erreur : '+(x.code||x.message))}
 closeSheet();toast(n+' questions importées ✅');admin()};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});