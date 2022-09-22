# arrpro

A simple programming language represented as JSON.

## Code example

```json
["do",

 ["def", "fact",
  ["fn", ["n"],
   ["cond", 
    ["<", "n", 1],
    1,
    
    "else",
    ["*", "n", ["fact", ["-", "n", 1]]]]]],
 
 ["print", ["fact", 5]]]
```

## About this repo

This repo contains:

1. An interpreter for arrpro in JS
2. A compiler for arrpro in JS
3. An interpreter for arrpro in arrpro
4. arrpro code examples

## How to use

[node.js](https://nodejs.org/en/) **must** be installed

### Interpret an arrpro file

```
$ node arrpro.js examples/fact.json 
```

### Compile and run an arrpro file

```
$ node compile.js examples/fact.json
$ node out.js
```

### Interpret using the self-hosting interpreter (arrpro in arrpro)

```
$ node arrpro.js examples/arrpro.json examples/fact.json
```

### Start a REPL

```
$ rlwrap node arrpro.js repl

> ["+", 1, 2]
=> 3

> ["def", "a", 10]
=> undefined

> "a"
=> 10
```

Note that on some machines, you might need to enter the `EOF` character (Ctrl + D) to evaluate the expression.

