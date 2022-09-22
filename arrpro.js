let fs = require('fs');
let path = process.cwd();
let cmdArgs = process.argv.slice(2);

function readLine () {
    return fs.readFileSync(0).toString();
}

function readFile(filename) {
    return fs.readFileSync(path + "/" + filename).toString();
}

function isNull(n) {
    return (n == null) || (n == undefined);
}

function isNumber(n) {
    return typeof n == "number";
}

function isString(n) {
    return typeof n == "string";
}

function isArray(n) {
    return n && n.constructor === Array;
}

function isEmpty(arr) {
    return arr && arr.length == 0;
}

function zipmap(arr1 ,arr2) {
    return arr1.reduce((p,c,i) => {
        p[c] = arr2[i];
        return p;
    }, {});
}

function last(arr) {
    return arr.slice(-1)[0];
}

function freshEnv () {
    return {
        "__PARENT__": null,

        "null":     null,
        "true":     true,
        "false":    false,
        "else":     true,
        "cmd-args": cmdArgs.slice(1),

        "=": (x, y) => x === y,
        "<": (x, y) => x < y,
        ">": (x, y) => x > y,
        "+": (x, y) => x + y,
        "-": (x, y) => x - y,
        "*": (x, y) => x * y,
        "/": (x, y) => x / y,

        "null?":   isNull,
        "number?": isNumber,
        "string?": isString,
        "array?":  isArray,

        "array":  (...args) => args,
        "get":    (arr, idx) => arr[idx],
        "set!":   (arr, idx, val) => { arr[idx] = val; },
        "slice":  (arr, ...args) => arr.slice(...args),
        "size":   (arr) => arr.length,
        "concat": (arr, ...arrs) => arr.concat(...arrs),

        "not":   (x) => !x,
        "apply": (f, args) => f(...args),

        "print":      (...args) => console.log(...args),
        "read-file":  readFile,
        "parse-json": (str) => JSON.parse(str)
    }
}

function envLookup(env, key) {
    let val = env[key];

    if (isNull(val)) {
        if (env.__PARENT__) {
            return envLookup(env.__PARENT__, key);
        } else {
            return null;
        }
    } else {
        return val;
    }
}

function makeFn(args, body, env) {
    return function(...fnArgs) {
        let bindings = zipmap(args, fnArgs);
        bindings.__PARENT__ = env;

        return walk(body, bindings);
    };
}

function walk(expr, env) {
    // console.log(expr, env);

    if (isNumber(expr)) {
        return expr;
    } else if (isString(expr)) {
        return envLookup(env, expr);
    } else if (isArray(expr)) {
        let [opExpr, ...argsExprs] = expr;

        if (opExpr == "do") {
            let exprs = argsExprs.map((e) => walk(e, env));

            return last(exprs);
        } else if (opExpr == "def") {
            let [varName, valExpr] = argsExprs;
            let val = walk(valExpr, env);

            env[varName] = val;
        } else if (opExpr == "fn") {
            let [args, body] = argsExprs;

            return makeFn(args, body, env);
        } else if (opExpr == "str") {
            return argsExprs[0];
        } else if (opExpr == "let") {
            let [bindings, bodyExpr] = argsExprs;

            if (!isEmpty(bindings)) {
                let [varName, valExpr, ...remaining] = bindings;
                let code =
                    [["fn", [varName],
                      ["let", remaining,
                       bodyExpr]],
                     valExpr];

                return walk(code, env);
            } else {
                return walk(bodyExpr, env);
            }
        } else if (opExpr == "cond") {
            if (isEmpty(argsExprs)) {
                return null;
            } else {
                let [condExpr, thenExpr, ...remaining] = argsExprs;
                let cond = walk(condExpr, env);
                let remainingExpr = ["cond", ...remaining];

                if (cond || cond === 0 || cond === "") {
                    return walk(thenExpr, env);
                } else {
                    return walk(remainingExpr, env);
                }
            }
        } else {
            let f = walk(opExpr, env);
            let args = argsExprs.map((e) => walk(e, env));

            return f(...args);
        }
    }
}

let replOrFile = cmdArgs[0],
    isREPL = replOrFile == "repl",
    env    = freshEnv(),
    read   = isREPL? () => {
        process.stdout.write("> ");
        return readLine();
    } : () => readFile(replOrFile);

if (isREPL) {
    console.log("===========");
    console.log("arrpro REPL");
    console.log("===========");
    console.log("(you might need to press Ctrl+D after pressing ENTER)\n");
}

do {
    let json = read(),
        code = JSON.parse(json),
        ret  = walk(code, env);

    if (isREPL)
        console.log("=>", ret, "\n");
} while (isREPL);
