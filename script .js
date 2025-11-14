let user = JSON.parse(localStorage.getItem('user')) || {
  nickname: '', bio:'', avatar:'avatar.png', xp:0, coins:0, followers:[], following:[]
};
let feed = JSON.parse(localStorage.getItem('feed')) || [];
let lang = 'pt';

// LOGIN
function login(){
  let nick = document.getElementById('nicknameInput').value.trim();
  if(nick.length<3){ alert("Nickname deve ter ao menos 3 caracteres!"); return; }
  user.nickname = nick;
  localStorage.setItem('user', JSON.stringify(user));
  document.getElementById('loginSection').style.display='none';
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
    li.innerHTML=`<b>${post.user}</b>: ${post.text} <br> Curtidas: ${post.likes || 0} <button onclick="likePost(${post.id})">Curtir</button>`;
    list.appendChild(li);
  });
}
function createPost(){
  let text = document.getElementById('postInput').value.trim();
  if(text.length<1){ alert("Digite algo"); return; }
  let post = {id: Date.now(), user:user.nickname, text:text, likes:0};
  feed.push(post); localStorage.setItem('feed', JSON.stringify(feed));
  document.getElementById('postInput').value='';
  renderFeed();
}
function likePost(id){
  let post = feed.find(p=>p.id===id); post.likes++; localStorage.setItem('feed', JSON.stringify(feed));
  user.xp +=2; localStorage.setItem('user', JSON.stringify(user));
  renderFeed(); renderProfile(); renderRanking();
}

// RANKING
function renderRanking(){
  let rankingList = feed.concat().map(p=>p.user)
    .reduce((acc, u)=>{
      if(!acc[u]) acc[u] = {nickname:u, xp:0}; acc[u].xp+=2; return acc;
    },{});
  let list = document.getElementById('rankingList'); list.innerHTML='';
  Object.values(rankingList).sort((a,b)=>b.xp-a.xp).forEach(u=>{
    let li = document.createElement('li'); li.innerText=`${u.nickname} - XP: ${u.xp}`;
    list.appendChild(li);
  });
}

// MULTILINGUE
function setLang(l){
  lang = l;
  // aqui você pode expandir para alterar textos no site via JSON
}

// INICIALIZAÇÃO
window.onload=function(){
  if(user.nickname){ document.getElementById('loginSection').style.display='none'; renderProfile(); renderFeed(); renderRanking(); }
}
