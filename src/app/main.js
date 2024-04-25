"use strict";
exports.__esModule = true;
var entrada_1 = require("../io/entrada");
var empresa_1 = require("../modelo/empresa");
var cadastroCliente_1 = require("../negocio/cadastroCliente");
var listagemClientes_1 = require("../negocio/listagemClientes");
var listagemProdutosServicos_1 = require("../negocio/listagemProdutosServicos");
console.log("Bem-vindo ao cadastro de clientes do Grupo World Beauty");
var empresa = new empresa_1["default"]();
var execucao = true;
while (execucao) {
    console.log("Op\u00E7\u00F5es:");
    console.log("1 - Cadastrar cliente");
    console.log("2 - Listar todos os clientes");
    console.log("3 - Listar os 10 clientes que mais consumiram em quantidade");
    console.log("4 - Listar os 10 clientes que menos consumiram em quantidade");
    console.log("5 - Listar os 5 clientes que mais consumiram em valor");
    console.log("6 - Listar todos os clientes por g\u00EAnero");
    console.log("7 - Listar os produtos/servi\u00E7os mais consumidos por g\u00EAnero");
    console.log("8 - Listar todos os produtos/servi\u00E7os");
    console.log("9 - Listar os produtos/servi\u00E7os mais consumidos");
    console.log("0 - Sair");
    var entrada = new entrada_1["default"]();
    var opcao = entrada.receberNumero("Por favor, escolha uma op\u00E7\u00E3o: ");
    switch (opcao) {
        case 1:
            var cadastro = new cadastroCliente_1["default"](empresa.getClientes);
            cadastro.cadastrar();
            break;
        case 2:
            var listagem = new listagemClientes_1["default"](empresa.getClientes);
            listagem.listar();
            break;
        case 3:
            var listagemTop10 = new listagemClientes_1["default"](empresa.getClientes);
            listagemTop10.listarMaisConsumiram();
            break;
        case 4:
            var listagemBottom10 = new listagemClientes_1["default"](empresa.getClientes);
            listagemBottom10.listarMenosConsumiram();
            break;
        case 5:
            var listagemTop5 = new listagemClientes_1["default"](empresa.getClientes);
            listagemTop5.listarMaisConsumiramEmValor();
            break;
        case 6:
            var listagemGenero = new listagemClientes_1["default"](empresa.getClientes);
            listagemGenero.listarPorGenero();
            break;
        case 7:
            var listagemConsumoGenero = new listagemClientes_1["default"](empresa.getClientes);
            listagemConsumoGenero.listarConsumoPorGenero();
            break;
        case 8:
            var listagemProdutosServicos = new listagemProdutosServicos_1["default"](empresa.getServicos, empresa.getProdutos);
            listagemProdutosServicos.listar();
            break;
        case 9:
            var listagemTopProdutosServicos = new listagemProdutosServicos_1["default"](empresa.getServicos, empresa.getProdutos);
            listagemTopProdutosServicos.listarMaisConsumidos();
            break;
        case 0:
            execucao = false;
            console.log("At\u00E9 mais");
            break;
        default:
            console.log("Opera\u00E7\u00E3o n\u00E3o entendida :(");
    }
}
