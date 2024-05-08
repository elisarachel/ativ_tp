import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BarraNavegacao from "../componentes/barraNavegacao";
import FormularioCadastroCliente from "../componentes/formularioCadastroCliente";
import FormularioCadastroProduto from "../componentes/formularioCadastroProduto";
import FormularioCadastroServico from "../componentes/formularioCadastroServico";
import ListaCliente from "../pages/listaCliente";
import ListaProdutos from "../pages/listaProdutos";
import ListaServicos from "../pages/listaServicos";

type Cliente = {
    nome: string;
    sobrenome: string;
    telefone: string;
    email: string;
    genero: string;
	produtosConsumidos: Produto[];
	servicosConsumidos: Servico[];
};

type Produto = {
    nome: string;
    descricao: string;
    preco: number;
};

type Servico = {
    nome: string;
    descricao: string;
    preco: number;
};

type Botao = {
    nome: string;
    link?: string;
    dropdown?: Botao[];
};

type Props = {};

const theme = createTheme({
    palette: {
        primary: {
            main: '#c0adea',
        },
        secondary: {
            main: '#ff4081',
        },
		text: {
			primary: '#515151'
		}
    },
    typography: {
        fontFamily: 'Space Grotesk, sans-serif',
        h2: {
            fontSize: '2rem',
            fontWeight: 'bold',
        },
    },
});

export default function Roteador(props: Props) {
    const [tela, setTela] = useState<string>('Clientes');
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);

    const selecionarView = (novaTela: string) => {
        setTela(novaTela);
    };

    const handleCadastroCliente = (cliente: Cliente) => {
        setClientes([...clientes, cliente]);
    };

	const handleCadastroProduto = (produto: Produto) => {
        setProdutos([...produtos, produto]);
    };

	const handleCadastroServico = (servico: Servico) => {
        setServicos([...servicos, servico]);
    };

	const calculateProdutosConsumidosPorGenero = () => {
        const produtosConsumidosPorGenero: { genero: string; produtos: Produto[] }[] = [];
        const produtosConsumidosMap: { [key: string]: Produto[] } = {};

        clientes.forEach((cliente) => {
            const { genero, produtosConsumidos } = cliente;

            if (!produtosConsumidosMap[genero]) {
                produtosConsumidosMap[genero] = [];
            }

            produtosConsumidosMap[genero].push(...produtosConsumidos);
        });

        for (const genero in produtosConsumidosMap) {
            produtosConsumidosPorGenero.push({
                genero,
                produtos: produtosConsumidosMap[genero]
            });
        }

		return produtosConsumidosPorGenero;
	};

	const calculateServicosConsumidosPorGenero = () => {
		const servicosConsumidosPorGenero: { genero: string; servicos: Servico[] }[] = [];
		const servicosConsumidosMap: { [key: string]: Servico[] } = {};
	
		clientes.forEach((cliente) => {
			const { genero, servicosConsumidos } = cliente;
	
			if (!servicosConsumidosMap[genero]) {
				servicosConsumidosMap[genero] = [];
			}
	
			servicosConsumidosMap[genero].push(...servicosConsumidos);
		});
	
		for (const genero in servicosConsumidosMap) {
			servicosConsumidosPorGenero.push({
				genero,
				servicos: servicosConsumidosMap[genero]
			});
		}
	
		return servicosConsumidosPorGenero;
	};

	const botoes: Botao[] = [
		{
			nome: 'Cadastros',
			dropdown: [
				{ nome: 'Clientes', link: '/cadastros/cliente' },
				{ nome: 'Produtos', link: '/cadastros/produto' },
				{ nome: 'Serviços', link: '/cadastros/servico' }
			]
		},
		{ nome: 'Clientes', link: '/clientes' },
		{ nome: 'Produtos', link: '/produtos' },
		{ nome: 'Serviços', link: '/servicos' }
	];

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<BarraNavegacao
					seletorView={(valor: string) => selecionarView(valor)}
					tema="purple lighten-4"
					botoes={botoes}
				/>
				<Routes>
					<Route path="/" element={<Navigate to="/clientes" />} />
					<Route path="/clientes" element={<ListaCliente clientes={clientes} />} />
					<Route path="/cadastros/cliente" element={<FormularioCadastroCliente
						tema="purple lighten-4"
						onCadastroCliente={handleCadastroCliente}
						produtosOptions={produtos}
						servicosOptions={servicos}
					/>} />
					<Route path="/cadastros/produto" element={<FormularioCadastroProduto tema="purple lighten-4" onCadastroProduto={handleCadastroProduto} />} />
					<Route path="/cadastros/servico" element={<FormularioCadastroServico tema="purple lighten-4" onCadastroServico={handleCadastroServico} />} />
					<Route path="/produtos" element={<ListaProdutos produtos={produtos} produtosConsumidosPorGenero={calculateProdutosConsumidosPorGenero()} />} />
					<Route path="/servicos" element={<ListaServicos servicos={servicos} servicosConsumidosPorGenero={calculateServicosConsumidosPorGenero()} />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}
