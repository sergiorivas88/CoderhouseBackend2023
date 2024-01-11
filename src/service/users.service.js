import { userRepository } from "../repositories/index.js"

export default class {
    static async create(data) {
        return await userRepository.create(data)
    }
    static async findOneDataEmail(data) {
        return await userRepository.findOneDataEmail(data)
    }
    static async findOneGithubId(data) {
        return await userRepository.findOneGithubId(data)
    }
    static async findById(uid) {
        return await userRepository.findById(uid)
    }
    static async findOneByEmail(email) {
        return await userRepository.findOneByEmail(email)
    }
    
    static async findOneByGithubId(gitId) {
        return await userRepository.findOneByGithubId(gitId)
    }
    
}
