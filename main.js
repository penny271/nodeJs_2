'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
//- passport.jsをロードする
//- passportをミドルウェアとして使用するためにセッションとクッキーを追加
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
//- p297 connect-flashをロードする
const connectFlash = require('connect-flash');
//- Userモジュールをロードする
const User = require('./models/user');

//-データベース接続を設定
mongoose.connect('mongodb://localhost:27017/nodeJs_assignment', {
  useNewUrlParser: true,
});
mongoose.set('useCreateIndex', true);

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// レイアウトモジュールの使用をアプリケーションに設定
router.use(layouts);
router.use(express.static('public'));

router.use(
  express.urlencoded({
    extended: false,
  })
);
router.use(express.json());

//- cookie-parserとexpresses-sessionをミドルウェアとして設定
router.use(cookieParser('secretCode123'));
router.use(
  expressSession({
    secret: 'secretCode123',
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
router.use(connectFlash());

//-passport.jsの設定
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//- フラッシュメッセージ及びユーザーログイン状況管理
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  //* passportのログイン状態を示すloggedIn変数を設定
  res.locals.loggedIn = req.isAuthenticated();
  //* ログイン中のユーザーを示すcurrentUser変数を設定
  res.locals.currentUser = req.user;
  next();
});

// Registerページへ飛ぶ
router.get('/', homeController.goToRegister)

// Loginページへ飛ぶ
router.get('/login', homeController.goToLogin);
//- ポストされたデータをauthenticateアクションに送る経路
router.post('/login', homeController.authenticate);
//- ログアウト機能
router.get(
  '/logout',
  homeController.logout,
  homeController.redirectView
);

// ログインしたユーザーのページへ飛ぶ
router.get('/user_info', homeController.goToUserInfo);
router.post('/user_info', homeController.goToUserInfo);

//- validatorをロードする
const itemValidator = require('./validations/validator');

//- validation及びユーザー登録、認証を行う
router.post(
  '/create',
  itemValidator,
  homeController.validate,
  homeController.create,
  homeController.authenticate,
);

// エラー処理
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

//- mount the router on the app
app.use('/', router);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});
