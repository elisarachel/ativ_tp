"use strict";
exports.__esModule = true;
var Produto = /** @class */ (function () {
    function Produto(nome, valor) {
        this.nome = nome;
        this.valor = valor;
    }
    Object.defineProperty(Produto.prototype, "getNome", {
        get: function () {
            return this.nome;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Produto.prototype, "getValor", {
        get: function () {
            return this.valor;
        },
        enumerable: false,
        configurable: true
    });
    return Produto;
}());
exports["default"] = Produto;
