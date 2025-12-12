# 🍔 Lancheria Delícia - Site Completo

Site 100% front-end para lancheria, otimizado para mobile e pronto para GitHub Pages.

## 🎨 Paleta de Cores (Paleta C)

- **Coral**: `#FF5F57` - Botões principais
- **Tomate**: `#E63D2E` - Botões secundários e hovers
- **Dourado**: `#FFC247` - Preços e destaques
- **Branco Quente**: `#FFFDF8` - Fundo geral

## ✨ Características

- ✅ Design mobile-first e responsivo
- ✅ Cardápio dinâmico organizado por categorias
- ✅ Sistema de carrinho interativo tipo drawer (gaveta)
- ✅ Integração direta com WhatsApp
- ✅ Controles de quantidade estilo iFood
- ✅ Psicologia das cores para aumentar apetite
- ✅ Animações suaves e transições
- ✅ 100% JavaScript puro (sem frameworks)
- ✅ Pronto para GitHub Pages

## 📁 Estrutura do Projeto

```
Template-Lancheria/
├── index.html          # Página principal
├── style.css           # Estilos com paleta de cores
├── app.js              # Lógica JavaScript
├── produtos.json       # Cardápio (produtos)
├── img/                # Imagens dos produtos
└── README.md           # Este arquivo
```

## 🚀 Como Usar

### 1. Adicionar Imagens dos Produtos

Coloque as imagens dos produtos na pasta `img/` com os seguintes nomes:
- `xburger.jpg`
- `xbacon.jpg`
- `xsalada.jpg`
- `xtudo.jpg`
- `xfrango.jpg`
- `hotdog.jpg`
- `coca.jpg`
- `guarana.jpg`
- `suco.jpg`
- `agua.jpg`
- `batata.jpg`
- `nuggets.jpg`
- `onion.jpg`
- `sundae.jpg`
- `milkshake.jpg`

**Formato recomendado**: Imagens quadradas (1:1), mínimo 300x300px, formato JPG ou PNG.

### 2. Configurar Número do WhatsApp

Abra o arquivo `app.js` e edite a linha 16:

```javascript
const WHATSAPP_NUMBER = '5555996283243'; // Substitua pelo seu número
```

**Formato**: Código do país + DDD + número (sem espaços, hífens ou parênteses)
- Exemplo Brasil: `5511999998888`

### 3. Personalizar Produtos

Edite o arquivo `produtos.json` para adicionar, remover ou modificar produtos:

```json
[
  {
    "id": 1,
    "nome": "Nome do Produto",
    "descricao": "Descrição detalhada",
    "preco": 19.90,
    "imagem": "img/nome-imagem.jpg",
    "categoria": "Lanches"
  }
]
```

**Categorias disponíveis**: Lanches, Bebidas, Porções, Sobremesas

### 4. Testar Localmente

Abra o arquivo `index.html` diretamente no navegador ou use um servidor local:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

### 5. Publicar no GitHub Pages

1. Faça commit dos arquivos no GitHub
2. Vá em **Settings** → **Pages**
3. Selecione a branch `main` e pasta `/ (root)`
4. Clique em **Save**
5. Aguarde alguns minutos e acesse: `https://seu-usuario.github.io/seu-repositorio`

## 🎯 Funcionalidades

### Cardápio Dinâmico
- Produtos organizados por categoria com emojis
- Cards com imagens grandes (formato 1:1)
- Nome, descrição e preço destacado

### Carrinho Interativo
- Drawer que sobe do rodapé (mobile) ou lateral (desktop)
- Controles de quantidade estilo iFood (− quantidade +)
- Cálculo automático do total
- Formulário para nome, endereço e observações

### Integração WhatsApp
- Mensagem formatada automaticamente
- Inclui todos os itens do pedido
- Dados do cliente (nome, endereço, observações)
- Link direto para WhatsApp Web/App

### Exemplo de Mensagem Gerada:

```
*Pedido:*

• X-Burger (2x) - R$ 37,80
• Coca-Cola 350ml (1x) - R$ 5,00

*Total: R$ 42,80*

*Nome:* João Silva
*Endereço:* Rua das Flores, 123 - Centro
*Observações:* Sem cebola no hambúrguer
```

## 🎨 Princípios de Design Aplicados

### Neuromarketing e Psicologia das Cores
- **Coral/Tomate**: Estimulam fome e urgência
- **Dourado**: Cria percepção de valor premium
- **Branco Quente**: Transmite limpeza e qualidade artesanal

### UX (Experiência do Usuário)
- Mobile-first (otimizado para celular)
- Botões grandes e de fácil toque
- Espaçamento generoso entre elementos
- Feedback visual em todas as ações
- Animações suaves e não invasivas

### Mere Exposure Effect
- Imagens grandes dos produtos aumentam o desejo
- Layout tipo "feed" facilita navegação
- Categorias bem separadas reduzem sobrecarga cognitiva

## 📱 Responsividade

### Mobile (< 768px)
- Grid de produtos: 2 colunas
- Drawer abre de baixo para cima
- Texto e botões otimizados para toque

### Desktop (≥ 769px)
- Grid de produtos: 3-4 colunas
- Drawer abre pela lateral direita
- Layout mais espaçoso

## 🔧 Tecnologias

- HTML5
- CSS3 (Grid, Flexbox, Animações)
- JavaScript ES6+ (Fetch API, Async/Await)
- WhatsApp Business API (link `wa.me`)

## 📝 Customização Avançada

### Mudar Logo
Edite a linha no `index.html`:
```html
<div class="logo">🍔 Lancheria Delícia</div>
```

### Adicionar Novas Categorias
1. Adicione produtos com nova categoria no `produtos.json`
2. Adicione emoji no `app.js` linha 10:
```javascript
categoryEmojis: {
    'Lanches': '🍔',
    'Bebidas': '🥤',
    'NovaCategoria': '🆕'
}
```

### Alterar Cores
Edite o `style.css` substituindo os códigos hex:
- `#FF5F57` (Coral)
- `#E63D2E` (Tomate)
- `#FFC247` (Dourado)
- `#FFFDF8` (Branco Quente)

## 🐛 Solução de Problemas

### Imagens não aparecem
- Verifique se os arquivos estão na pasta `img/`
- Confirme que os nomes no JSON correspondem aos arquivos
- Sistema de fallback mostra placeholder automaticamente

### WhatsApp não abre
- Verifique o número no formato correto (sem espaços ou caracteres especiais)
- Teste o número diretamente: `https://wa.me/SEU_NUMERO`

### Produtos não carregam
- Verifique se o `produtos.json` tem sintaxe válida
- Abra o Console do navegador (F12) para ver erros
- Teste o JSON em: https://jsonlint.com/

## 📄 Licença

Este projeto é de uso livre. Sinta-se à vontade para modificar e usar em seus projetos.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Abra uma issue ou envie um pull request.

---

**Desenvolvido com ❤️ e 🍔**