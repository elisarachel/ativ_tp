"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const listagem_1 = __importDefault(require("./listagem"));
class ListagemClientes extends listagem_1.default {
    constructor(clientes) {
        super();
        this.clientes = clientes;
    }
    // 4 - Listar todos os clientes
    listar() {
        console.log(`\nLista de todos os clientes:`);
        this.clientes.forEach(cliente => {
            console.log(`Nome: ` + cliente.nome);
            console.log(`Nome social: ` + cliente.nomeSocial);
            console.log(`CPF: ` + cliente.getCpf.getValor);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }
    // 5 - Listar os 10 clientes que mais consumiram em quantidade
    listarMaisConsumiram() {
        console.log(`\nLista dos 10 clientes que mais consumiram:`);
        this.clientes.sort((a, b) => {
            const consumoTotalA = a.getProdutosConsumidos.length + a.getServicosConsumidos.length;
            const consumoTotalB = b.getProdutosConsumidos.length + b.getServicosConsumidos.length;
            return consumoTotalB - consumoTotalA;
        });
        const top10Clientes = this.clientes.slice(0, 10);
        top10Clientes.forEach((cliente, index) => {
            console.log(`${index + 1}. Nome: ${cliente.nome}`);
            const consumoTotal = cliente.getProdutosConsumidos.length + cliente.getServicosConsumidos.length;
            console.log(`   Consumo total: ${consumoTotal} itens`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }
    // 6 - Listar os 10 clientes que menos consumiram em quantidade
    listarMenosConsumiram() {
        console.log(`\nLista dos 10 clientes que menos consumiram:`);
        this.clientes.sort((a, b) => {
            const consumoTotalA = a.getProdutosConsumidos.length + a.getServicosConsumidos.length;
            const consumoTotalB = b.getProdutosConsumidos.length + b.getServicosConsumidos.length;
            return consumoTotalA - consumoTotalB;
        });
        const bottom10Clientes = this.clientes.slice(0, 10);
        bottom10Clientes.forEach((cliente, index) => {
            console.log(`${index + 1}. Nome: ${cliente.nome}`);
            const consumoTotal = cliente.getProdutosConsumidos.length + cliente.getServicosConsumidos.length;
            console.log(`   Consumo total: ${consumoTotal} itens`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }
    // 7 - Listar os 5 clientes que mais consumiram em valor
    listarMaisConsumiramEmValor() {
        console.log(`\nLista dos 5 clientes que mais consumiram em valor:`);
        this.clientes.sort((a, b) => {
            const clvA = this.calcularCLV(a);
            const clvB = this.calcularCLV(b);
            return clvB - clvA;
        });
        const top5Clientes = this.clientes.slice(0, 5);
        top5Clientes.forEach((cliente, index) => {
            console.log(`${index + 1}. Nome: ${cliente.nome}`);
            console.log(`   CLV: R$${this.calcularCLV(cliente)}`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }
    // Método auxiliar para a listagem dos clientes que mais consumiram em valor
    // CLV seria o Valor do Tempo de Vida do Cliente, ou seja, quanto o cliente gastou na empresa
    calcularCLV(cliente) {
        let clv = 0;
        cliente.getProdutosConsumidos.forEach((servico) => {
            clv += servico.getValor;
        });
        cliente.getProdutosConsumidos.forEach((produto) => {
            clv += produto.getValor;
        });
        return clv;
    }
    // 8 - Listar todos os clientes por gênero
    listarPorGenero() {
        console.log(`\nLista de todos os clientes por gênero:`);
        const clientesPorGenero = this.agruparPorGenero();
        clientesPorGenero.forEach((clientes, genero) => {
            console.log(`Gênero: ${genero}`);
            clientes.forEach((cliente) => {
                console.log(`  Nome: ${cliente.nome}`);
                console.log(`  Nome social: ${cliente.nomeSocial}`);
                console.log(`  CPF: ${cliente.getCpf.getValor}`);
                console.log(`--------------------------------------`);
            });
        });
        console.log(`\n`);
    }
    // Método auxiliar para a listagem dos clientes por gênero
    agruparPorGenero() {
        const clientesPorGenero = new Map();
        this.clientes.forEach((cliente) => {
            var _a;
            const genero = cliente.getGenero;
            if (!clientesPorGenero.has(genero)) {
                clientesPorGenero.set(genero, []);
            }
            (_a = clientesPorGenero.get(genero)) === null || _a === void 0 ? void 0 : _a.push(cliente);
        });
        return clientesPorGenero;
    }
    // 9 - Listar os produtos/serviços mais consumidos por gênero
    listarConsumoPorGenero() {
        console.log(`\nProdutos e serviços mais consumidos por gênero:`);
        const consumoPorGenero = new Map();
        this.clientes.forEach((cliente) => {
            const genero = cliente.getGenero;
            if (!consumoPorGenero.has(genero)) {
                consumoPorGenero.set(genero, new Map());
            }
            const produtosPorGenero = consumoPorGenero.get(genero);
            cliente.getProdutosConsumidos.forEach((produto) => {
                produtosPorGenero.set(produto.getNome, (produtosPorGenero.get(produto.getNome) || 0) + 1);
            });
        });
        consumoPorGenero.forEach((produtosPorGenero, genero) => {
            console.log(`Gênero: ${genero}`);
            produtosPorGenero.forEach((quantidade, nomeProduto) => {
                console.log(`  Produto/Serviço: ${nomeProduto} - Quantidade consumida: ${quantidade}`);
            });
        });
        console.log(`\n`);
    }
}
exports.default = ListagemClientes;
