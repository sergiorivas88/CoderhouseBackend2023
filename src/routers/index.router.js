import { Router } from 'express';
import cartRouter from "./cart.router.js"
import productsRouter from "./products.router.js"
import chatRouter from "./chat.router.js"
import passport from 'passport';
import mockRouter from './mocking.router.js'
import usersController from '../controller/users.controller.js';
import userRouter from './user.router.js'
const router = Router();


router.use('/api', passport.authenticate('currentGeneral', { session: false }), cartRouter);
router.use('/api', passport.authenticate('currentGeneral', { session: false }), productsRouter);
router.use('/api', passport.authenticate('currentGeneral', { session: false }), chatRouter);
router.use('/api', passport.authenticate('currentGeneral', { session: false }), userRouter)
router.use('/mock', passport.authenticate('currentGeneral', { session: false }), mockRouter);

router.get("/", (req, res) => {
    res.redirect('/login');
})

router.get('/profile', passport.authenticate('currentProfile', { session: false }), async (req, res) => {
    if(req.user.role === "admin"){
        res.render('profile', {title: "Profile", user: req.user})
    } else {
        const id = req.user._id
        const user = await usersController.findById(id)
        let documents = ""
        let profilePhotoLink = ""
        if(user && user.documents){
            documents = user.documents
            const existingProfilePhoto = user.documents.findIndex(doc => doc.uploadType === "profilePhoto")
            if(existingProfilePhoto !== -1){ 
                const profilePhoto = user.documents[existingProfilePhoto]
                profilePhotoLink = profilePhoto.reference
            }
        }
        res.render('profile', { title: "Profile", user: req.user, documents: documents, profilePhoto: profilePhotoLink });
    }
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

router.get('/resetPassword/:uid/:token', async (req, res) => {
    const uid = req.params.uid;
    const token = req.params.token;
    
    try {
        const user = await usersController.findById(uid);
        
        if (!user) {
            return res.status(401).json({ message: "Invalid user!" });
        } 
        
        if (user.resetLink.token !== token) {
            return res.status(401).json({ message: "Invalid link!" });
        }

        const dateNow = new Date();
        const dateOfCreation = user.resetLink.date;

        const maxAllowedDifference = 60 * 60 * 1000;

        if ((dateNow - dateOfCreation) > maxAllowedDifference) {
            req.logger.warning("Expired Link");
            res.redirect("/changePassword")
        } else {
            res.render('newPassword', { uid: uid });
        }
    } catch (error) {
        req.logger.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;
