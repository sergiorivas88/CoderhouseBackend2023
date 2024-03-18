import { Router } from 'express';
import usersController from '../controller/users.controller.js';
import { authenticateLevel, tokenGenerator } from '../utils/utils.js';
import multer from 'multer';
import { __dirname } from '../utils/utils.js';
import path, {join} from 'path'
import userModel from '../dao/models/user.model.js';
import { request } from 'https';


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

router.get('/users', authenticateLevel(2), async (req, res) => {
    const { limit, page, sort, firstName, role, provider } = req.query;

    try {
        const options = {
            limit: limit ? parseInt(limit) : 10,
            page: page ? parseInt(page) : 1,
        };

        const filter = {};

        if (role) {
            filter.role = role;
        }
        if (provider) {
            filter.provider = provider;
        }
        if (firstName) {
            filter.firstName = firstName;
        }
        if (sort === 'asc' || sort === 'desc') {
            options.sort = { lastConnection: sort === 'asc' ? 1 : -1 };
        }

        const result = await userModel.paginate(filter, options);


        res.render('users', {
            users: result.docs,
            totalPages: result.totalPages,
            prevLink: result.hasPrevPage ? `/api/users?page=${result.page - 1}&limit=${options.limit}` : null,
            nextLink: result.hasNextPage ? `/api/users?page=${result.page + 1}&limit=${options.limit}` : null,
        });
    } catch (error) {
        req.logger.error("Error fetching users:", error)
        res.status(500).send("Error fetching users.");
    }
})
router.delete('/users/clean', authenticateLevel(2), async (req, res) => {
    const deleted = await usersController.cleanUnconnectedUsers()
    if (deleted === 'cleaned') {
        res.json({message: "Users deleted, go back to panel and refresh to see the changes"})
    } else {
        res.json({message: "Something went wrong"})
    }
})
router.get('/users/adminPanel', authenticateLevel(2), async (req, res) => {
    const { limit, page, _id, } = req.query;

    try {
        const options = {
            limit: limit ? parseInt(limit) : 1,
            page: page ? parseInt(page) : 1,
        };

        const filter = {};

        if (_id) {
            filter._id = _id;
        }
        

        const result = await userModel.paginate(filter, options);


        res.render('usersAdminPanel', {
            users: result.docs,
            totalPages: result.totalPages,
            prevLink: result.hasPrevPage ? `/api/users/adminPanel?page=${result.page - 1}&limit=${options.limit}` : null,
            nextLink: result.hasNextPage ? `/api/users/adminPanel?page=${result.page + 1}&limit=${options.limit}` : null,
        });
    } catch (error) {
        req.logger.error("Error fetching users:", error)
        res.status(500).send("Error fetching users.");
    }
})
router.post('/users/:uid/changeRoleByAdmin', authenticateLevel(2), async(req, res) => {
    const uid = req.params.uid;
    const user = await usersController.changeRol(uid)
    if(user){
        res.json({message: "Role Updated, go back to panel and refresh to see the changes"})
    } else {
        res.json({message: "Something went wrong"})
    }
})
router.delete('/users/:uid/deleteUser', authenticateLevel(2), async (req, res) => {
    const uid = req.params.uid;
    const deleted = await usersController.deleteUser(uid)
    if (deleted) {
        res.json({message: "User deleted, go back to panel and refresh to see the changes "})
    } else {
        res.json({message: "Something went wrong"})
    }
})
export default router

