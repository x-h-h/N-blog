const User = require('../lib/mongo').User

module.exports = {
  // 注册一个用户
  create: function create (user) {
    return User.create(user).exec()
  },

  getUserByName1: function getUserByName1(name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec()
  },

  update: function update(email,password){
    if(this.getUserByName(email))
    return User.update({ email: email }, { $set: {password:password}}).exec();
  },

  // 通过用户名获取用户信息
  getUserByName: function getUserByName (email) {
    return User
      .findOne({ email: email })
      .addCreatedAt()
      .exec()
  }

}
