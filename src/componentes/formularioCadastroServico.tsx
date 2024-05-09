import React, { Component } from "react";
import { TextField, Button, Grid } from "@mui/material";

interface Servico {
    nome: string;
    descricao: string;
    preco: number;
}

interface Props {
    tema: string;
    onCadastroServico: (servico: Servico) => void;
}

export default class FormularioCadastroServico extends Component<Props, Servico> {
    constructor(props: Props) {
        super(props);
        this.state = {
            nome: "",
            descricao: "",
            preco: 0,
        };
    }

    handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

	handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, '');
        this.setState((prevState) => ({
            ...prevState,
            preco: parseInt(value) || 0, 
        }));
    };

    handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { nome, descricao, preco } = this.state;
        if (!nome || !descricao || preco <= 0) {
            alert("Todos os campos são obrigatórios e o preço deve ser maior que 0.");
            return;
        }

        this.props.onCadastroServico(this.state);

        this.setState({
            nome: "",
            descricao: "",
            preco: 0,
        });
    };

    render() {
        const { tema } = this.props;

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <form onSubmit={this.handleFormSubmit}>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="nome"
                                    label="Nome do Serviço"
                                    variant="outlined"
                                    name="nome"
                                    value={this.state.nome}
                                    onChange={this.handleInputChange}
									required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="descricao"
                                    label="Descrição"
                                    variant="outlined"
                                    name="descricao"
                                    value={this.state.descricao}
                                    onChange={this.handleInputChange}
                                    multiline
                                    rows={4}
									required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="preco"
                                    label="Preço"
                                    variant="outlined"
                                    name="preco"
                                    type="number"
                                    value={this.state.preco}
                                    onChange={this.handlePriceChange}
									required
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    className={tema}
                                    fullWidth
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        );
    }
}
