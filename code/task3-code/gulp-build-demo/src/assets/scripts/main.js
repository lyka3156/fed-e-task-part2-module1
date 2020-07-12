

// const { a, b } = require("./a.js");

console.log("触发了main");
const sum = (a, b) => {
  return a + b;
};

// console.log(sum(a, b));

class Person {
  constructor(name) {
    this.name = name;
  }
  say = () => {
    console.log(`hello ${this.name}`);
  };
}

const p1 = new Person("张珊2");
p1.say();
