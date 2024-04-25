"use strict";
exports.__esModule = true;
var Servico = /** @class */ (function () {
    function Servico(nome, valor) {
        this.nome = nome;
        this.valor = valor;
    }
    Object.defineProperty(Servico.prototype, "getNome", {
        get: function () {
            return this.nome;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Servico.prototype, "getValor", {
        get: function () {
            return this.valor;
        },
        enumerable: false,
        configurable: true
    });
    return Servico;
}());
exports["default"] = Servico;
