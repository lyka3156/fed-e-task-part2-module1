

const sum = (a, b) => {
    return a + b;
}

console.log(sum(1, 2));

class Person {
    constructor(name) {
        this.name = name;
    }
    say = () => {
        console.log(`hello ${this.name}`);
    }
}

const p1 = new Person("张珊");
p1.say();