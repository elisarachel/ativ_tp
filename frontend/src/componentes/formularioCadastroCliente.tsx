import React, { useState } from "react";
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme, Autocomplete } from "@mui/material";
import { SelectChangeEvent } from '@mui/material';
import { Produto } from '../pages/listaProdutos';
import { Servico } from '../pages/listaServicos';
import axios from "axios";

type ProdutoConsumido = {
    id: number;
    clienteId: number;
    produtoId: number;
    produto: Produto;
};

type ServicoConsumido = {
    id: number;
    clienteId: number;
    servicoId: number;
    servico: Servico;
};

interface Cliente {
    id: number;
    nome: string;
    sobrenome: string;
    telefone: string;
    email: string;
    genero: string;
    produtosConsumidos: ProdutoConsumido[];
    servicosConsumidos: ServicoConsumido[];
};

interface Props {
    tema: string;
    onCadastroCliente: (cliente: Cliente) => void;
    produtosOptions: Produto[];
    servicosOptions: Servico[];
}

export default function FormularioCadastroCliente(props: Props) {
    const { tema, onCadastroCliente, produtosOptions, servicosOptions } = props;
    const [formData, setFormData] = useState<Cliente>({
		id: 0,
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

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setFormData((prevData) => ({
            ...prevData,
            genero: value,
        }));
    };

	const handleProdutosChange = (event: React.ChangeEvent<{}>, value: Produto[]) => {
		const produtosConsumidos: ProdutoConsumido[] = value.map(produto => ({
			id: produto.id,
			clienteId: formData.id, // Assuming you want to associate the produto with the current client
			produtoId: produto.id,
			produto: produto,
		}));
	
		setFormData((prevData) => ({
			...prevData,
			produtosConsumidos: produtosConsumidos,
		}));
	};
	
	const handleServicosChange = (event: React.ChangeEvent<{}>, value: Servico[]) => {
		const servicosConsumidos: ServicoConsumido[] = value.map(servico => ({
			id: servico.id,
			clienteId: formData.id, // Assuming you want to associate the servico with the current client
			servicoId: servico.id,
			servico: servico,
		}));
	
		setFormData((prevData) => ({
			...prevData,
			servicosConsumidos: servicosConsumidos,
		}));
	};
	

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	
		console.log('Form data before submission:', formData);
	
		if (!Array.isArray(formData.produtosConsumidos) || !Array.isArray(formData.servicosConsumidos)) {
			console.error('produtosConsumidos or servicosConsumidos are not arrays');
			return;
		}
	
		try {
			const produtosConsumidos = formData.produtosConsumidos.map(produto => ({ id: produto.id }));
			const servicosConsumidos = formData.servicosConsumidos.map(servico => ({ id: servico.id }));
	
			const dataToSend = {
				...formData,
				produtosConsumidos,
				servicosConsumidos
			};
	
			console.log('Data to send:', dataToSend);
	
			const response = await axios.post('http://localhost:5000/api/clients', dataToSend);
			onCadastroCliente(response.data);
			setFormData({
				id: 0,
				nome: "",
				sobrenome: "",
				telefone: "",
				email: "",
				genero: "",
				produtosConsumidos: [],
				servicosConsumidos: []
			});
		} catch (error) {
			console.error('There was an error!', error);
		}
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
