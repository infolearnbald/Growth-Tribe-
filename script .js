// CC-Ropson Gustavo

let user = { tribe:"", points:0, xp:0, coins:0 };

function chooseTribe(name){
  user.tribe = name;
  document.getElementById('tribeName').innerText = "Tribo: "+name;
  addXP(10);
  alert("Bem-vindo à tribo "+name+"!");
}

function startGame(game){
  switch(game){
    case 'speedMath': alert("Speed Math Arena iniciado!"); addPoints(50); break;
    case 'memoryClash': alert("Memory Clash iniciado!"); addPoints(50); break;
    case 'reactionWar': alert("Reaction War iniciado!"); addPoints(50); break;
    case 'brainTower': alert("The Brain Tower iniciado!"); addPoints(50); break;
  }
}

function addPoints(n){
  user.points += n;
  document.getElementById('points').innerText = "Pontos: "+user.points;
  checkRewards();
}

function addXP(n){
  user.xp += n;
  document.getElementById('xp').innerText = "XP: "+user.xp;
  checkRewards();
}

function addCoins(n){
  user.coins += n;
  document.getElementById('coins').innerText = "GT-Coins: "+user.coins;
}

function checkRewards(){
  let rewards = document.getElementById('rewardsList');
  rewards.innerHTML="";
  if(user.points >=100){ rewards.innerHTML+="<li>Cupon de 5% desconto</li>"; }
  if(user.points >=200){ rewards.innerHTML+="<li>Cupon de 10% desconto</li>"; addCoins(50);}
}

// Botão invisível de contato
function showEmail(){
  alert("Para mais informações, contate: infolearn8441@gmail.com");
}

