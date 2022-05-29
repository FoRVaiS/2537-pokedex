const { UserModel } = require('../models/user.model');
const { generateRandomPassword } = require('./generateRandomPassword');

const createRootAccount = async () => {
  const rootUser = await UserModel.findOne({ username: 'root' });

  if (!rootUser) {
    const securePassword = generateRandomPassword(24, { letters: true, numbers: true, symbols: true });

    await UserModel.create({
      username: 'root',
      password: securePassword,
      firstName: 'System',
      lastName: 'Administrator',
      age: 23,
      gender: 'male',
      isRemovable: false,
      activeCart: -1,
      roles: ['admin', 'member'],
    });

    console.log('\nA new root admin has been created.');
    console.log(`The root admin password is: ${securePassword}`);
    console.log('Be sure to securely store this password, this will will no longer be displayed.\n');
  }
};

module.exports = { createRootAccount };
