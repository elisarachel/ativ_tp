"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entrada_1 = __importDefault(require("../io/entrada"));
const empresa_1 = __importDefault(require("../modelo/empresa"));
const cadastroCliente_1 = __importDefault(require("../negocio/cadastroCliente"));
const listagemClientes_1 = __importDefault(require("../negocio/listagemClientes"));
const listagemProdutosServicos_1 = __importDefault(require("../negocio/listagemProdutosServicos"));
const cadastroProduto_1 = __importDefault(require("../negocio/cadastroProduto"));
const cadastroServico_1 = __importDefault(require("../negocio/cadastroServico"));
console.log(`Bem-vindo ao cadastro de clientes do Grupo World Beauty`);
let empresa = new empresa_1.default();
let execucao = true;
while (execucao) {
    console.log(`Opções:`);
    console.log(`1 - Cadastrar cliente`);
    console.log(`2 - Cadastrar produto`);
    console.log(`3 - Cadastrar serviço`);
    console.log(`4 - Listar todos os clientes`);
    console.log(`5 - Listar os 10 clientes que mais consumiram em quantidade`);
    console.log(`6 - Listar os 10 clientes que menos consumiram em quantidade`);
    console.log(`7 - Listar os 5 clientes que mais consumiram em valor`);
    console.log(`8 - Listar todos os clientes por gênero`);
    console.log(`9 - Listar os produtos/serviços mais consumidos por gênero`);
    console.log(`10 - Listar todos os produtos/serviços`);
    console.log(`11 - Listar os produtos/serviços mais consumidos`);
    console.log(`12 - Associar produto a cliente`);
    console.log(`13 - Associar serviço a cliente`);
    console.log(`0 - Sair`);
    let entrada = new entrada_1.default();
    let opcao = entrada.receberNumero(`Por favor, escolha uma opção: `);
    switch (opcao) {
        case 1:
            let cadastro = new cadastroCliente_1.default(empresa.getClientes, empresa.getProdutos, empresa.getServicos);
            cadastro.cadastrar();
            break;
        case 2:
            let cadastroProduto = new cadastroProduto_1.default(empresa.getProdutos);
            cadastroProduto.cadastrar();
            break;
        case 3:
            let cadastroServico = new cadastroServico_1.default(empresa.getServicos);
            cadastroServico.cadastrar();
            break;
        case 4:
            let listagem = new listagemClientes_1.default(empresa.getClientes);
            listagem.listar();
            break;
        case 5:
            let listagemTop10 = new listagemClientes_1.default(empresa.getClientes);
            listagemTop10.listarMaisConsumiram();
            break;
        case 6:
            let listagemBottom10 = new listagemClientes_1.default(empresa.getClientes);
            listagemBottom10.listarMenosConsumiram();
            break;
        case 7:
            let listagemTop5 = new listagemClientes_1.default(empresa.getClientes);
            listagemTop5.listarMaisConsumiramEmValor();
            break;
        case 8:
            let listagemGenero = new listagemClientes_1.default(empresa.getClientes);
            listagemGenero.listarPorGenero();
            break;
        case 9:
            let listagemConsumoGenero = new listagemClientes_1.default(empresa.getClientes);
            listagemConsumoGenero.listarConsumoPorGenero();
            break;
        case 10:
            let listagemProdutosServicos = new listagemProdutosServicos_1.default(empresa.getServicos, empresa.getProdutos);
            listagemProdutosServicos.listar();
            break;
        case 11:
            let listagemTopProdutosServicos = new listagemProdutosServicos_1.default(empresa.getServicos, empresa.getProdutos);
            listagemTopProdutosServicos.listarMaisConsumidos();
            break;
        case 12:
            let associarProduto = new cadastroCliente_1.default(empresa.getClientes, empresa.getProdutos, empresa.getServicos);
            associarProduto.associarProdutoACliente();
            break;
        case 13:
            let associarServico = new cadastroCliente_1.default(empresa.getClientes, empresa.getProdutos, empresa.getServicos);
            associarServico.associarServicoACliente();
            break;
        case 0:
            execucao = false;
            console.log(`Até mais`);
            break;
        default:
            console.log(`Operação não entendida :(`);
    }
}
