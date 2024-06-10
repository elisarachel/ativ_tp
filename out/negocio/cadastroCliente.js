"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entrada_1 = __importDefault(require("../io/entrada"));
const cliente_1 = __importDefault(require("../modelo/cliente"));
const cpf_1 = __importDefault(require("../modelo/cpf"));
const cadastro_1 = __importDefault(require("./cadastro"));
class CadastroCliente extends cadastro_1.default {
    constructor(clientes, produtos, servicos) {
        super();
        this.clientes = clientes;
        this.produtos = produtos;
        this.servicos = servicos;
        this.entrada = new entrada_1.default();
    }
    cadastrar() {
        console.log(`\nInício do cadastro do cliente`);
        let nome = this.entrada.receberTexto(`Por favor informe o nome do cliente: `);
        let nomeSocial = this.entrada.receberTexto(`Por favor informe o nome social do cliente: `);
        let valor = this.entrada.receberTexto(`Por favor informe o número do cpf: `);
        let data = this.entrada.receberTexto(`Por favor informe a data de emissão do cpf, no padrão dd/mm/yyyy: `);
        let genero = this.entrada.receberTexto(`Por favor informe o gênero do cliente: `);
        let partesData = data.split('/');
        let ano = new Number(partesData[2].valueOf()).valueOf();
        let mes = new Number(partesData[1].valueOf()).valueOf();
        let dia = new Number(partesData[0].valueOf()).valueOf();
        let dataEmissao = new Date(ano, mes, dia);
        let cpf = new cpf_1.default(valor, dataEmissao);
        let cliente = new cliente_1.default(nome, nomeSocial, cpf, genero);
        this.clientes.push(cliente);
        console.log(`\nCadastro concluído :)\n`);
    }
    associarProdutoACliente() {
        let cpfCliente = this.entrada.receberTexto(`Informe o CPF do cliente: `);
        let cliente = this.clientes.find(cliente => cliente.getCpf.getValor === cpfCliente);
        if (cliente) {
            let produtoNome = this.entrada.receberTexto(`Informe o nome do produto a ser associado: `);
            let produto = this.produtos.find(produto => produto.getNome === produtoNome);
            if (produto) {
                cliente.adicionarProduto(produto);
                console.log(`Produto associado com sucesso!`);
            }
            else {
                console.log(`Produto não encontrado!`);
            }
        }
        else {
            console.log(`Cliente não encontrado!`);
        }
    }
    associarServicoACliente() {
        let cpfCliente = this.entrada.receberTexto(`Informe o CPF do cliente: `);
        let cliente = this.clientes.find(cliente => cliente.getCpf.getValor === cpfCliente);
        if (cliente) {
            let servicoNome = this.entrada.receberTexto(`Informe o nome do serviço a ser associado: `);
            let servico = this.servicos.find(servico => servico.getNome === servicoNome);
            if (servico) {
                cliente.adicionarServico(servico);
                console.log(`Serviço associado com sucesso!`);
            }
            else {
                console.log(`Serviço não encontrado!`);
            }
        }
        else {
            console.log(`Cliente não encontrado!`);
        }
    }
}
exports.default = CadastroCliente;
