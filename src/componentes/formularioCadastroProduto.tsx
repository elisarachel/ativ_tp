import React, { useState } from "react";
import { TextField, Button, Grid, useMediaQuery, useTheme } from "@mui/material";

interface Produto {
    nome: string;
    descricao: string;
    preco: number;
}

interface Props {
    tema: string;
    onCadastroProduto: (produto: Produto) => void;
}

const FormularioCadastroProduto: React.FC<Props> = ({ tema, onCadastroProduto }) => {
    const [formData, setFormData] = useState<Produto>({
        nome: "",
        descricao: "",
        preco: 0,
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Check if all required fields are filled
        const { nome, descricao, preco } = formData;
        if (!nome || !descricao || preco <= 0) {
            // If any of the required fields are empty or preço is less than or equal to 0,
            // display an error message and prevent form submission
            alert("Todos os campos são obrigatórios e o preço deve ser maior que 0.");
            return;
        }

        // All required fields are filled, proceed with form submission
        onCadastroProduto(formData);

        // Reset form data
        setFormData({
            nome: "",
            descricao: "",
            preco: 0,
        });
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Ensure that only numbers are allowed in the price field
        const value = event.target.value.replace(/\D/g, '');
        setFormData((prevData) => ({
            ...prevData,
            preco: parseInt(value) || 0, // Convert value to integer or default to 0 if not a valid number
        }));
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="nome"
                                label="Nome do Produto"
                                variant="outlined"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required // Make field required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="descricao"
                                label="Descrição"
                                variant="outlined"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                required // Make field required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="preco"
                                label="Preço"
                                variant="outlined"
                                name="preco"
                                type="text" // Change type to "text" to allow for custom input validation
                                value={formData.preco}
                                onChange={handlePriceChange} // Use custom handler for price change
                                required // Make field required
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
};

export default FormularioCadastroProduto;
