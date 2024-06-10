import Entrada from "../io/entrada";
import Cliente from "../modelo/cliente";
import CPF from "../modelo/cpf";
import Produto from "../modelo/produto";
import Servico from "../modelo/servico";
import Cadastro from "./cadastro";

export default class CadastroCliente extends Cadastro {
	private clientes: Array<Cliente>;
    private produtos: Array<Produto>;
    private servicos: Array<Servico>;
    private entrada: Entrada;

    constructor(clientes: Array<Cliente>, produtos: Array<Produto>, servicos: Array<Servico>) {
        super();
        this.clientes = clientes;
        this.produtos = produtos;
        this.servicos = servicos;
        this.entrada = new Entrada();
    }
    public cadastrar(): void {
        console.log(`\nInício do cadastro do cliente`);
        let nome = this.entrada.receberTexto(`Por favor informe o nome do cliente: `)
        let nomeSocial = this.entrada.receberTexto(`Por favor informe o nome social do cliente: `)
        let valor = this.entrada.receberTexto(`Por favor informe o número do cpf: `);
        let data = this.entrada.receberTexto(`Por favor informe a data de emissão do cpf, no padrão dd/mm/yyyy: `);
		let genero = this.entrada.receberTexto(`Por favor informe o gênero do cliente: `)
        let partesData = data.split('/')
        let ano = new Number(partesData[2].valueOf()).valueOf()
        let mes = new Number(partesData[1].valueOf()).valueOf()
        let dia = new Number(partesData[0].valueOf()).valueOf()
        let dataEmissao = new Date(ano, mes, dia)
        let cpf = new CPF(valor, dataEmissao);
        let cliente = new Cliente(nome, nomeSocial, cpf, genero);
        this.clientes.push(cliente)
        console.log(`\nCadastro concluído :)\n`);
    }
	public associarProdutoACliente(): void {
        let cpfCliente = this.entrada.receberTexto(`Informe o CPF do cliente: `);
        let cliente = this.clientes.find(cliente => cliente.getCpf.getValor === cpfCliente);

        if (cliente) {
            let produtoNome = this.entrada.receberTexto(`Informe o nome do produto a ser associado: `);
            let produto = this.produtos.find(produto => produto.getNome === produtoNome);

            if (produto) {
                cliente.adicionarProduto(produto);
                console.log(`Produto associado com sucesso!`);
            } else {
                console.log(`Produto não encontrado!`);
            }
        } else {
            console.log(`Cliente não encontrado!`);
        }
    }

    public associarServicoACliente(): void {
        let cpfCliente = this.entrada.receberTexto(`Informe o CPF do cliente: `);
        let cliente = this.clientes.find(cliente => cliente.getCpf.getValor === cpfCliente);

        if (cliente) {
            let servicoNome = this.entrada.receberTexto(`Informe o nome do serviço a ser associado: `);
            let servico = this.servicos.find(servico => servico.getNome === servicoNome);

            if (servico) {
                cliente.adicionarServico(servico);
                console.log(`Serviço associado com sucesso!`);
            } else {
                console.log(`Serviço não encontrado!`);
            }
        } else {
            console.log(`Cliente não encontrado!`);
        }
    }
}