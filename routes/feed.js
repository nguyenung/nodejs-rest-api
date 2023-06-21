import { Router } from 'express';
import { body } from 'express-validator/check/index.js';

import { getPosts, createPost, getPost, updatePost, deletePost } from '../controllers/feed.js';
import isAuth from '../middleware/is-auth.js';

const feedRoutes = Router();

// GET /feed/posts
feedRoutes.get('/posts', isAuth, getPosts);

// POST /feed/post
feedRoutes.post(
  '/post',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  createPost
);

feedRoutes.get('/post/:postId', isAuth, getPost);

feedRoutes.put(
  '/post/:postId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  updatePost
);

feedRoutes.delete('/post/:postId', isAuth, deletePost);

export default feedRoutes;
