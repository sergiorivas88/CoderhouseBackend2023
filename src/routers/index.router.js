import { Router } from 'express';
import cartRouter from "./cart.router.js"
import productsRouter from "./products.router.js"
import chatRouter from "./chat.router.js"
import passport from 'passport';
import mockRouter from './mocking.router.js'
const router = Router();


router.use('/api', passport.authenticate('currentGeneral', { session: false }), cartRouter);
router.use('/api', passport.authenticate('currentGeneral', { session: false }), productsRouter);
router.use('/api', passport.authenticate('currentGeneral', { session: false }), chatRouter);
router.use('/mock', passport.authenticate('currentGeneral', { session: false }), mockRouter);

router.get("/", (req, res) => {
    res.redirect('/login');
})

router.get('/profile', passport.authenticate('currentProfile', { session: false }), (req, res) => {
    res.render('profile', { title: "Profile", user: req.user});
});

router.get('/login', (req, res) => {
    res.render('login', {title: "Login"});
});
router.get('/login-github', (req, res) => {
    res.render('login-github', {title: "GitHub Login"});
});

router.get('/register', (req, res) => {
    res.render('register', {title: "Login"});
});

router.get('/changePassword', (req, res) => {
    res.render('changePassword', {title: "Change Password"});
})


export default router;
