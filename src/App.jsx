import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'form', 'success'
  const [formData, setFormData] = useState({ name: '', address: '', payment: 'Cartão de Crédito' });
  const [lastOrderJson, setLastOrderJson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error('Erro ao carregar produtos:', err));
  }, []);

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', 'Eletrônicos', 'Calçados', 'Acessórios', 'Casa'];

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Criação do objeto JSON estruturado da compra
    // Criação do objeto JSON estruturado da compra
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
      // Data e hora formatadas para o padrão do Brasil (ex: "25/08/2026, 20:16:00")
      dataPedido: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    };

    // Salva o JSON no estado e imprime no console para debug/simulação de API
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
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              🛒 Carrinho <span className="badge">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </button>
          </div>
        </div>
      </header>

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
                
                {/* Exibição visual do JSON do pedido gerado */}
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
      <footer className="footer">
        <p>&copy; 2026 Super Store - Desenvolvido por Kaléu para o Bootcamp de E-commerce.</p>
        <a href="#como-fiz" className="como-fiz-link">Acessar página /como-fiz (Vídeo do projeto)</a>
      </footer>
    </div>
  );
}

export default App;