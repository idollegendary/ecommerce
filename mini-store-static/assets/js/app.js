/* mini-store static SPA: router, state, views, and mock data */
const state = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  products: [],
  categories: [],
  orders: JSON.parse(localStorage.getItem('orders') || '[]'),
};

function saveCart(){ localStorage.setItem('cart', JSON.stringify(state.cart)); }
function saveAuth(){ if(state.user){ localStorage.setItem('user', JSON.stringify(state.user)); localStorage.setItem('token', state.token || ''); } else { localStorage.removeItem('user'); localStorage.removeItem('token'); } }
function saveOrders(){ localStorage.setItem('orders', JSON.stringify(state.orders)); }

// Seed mock data
function seed(){
  state.categories = [
    { id: 1, name: 'Laptops' },
    { id: 2, name: 'Phones' },
    { id: 3, name: 'Accessories' },
  ];
  state.products = [
    { id:1, sku:'LAP-001', name:'Ultrabook Pro 14', short:'Powerful and portable 14" laptop', price:1299, currency:'USD', images:[{url:'./assets/hero-laptop.svg'}], rating:4.6, stock:5, preorder:false, categoryId:1 },
    { id:2, sku:'PHN-101', name:'Smartphone X', short:'Flagship phone with great camera', price:899, currency:'USD', images:[{url:'./assets/hero-phone.svg'}], rating:4.4, stock:0, preorder:true, categoryId:2 },
    { id:3, sku:'ACC-550', name:'Wireless Headphones', short:'Noise-cancelling, long battery', price:199, currency:'USD', images:[{url:'./assets/hero-headphones.svg'}], rating:4.2, stock:25, preorder:false, categoryId:3 },
    { id:4, sku:'LAP-777', name:'Developer Laptop 16', short:'High performance for devs', price:1899, currency:'USD', images:[{url:'./assets/hero-laptop.svg'}], rating:4.8, stock:11, preorder:false, categoryId:1 },
  ];
}

// Utilities
const fmt = (n) => n.toFixed(2);
function byId(id){ return state.products.find(p=>p.id===Number(id)); }
function cartCount(){ return state.cart.reduce((s,i)=>s+i.qty,0); }
function upsertCart(productId, delta){
  const p = byId(productId); if(!p) return;
  const existing = state.cart.find(i=>i.productId===productId);
  if(existing){ existing.qty = Math.max(1, existing.qty + delta); } else { state.cart.push({ productId, name:p.name, price:p.price, qty:1 }); }
  state.cart = state.cart.filter(i=>i.qty>0);
  saveCart();
  renderHeader();
}
function removeCart(productId){ state.cart = state.cart.filter(i=>i.productId!==productId); saveCart(); renderHeader(); }

// Router
const routes = {
  '': HomeView,
  '#/': HomeView,
  '#/catalog': CatalogView,
  '#/product': ProductView,
  '#/cart': CartView,
  '#/checkout': CheckoutView,
  '#/auth/login': LoginView,
  '#/auth/register': RegisterView,
  '#/profile': ProfileView,
  '#/admin': AdminView,
};

function navigate(hash){ window.location.hash = hash; }
window.addEventListener('hashchange', renderApp);

