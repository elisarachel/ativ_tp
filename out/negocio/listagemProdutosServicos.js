"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const listagem_1 = __importDefault(require("./listagem"));
class ListagemProdutosServicos extends listagem_1.default {
    constructor(servicos, produtos) {
        super();
        this.servicos = servicos;
        this.produtos = produtos;
    }
    // 10 - Listar todos os produtos/serviços
    listar() {
        console.log(`\nLista de todos os serviços:`);
        this.servicos.forEach((servico) => {
            console.log(`  Nome do serviço: ${servico.getNome}`);
        });
        console.log(`\nLista de todos os produtos:`);
        this.produtos.forEach((produto) => {
            console.log(`  Nome do produto: ${produto.getNome}`);
        });
        console.log(`\n`);
    }
    // 11 - Listar os produtos/serviços mais consumidos
    listarMaisConsumidos() {
        console.log(`\nLista de serviços e produtos mais consumidos:`);
        const servicosPorConsumo = this.agruparPorConsumo(this.servicos);
        const produtosPorConsumo = this.agruparPorConsumo(this.produtos);
        this.exibirConsumo("Serviços", servicosPorConsumo);
        this.exibirConsumo("Produtos", produtosPorConsumo);
        console.log(`\n`);
    }
    // Método auxiliar para a listagem dos produtos e serviços mais consumidos
    agruparPorConsumo(itens) {
        const consumoPorItem = new Map();
        itens.forEach((item) => {
            const nome = item.getNome;
            if (!consumoPorItem.has(nome)) {
                consumoPorItem.set(nome, 0);
            }
            consumoPorItem.set(nome, consumoPorItem.get(nome) + 1);
        });
        return consumoPorItem;
    }
    // Método auxiliar para a listagem dos produtos e serviços mais consumidos
    exibirConsumo(tipo, consumoPorItem) {
        console.log(`${tipo}:`);
        consumoPorItem.forEach((quantidade, nome) => {
            console.log(`  ${nome}: ${quantidade} vezes consumido`);
        });
    }
}
exports.default = ListagemProdutosServicos;
