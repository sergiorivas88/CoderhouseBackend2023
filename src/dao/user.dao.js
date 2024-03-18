import userModel from './models/user.model.js'

export default class {
    static async create(data) {
        return await userModel.create(data)
    }
    static async findOneDataEmail(data) {
        return await userModel.findOne({email: data.email})
    }
    static async findOneGithubId(data) {
        return await userModel.findOne({githubId: data.githubId})
    }
    static async findById(uid) {
        return await userModel.findById(uid)
    }
    static async findOneByEmail(email) {
        return await userModel.findOne({ email })
    }
    static async findOneByGithubId(gitId) {
        return await userModel.findOne({githubId : gitId})
    }
    static async getUsers(){
        return await userModel.find()
    }
    static async deleteUser(uid){
        return await userModel.deleteOne({_id : uid})
    }
}