// Layout
function renderHeader(){
  const app = document.getElementById('app');
  const count = cartCount();
  app.querySelector('.header')?.remove();
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <div class="header-inner container">
      <a class="brand" href="#/">
        <span class="dot"></span>
        mini-store
      </a>
      <nav class="nav">
        <a href="#/catalog">Каталог</a>
        <a href="#/profile">Профіль</a>
        <a href="#/admin">Адмін</a>
      </nav>
      <div class="actions">
        ${state.user ? `<span class="muted">Вітаю, ${state.user.username}</span>` : `<a class="btn btn-outline" href="#/auth/login">Увійти</a>`}
        <a class="btn icon-btn" href="#/cart" aria-label="Кошик">
          🛒 ${count>0?`<span class="badge">${count}</span>`:''}
        </a>
      </div>
    </div>`;
  app.prepend(header);
}

function renderFooter(){
  const app = document.getElementById('app');
  app.querySelector('.footer')?.remove();
  const f = document.createElement('footer');
  f.className = 'footer';
  f.textContent = `© ${new Date().getFullYear()} mini-store`;
  app.appendChild(f);
}

function renderPage(el){
  const app = document.getElementById('app');
  app.querySelector('.page')?.remove();
  el.classList.add('page');
  app.insertBefore(el, app.querySelector('.footer'));
}

// Views
function HomeView(){
  const el = document.createElement('main');
  el.innerHTML = `
    <section class="hero container">
      <h1>Сучасний mini-store</h1>
      <p class="muted">Переглядайте товари, додавайте в кошик і оформлюйте замовлення.</p>
    </section>
    <section class="container">
      <div class="grid cols-4" id="home-grid"></div>
    </section>`;

  const grid = el.querySelector('#home-grid');
  state.products.slice(0,4).forEach(p=>grid.appendChild(ProductCard(p)));
  renderPage(el);
}

function CatalogView(){
  const url = new URL(window.location.href);
  const q = url.searchParams.get('q') || '';
  const sort = url.searchParams.get('sort') || '';
  const el = document.createElement('main');
  el.innerHTML = `
    <section class="container">
      <div class="row mb-4">
        <input class="input" placeholder="Пошук" value="${q}" id="q" />
        <select class="input" id="sort">
          <option value="">Сортування</option>
          <option value="price_asc" ${sort==='price_asc'?'selected':''}>Ціна: зростання</option>
          <option value="price_desc" ${sort==='price_desc'?'selected':''}>Ціна: спадання</option>
          <option value="rating" ${sort==='rating'?'selected':''}>Рейтинг</option>
        </select>
        <button class="btn btn-primary" id="apply">Застосувати</button>
      </div>
      <div class="grid cols-4" id="grid"></div>
    </section>`;
  el.querySelector('#apply').addEventListener('click', ()=>{
    const nq = el.querySelector('#q').value.trim();
    const ns = el.querySelector('#sort').value;
    const usp = new URLSearchParams(); if(nq) usp.set('q',nq); if(ns) usp.set('sort',ns);
    navigate(`#/catalog?${usp.toString()}`);
  });
  let list = [...state.products];
  if(q) list = list.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()) || p.short.toLowerCase().includes(q.toLowerCase()));
  if(sort==='price_asc') list.sort((a,b)=>a.price-b.price);
  if(sort==='price_desc') list.sort((a,b)=>b.price-a.price);
  if(sort==='rating') list.sort((a,b)=>(b.rating||0)-(a.rating||0));
  const grid = el.querySelector('#grid');
  list.forEach(p=>grid.appendChild(ProductCard(p)));
  renderPage(el);
}

function ProductView(){
  const hash = window.location.hash; // #/product?id=1
  const usp = new URLSearchParams(hash.split('?')[1]||'');
  const id = Number(usp.get('id'));
  const p = byId(id);
  const el = document.createElement('main');
  if(!p){ el.innerHTML = `<section class="container">Не знайдено</section>`; return renderPage(el); }
  el.innerHTML = `
    <section class="container grid cols-2">
      <div class="card-media" style="border-radius:12px; overflow:hidden"><img src="${p.images?.[0]?.url||''}" alt="${p.name}" style="height:200px"/></div>
      <div>
        <h1 class="title">${p.name}</h1>
        <p class="muted">${p.short||''}</p>
        <div class="price-row">
          <div class="title">${fmt(p.price)} ${p.currency}</div>
          ${p.stock===0?'<span class="pill oos">Немає в наявності</span>':''}
          ${p.preorder?'<span class="pill preorder">Предзамовлення</span>':''}
        </div>
        <div class="mt-4">
          <button class="btn btn-primary" id="add">Додати в кошик</button>
        </div>
      </div>
    </section>`;
  el.querySelector('#add').addEventListener('click', ()=>{ upsertCart(p.id, +1); alert('Додано до кошика'); });
  renderPage(el);
}

