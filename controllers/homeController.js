'use strict';

const User = require('../models/user');

//- passportを追加
const passport = require('passport');
//- validator.jsの結果をロードする
const { validationResult } = require('express-validator');
//- ユーザー属性の設定
const getUserParams = body => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  };
};

module.exports = {
  goToRegister: (req, res) => {
    res.render('register');
  },

  goToLogin: (req, res) => {
    res.render('login');
  },

  goToUserInfo: (req, res) => {
    res.render('user_info');
  },

  //- ユーザー登録を行う
  create: (req, res, next) => {
    if (req.skip) return next();

    //- newUserインスタンスのユーザー属性を
    //- １個のオブジェクトにまとめる
    let newUser = new User(getUserParams(req.body));

    //- createアクションでユーザーを登録する
    User.register(newUser, req.body.password, (e, user) => {if (user) {
        //- フラッシュメッセージとともにレスポンスを返す
        req.flash('success', `${user.name}'s account created successfully!`);
        res.locals.redirect = '/login';
        next();
      } else {
        req.flash(
          'error',
          `Failed to create user account because: ${e.message}.`
        );
        //- 登録画面へ戻す
        res.redirect('/');
      }
    });
  },

  //- redirectの経路を一括管理する
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) {
      res.redirect(redirectPath);
    } else next();
  },

  //- validationの結果をハンドリングする
  validate: (req, res, next) => {
    const errors = validationResult(req);
    //- エラーがあった場合は、
    //- スキッププロパティを設定し、
    //- エラーメッセージをフラッシュメッセージに追加
    if (!errors.isEmpty()) {
      let messages = errors.array().map(e => e.msg);
      req.skip = true;
      req.flash('error', messages.join(' and '));
      //- 登録画面へ戻す
      res.locals.redirect = '/';
      next();
    } else {
      next();
    }
  },
  //- 認証のミドルウェアを追加して、
  //- リダイレクトとフラッシュメッセージのオプションを指定する
  authenticate: passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Failed to login.',
    successRedirect: '/user_info',
    successFlash: 'Logged in!',
  }),
  //-ユーザーがログアウトするためのアクション
  logout: (req, res, next) => {
    req.logout();
    req.flash('success', 'You have been logged out!');
    res.locals.redirect = '/';
    next();
  },
};
