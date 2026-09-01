## 🌐 Acesse o projeto

🔗 **Super Store — Acessar aplicação https://super-store-sandy.vercel.app/**

A aplicação está hospedada na **Vercel** e pode ser acessada diretamente pelo link acima.

# 🛍️ Super Store ⚡

Uma aplicação de e-commerce desenvolvida como desafio do **Bootcamp AWS AI FDE for Commerce**.

O projeto foi construído utilizando **JavaScript, React, Vite e CSS**, aplicando o conceito de **Headless Commerce**, com a separação entre a camada de dados do catálogo e a camada responsável pela interface e experiência de compra.

A aplicação simula uma loja virtual completa, permitindo pesquisar produtos, filtrar categorias, adicionar itens ao carrinho, realizar um checkout e gerar um payload JSON estruturado representando o pedido.

## 🎯 Sobre o projeto

A **Super Store** foi desenvolvida com o objetivo de aplicar na prática conceitos de desenvolvimento para e-commerce, com foco na arquitetura **Headless Commerce**.

No projeto, o catálogo de produtos é desacoplado da interface. Os produtos ficam armazenados em um arquivo `products.json` e são carregados pela aplicação React através de uma requisição assíncrona utilizando `fetch`.

Dessa forma, a camada de apresentação não mantém os dados dos produtos diretamente em seus componentes, permitindo uma separação entre **conteúdo/dados** e **interface**.

## 🧠 Headless Commerce

O projeto utiliza o conceito de **Headless Commerce** ao separar o catálogo de produtos da camada de apresentação.

```text
             Catálogo
          products.json
                │
                │ fetch()
                ▼
        ┌─────────────────┐
        │      React      │
        │   Interface UI  │
        └─────────────────┘
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
     Busca   Carrinho  Checkout
                         │
                         ▼
                  Payload JSON
```

O `products.json` funciona como fonte dos dados do catálogo, enquanto o React fica responsável por consumir esses dados e construir toda a experiência de compra.

Os produtos possuem informações como **nome, categoria, preço, descrição e imagem**, mantendo esses dados separados da lógica da interface.

No código, essa separação pode ser observada no carregamento assíncrono do catálogo através de `fetch('/products.json')`.

> **Observação:** neste desafio, o Headless Commerce foi implementado de forma simplificada utilizando um arquivo JSON como fonte do catálogo. Em uma aplicação real, essa mesma arquitetura poderia consumir uma API ou um serviço de backend.

## ✨ Funcionalidades

* 🔎 Busca de produtos por nome e descrição
* 🏷️ Filtro por categoria
* 🛒 Carrinho de compras interativo
* ➕ Controle de quantidade dos produtos
* 🗑️ Remoção de produtos
* 💰 Cálculo automático do valor total
* 📦 Fluxo de checkout
* 👤 Formulário de dados do cliente
* 💳 Seleção de forma de pagamento fictícia
* 🧾 Geração de payload JSON do pedido
* 🎉 Tela de confirmação
* 📱 Interface responsiva
* ✨ Animações e efeitos visuais
* 📺 Página `/como-fiz` com documentação e apresentação técnica

## 🎥 Página `/como-fiz`

Além da loja virtual, o projeto possui uma página dedicada chamada **`/como-fiz`**.

Essa página foi criada especialmente para apresentar o desenvolvimento do projeto e explicar as decisões técnicas tomadas durante o desafio.

### O que você encontrará na página:

* 🎬 **Vídeo de apresentação feito por mim**
* 🧠 Explicação do funcionamento do código
* 🏗️ Explicação da arquitetura utilizada
* 🛒 Demonstração do funcionamento do e-commerce
* 📦 Explicação do fluxo de checkout
* 🧾 Explicação da geração do JSON do pedido
* ☁️ Discussão dos conceitos relacionados ao desafio
* ❓ **Respostas às perguntas propostas no desafio**

Ou seja, além de explorar o código, é possível acessar o `/como-fiz` para assistir à minha apresentação completa, na qual explico **como o projeto foi construído, as decisões tomadas durante o desenvolvimento e as respostas para as questões apresentadas no desafio**.

## 🧩 Tecnologias utilizadas

* **JavaScript**
* **React**
* **Vite**
* **CSS3**

## 🛒 Fluxo de compra

O usuário pode:

1. Navegar pelo catálogo.
2. Pesquisar produtos.
3. Filtrar por categoria.
4. Adicionar produtos ao carrinho.
5. Alterar a quantidade dos itens.
6. Remover produtos.
7. Avançar para o checkout.
8. Informar os dados de entrega.
9. Escolher uma forma de pagamento fictícia.
10. Finalizar o pedido.
11. Visualizar o payload JSON gerado.

Ao finalizar o checkout, a aplicação cria um objeto estruturado contendo os dados do cliente, itens do pedido, quantidades, preços, forma de pagamento, valor total e data do pedido.

## 📊 Performance

Também foi realizada uma análise utilizando **Lighthouse**, avaliando aspectos relacionados à performance, boas práticas e acessibilidade.

Os resultados e a explicação técnica fazem parte da apresentação disponível na página `/como-fiz`.

## 🚀 Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/Kaleu-Victor/super-store.git
```

### 2. Entre na pasta

```bash
cd super-store
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Execute o projeto

```bash
npm run dev
```

O Vite fornecerá no terminal o endereço local para acessar a aplicação.

## 📌 Possíveis evoluções

Por ser um projeto desenvolvido como desafio, algumas funcionalidades poderiam ser evoluídas em uma aplicação real:

* Integração com uma API/backend
* Banco de dados
* Persistência do carrinho
* Autenticação de usuários
* Gerenciamento de estoque
* Integração com gateway de pagamento
* Painel administrativo
* Testes automatizados
* Integração com serviços AWS

---

<div align="center">

### Autor

<img src="https://github.com/Kaleu-Victor.png" width="100" style="border-radius: 50%;">

 Kaléu Victor

Desenvolvido como parte do Bootcamp AWS AI FDE for Commerce

<hr>

⭐ Desenvolvido com React, Vite, JavaScript e CSS, aplicando conceitos de **Headless Commerce** para construir uma experiência de e-commerce moderna.

</div>
