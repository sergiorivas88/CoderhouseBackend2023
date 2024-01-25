import usersService from "../service/users.service.js";
import { Exception } from '../utils/utils.js';
import bcrypt from 'bcrypt';
import cartsController from '../controller/carts.controller.js';
import { createError } from "../utils/createError.js";
import { generatorUserError } from "../utils/errorCause.js";
import errorList from "../utils/errorList.js";
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
}
