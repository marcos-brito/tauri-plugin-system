console.log(window)

class MyPlugin {
    sayHi() {
        return "Hello there 👽"
    }

    sayHiTo(name) {
        return `Oh! You have a name? Hello ${name}`
    }
}

export default new MyPlugin();
