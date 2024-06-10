import promptSync from 'prompt-sync';

export default class Entrada {
    private prompt: promptSync.Prompt;

    constructor() {
        this.prompt = promptSync();
    }

    public receberNumero(mensagem: string): number {
        let valor = this.prompt(mensagem);
        let numero = new Number(valor);
        return numero.valueOf();
    }

    public receberTexto(mensagem: string): string {
        let texto = this.prompt(mensagem);
        return texto;
    }
}
