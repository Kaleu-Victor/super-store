import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [formData, setFormData] = useState({ name: '', address: '', payment: 'Cartão de Crédito' });
  const [lastOrderJson, setLastOrderJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('store');

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error('Erro ao carregar produtos:', err));
  }, []);

  // carrinho
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // busca e categorias
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', 'Eletrônicos', 'Calçados', 'Acessórios', 'Casa'];

  // geração do json
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const orderPayload = {
      cliente: {
        nome: formData.name,
        endereco: formData.address,
      },
      formaPagamento: formData.payment,
      itens: cart.map((item) => ({
        id: item.id,
        nome: item.name,
        categoria: item.category,
        quantidade: item.quantity,
        precoUnitario: item.price,
        subtotal: Number((item.price * item.quantity).toFixed(2))
      })),
      valorTotal: Number(totalCartPrice.toFixed(2)),
      dataPedido: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    };

    setLastOrderJson(orderPayload);
    console.log("=== JSON DO PEDIDO GERADO COM SUCESSO ===");
    console.log(JSON.stringify(orderPayload, null, 2));

    setCheckoutStep('success');
    setCart([]);
  };

  return (
    <div className="app-container">
    {/* Navbar */}
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <h2>Super Store ⚡</h2>
        </div>
        <div className="navbar-actions">
          <button 
            className={`nav-doc-btn ${currentView === 'como-fiz' ? 'active' : ''}`} 
            onClick={() => setCurrentView(currentView === 'store' ? 'como-fiz' : 'store')}
          >
            {currentView === 'store' ? '🎬 /como-fiz' : '🛍️ Voltar à Loja'}
          </button>

          {currentView === 'store' && (
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              🛒 Carrinho <span className="badge">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </button>
          )}
        </div>
      </div>
    </header>

    {currentView === 'como-fiz' ? (
      <div className="como-fiz-container">
        <div className="como-fiz-content">
          <h1>Página /como-fiz & Documentação do Projeto</h1>
          <p className="subtitle">Demonstração técnica e arquitetural da Super Store ⚡</p>

          <div className="video-section">
            <h3>Vídeo de Apresentação</h3>
            <div className="video-wrapper">
              <iframe
                className="self-hosted-video"
                src="https://www.youtube.com/embed/RSrTfDwu_zE"
                title="Como fiz minha loja"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <span className="video-tip">Nota: Apresentação técnica detalhada do projeto e auditoria Lighthouse.</span>
          </div>

          {/* Resumo Geral do que foi feito */}
          <div className="summary-section">
            <h3>Resumo Geral do Desenvolvimento</h3>
            <ul>
              <li><strong>Arquitetura Headless Commerce:</strong> O catálogo de produtos foi completamente desacoplado da interface através de um arquivo estático `products.json`, consumido via requisições assíncronas (`fetch` e `useEffect`).</li>
              <li><strong>Stack Tecnológica:</strong> Construído em React utilizando Vite para empacotamento rápido, complementado por estilização em CSS puro focada em design responsivo e efeitos modernos (Glassmorphism).</li>
              <li><strong>Gestão de Estado Complexa:</strong> Implementação de carrinho de compras interativo com controle dinâmico de quantidades, exclusão de itens, persistência de estados e cálculo automático de subtotais e totais.</li>
              <li><strong>Checkout Dinâmico e Geração de Payload JSON:</strong> O fluxo final valida os dados do cliente, monta um objeto JSON estruturado com os dados do pedido, itens, forma de pagamento e data/hora atualizada, simulando uma API real no console.</li>
              <li><strong>Performance e Otimização:</strong> Análise de desempenho executada via Lighthouse, validando métricas de carregamento, boas práticas e pontos de melhoria em acessibilidade.</li>
            </ul>
          </div>

          <button className="primary-action-btn back-store-btn" onClick={() => setCurrentView('store')}>
            Voltar para a Loja Virtual
          </button>
        </div>
      </div>
    ) : (
        <>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1>Os Melhores Produtos em um Só Lugar</h1>
              <p>Sua loja online com variedade, rapidez e qualidade garantida.</p>
              
              <div className="search-filter-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar produtos (ex: Fone, Tênis, Cafeteira...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="category-tabs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Vitrine */}
          <main className="main-content">
            <div className="catalog-header">
              <h2>Catálogo de Produtos</h2>
              <span>Exibindo {filteredProducts.length} itens</span>
            </div>

            {loading ? (
              <p className="loading-msg">Carregando catálogo...</p>
            ) : (
              <div className="product-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="card-img-container">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="card-body">
                        <span className="card-category">{product.category}</span>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="card-footer">
                          <span className="price">R$ {product.price.toFixed(2)}</span>
                          <button className="buy-btn" onClick={() => addToCart(product)}>Comprar</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-results">Nenhum produto encontrado com esses termos.</p>
                )}
              </div>
            )}
          </main>
        </>
      )}

      {/* Carrinho Lateral / Drawer */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Seu Carrinho de Compras</h3>
              <button className="close-x" onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}>&times;</button>
            </div>

            {checkoutStep === 'cart' && (
              <>
                <div className="drawer-body">
                  {cart.length === 0 ? (
                    <p className="empty-cart-text">O seu carrinho está vazio.</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="cart-row">
                        <div className="cart-row-info">
                          <h4>{item.name}</h4>
                          <span className="cart-row-price">R$ {item.price.toFixed(2)}</span>
                        </div>
                        <div className="cart-row-controls">
                          <div className="qty-controls">
                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="trash-btn">Excluir</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="drawer-footer">
                    <div className="total-row">
                      <span>Total:</span>
                      <strong>R$ {totalCartPrice.toFixed(2)}</strong>
                    </div>
                    <button className="primary-action-btn" onClick={() => setCheckoutStep('form')}>
                      Continuar para Checkout
                    </button>
                  </div>
                )}
              </>
            )}

            {checkoutStep === 'form' && (
              <form onSubmit={handleCheckoutSubmit} className="checkout-form-container">
                <div className="drawer-body">
                  <h4>Dados de Entrega e Pagamento</h4>
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Ex: Kaléu Victor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Endereço de Entrega</label>
                    <input
                      type="text"
                      placeholder="Ex: Rua Principal, 100"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Forma de Pagamento Fictícia</label>
                    <select
                      value={formData.payment}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                    >
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Boleto Bancário">Boleto Bancário</option>
                      <option value="Pix">Pix</option>
                    </select>
                  </div>
                </div>
                <div className="drawer-footer form-actions-row">
                  <button type="button" className="secondary-action-btn" onClick={() => setCheckoutStep('cart')}>Voltar</button>
                  <button type="submit" className="primary-action-btn">Finalizar Pedido</button>
                </div>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="drawer-body success-body">
                <div className="success-icon">🎉</div>
                <h3>Pedido Concluído!</h3>
                <p>Obrigado, <strong>{formData.name}</strong>!</p>
                <p>Seu pedido foi registrado via <strong>{formData.payment}</strong>.</p>
                
                {lastOrderJson && (
                  <div className="json-preview-box">
                    <span className="json-title">Payload JSON Gerado:</span>
                    <pre>{JSON.stringify(lastOrderJson, null, 2)}</pre>
                  </div>
                )}

                <button className="primary-action-btn" onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}>
                  Voltar à Loja
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rodapé */}
      <footer className="footer bg-gray-950 text-white py-12 px-6 mt-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h3 className="text-xl font-bold mb-2">Sobre o Projeto & Apresentação</h3>
          <p className="text-gray-400 text-sm mb-4 max-w-xl mx-auto">
            Desenvolvido com React, Vite e CSS, aplicando o conceito de Headless Commerce com catálogo em JSON.
          </p>
          <div className="inline-block bg-gray-900 border border-gray-700 px-6 py-3 rounded-lg">
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 border-t border-gray-900 pt-6">
          <p>&copy; 2026 Super Store - Desenvolvido por Kaléu para o Bootcamp de E-commerce.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;