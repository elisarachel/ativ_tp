import Entrada from "../io/entrada";
import Servico from "../modelo/servico";
import Cadastro from "./cadastro";

export default class CadastroServico extends Cadastro {
    private servicos: Array<Servico>
    private entrada: Entrada
    constructor(servicos: Array<Servico>) {
        super()
        this.servicos = servicos
        this.entrada = new Entrada()
    }

	// 3 - Cadastrar serviço
    public cadastrar(): void {
        console.log(`\nInício do cadastro de servico:`);
        let nome = this.entrada.receberTexto(`Por favor informe o nome do servico: `)
        let valor = this.entrada.receberNumero(`Por favor informe o valor do servico: `);
		let servico = new Servico(nome, valor);
		this.servicos.push(servico);
        console.log(`\nCadastro concluído :)\n`);
    }
}