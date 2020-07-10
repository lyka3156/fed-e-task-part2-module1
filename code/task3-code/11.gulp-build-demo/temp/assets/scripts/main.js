"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sum = function sum(a, b) {
  return a + b;
};

console.log(sum(1, 2));

var Person = function Person(name) {
  var _this = this;

  _classCallCheck(this, Person);

  _defineProperty(this, "say", function () {
    console.log("hello ".concat(_this.name));
  });

  this.name = name;
};

var p1 = new Person("张珊1");
p1.say();