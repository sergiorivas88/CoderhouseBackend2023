import { Router } from 'express';
import usersController from '../controller/users.controller.js';
import { tokenGenerator } from '../utils/utils.js';

const router = Router();

router.get('/users/premium/:uid', async (req, res) => {
    const uid = req.params.uid;
    const user = await usersController.changeRol(uid)
    if(user){
        const token = tokenGenerator(user)
        res.clearCookie('access_token');
        res
        .cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200)
        .redirect("/profile")
    } else {
        res.redirect("/profile")
}})
export default router