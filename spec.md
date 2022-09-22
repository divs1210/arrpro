# arrpro Language Specification

## Special Forms

- `["do", exp1, exp2, ... expN]`

- `["def", "varName", value]`

- `["fn", ["arg1", "arg2", ... "argN"], returnExp]`

- `["let", ["var1", exp1, ... "varN", expN], returnExp]`

- `["cond", condExp1, returnExp1, ... condExpN, returnExpN, "else", defaultExp]`

- `["str", "unevaluated string"]`


## Functions

### Types

`null?`, `number?`, `string?`, `array?`

### Math

`=`, `<`, `>`, `+`, `-`, `*`, `/`

### Arrays

`array`, `get`, `set!`, `size`, `slice`, `concat`

### Misc

`apply`, `not`, `print`, `read-file`, `parse-json`


## Vars

`null`, `true`, `false`, `else`, `cmd-args`
