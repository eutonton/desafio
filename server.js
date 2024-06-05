const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const path = require('path');

const app = express();
const PORT = 3001; // Porta em que o servidor irá rodar

const AMAZON_URL = 'https://www.amazon.com/s?k=';

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint de raspagem
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).json({ error: 'Por favor, forneça uma palavra-chave' });
    }

    try {
        // Construir a URL de busca da Amazon
        const url = `${AMAZON_URL}${encodeURIComponent(keyword)}`;
        
        // Fazer a requisição HTTP para a URL de busca da Amazon
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        // Obter o HTML da resposta
        const html = response.data;
        
        // Usar JSDOM para analisar o HTML
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const products = [];
        
        // Selecionar todos os itens de produto na página
        const items = document.querySelectorAll('.s-main-slot .s-result-item');

        items.forEach(item => {
            // Extrair detalhes do produto
            const titleElement = item.querySelector('h2 a span');
            const ratingElement = item.querySelector('.a-icon-alt');
            const reviewsElement = item.querySelector('.a-size-base');
            const imageElement = item.querySelector('.s-image');

            if (titleElement && ratingElement && reviewsElement && imageElement) {
                const title = titleElement.textContent;
                const rating = ratingElement.textContent;
                const reviews = reviewsElement.textContent;
                const imageUrl = imageElement.src;

                // Adicionar os detalhes do produto ao array de produtos
                products.push({
                    title,
                    rating,
                    reviews,
                    imageUrl
                });
            }
        });

        // Retornar os produtos extraídos como JSON
        res.json({ products });
    } catch (error) {
        console.error('Erro ao buscar dados da Amazon:', error);
        res.status(500).json({ error: 'Erro ao buscar dados da Amazon' });
    }
});

// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
