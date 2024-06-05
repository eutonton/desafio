function search() {
    // Obter a palavra-chave do campo de entrada
    const keyword = document.getElementById('keyword').value;
    if (!keyword) {
        alert('Por favor, insira uma palavra-chave');
        return;
    }

    // Fazer uma chamada AJAX para o endpoint de raspagem
    fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            // Verificar se há produtos no resultado
            if (data.products && data.products.length > 0) {
                data.products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');

                    // Adicionar detalhes do produto ao elemento
                    productDiv.innerHTML = `
                        <img src="${product.imageUrl}" alt="${product.title}">
                        <div class="product-details">
                            <h3>${product.title}</h3>
                            <p>Rating: ${product.rating}</p>
                            <p>Reviews: ${product.reviews}</p>
                        </div>
                    `;

                    // Adicionar o produto ao container de resultados
                    resultsDiv.appendChild(productDiv);
                });
            } else {
                resultsDiv.innerHTML = '<p>Nenhum produto encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao buscar os dados. Por favor, tente novamente.');
        });
}
