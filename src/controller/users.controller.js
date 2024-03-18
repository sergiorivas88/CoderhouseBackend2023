import usersService from "../service/users.service.js";
import { Exception } from '../utils/utils.js';
import bcrypt from 'bcrypt';
import cartsController from '../controller/carts.controller.js';
import { createError } from "../utils/createError.js";
import { generatorUserError } from "../utils/errorCause.js";
import errorList from "../utils/errorList.js";
import { transporter } from "../app.js";
import config from "../config/envConfig.js";
export default class {
    static async addUser(data) {
        try {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);
            const userCart = await cartsController.addCart(data.email)
            const finalData = {
                ...data,
                cart: userCart._id
            }
            await usersService.create(finalData);
            return await usersService.findOneDataEmail(finalData);
        }
        catch (error) {
            createError.Error({
                name: 'User creation error',
                cause: generatorUserError(data),
                message: `An error occurred while creating a user.`,
                code: errorList.USER_CREATION_ERROR,
            });
        }
    }
    static async addGithubUser(data) {
        const finalData = {
            ...data,
            cart: undefined
        }
        await usersService.create(finalData);
        return await usersService.findOneGithubId(data);
    }

    static async getUserData(email, password) {
        const user = await this.findEmail(email)
        if (!user) {
            return "Email or password invalid";
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            return user;
        } else {
            return "Email or password invalid";
        }
    }
    static async findEmail(email){
        const user = await usersService.findOneByEmail(email);
        if (!user) {
            return null;
        } else {
            return user;
        }
    }
    static async updateData(dataToUpdate, data, uid) {
        try {
            let user = await usersService.findById(uid);
    
            if (dataToUpdate === "email") {    
                let email = data
                const existingUser = await usersService.findOneByEmail(email);
    
                if (existingUser && existingUser._id.toString() !== uid) {
                    throw new Exception("The email cannot be used");
                }
                
                user.email = data;
                if(user.cart === undefined){
                    const userCart = await cartsController.addCart(data)
                    user.cart = userCart
                }
                await user.save();
                const newUser = await usersService.findOneByEmail(email)    
                return newUser;
            } else if (dataToUpdate === "password") {
                const passwordMatch = await bcrypt.compare(data, user.password);
                if(passwordMatch){
                    return false
                } else {
                    const saltRounds = 10;
                    data = await bcrypt.hash(data, saltRounds);
                    user.password = data;
                    await user.save(); 
                    return true;
                }
            }
        } catch (error) {
            console.error("Error updating data:", error);
            throw error; 
        }
    }
    
    static async findUserByGithubId (gitId) {
        const user = await usersService.findOneByGithubId(gitId)
        if(!user) {
            return null;
        }
        else{
            return user;
        }
    }
    static async findById(id){
        return await usersService.findById(id)
    }
    static async generateLink(email, token){
        const date = Date()
        const user = await usersService.findOneByEmail(email)
        user.resetLink.token = token
        user.resetLink.date = date
        user.save()
        const newUser = await usersService.findOneByEmail(email)   
        return newUser;
    }
    static async changeRol(uid) {
        const user = await usersService.findById(uid)
        if(user.role === "user"){
            user.role = "premium"
            user.save()
            const newUser = await usersService.findById(uid)
            return newUser
        } else if(user.role === "premium") {
            user.role = "user"
            user.save()
            const newUser = await usersService.findById(uid)
            return newUser
        } else {
            return null
        }   
    }
    static async lastConnection(uid, date) {
        const user = await usersService.findById(uid)
        if(user) {
            user.lastConnection = date
            user.save()
            return true
        } else {
            return false
        }
    }
    static async uploadFile(uid, filename, link, uploadType) {
        const user = await usersService.findById(uid);
        if (user) {
            if (uploadType === "productPhoto") {
                const document = {
                    name: filename,
                    reference: link,
                    uploadType: uploadType
                };
                user.documents.push(document);
            } else {
                const existingDocumentIndex = user.documents.findIndex(doc => doc.uploadType === uploadType);
                if (existingDocumentIndex !== -1) {
                    user.documents[existingDocumentIndex].name = filename;
                    user.documents[existingDocumentIndex].reference = link;
                } else {
                    const document = {
                        name: filename,
                        reference: link,
                        uploadType: uploadType
                    };
                    user.documents.push(document);
                }
            }
            await user.save();
            return true;
        } else {
            return false;
        }
    }
    static async cleanUnconnectedUsers(date){
        const allUsers = await usersService.getUsers();
        const currentDate = new Date();
        const twoDaysAgo = new Date(currentDate);
        twoDaysAgo.setDate(currentDate.getDate() - 2);
    
        const unconnectedUsers = allUsers.filter(u => {
            return new Date(u.lastConnection) < twoDaysAgo;
        });
    
        for (const user of unconnectedUsers) {
            const sended = await sendMail(user);
            if (sended) {
                await cartsController.deleteCart(user.cart)
                await this.deleteUser(user._id);
            } 
            console.log("next");
        }
    
        return 'cleaned';
    }
    
    static async deleteUser(uid){
        const user = await usersService.findById(uid);
        await cartsController.deleteCart(user.cart); 
        return await usersService.deleteUser(uid);
    }
    
}
    async function sendMail(user) {
        const mailOptions = {
            from: config.nodemailer.email,
            to: user.email,
            subject: 'Your user on the apple shop was deleted',
            text: `Hi from the apples shop!
            
            Your user was deleted because it was unconnected for more than two days, and admin has decided to clean it.
            If you want  to continue using our services please create a new account by registering again on our shop.
    
            Hope to see you again!
            Apple shop's CEO
            `
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(info);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
    