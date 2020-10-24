import Crypto from 'crypto';

class Encryption {
    constructor() {
        this.makeSalt = this.makeSalt.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
    };

    makeSalt() {
        let saltLength = 20;let result = {
            salt: ''
        };

        result.salt = Crypto.randomBytes(Math.ceil(saltLength / 2)).toString('hex').slice(0, saltLength);

        return result;
    };

    validatePassword(typedPassword, savedSalt) {
        return Crypto.createHmac('sha256', savedSalt).update(typedPassword).digest('hex');
    };
};

export default Encryption;