function CartView(){
  const el = document.createElement('main');
  const items = state.cart.map(i=>({ ...i, total: i.price*i.qty }));
  const subtotal = items.reduce((s,i)=>s+i.total,0);
  el.innerHTML = `
    <section class="container">
      <h2 class="mb-4">Ваш кошик</h2>
      <div id="items" class="grid cols-1"></div>
      <div class="row mt-6">
        <div>Сума: <strong>${fmt(subtotal)} USD</strong></div>
        <div>
          <a class="btn btn-outline" href="#/catalog">Продовжити покупки</a>
          <a class="btn btn-primary" href="#/checkout">Оформити</a>
        </div>
      </div>
    </section>`;
  const list = el.querySelector('#items');
  if(items.length===0){ list.innerHTML = `<div class="muted">Кошик порожній</div>`; }
  items.forEach(i=>{
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div><div class="title">${i.name}</div><div class="muted">${fmt(i.price)} x ${i.qty} = ${fmt(i.total)}</div></div>
                     <div class="flex gap-2">
                       <button class="btn" data-dec="${i.productId}">-</button>
                       <button class="btn" data-inc="${i.productId}">+</button>
                       <button class="btn btn-danger" data-del="${i.productId}">Видалити</button>
                     </div>`;
    row.querySelector(`[data-inc="${i.productId}"]`).addEventListener('click', ()=>{ upsertCart(i.productId,+1); renderApp(); });
    row.querySelector(`[data-dec="${i.productId}"]`).addEventListener('click', ()=>{ upsertCart(i.productId,-1); renderApp(); });
    row.querySelector(`[data-del="${i.productId}"]`).addEventListener('click', ()=>{ removeCart(i.productId); renderApp(); });
    list.appendChild(row);
  });
  renderPage(el);
}

function LoginView(){
  const el = document.createElement('main');
  el.innerHTML = `
    <section class="container" style="max-width:480px">
      <h2 class="mb-4">Увійти</h2>
      <div class="field mb-2">
        <label class="label" for="u">Email або логін</label>
        <input id="u" class="input" placeholder="demo@example.com" />
      </div>
      <div class="field mb-4">
        <label class="label" for="p">Пароль</label>
        <input id="p" type="password" class="input" placeholder="••••••" />
      </div>
      <button class="btn btn-primary" id="login">Увійти</button>
      <a class="btn btn-outline" href="#/auth/register" style="margin-left:8px">Реєстрація</a>
    </section>`;
  el.querySelector('#login').addEventListener('click', ()=>{
    const username = el.querySelector('#u').value.trim() || 'demo';
    state.user = { id:1, username, email:`${username}@example.com`, roles:['USER'] };
    state.token = 'mock-token';
    saveAuth();
    alert('Вхід успішний');
    navigate('#/');
  });
  renderPage(el);
}

function RegisterView(){
  const el = document.createElement('main');
  el.innerHTML = `
    <section class="container" style="max-width:480px">
      <h2 class="mb-4">Реєстрація</h2>
      <div class="field mb-2">
        <label class="label" for="ru">Ім'я користувача</label>
        <input id="ru" class="input" />
      </div>
      <div class="field mb-2">
        <label class="label" for="re">Email</label>
        <input id="re" class="input" type="email" />
      </div>
      <div class="field mb-4">
        <label class="label" for="rp">Пароль</label>
        <input id="rp" type="password" class="input" />
      </div>
      <button class="btn btn-primary" id="register">Створити акаунт</button>
    </section>`;
  el.querySelector('#register').addEventListener('click', ()=>{
    const username = el.querySelector('#ru').value.trim() || 'user';
    state.user = { id:2, username, email: (el.querySelector('#re').value || `${username}@example.com`), roles:['USER'] };
    state.token = 'mock-token';
    saveAuth();
    alert('Акаунт створено');
    navigate('#/');
  });
  renderPage(el);
}

function CheckoutView(){
  const el = document.createElement('main');
  const items = state.cart.map(i=>({ ...i, total: i.price*i.qty }));
  const subtotal = items.reduce((s,i)=>s+i.total,0);
  el.innerHTML = `
    <section class="container" style="max-width:720px">
      <h2 class="mb-4">Оформлення</h2>
      <div class="row mb-4"><div>Сума: <strong>${fmt(subtotal)} USD</strong></div><div class="muted">Оплата: mock</div></div>
      <button class="btn btn-primary" id="pay">Оплатити</button>
    </section>`;
  el.querySelector('#pay').addEventListener('click', ()=>{
    const orderId = Math.floor(Math.random()*100000);
    state.orders.push({ id: orderId, total: subtotal, status:'PAID', createdAt: new Date().toISOString() });
    saveOrders();
    state.cart = []; saveCart(); renderHeader();
    alert(`Замовлення #${orderId} оплачено`);
    navigate('#/profile');
  });
  renderPage(el);
}

function ProfileView(){
  const el = document.createElement('main');
  el.innerHTML = `
    <section class="container">
      <h2 class="mb-4">Профіль</h2>
      ${state.user?`<div class="row mb-4"><div>${state.user.username} (${state.user.email})</div><button class="btn" id="logout">Вийти</button></div>`: `<div class="muted">Ви не увійшли</div>`}
      <h3 class="mb-2">Історія замовлень</h3>
      <div id="orders" class="grid cols-1"></div>
    </section>`;
  if(state.user){
    el.querySelector('#logout').addEventListener('click', ()=>{ state.user=null; state.token=null; saveAuth(); renderApp(); });
  }
  const list = el.querySelector('#orders');
  if(state.orders.length===0){ list.innerHTML = `<div class="muted">Поки що немає замовлень</div>`; }
  state.orders.slice().reverse().forEach(o=>{
    const row = document.createElement('div'); row.className='row';
    row.innerHTML = `<div>#${o.id}</div><div>${o.status}</div><div>${new Date(o.createdAt).toLocaleString()}</div><div><strong>${fmt(o.total)} USD</strong></div>`;
    list.appendChild(row);
  });
  renderPage(el);
}

