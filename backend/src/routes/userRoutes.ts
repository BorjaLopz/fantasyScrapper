import {
  createNewUser,
  deleteUser,
  getListUsers,
  updateUser,
} from '@/controllers/userController';
import { validateRequest } from '@/middlewares/requestValidatorMiddleware';
import { getListUsersSchema } from '@/requests/userRequest';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', validateRequest(getListUsersSchema), getListUsers);
userRouter.post('/', createNewUser);
userRouter.delete('/:id', deleteUser);
userRouter.patch('/:id', updateUser);

export default userRouter;
