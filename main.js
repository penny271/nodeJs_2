"use strict";

const express = require("express"),
  // expressアプリケーションを実体化する
  app = express(),
  homeController = require("./controllers/homeController"),
  // express-ejs-layoutsモジュールをロード
  layouts = require("express-ejs-layouts");
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);


// レイアウトモジュールの使用をアプリケーションに設定
app.use(layouts);
app.use(express.static("public"));

// Registerページへ飛ぶ
app.get("/", homeController.goToRegister);

// Loginページへ飛ぶ
app.get("/login", homeController.goToLogin)

app.get(homeController.error);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
