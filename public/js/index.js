// CSSフレームワークのBulumaを使ってみたら、
// 自動的にnavigationにリスポンシブがかかり
// 小さい画面でハンバーガーメニューが強制されるため、
// 中を開けるようにこのjsファイルを作成しています

// mobile menu
const burgerIcon = document.querySelector("#burgerMenu");
const navbarMenu = document.querySelector("#nav-list");

burgerIcon.addEventListener('click', () => {
  navbarMenu.classList.toggle('is-active');
})
