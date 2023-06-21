import { Router } from 'express';
import body from 'express-validator/check/check.js';

import User from '../models/user.js';
import { signup, login, getUserStatus, updateUserStatus } from '../controllers/auth.js';
import isAuth from '../middleware/is-auth.js';

const authRoutes = Router();

authRoutes.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  signup
);

authRoutes.post('/login', login);

authRoutes.get('/status', isAuth, getUserStatus);

authRoutes.patch(
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  updateUserStatus
)

export default authRoutes
