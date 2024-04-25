"use strict";
exports.__esModule = true;
var prompt_sync_1 = require("prompt-sync");
var Entrada = /** @class */ (function () {
    function Entrada() {
    }
    Entrada.prototype.receberNumero = function (mensagem) {
        var prompt = (0, prompt_sync_1["default"])();
        var valor = prompt(mensagem);
        var numero = new Number(valor);
        return numero.valueOf();
    };
    Entrada.prototype.receberTexto = function (mensagem) {
        var prompt = (0, prompt_sync_1["default"])();
        var texto = prompt(mensagem);
        return texto;
    };
    return Entrada;
}());
exports["default"] = Entrada;
