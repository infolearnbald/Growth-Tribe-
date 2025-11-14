function createShop(){
  let name = document.getElementById('shopName').value.trim();
  if(!name){ alert("Digite o nome da loja"); return; }
  let shop = {id:Date.now(), owner:user.nickname, name:name, products:[]};
  shops.push(shop); localStorage.setItem('shops', JSON.stringify(shops));
  document.getElementById('shopName').value='';
  renderShops();
}
function renderShops(){
  let list = document.getElementById('shopsList'); list.innerHTML='';
  shops.forEach(shop=>{
    let li = document.createElement('li');
    li.innerHTML=`<b>${shop.name}</b> (dono: ${shop.owner}) <button onclick="addProduct(${shop.id})">Adicionar Produto</button>`;
    list.appendChild(li);
  });
}
function addProduct(shopId){
  let shop = shops.find(s=>s.id===shopId);
  let productName = prompt("Nome do produto:");
  if(!productName) return;
  let productPrice = prompt("Preço em cupons:");
  if(!productPrice || isNaN(productPrice)) return;
  shop.products.push({name:productName, price:Number(productPrice)});
  localStorage.setItem('shops', JSON.stringify(shops));
  renderShops();
}
