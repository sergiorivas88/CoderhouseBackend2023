import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/envConfig.js';
import JWT from 'jsonwebtoken';
import { faker } from "@faker-js/faker";
import {createError} from './createError.js';
import errorList from './errorList.js';
const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);


export const tokenGenerator = (user) => {
    const {
        _id,
        firstName,
        lastName,
        age,
        email,
        role,
        cart
    } = user;    
    const payload = {
        _id,
        firstName,
        lastName,
        email,
        age,
        role,
        cart,
    };
    return JWT.sign(payload, config.jwtSecret, { expiresIn: '30m' });
}


export class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
};

export function authenticateLevel(level) {
    return async (req, res, next) => {
        try {
            if(level === 1){
                next()
            } else if (level === 2){
                if(req.user.role === "admin") {
                    next()
                } else {
                    res.status(401).send({ message: 'You are not authorised to perform this action'});
                }
            } else if (level === 3) {
                if(req.user.role === "user" || req.user.role === "premium") {
                    next()
                } else {
                    res.status(405).send({ message: 'User level required'});
                }
            } else if (level === 4){
                if(req.user.role === "admin" || req.user.role === "premium") {
                    next()
                } else {
                    res.status(405).send({ message: 'Admin or premium level required'});
                }
            }
        }
        catch (Error) {
            createError.Error({
                name: 'Authentication error',
                cause: Error,
                message: 'An error occured within the authenticate method',
                code: errorList.AUTHORIZATION_ERROR,
            });
        }
    }
}

export const generateProduct = () => {
    const thumbnailImage = getThumbnailUrl(); 

    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        code: faker.string.alphanumeric({ length: 10 }),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 10000, max: 99999 }),
        image: faker.image.url(),
        status: faker.datatype.boolean(),
        category: faker.commerce.productAdjective(),
        thumbnail: thumbnailImage,
    };
};
const getThumbnailUrl = () => {
    const productImage = faker.image.url();
    const fileExtension = productImage.split('.').pop();
    const thumbnailUrl = productImage.replace(`.${fileExtension}`, `_thumb.${fileExtension}`);
    return thumbnailUrl;
};
