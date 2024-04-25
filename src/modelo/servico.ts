export default class Servico {
    private nome!: string
	private valor!: number

	constructor(nome: string, valor: number){
		this.nome = nome;
		this.valor = valor;
	}

	public get getNome(): string {
		return this.nome;
	}
	public get getValor(): number {
		return this.valor;
	}
}