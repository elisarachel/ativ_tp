import React, { Component } from "react";
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Autocomplete } from "@mui/material";
import { SelectChangeEvent } from '@mui/material';
import { Produto } from '../pages/listaProdutos';
import { Servico } from '../pages/listaServicos';

interface State {
    nome: string;
    sobrenome: string;
    telefone: string;
    email: string;
    genero: string;
    produtosConsumidos: Produto[];
    servicosConsumidos: Servico[];
}

interface Props {
    tema: string;
    onCadastroCliente: (cliente: State) => void;
    produtosOptions: Produto[];
    servicosOptions: Servico[];
}

export default class FormularioCadastroCliente extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            nome: "",
            sobrenome: "",
            telefone: "",
            email: "",
            genero: "",
            produtosConsumidos: [],
            servicosConsumidos: []
        };
    }

    handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		if (name === "telefone") {
			const cleanedValue = value.replace(/\D/g, '');
			if (cleanedValue.length === 11) {
				const formattedValue = `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7)}`;
				this.setState((prevState) => ({
					...prevState,
					[name]: formattedValue,
				}));
			} else {
				this.setState((prevState) => ({
					...prevState,
					[name]: cleanedValue,
				}));
			}
		} else {
			this.setState((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

    handleSelectChange = (
        event: SelectChangeEvent<string>
    ) => {
        const value = event.target.value;
        this.setState((prevState) => ({
            ...prevState,
            genero: value,
        }));
    };

    handleProdutosChange = (event: React.ChangeEvent<{}>, value: Produto[]) => {
        this.setState((prevState) => ({
            ...prevState,
            produtosConsumidos: value,
        }));
    };

    handleServicosChange = (event: React.ChangeEvent<{}>, value: Servico[]) => {
        this.setState((prevState) => ({
            ...prevState,
            servicosConsumidos: value,
        }));
    };

    handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onCadastroCliente(this.state);
    };

    render() {
        const { tema, produtosOptions, servicosOptions } = this.props;

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <form onSubmit={this.handleFormSubmit}>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="first_name"
                                    label="Nome"
                                    variant="outlined"
                                    name="nome"
                                    value={this.state.nome}
                                    onChange={this.handleInputChange}
									required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="last_name"
                                    label="Sobrenome"
                                    variant="outlined"
                                    name="sobrenome"
                                    value={this.state.sobrenome}
                                    onChange={this.handleInputChange}
									required
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="telefone"
                                    label="Telefone"
                                    variant="outlined"
                                    name="telefone"
                                    value={this.state.telefone}
                                    onChange={this.handleInputChange}
									required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    label="E-mail"
                                    variant="outlined"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
									required
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="genero-label">Gênero</InputLabel>
                                    <Select
                                        labelId="genero-label"
                                        id="genero"
                                        value={this.state.genero}
                                        onChange={this.handleSelectChange}
                                        label="Gênero"
										required
                                    >
                                        <MenuItem value="">Selecione</MenuItem>
                                        <MenuItem value="Feminino">Feminino</MenuItem>
                                        <MenuItem value="Masculino">Masculino</MenuItem>
                                        <MenuItem value="Não-binário">Não-binário</MenuItem>
                                        <MenuItem value="Outro">Outro</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    id="produtosConsumidos"
                                    options={produtosOptions}
                                    getOptionLabel={(option: Produto) => option.nome}
                                    renderInput={(params) => <TextField {...params} label="Produtos Consumidos" variant="outlined" />}
                                    onChange={this.handleProdutosChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    id="servicosConsumidos"
                                    options={servicosOptions}
                                    getOptionLabel={(option: Servico) => option.nome}
                                    renderInput={(params) => <TextField {...params} label="Serviços Consumidos" variant="outlined" />}
                                    onChange={this.handleServicosChange}
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
