const Random = require('../lib/mongo').Random

module.exports = {
    //对一个邮箱产生随机数
    createRandom: function createRandom(ran){
        return Random.create(ran).exec()
    },

    getRandom: function getRandom(email){
        return Random
            .findOne({email: email})
            .exec()
    },

    delRandom: function delRandom(email){
        return Random.deleteOne({ email: email}).exec()
    }
}