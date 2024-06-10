"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Servico {
    constructor(nome, valor) {
        this.nome = nome;
        this.valor = valor;
    }
    get getNome() {
        return this.nome;
    }
    get getValor() {
        return this.valor;
    }
}
exports.default = Servico;
