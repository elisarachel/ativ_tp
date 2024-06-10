import Entrada from "../io/entrada";
import Empresa from "../modelo/empresa"
import CadastroCliente from "../negocio/cadastroCliente";
import ListagemClientes from "../negocio/listagemClientes";
import ListagemProdutosServicos from "../negocio/listagemProdutosServicos";
import CadastroProduto from "../negocio/cadastroProduto";
import CadastroServico from "../negocio/cadastroServico";

console.log(`Bem-vindo ao cadastro de clientes do Grupo World Beauty`)
let empresa = new Empresa()
let execucao = true

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

    let entrada = new Entrada();
    let opcao = entrada.receberNumero(`Por favor, escolha uma opção: `);

    switch (opcao) {
        case 1:
            let cadastro = new CadastroCliente(empresa.getClientes, empresa.getProdutos, empresa.getServicos);
            cadastro.cadastrar();
            break;
		case 2:
			let cadastroProduto = new CadastroProduto(empresa.getProdutos);
			cadastroProduto.cadastrar();
			break;
		case 3:
			let cadastroServico = new CadastroServico(empresa.getServicos);
			cadastroServico.cadastrar();
			break;
        case 4:
            let listagem = new ListagemClientes(empresa.getClientes);
            listagem.listar();
            break;
		case 5:
			let listagemTop10 = new ListagemClientes(empresa.getClientes);
            listagemTop10.listarMaisConsumiram();
			break;
		case 6:
			let listagemBottom10 = new ListagemClientes(empresa.getClientes);
            listagemBottom10.listarMenosConsumiram();
			break;
		case 7:
			let listagemTop5 = new ListagemClientes(empresa.getClientes);
            listagemTop5.listarMaisConsumiramEmValor();
			break;
		case 8:
			let listagemGenero = new ListagemClientes(empresa.getClientes);
            listagemGenero.listarPorGenero();
			break;
		case 9:
			let listagemConsumoGenero = new ListagemClientes(empresa.getClientes);
            listagemConsumoGenero.listarConsumoPorGenero();
			break;
		case 10:
			let listagemProdutosServicos = new ListagemProdutosServicos(empresa.getServicos, empresa.getProdutos);
            listagemProdutosServicos.listar();
			break;
		case 11:
			let listagemTopProdutosServicos = new ListagemProdutosServicos(empresa.getServicos, empresa.getProdutos);
            listagemTopProdutosServicos.listarMaisConsumidos();
			break;
		case 12:
			let associarProduto = new CadastroCliente(empresa.getClientes, empresa.getProdutos, empresa.getServicos);
			associarProduto.associarProdutoACliente();
			break;
		case 13:
			let associarServico = new CadastroCliente(empresa.getClientes, empresa.getProdutos, empresa.getServicos);
			associarServico.associarServicoACliente();
			break;
        case 0:
            execucao = false
            console.log(`Até mais`)
            break;
        default:
            console.log(`Operação não entendida :(`)
    }
}