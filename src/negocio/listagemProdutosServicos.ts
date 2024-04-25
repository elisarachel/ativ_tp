import Servico from "../modelo/servico";
import Produto from "../modelo/produto";
import Listagem from "./listagem";

export default class ListagemProdutosServicos extends Listagem {
    private servicos: Array<Servico>;
    private produtos: Array<Produto>;

    constructor(servicos: Array<Servico>, produtos: Array<Produto>) {
        super();
        this.servicos = servicos;
        this.produtos = produtos;
    }

	// 10 - Listar todos os produtos/serviços
	public listar(): void {
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
    public listarMaisConsumidos(): void {
        console.log(`\nLista de serviços e produtos mais consumidos:`);

        const servicosPorConsumo = this.agruparPorConsumo(this.servicos);
        const produtosPorConsumo = this.agruparPorConsumo(this.produtos);

        this.exibirConsumo("Serviços", servicosPorConsumo);
        this.exibirConsumo("Produtos", produtosPorConsumo);

        console.log(`\n`);
    }

	// Método auxiliar para a listagem dos produtos e serviços mais consumidos
    private agruparPorConsumo(itens: Array<Servico | Produto>): Map<string, number> {
        const consumoPorItem = new Map<string, number>();

        itens.forEach((item) => {
            const nome = item.getNome;
            if (!consumoPorItem.has(nome)) {
                consumoPorItem.set(nome, 0);
            }
            consumoPorItem.set(nome, consumoPorItem.get(nome)! + 1);
        });

        return consumoPorItem;
    }

	// Método auxiliar para a listagem dos produtos e serviços mais consumidos
    private exibirConsumo(tipo: string, consumoPorItem: Map<string, number>): void {
        console.log(`${tipo}:`);
        consumoPorItem.forEach((quantidade, nome) => {
            console.log(`  ${nome}: ${quantidade} vezes consumido`);
        });
    }
}
