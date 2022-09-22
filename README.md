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


