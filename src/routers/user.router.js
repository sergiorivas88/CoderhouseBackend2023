import { Router } from 'express';
import usersController from '../controller/users.controller.js';
import { tokenGenerator } from '../utils/utils.js';
import multer from 'multer';
import { __dirname } from '../utils/utils.js';
import path, {join} from 'path'

const router = Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        const uploadType = req.body.uploadType; 

        if (uploadType === "profilePhoto") {
            uploadPath = join(process.cwd(), 'public', 'img', 'profilesPhotos');
        } else if (uploadType === "productPhoto") {
            uploadPath = join(process.cwd(), 'public', 'img', 'productsPhotos');
        } else if(uploadType === "creditCard") {
            uploadPath = join(process.cwd(), 'public', 'img','documentsPhotos');
        } else if(uploadType === "houseLocation") {
            uploadPath = join(process.cwd(), 'public', 'img', 'documentsPhotos');
        } else if(uploadType === "id") {
            uploadPath = join(process.cwd(), 'public', 'img','documentsPhotos');
        } 
        cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName);
    }
});

const upload = multer({ storage });

router.get('/users/premium/:uid', async (req, res) => {
    const uid = req.params.uid;
    const validateUser = await usersController.findById(uid)
    const existingIdPhoto = validateUser.documents.findIndex(doc => doc.uploadType === "id");
    const existingCardPhoto = validateUser.documents.findIndex(doc => doc.uploadType === "creditCard");
    const existingHousePhoto = validateUser.documents.findIndex(doc => doc.uploadType === "houseLocation");
    if(existingCardPhoto >= 0 && existingHousePhoto >= 0 && existingIdPhoto >= 0){
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
        }
    } else {
        res.json({message: "You have to upload your id, your credit card and your house location photos"})
    }
})


router.post('/users/:uid/documents', upload.single('file'), async (req, res) => {
    const { uploadType} = req.body
    const uid = req.params.uid;
    const fileName = req.file.filename;
    const imgPath = req.file.path  

    if(imgPath){
        const imgIndex = imgPath.indexOf('img');

        const relativePath = imgPath.substring(imgIndex);

        const saved = await usersController.uploadFile(uid, fileName, relativePath, uploadType);
        if (saved) {
            res.redirect('/profile');
        } else {
            res.json({ message: "The file may be uploaded but it is not connected to your user account due to an error" });
        }
    } else {

        return res.status(400).json({ error: "Invalid upload type" });
    }
});

router.get('/users/postDocuments', async (req, res) => {
    const user = req.user
    const uid = user._id
    res.render('files', {title: "Uploading files", uid: uid})
})

export default router

