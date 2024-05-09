import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Produto } from "./listaProdutos";
import { Servico } from "./listaServicos";
import { SelectChangeEvent } from '@mui/material';
import { withTheme } from '@mui/styles';
import { Theme } from '@mui/material/styles';

type Cliente = {
    nome?: string;
    sobrenome?: string;
    telefone?: string;
    email?: string;
    genero: string;
    produtosConsumidos?: Produto[];
    servicosConsumidos?: Servico[];
};

class ListaClienteBase extends React.Component<{ clientes: any, tema: Theme; }, { filterOption: string; }> {
	filteredClients: any;
    constructor(props: { clientes: any, tema: any; }) {
        super(props);
        this.state = {
            filterOption: ''
        };
    }

	componentDidMount() {
        this.filteredClients = this.filterClients();
    }

    handleFilterChange = (event: SelectChangeEvent<string>) => {
        this.setState({ filterOption: event.target.value });
    };

    filterClients = () => {
        const { clientes } = this.props;
        const { filterOption } = this.state;

        switch (filterOption) {
            case 'top10Quantidade':
                return this.getTop10ClientesPorQuantidade(true, 10);
            case 'bottom10Quantidade':
                return this.getTop10ClientesPorQuantidade(false, 10);
            case 'maisConsumiramPorValor':
                return this.getTop5ClientesPorValor(true, 5);
            case 'listarPorGenero':
                const clientsByGender: { [key: string]: Cliente[] } = {};
                clientes.forEach((cliente: Cliente) => {
                    const genero = cliente.genero.toString();

                    if (clientsByGender[genero]) {
                        clientsByGender[genero].push(cliente);
                    } else {
                        clientsByGender[genero] = [cliente];
                    }
                });
                const clientsByGenderArray = Object.entries(clientsByGender).map(([gender, clients]) => ({ gender, clients }));
                return clientsByGenderArray;
            default:
                return clientes;
        }
    };

	getTop10ClientesPorQuantidade = (most: boolean, count: number) => {
        const { clientes } = this.props;

		const clientsWithTotalConsumption = clientes.map((client: { produtosConsumidos: string | any[]; servicosConsumidos: string | any[]; }) => {
			const totalProductsConsumed = client.produtosConsumidos ? client.produtosConsumidos.length : 0;
			const totalServicesConsumed = client.servicosConsumidos ? client.servicosConsumidos.length : 0;
			return { ...client, totalProductsConsumed, totalServicesConsumed };
		});
	

		clientsWithTotalConsumption.sort((a: { totalProductsConsumed: any; totalServicesConsumed: any; }, b: { totalProductsConsumed: any; totalServicesConsumed: any; }) => {
			const totalConsumedA = a.totalProductsConsumed + a.totalServicesConsumed;
			const totalConsumedB = b.totalProductsConsumed + b.totalServicesConsumed;
			const diff = totalConsumedA - totalConsumedB;
			return most ? -diff : diff;
		});
	
		return clientsWithTotalConsumption.slice(0, count);
	};

	getTop5ClientesPorValor = (most: boolean, count: number) => {
		const { clientes } = this.props;

		const clientsWithTotalPrice = clientes.map((client: { produtosConsumidos: any[]; servicosConsumidos: any[]; }) => {
			const totalPriceProducts = client.produtosConsumidos.reduce((total: any, produto: { preco: any; }) => total + produto.preco, 0);
			const totalPriceServices = client.servicosConsumidos.reduce((total: any, servico: { preco: any; }) => total + servico.preco, 0);
			const totalPriceConsumed = totalPriceProducts + totalPriceServices;
			return { ...client, totalPriceConsumed };
		});
	
		clientsWithTotalPrice.sort((a: { totalPriceConsumed: number; }, b: { totalPriceConsumed: number; }) => {
			const diff = a.totalPriceConsumed - b.totalPriceConsumed;
			return most ? -diff : diff;
		});
	
		return clientsWithTotalPrice.slice(0, count);
	};
	
