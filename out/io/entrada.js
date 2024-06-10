"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
class Entrada {
    constructor() {
        this.prompt = (0, prompt_sync_1.default)();
    }
    receberNumero(mensagem) {
        let valor = this.prompt(mensagem);
        let numero = new Number(valor);
        return numero.valueOf();
    }
    receberTexto(mensagem) {
        let texto = this.prompt(mensagem);
        return texto;
    }
}
exports.default = Entrada;
