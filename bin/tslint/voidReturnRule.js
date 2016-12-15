"use strict";
const Lint = require("tslint");
const ts = require("typescript");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: "void-return",
    description: "`void` may only be used as a return type.",
    rationale: "style",
    optionsDescription: "Not configurable.",
    options: null,
    type: "style",
    typescriptOnly: true,
};
Rule.FAILURE_STRING = "Use the `void` type for return types only. Otherwise, use `undefined`.";
exports.Rule = Rule;
class Walker extends Lint.RuleWalker {
    visitNode(node) {
        if (node.kind === ts.SyntaxKind.VoidKeyword && node.parent.kind !== ts.SyntaxKind.TypeReference && !isReturnType(node)) {
            this.fail(node, Rule.FAILURE_STRING);
        }
        super.visitNode(node);
    }
    fail(node, message) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
    }
}
function isReturnType(node) {
    const parent = node.parent;
    return isSignatureDeclaration(parent) && parent.type === node;
}
function isSignatureDeclaration(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            return true;
        default:
            return false;
    }
}
//# sourceMappingURL=voidReturnRule.js.map