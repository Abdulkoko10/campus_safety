import express from 'express';
import {
  createUser,
  updateUser,
  getAllUsers,
  getUserInfoById,
  registerUser,
  loginUser,
  sendNotification,
} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/').get(getAllUsers).post(createUser);
router.route('/sendNotification').post(sendNotification);
router.route('/:id').get(getUserInfoById).patch(updateUser);


export default router;
