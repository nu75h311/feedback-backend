import { UsersController } from '@controllers';
import { Router } from 'express';

// Init shared
const router = Router();
const usersController = new UsersController();

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser);

router.route('/:userId')
    .get(usersController.getOne)
    .patch(usersController.updateOne)
    .delete(usersController.deleteOne);

export default router;
