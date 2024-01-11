import { Router } from 'express';
import passport from 'passport';
import usersController from '../controller/users.controller.js';
import { tokenGenerator} from '../utils/utils.js';

const router = Router();

router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    res.redirect('/login');
});

router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
    const token = tokenGenerator(req.user)
    res
    .cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
    .status(200)
    .redirect('/api/products');
});
router.get('/sessions/current', passport.authenticate('current', { failureRedirect: '/login' }), async (req, res) => {
    const currentUser = req.user;
    res.json({ user: currentUser });
});

router.post('/sessions/login-github', passport.authenticate('current', { session: false }), async (req, res) => {
    try {
        const { body:{ email } } = req;
        let user = req.user
        if (user.email === undefined) {
            const newUser = await usersController.updateData("email", email, req.user._id);
            const token = tokenGenerator(newUser)
            res
            .cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
            .status(200)
            .redirect('/api/products');
        }
    } catch (error) {
        res.redirect('/login');
    }
});


router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;

    if (!user.email) {
        const token = tokenGenerator(user)
        res
        .cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200)
        .redirect('/login-github');
    } else {
        const token = tokenGenerator(req.user)
        res
        .cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200)
        .redirect('/api/products'); 
    }
})
router.get('/sessions/logout', (req, res) => {
    res
    .clearCookie('access_token')
    .redirect('/login')
});
router.post('/sessions/changePassword', async (req, res) => {
    try {
        const { body:{ email, password } } = req;
        const exist = await usersController.findEmail(email);
        if (exist){
            await usersController.updateData("password", password, exist._id);
            res.redirect('/login')
        } else {
            res.redirect('/changePassword');
        }
    }
    catch (error) {
        res.redirect('/changePassword');
    }
})

export default router;
