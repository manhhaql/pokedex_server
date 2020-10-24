class HelloCore {
    constructor() {
        this.sayHello = this.sayHello.bind(this);
    }

    sayHello(options) {
        return new Promise((resolve, reject) => {
            return resolve(`Hello ${options.name}`)
        })
    };
};

export default HelloCore;