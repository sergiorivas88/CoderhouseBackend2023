export default class UserDTO {
    constructor(user) {
        if (!user || !user._id || !user.cart || !user.role || !user.email) {
            throw new Error('UserDTO: Missing required properties');
        }
        this._id = user._id;
        this.cart = user.cart;
        this.role = user.role;
        this.email = user.email;
    }
}