// CC-Ropson Gustavo

let user = { tribe:"", points:0, xp:0, coins:0 };
let ranking = JSON.parse(localStorage.getItem('gt_ranking')||'[]');
let lang='pt';

// ==========================
// MULTILÍNGUE
// ==========================
function setLang(l){
  lang=l;
  document.querySelectorAll('[data-lang]').forEach(el=>{
    fetch('languages.json')
    .then(res=>res.json())
    .then(data=>{
      el.innerText=data[lang][el.getAttribute('data-lang')];
    });
  });
}

// ==========================
// TRIBOS
// ==========================
function chooseTribe(name){
  user.tribe = name;
  document.getElementById('tribeName').innerText = "Tribo: "+name;
  addXP(10);
  alert("Bem-vindo à tribo "+name+"!");
}

// ==========================
// JOGOS
// ==========================
function startGame(game){
  let container = document.getElementById('gameContainer');
  container.innerHTML="";
  switch(game){
    case 'speedMath': speedMathGame(container); break;
    case 'memoryClash': memoryClashGame(container); break;
    case 'reactionWar': reactionWarGame(container); break;
    case 'brainTower': brainTowerGame(container); break;
  }
}

// ==========================
// PONTOS, XP, COINS
// ==========================
function addPoints(n){ user.points+=n; updateUI(); checkRewards(); }
function addXP(n){ user.xp+=n; updateUI(); checkRewards(); }
function addCoins(n){ user.coins+=n; updateUI(); }

function updateUI(){
  document.getElementById('points').innerText="Pontos: "+user.points;
  document.getElementById('xp').innerText="XP: "+user.xp;
  document.getElementById('coins').innerText="GT-Coins: "+user.coins;
  updateRanking();
}

// ==========================
// RECOMPENSAS
// ==========================
function checkRewards(){
  let rewards = document.getElementById('rewardsList');
  rewards.innerHTML="";
  if(user.points>=100){ rewards.innerHTML+="<li>Cupon 5% desconto</li>"; }
  if(user.points>=200){ rewards.innerHTML+="<li>Cupon 10% desconto</li>"; addCoins(50);}
}

// ==========================
// EMAIL INVISÍVEL
// ==========================
function showEmail(){ alert("Para mais informações, contate: infolearn8441@gmail.com"); }

// ==========================
// RANKING GLOBAL (localStorage)
// ==========================
function updateRanking(){
  // procura se user já existe
  let idx = ranking.findIndex(u=>u.tribe===user.tribe);
  if(idx>=0){ ranking[idx]={...user}; }
  else{ ranking.push({...user}); }
  // ordenar por pontos
  ranking.sort((a,b)=>b.points-a.points);
  localStorage.setItem('gt_ranking',JSON.stringify(ranking));
  let list=document.getElementById('rankingList');
  list.innerHTML="";
  ranking.slice(0,10).forEach(u=>{
    let li=document.createElement('li');
    li.innerText=`${u.tribe} - Pontos: ${u.points} | XP: ${u.xp} | Coins: ${u.coins}`;
    list.appendChild(li);
  });
}

// ==========================
// JOGOS FUNCIONAIS
// ==========================

// 1. Speed Math
function speedMathGame(container){
  let score=0; let time=15;
  container.innerHTML=`<h3>Resolva o maior número de contas em 15s!</h3>
  <div id="question"></div>
  <input type="number" id="answer" placeholder="Resposta">
  <button onclick="submitAnswer()">Enviar</button>
  <div id="timer">Tempo: ${time}s</div>
  <div id="score">Pontos: 0</div>`;

  let interval = setInterval(()=>{
    time--; document.getElementById('timer').innerText="Tempo: "+time+"s";
    if(time<=0){ clearInterval(interval); alert("Fim! Pontos: "+score); addPoints(score*10); addXP(score*5); container.innerHTML=""; }
  },1000);

  generateQuestion();

  function generateQuestion(){
    let a=Math.floor(Math.random()*10+1);
    let b=Math.floor(Math.random()*10+1);
    window.correctAnswer=a+b;
    document.getElementById('question').innerText=`${a} + ${b} = ?`;
    document.getElementById('answer').value="";
  }

  window.submitAnswer=function(){
    let ans=parseInt(document.getElementById('answer').value);
    if(ans===window.correctAnswer){ score++; document.getElementById('score').innerText="Pontos: "+score; }
    generateQuestion();
  }
}

// 2. Memory Clash
function memoryClashGame(container){
  let sequence=[]; let userSeq=[]; let level=1;
  container.innerHTML=`<h3>Memorize a sequência e repita!</h3>
  <div id="memoryDisplay"></div>
  <input type="text" id="memoryInput" placeholder="Digite a sequência">
  <button onclick="submitMemory()">Enviar</button>
  <div id="level">Nível: 1</div>`;

  generateSequence();
  function generateSequence(){
    sequence=[];
    for(let i=0;i<level+2;i++){ sequence.push(Math.floor(Math.random()*9)); }
    document.getElementById('memoryDisplay').innerText=sequence.join(" ");
    setTimeout(()=>{ document.getElementById('memoryDisplay').innerText=""; },1000*level);
    userSeq=[];
  }

  window.submitMemory=function(){
    userSeq=document.getElementById('memoryInput').value.split("").map(Number);
    if(userSeq.join("")===sequence.join("")){
      level++; document.getElementById('level').innerText="Nível: "+level; addPoints(level*10); addXP(level*5); generateSequence();
    } else { alert("Errado! Nível alcançado: "+level); container.innerHTML=""; }
  }
}

// 3. Reaction War
function reactionWarGame(container){
  let score=0;
  container.innerHTML=`<h3>Toque quando a cor mudar!</h3>
  <div id="reactBox" style="width:200px;height:200px;background:red;margin:auto;border-radius:20px;cursor:pointer;"></div>
  <div id="reactScore">Pontos: 0</div>`;

  let box=document.getElementById('reactBox');
  function changeColor(){ box.style.background="green"; }
  setTimeout(changeColor, Math.random()*5000+1000);

  box.onclick=function(){
    if(box.style.background==="green"){ score++; document.getElementById('reactScore').innerText="Pontos: "+score; box.style.background="red"; setTimeout(changeColor, Math.random()*5000+1000); }
  }

  setTimeout(()=>{ alert("Fim! Pontos: "+score); addPoints(score*20); addXP(score*10); container.innerHTML=""; },20000);
}

// 4. The Brain Tower
function brainTowerGame(container){
  let level=1;
  container.innerHTML=`<h3>Resolva os enigmas!</h3>
  <div id="puzzle"></div>
  <input type="number" id="puzzleInput" placeholder="Resposta">
  <button onclick="submitPuzzle()">Enviar</button>
  <div id="puzzleLevel">Nível: 1</div>`;

  generatePuzzle();
  function generatePuzzle(){
    let a=Math.floor(Math.random()*10+1);
    let b=Math.floor(Math.random()*10+1);
    window.puzzleAnswer=a*b;
    document.getElementById('puzzle').innerText=`${a} x ${b} = ?`;
    document.getElementById('puzzleInput').value="";
  }

  window.submitPuzzle=function(){
    let ans=parseInt(document.getElementById('puzzleInput').value);
    if(ans===window.puzzleAnswer){ level++; document.getElementById('puzzleLevel').innerText="Nível: "+level; addPoints(level*15); addXP(level*10); generatePuzzle(); }
    else{ alert("Errado! Nível alcançado: "+level); container.innerHTML=""; }
  }
      }
