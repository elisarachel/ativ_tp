import React, { useState } from "react";
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme, Autocomplete } from "@mui/material";
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

export default function FormularioCadastroCliente(props: Props) {
    const { tema, onCadastroCliente, produtosOptions, servicosOptions } = props;
    const [formData, setFormData] = useState<State>({
        nome: "",
        sobrenome: "",
        telefone: "",
        email: "",
        genero: "",
        produtosConsumidos: [],
        servicosConsumidos: []
    });

    const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		if (name === "telefone") {
			const cleanedValue = value.replace(/\D/g, '');
			if (cleanedValue.length === 11) {
				const formattedValue = `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7)}`;
				setFormData((prevData) => ({
					...prevData,
					[name]: formattedValue,
				}));
			} else {
				setFormData((prevData) => ({
					...prevData,
					[name]: cleanedValue,
				}));
			}
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};
	

    const handleSelectChange = (
        event: SelectChangeEvent<string>
    ) => {
        const value = event.target.value;
        setFormData((prevData) => ({
            ...prevData,
            genero: value,
        }));
    };

    const handleProdutosChange = (event: React.ChangeEvent<{}>, value: Produto[]) => {
        setFormData((prevData) => ({
            ...prevData,
            produtosConsumidos: value,
        }));
    };

    const handleServicosChange = (event: React.ChangeEvent<{}>, value: Servico[]) => {
        setFormData((prevData) => ({
            ...prevData,
            servicosConsumidos: value,
        }));
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onCadastroCliente(formData);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="first_name"
                                label="Nome"
                                variant="outlined"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
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
                                value={formData.sobrenome}
                                onChange={handleInputChange}
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
                                value={formData.telefone}
                                onChange={handleInputChange}
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
                                value={formData.email}
                                onChange={handleInputChange}
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
                                    value={formData.genero}
                                    onChange={handleSelectChange}
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
                                onChange={handleProdutosChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                id="servicosConsumidos"
                                options={servicosOptions}
                                getOptionLabel={(option: Servico) => option.nome}
                                renderInput={(params) => <TextField {...params} label="Serviços Consumidos" variant="outlined" />}
                                onChange={handleServicosChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                type="submit"
                                className={tema}
                                fullWidth={isMobile}
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
