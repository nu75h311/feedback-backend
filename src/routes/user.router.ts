
import { UsersController } from '@controllers';
import { Router } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

// Init shared
const router = Router();
const usersController = new UsersController();

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser);

router.route('/:userId')
    .get(usersController.getOne);


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

// router.put('/update', async (req: Request, res: Response) => {
//     try {
//         const { user } = req.body;
//         if (!user) {
//             return res.status(BAD_REQUEST).json({
//                 error: paramMissingError,
//             });
//         }
//         user.id = Number(user.id);
//         await userController.update(user);
//         return res.status(OK).end();
//     } catch (err) {
//         logger.error(err.message, err);
//         return res.status(BAD_REQUEST).json({
//             error: err.message,
//         });
//     }
// });

/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

// router.delete('/delete/:id', async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params as ParamsDictionary;
//         await userController.delete(Number(id));
//         return res.status(OK).end();
//     } catch (err) {
//         logger.error(err.message, err);
//         return res.status(BAD_REQUEST).json({
//             error: err.message,
//         });
//     }
// });

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
