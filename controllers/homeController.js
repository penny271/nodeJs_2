"use strict";

exports.goToRegister = (req, res) => {
  res.render("register");
};

exports.goToLogin = (req, res) => {
  res.render("login");
};
