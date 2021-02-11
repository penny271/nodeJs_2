'use strict';

const { check, sanitizeBody } = require('express-validator');

module.exports = [
  sanitizeBody('email')
    .normalizeEmail({
      all_lowercase: true,
    })
    .trim(),

  check('email', 'email is invalid')
    .isEmail()
    .notEmpty(),
  check('password', 'Password must be at least 7 letters')
    .notEmpty()
    .isLength({ min: 7 }),
  check('confirmPassword').custom((confirmPassword, { req }) => {
    if (confirmPassword !== req.body.password) {
      throw new Error('Password Confirmation does not match password');
    }
    return true;
  }),
];
