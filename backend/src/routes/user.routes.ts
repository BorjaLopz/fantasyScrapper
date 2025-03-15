import {
  createNewUser,
  deleteUser,
  getListUsers,
  updateUser,
} from '@/controllers/user.controller';
import { validateRequest } from '@/middlewares/request-validator.middleware';
import { getListUsersSchema } from '@/requests/user-request';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', validateRequest(getListUsersSchema), getListUsers);
userRouter.post('/', createNewUser);
userRouter.delete('/:id', deleteUser);
userRouter.patch('/:id', updateUser);

export default userRouter;
