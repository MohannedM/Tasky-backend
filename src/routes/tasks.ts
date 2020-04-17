import {Router} from 'express';
import {check} from 'express-validator';
import isAuth from '../middlewares/is-auth';

const router = Router();

router.post("/", [
    check('title').trim().isLength({min: 5, max: 50}),
    check('description').trim().isLength({min: 20, max: 250}),
    check('due_date').trim().isLength({min: 3, max: 20})
], isAuth);


export default router;