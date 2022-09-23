let fs = require('fs');
let path = process.cwd();

let __EQ__ = (a, b) => a === b;
let __LT__ = (a, b) => a < b;
let __GT__ = (a, b) => a > b;

let __ADD__ = (a, b) => a + b;
let __SUB__ = (a, b) => a - b;
let __MUL__ = (a, b) => a * b;
let __DIV__ = (a, b) => a / b;

let __ELSE__ = true;
let cmd__SUB__args = process.argv.slice(2);

let array = (...args) => args;
let get = (arr, idx) => arr[idx];
let size = (arr) => arr.length;
let slice = (arr, ...args) => arr.slice(...args);
let concat = (arr, ...arrs) => arr.concat(...arrs);

let apply = (f, args) => f(...args);
let not = (x) => !x;
let print = console.log;

function null__QN__(n) {
    return (n == null) || (n == undefined);
}

function number__QN__(n) {
    return typeof n == "number";
}

function string__QN__(n) {
    return typeof n == "string";
}

function array__QN__(n) {
    return n && n.constructor === Array;
}

function set__EX__(arr, idx, val) {
    arr[idx] = val;
}

function read__SUB__file(fileName) {
    return fs.readFileSync(path + "/" + fileName).toString();
}

function parse__SUB__json(str) {
    return JSON.parse(str);
}
