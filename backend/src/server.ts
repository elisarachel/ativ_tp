import express from 'express';
import bodyParser from 'body-parser';
import prisma from './prismaClient';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Fetch all clients with related products and services
app.get('/api/clientes', async (req, res) => {
    try {
        const clients = await prisma.cliente.findMany({
            include: {
                produtosConsumidos: {
                    include: {
                        produto: true
                    }
                },
                servicosConsumidos: {
                    include: {
                        servico: true
                    }
                }
            }
        });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});


// Fetch all products
app.get('/api/produtos', async (req, res) => {
	try {
		const products = await prisma.produto.findMany();
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch products' });
	}
});

// Fetch all services
app.get('/api/servicos', async (req, res) => {
	try {
		const services = await prisma.servico.findMany();
		res.status(200).json(services);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch services' });
	}
});

// Create a new client
app.post('/api/clients', async (req, res) => {
    const { nome, sobrenome, telefone, email, genero, produtosConsumidos, servicosConsumidos } = req.body;

    try {
        const client = await prisma.cliente.create({
            data: {
                nome,
                sobrenome,
                telefone,
                email,
                genero,
                produtosConsumidos: {
                    create: produtosConsumidos.map((produto: { id: number }) => ({
                        produto: { connect: { id: produto.id } }
                    }))
                },
                servicosConsumidos: {
                    create: servicosConsumidos.map((servico: { id: number }) => ({
                        servico: { connect: { id: servico.id } }
                    }))
                }
            }
        });

        console.log('Created Client:', client);
        res.status(201).json(client);
    } catch (error) {
        console.error('Failed to add client:', error);
        res.status(500).json({ error: 'Failed to add client' });
    }
});

// Create a new product
app.post('/api/products', async (req, res) => {
	const { id, nome, descricao, preco } = req.body;
	try {
		const product = await prisma.produto.create({
			data: {
				nome,
				descricao,
				preco
			}
		});
		res.status(201).json(product);
	} catch (error: unknown) {
		// Type assertion for error
		if (error instanceof Error) {
			console.error('Error creating product:', error.message);
			res.status(500).json({ error: 'Failed to add product', details: error.message });
		} else {
			console.error('Unexpected error', error);
			res.status(500).json({ error: 'Unexpected error' });
		}
	}
});

// Create a new service
app.post('/api/services', async (req, res) => {
	const { id, nome, descricao, preco } = req.body;
	try {
		const service = await prisma.servico.create({
			data: {
				nome,
				descricao,
				preco
			}
		});
		res.status(201).json(service);
	} catch (error) {
		res.status(500).json({ error: 'Failed to add service' });
	}
});

// Update a client
app.put('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, telefone, email, genero, produtosConsumidos, servicosConsumidos } = req.body;
    
    console.log('Received data:', req.body); // Log the received data

    try {
        const client = await prisma.cliente.update({
            where: { id: parseInt(id) },
            data: {
                nome,
                sobrenome,
                telefone,
                email,
                genero,
                produtosConsumidos: {
                    deleteMany: {}, // Clear existing relations
                    create: produtosConsumidos.map((produto: { produtoId: number; }) => ({
                        produto: { connect: { id: produto.produtoId } }
                    }))
                },
                servicosConsumidos: {
                    deleteMany: {}, // Clear existing relations
                    create: servicosConsumidos.map((servico: { servicoId: number; }) => ({
                        servico: { connect: { id: servico.servicoId } }
                    }))
                }
            }
        });
        res.status(200).json(client);
    } catch (error) {
        console.error('Failed to update client:', error);
        res.status(500).json({ error: 'Failed to update client' });
    }
});



// Update a product
app.put('/api/produtos/:id', async (req, res) => {
	const { id } = req.params;
	const { nome, descricao, preco } = req.body;
	try {
		const product = await prisma.produto.update({
			where: { id: parseInt(id) },
			data: {
				nome,
				descricao,
				preco: parseInt(preco)
			}
		});
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update product' });
	}
});

// Update a service
app.put('/api/servicos/:id', async (req, res) => {
	const { id } = req.params;
	const { nome, descricao, preco } = req.body;
	try {
		const service = await prisma.servico.update({
			where: { id: parseInt(id) },
			data: {
				nome,
				descricao,
				preco: parseInt(preco)
			}
		});
		res.status(200).json(service);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update service' });
	}
});

// Delete a client
app.delete('/api/clientes/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.cliente.delete({
			where: { id: parseInt(id) }
		});
		res.status(200).json({ message: 'Client deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete client' });
	}
});

// Delete a product
app.delete('/api/produtos/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.produto.delete({
			where: { id: parseInt(id) }
		});
		res.status(200).json({ message: 'Product deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete product' });
	}
});

// Delete a service
app.delete('/api/servicos/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.servico.delete({
			where: { id: parseInt(id) }
		});
		res.status(200).json({ message: 'Service deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete service' });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
