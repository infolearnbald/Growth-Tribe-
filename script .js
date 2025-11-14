let user = JSON.parse(localStorage.getItem('user')) || {nickname:'', bio:'', avatar:'avatar.png', xp:0, coins:0, followers:[], following:[], country:''};
let feed = JSON.parse(localStorage.getItem('feed')) || [];
let lang='pt';
let shops = JSON.parse(localStorage.getItem('shops')) || [];

// LOGIN
function login(){
  let nick = document.getElementById('nicknameInput').value.trim();
  let avatar = document.getElementById('avatarInput').value.trim() || 'avatar.png';
  let country = document.getElementById('countryInput').value;
  if(!nick || !country){ alert("Preencha todos os campos"); return; }
  user.nickname = nick; user.avatar = avatar; user.country = country;
  localStorage.setItem('user', JSON.stringify(user));
  document.getElementById('loginModal').style.display='none';
  document.getElementById('app').style.display='block';
  renderProfile(); renderFeed(); renderRanking(); renderShops();
}

// PERFIL
function renderProfile(){
  document.getElementById('userName').innerText = "Nickname: "+user.nickname;
  document.getElementById('xp').innerText = "XP: "+user.xp;
  document.getElementById('coins').innerText = "Cupons: "+user.coins;
  document.getElementById('avatar').src = user.avatar;
  document.getElementById('bioInput').value = user.bio;
  document.getElementById('followers').innerText = "Seguidores: "+user.followers.length;
  document.getElementById('following').innerText = "Seguindo: "+user.following.length;
}
function updateProfile(){
  user.bio = document.getElementById('bioInput').value;
  localStorage.setItem('user', JSON.stringify(user));
  renderProfile();
}

// FEED
function renderFeed(){
  let list = document.getElementById('feedList'); list.innerHTML='';
  feed.slice().reverse().forEach(post=>{
    let li = document.createElement('li');
    li.innerHTML=`<span><b>${post.user}</b>: ${post.text}</span>
      <span> Curtidas: ${post.likes || 0} <button onclick="likePost(${post.id})">Curtir</button></span>`;
    list.appendChild(li);
  });
}
function createPost(){
  let text = document.getElementById('postInput').value.trim();
  if(!text){ alert("Digite algo"); return; }
  let post = {id: Date.now(), user:user.nickname, text:text, likes:0};
  feed.push(post); localStorage.setItem('feed', JSON.stringify(feed));
  document.getElementById('postInput').value='';
  renderFeed(); renderRanking();
}
function likePost(id){
  let post = feed.find(p=>p.id===id); post.likes++; localStorage.setItem('feed', JSON.stringify(feed));
  user.xp +=2; localStorage.setItem('user', JSON.stringify(user));
  renderFeed(); renderProfile(); renderRanking();
}

// RANKING
function renderRanking(){
  let rankingMap = {};
  feed.forEach(p=>{
    if(!rankingMap[p.user]) rankingMap[p.user]={nickname:p.user, xp:0};
    rankingMap[p.user].xp+=2;
  });
  let list = document.getElementById('rankingList'); list.innerHTML='';
  Object.values(rankingMap).sort((a,b)=>b.xp-a.xp).forEach(u=>{
    let li = document.createElement('li'); li.innerText=`${u.nickname} - XP: ${u.xp}`;
    list.appendChild(li);
  });
}

// INICIALIZAÇÃO
window.onload=function(){
  if(user.nickname){ document.getElementById('loginModal').style.display='none'; document.getElementById('app').style.display='block';
  renderProfile(); renderFeed(); renderRanking(); renderShops();}
}