    render() {
        const filteredClients = this.filterClients();
		const { filterOption } = this.state;
		const { tema } = this.props;

		return (
			<div style={{ marginTop: this.props.tema.spacing(2), marginBottom: this.props.tema.spacing(2) }}>
				<Typography variant="h2" style={{ fontFamily: this.props.tema.typography.fontFamily, marginLeft: this.props.tema.spacing(2), marginRight: this.props.tema.spacing(2), color: '#515151' }}>Lista de Clientes</Typography>
				<FormControl variant="outlined" style={{ marginTop: this.props.tema.spacing(2), marginLeft: this.props.tema.spacing(2), marginRight: this.props.tema.spacing(2), minWidth: 200 }}>
					<InputLabel id="filter-select-label">Filtrar</InputLabel>
					<Select
						labelId="filter-select-label"
						id="filter-select"
						value={filterOption}
						onChange={this.handleFilterChange}
						label="Filtrar"
					>
						<MenuItem value="">Listar todos os clientes</MenuItem>
						<MenuItem value="top10Quantidade">Listar os 10 clientes que mais consumiram</MenuItem>
						<MenuItem value="bottom10Quantidadegit ">Listar os 10 clientes que menos consumiram</MenuItem>
						<MenuItem value="maisConsumiramPorValor">Listar os 5 clientes que mais consumiram em valor</MenuItem>
						<MenuItem value="listarPorGenero">Listar todos os clientes por gênero</MenuItem>
					</Select>
				</FormControl>
				{filteredClients.map((group: { gender: any; clients: any[]; nome: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; sobrenome: any; telefone: any; email: any; produtosConsumidos: any[]; servicosConsumidos: any[]; }, index: React.Key | null | undefined) => {
		if (filterOption === 'listarPorGenero') {
			return (
				<div key={index}>
					<Typography variant="h6">{`Gênero: ${group.gender}`}</Typography>
					{group.clients.map((cliente: { nome: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; sobrenome: any; telefone: any; email: any; produtosConsumidos: any[]; servicosConsumidos: any[]; }, idx: any) => (
						<Accordion key={`${group.gender}-${idx}`} className={tema.palette.primary.main}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={`panel${index}-content`}
								id={`panel${index}-header`}
							>
								<Typography>{cliente.nome}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<List>
									<ListItem>
										<ListItemText primary={`Sobrenome: ${cliente.sobrenome}`} />
									</ListItem>
									<ListItem>
										<ListItemText primary={`Telefone: ${cliente.telefone}`} />
									</ListItem>
									<ListItem>
										<ListItemText primary={`E-mail: ${cliente.email}`} />
									</ListItem>
									<ListItem>
										<ListItemText primary={`Produtos Consumidos:`} />
											<List>
												{cliente.produtosConsumidos.map((produto, idx) => (
													<ListItem key={idx}>
														<ListItemText primary={`${produto.nome} - ${produto.descricao} - Preço: ${produto.preco}`} />
													</ListItem>
												))}
											</List>
									</ListItem>
									<ListItem>
										<ListItemText primary={`Serviços Consumidos:`} />
											<List>
												{cliente.servicosConsumidos.map((servico, idx) => (
													<ListItem key={idx}>
														<ListItemText primary={`${servico.nome} - ${servico.descricao} - Preço: ${servico.preco}`} />
													</ListItem>
												))}
											</List>
									</ListItem>
								</List>
							</AccordionDetails>
						</Accordion>
					))}
				</div>
			);
		} else {
			return (
				<div key={index}>
					<Accordion className={tema.palette.primary.main}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls={`panel${index}-content`}
							id={`panel${index}-header`}
						>
							<Typography>{group.nome}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<List>
								<ListItem>
									<ListItemText primary={`Sobrenome: ${group.sobrenome}`} />
								</ListItem>
								<ListItem>
									<ListItemText primary={`Telefone: ${group.telefone}`} />
								</ListItem>
								<ListItem>
									<ListItemText primary={`E-mail: ${group.email}`} />
								</ListItem>
								<ListItem>
									<ListItemText primary={`Produtos Consumidos:`} />
									<List>
										{group.produtosConsumidos && group.produtosConsumidos.map((produto, idx) => (
											<ListItem key={idx}>
												<ListItemText primary={`${produto.nome} - ${produto.descricao} - Preço: ${produto.preco}`} />
											</ListItem>
										))}
									</List>
								</ListItem>
								<ListItem>
									<ListItemText primary={`Serviços Consumidos:`} />
									<List>
										{group.servicosConsumidos && group.servicosConsumidos.map((servico, idx) => (
											<ListItem key={idx}>
												<ListItemText primary={`${servico.nome} - ${servico.descricao} - Preço: ${servico.preco}`} />
											</ListItem>
										))}
									</List>
								</ListItem>
							</List>
						</AccordionDetails>
					</Accordion>
				</div>
			);
		}
	})}
	
			</div>
		);
    }
}

const ListaCliente = withTheme(ListaClienteBase);

export default ListaCliente;
