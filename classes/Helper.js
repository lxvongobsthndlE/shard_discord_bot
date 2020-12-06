module.exports = class Helper {
    constructor(){

    }

    getRandomInteger(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    isAdmin(userId, adminIds) {
        return adminIds.includes(userId);
    }

    makeUserAt(user) {
        return '<@' + user.id + '>';
    }
}