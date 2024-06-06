import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, MenuItem, Select, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { SelectChangeEvent } from '@mui/material';
import React from "react";

export interface Produto {
	id: number;
    nome: string;
    descricao: string;
    preco: number;
}

interface Props {
    produtos: Produto[];
    produtosConsumidosPorGenero: { genero: string; produtos: Produto[] }[];
}

const ListaProdutos: React.FC<Props> = ({ produtos, produtosConsumidosPorGenero }) => {
    const theme = useTheme();
    const [filterOption, setFilterOption] = useState('');
    const [selectedGender, setSelectedGender] = useState<string>('');
	const [editProduto, setEditProduto] = useState<Produto | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
	const [productList, setProductList] = useState<Produto[]>(produtos);

	useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/produtos');
            const data = await response.json();
            setProductList(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setFilterOption(value);
        if (value !== 'listarPorGenero') {
            setSelectedGender('');
        }
    };

    const handleGenderFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setSelectedGender(value);
    };

	const filterProductsByGender = (genero: string) => {
        const item = produtosConsumidosPorGenero.find(item => item.genero === genero);
        if (item) {
            const productCounts: { [key: string]: number } = {};
            item.produtos.forEach((produto) => {
                productCounts[produto.nome] = (productCounts[produto.nome] || 0) + 1;
            });

            const sortedProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);

            return sortedProducts
                .map((productName) => productList.find((produto) => produto.nome === productName))
                .filter((produto) => produto !== undefined) as Produto[];
        }
        return [];
    };

    const filterProducts = () => {
        switch (filterOption) {
            case 'mostConsumed':
                return calculaProdutosMaisConsumidos();
            case 'listarPorGenero':
                return filterProductsByGender(selectedGender);
            default:
                return productList;
        }
    };

	const calculaProdutosMaisConsumidos = () => {
        const productCounts: { [key: string]: number } = {};
        produtosConsumidosPorGenero.forEach(({ produtos }) => {
            produtos.forEach((produto) => {
                productCounts[produto.nome] = (productCounts[produto.nome] || 0) + 1;
            });
        });

        const sortedProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);

        return sortedProducts
		.map((productName) => productList.find((produto) => produto.nome === productName))
        .filter((produto) => produto !== undefined) as Produto[];
    };

	const handleEditProduto = (id: number, updatedData: Produto) => {
        fetch(`http://localhost:5000/api/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Produto updated:', data);
                setOpenEditDialog(false);
                setProductList((prevProducts) =>
                    prevProducts.map((produto) =>
                        produto.id === id ? data : produto
                    )
                );
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDeleteProduto = (id: number) => {
        fetch(`http://localhost:5000/api/produtos/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Produto deleted:', data);
                setProductList((prevProducts) =>
                    prevProducts.filter((produto) => produto.id !== id)
                );
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEditButtonClick = (produto: Produto) => {
        setEditProduto(produto);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setEditProduto(null);
    };

	const handleEditDialogSave = () => {
        if (editProduto) {
            handleEditProduto(editProduto.id, editProduto);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editProduto) {
            setEditProduto({ ...editProduto, [e.target.name]: e.target.value });
        }
    };

    const filteredProducts = filterProducts();

    const genders = ["Masculino", "Feminino", "Não-binário", "Outros"];

    return (
        <div style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }}>
            <Typography variant="h2" style={{ fontFamily: theme.typography.fontFamily, marginLeft: theme.spacing(2), marginRight: theme.spacing(2), color: '#515151' }}>Lista de Produtos</Typography>
            <FormControl variant="outlined" style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2), marginRight: theme.spacing(2), marginBottom: theme.spacing(2), minWidth: 200 }}>
                <InputLabel id="filter-select-label">Filtrar</InputLabel>
                <Select
                    labelId="filter-select-label"
                    id="filter-select"
                    value={filterOption}
                    onChange={handleFilterChange}
                    label="Filtrar"
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="mostConsumed">Mais Consumidos</MenuItem>
                    <MenuItem value="listarPorGenero">Por Gênero</MenuItem>
                </Select>
            </FormControl>
            {filterOption === 'listarPorGenero' && (
                <FormControl variant="outlined" style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2), marginRight: theme.spacing(2), minWidth: 200 }}>
                    <InputLabel id="gender-filter-select-label">Filtrar por Gênero</InputLabel>
                    <Select
                        labelId="gender-filter-select-label"
                        id="gender-filter-select"
                        value={selectedGender}
                        onChange={handleGenderFilterChange}
                        label="Filtrar por Gênero"
                    >
                        {genders.map((gender, index) => (
                            <MenuItem key={index} value={gender}>{gender}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {filteredProducts.map((produto: Produto, index: number) => (
                <Accordion key={index} className={theme.palette.primary.main}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <Typography>{produto.nome}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            <ListItem>
                                <ListItemText primary={`Descrição: ${produto.descricao}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Preço: ${produto.preco}`} />
                            </ListItem>
                            <ListItem>
                                <Button variant="contained" color="primary" onClick={() => handleEditButtonClick(produto)} style={{ marginRight: '8px' }}>Editar</Button>
                                <Button variant="contained" color="secondary" onClick={() => handleDeleteProduto(produto.id)}>Deletar</Button>
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                <DialogTitle>Editar Produto</DialogTitle>
                <DialogContent>
                    {editProduto && (
                        <div>
                            <TextField
                                margin="dense"
                                label="Nome"
                                type="text"
                                fullWidth
                                name="nome"
                                value={editProduto.nome}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                label="Descrição"
                                type="text"
                                fullWidth
                                name="descricao"
                                value={editProduto.descricao}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                label="Preço"
                                type="number"
                                fullWidth
                                name="preco"
                                value={editProduto.preco}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">Cancelar</Button>
                    <Button onClick={handleEditDialogSave} color="primary">Salvar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ListaProdutos;
