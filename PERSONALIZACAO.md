# 🎨 Guia de Personalização Rápida

Este guia mostra os principais pontos de personalização do site.

## 1️⃣ Nome da Lancheria

**Arquivo:** `index.html` (linha 9)

```html
<div class="logo">🍔 Lancheria Delícia</div>
```

Altere "Lancheria Delícia" para o nome do seu estabelecimento.

## 2️⃣ Número do WhatsApp

**Arquivo:** `app.js` (linha 16)

```javascript
const WHATSAPP_NUMBER = '5511999998888';
```

Substitua pelo seu número no formato: **código país + DDD + número**
- Exemplo: `5511999998888`
- Sem espaços, hífens ou parênteses

## 3️⃣ Produtos e Preços

**Arquivo:** `produtos.json`

```json
{
  "id": 1,
  "nome": "X-Burger",
  "descricao": "Hambúrguer artesanal, queijo...",
  "preco": 18.90,
  "imagem": "img/xburger.jpg",
  "categoria": "Lanches"
}
```

- **nome**: Nome do produto
- **descricao**: Descrição detalhada (ingredientes)
- **preco**: Preço (use ponto, não vírgula)
- **imagem**: Caminho da foto
- **categoria**: Lanches, Bebidas, Porções ou Sobremesas

## 4️⃣ Cores do Site

**Arquivo:** `style.css`

Procure e substitua estas cores em todo o arquivo:

- `#FF5F57` → Coral (botões principais)
- `#E63D2E` → Tomate (hovers)
- `#FFC247` → Dourado (preços)
- `#FFFDF8` → Branco Quente (fundo)

## 5️⃣ Adicionar Nova Categoria

### Passo 1: Adicionar emoji (app.js - linha 10)

```javascript
categoryEmojis: {
    'Lanches': '🍔',
    'Bebidas': '🥤',
    'Porções': '🍟',
    'Sobremesas': '🍨',
    'Pizza': '🍕'  // Nova categoria
}
```

### Passo 2: Adicionar produtos (produtos.json)

```json
{
  "id": 16,
  "nome": "Pizza Margherita",
  "descricao": "Molho de tomate, mussarela e manjericão",
  "preco": 35.00,
  "imagem": "img/pizza.jpg",
  "categoria": "Pizza"
}
```

## 6️⃣ Favicon (Ícone do Site)

Crie um ícone 32x32 ou 64x64 pixels e salve como `favicon.png` na raiz.

Adicione no `<head>` do `index.html`:

```html
<link rel="icon" type="image/png" href="favicon.png">
```

## 7️⃣ SEO - Melhorar no Google

Edite o `<head>` do `index.html`:

```html
<title>Lancheria Delícia - Os Melhores Lanches de [Sua Cidade]</title>
<meta name="description" content="Lanches artesanais, delivery rápido em [Sua Cidade]. Peça agora pelo WhatsApp!">
```

## 8️⃣ Redes Sociais

Adicione ícones no rodapé do `index.html`:

```html
<div class="social-links">
    <a href="https://instagram.com/seuperfil">📷 Instagram</a>
    <a href="https://facebook.com/suapagina">👍 Facebook</a>
</div>
```

E estilize no `style.css`:

```css
.social-links {
    text-align: center;
    padding: 20px;
}

.social-links a {
    margin: 0 10px;
    color: #FF5F57;
    text-decoration: none;
    font-weight: 600;
}
```

## 9️⃣ Horário de Funcionamento

Adicione no final do `index.html` (antes do `</body>`):

```html
<footer style="text-align: center; padding: 30px 20px; background: #fff; margin-top: 50px;">
    <p style="color: #666; margin-bottom: 10px;">
        🕒 Funcionamento: Ter-Dom, 18h às 23h
    </p>
    <p style="color: #999; font-size: 14px;">
        © 2024 Lancheria Delícia - Todos os direitos reservados
    </p>
</footer>
```

## 🔟 Taxa de Entrega

Adicione campo no formulário (`index.html`):

```html
<div class="form-group">
    <label for="customer-neighborhood">Bairro:</label>
    <input type="text" id="customer-neighborhood" placeholder="Seu bairro">
</div>
```

E modifique a mensagem do WhatsApp no `app.js`:

```javascript
const neighborhood = document.getElementById('customer-neighborhood').value.trim();
message += `*Bairro:* ${neighborhood}\n`;
```

## 🎯 Dicas Extras

### Aumentar conversões:
1. Use fotos reais e de alta qualidade
2. Destaque combos e promoções
3. Adicione avaliações de clientes
4. Mostre tempo estimado de entrega
5. Ofereça desconto na primeira compra

### Performance:
1. Comprima as imagens antes de adicionar
2. Use formato WebP quando possível
3. Mantenha o `produtos.json` organizado
4. Teste em diferentes dispositivos

---

**Precisa de ajuda?** Abra uma issue no GitHub ou consulte o README principal.
