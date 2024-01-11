import mongoose from 'mongoose';
import config from '../config/envConfig.js'

export const init = async () => {
    
    try {
        await mongoose.connect(config.db.URI);
        console.log('Database conected');
    } catch (error) {
        console.log('An error occured while trying to connect DB', error.message);
    }
}