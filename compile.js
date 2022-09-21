let fs = require('fs');
let path = process.cwd();
let cmdArgs = process.argv.slice(2);

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

function readFile(fileName) {
    return fs.readFileSync(path + "/" + fileName).toString();
}

function writeFile(fileName, text) {
    return fs.writeFileSync(fileName, text);
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

function butLast(arr) {
    return arr.slice(0, -1);
}

function last(arr) {
    return arr.slice(-1)[0];
}

function jsfy(text) {
    return text
        .replaceAll("-", "__SUB__")
        .replaceAll("+", "__ADD__")
        .replaceAll("*", "__MUL__")
        .replaceAll("/", "__DIV__")
        .replaceAll("=", "__EQ__")
        .replaceAll("<", "__LT__")
        .replaceAll(">", "__GT__")
        .replaceAll("?", "__QN__")
        .replaceAll("!", "__EX__")
        .replaceAll("var", "__var__");
}

function compile(expr) {
    if (isNumber(expr)) {
        return expr;
    } else if (isString(expr)) {
        return jsfy(expr);
    } else if (isArray(expr)) {
        let [opExpr, ...argsExprs] = expr;

        if (opExpr == "do") {
            let exprs = argsExprs.map(compile);
            let butLastExprs = butLast(exprs).join(";\n");
            let lastExpr = last(exprs);

            return `(function(){
  ${butLastExprs};
  return ${lastExpr};
}())`;
        } else if (opExpr == "def") {
            let [varName, valExpr] = argsExprs,
                jsVarName = jsfy(varName),
                val = compile(valExpr);

            return `let ${jsVarName} = ${val};`;
        } else if (opExpr == "fn") {
            let [args, body] = argsExprs;
            let compiledArgs = args.map(jsfy).join(", ");
            let compiledBody = compile(body);

            return `((${compiledArgs}) => ${compiledBody})`;
        } else if (opExpr == "str") {
            return `"${argsExprs[0]}"`;
        } else if (opExpr == "let") {
            let [bindings, bodyExpr] = argsExprs;

            if (!isEmpty(bindings)) {
                let [varName, valExpr, ...remaining] = bindings,
                    jsVarName = jsfy(varName),
                    code =
                    [["fn", [varName],
                      ["let", remaining,
                       bodyExpr]],
                     valExpr];

                return compile(code);
            } else {
                return compile(bodyExpr);
            }
        } else if (opExpr == "cond") {
            if (isEmpty(argsExprs)) {
                return "null";
            } else {
                let [condExpr, thenExpr, ...remaining] = argsExprs;
                let remainingExpr = ["cond", ...remaining];

                let cond = compile(condExpr);

                if (cond == "else")
                    cond = "true";

                let then = compile(thenExpr);
                let _else = compile(remainingExpr);

                return `(function(){
  let res = ${cond};
  if (res || res === "" || res === 0)
    return ${then};
  else
    return ${_else};
}())`;
            }
        } else {
            let f = compile(opExpr);
            let args = argsExprs.map(compile).join(", ");

            return `${f}(${args})`;
        }
    }
}

let file = cmdArgs[0],
    json = readFile(file),
    code = JSON.parse(json),
    compiledCode = compile(code),
    preamble = readFile("preamble.js"),
    finalCode = preamble + "\n" + compiledCode;


writeFile("out.js", finalCode);
