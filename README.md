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

1. [arrpro Language Specification](spec.md)
2. [An interpreter for arrpro in JS](arrpro.js)
3. [A compiler for arrpro in JS](compile.js)
4. [An interpreter for arrpro in arrpro](examples/arrpro.json)
5. [arrpro code examples](examples/)

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