function AdminView(){
  const el = document.createElement('main');
  el.innerHTML = `
    <section class="container">
      <h2 class="mb-4">Адмін</h2>
      <div class="grid cols-2">
        <div>
          <h3 class="mb-2">Товари</h3>
          <div id="plist" class="grid cols-1"></div>
          <button class="btn mt-4" id="addp">Додати товар</button>
        </div>
        <div>
          <h3 class="mb-2">Категорії</h3>
          <div id="clist" class="grid cols-1"></div>
          <button class="btn mt-4" id="addc">Додати категорію</button>
        </div>
      </div>
    </section>`;
  const plist = el.querySelector('#plist');
  state.products.forEach(p=>{
    const row = document.createElement('div'); row.className='row';
    row.innerHTML = `<div>${p.name}</div><div>${fmt(p.price)} ${p.currency}</div><div class="flex gap-2"><button class="btn" data-edit="${p.id}">✏️</button><button class="btn btn-danger" data-del="${p.id}">🗑️</button></div>`;
    row.querySelector(`[data-del="${p.id}"]`).addEventListener('click', ()=>{ state.products = state.products.filter(x=>x.id!==p.id); renderApp(); });
    row.querySelector(`[data-edit="${p.id}"]`).addEventListener('click', ()=>{ const np = prompt('Нова назва', p.name); if(np){ p.name=np; renderApp(); } });
    plist.appendChild(row);
  });
  const clist = el.querySelector('#clist');
  state.categories.forEach(c=>{
    const row = document.createElement('div'); row.className='row';
    row.innerHTML = `<div>${c.name}</div><div class="flex gap-2"><button class="btn" data-edc="${c.id}">✏️</button><button class="btn btn-danger" data-dc="${c.id}">🗑️</button></div>`;
    row.querySelector(`[data-dc="${c.id}"]`).addEventListener('click', ()=>{ state.categories = state.categories.filter(x=>x.id!==c.id); renderApp(); });
    row.querySelector(`[data-edc="${c.id}"]`).addEventListener('click', ()=>{ const nn = prompt('Нова назва', c.name); if(nn){ c.name=nn; renderApp(); } });
    clist.appendChild(row);
  });
  el.querySelector('#addp').addEventListener('click', ()=>{
    const name = prompt('Назва товару'); if(!name) return;
    const price = Number(prompt('Ціна','100')||'100');
    state.products.push({ id: Date.now(), sku:'NEW', name, short:'', price, currency:'USD', images:[{url:'./assets/hero-laptop.svg'}], rating:4, stock:10, preorder:false, categoryId:1 });
    renderApp();
  });
  el.querySelector('#addc').addEventListener('click', ()=>{
    const name = prompt('Назва категорії'); if(!name) return;
    state.categories.push({ id: Date.now(), name });
    renderApp();
  });
  renderPage(el);
}

// UI Components
function ProductCard(p){
  const c = document.createElement('div');
  c.className = 'card';
  c.innerHTML = `
    <div class="card-media"><img src="${p.images?.[0]?.url||''}" alt="${p.name}" style="height:64px"/></div>
    <div class="card-body">
      <div class="title">${p.name}</div>
      <div class="muted">${p.short||''}</div>
      <div class="price-row">
        <div class="title">${fmt(p.price)} ${p.currency}</div>
        ${p.stock===0?'<span class="pill oos">Немає</span>':''}
        ${p.preorder?'<span class="pill preorder">Preorder</span>':''}
      </div>
      <div class="mt-4 flex gap-2">
        <a class="btn" href="#/product?id=${p.id}">Деталі</a>
        <button class="btn btn-primary" data-add>В кошик</button>
      </div>
    </div>`;
  c.querySelector('[data-add]').addEventListener('click', ()=>{ upsertCart(p.id, +1); });
  return c;
}

// Boot
function renderApp(){
  renderHeader();
  const hash = window.location.hash.split('?')[0];
  const view = routes[hash] || HomeView;
  view();
  renderFooter();
}

seed();
renderApp();

