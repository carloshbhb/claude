# vetor.blog — Static Site Generator

Blog de afiliados com geração estática de páginas de review a partir de JSONs.

## Estrutura

```
vetor-blog/
├── build.js          ← Gerador: lê os JSONs e cria os HTMLs
├── template.html     ← Template mestre com placeholders {{VAR}}
├── style.css         ← CSS completo (tokens, componentes, responsive)
├── topbar.js         ← Navbar + alert bar (document.write)
├── main.js           ← JS compartilhado (TOC ativo, FAQ accordion)
├── data/             ← Um JSON por produto/review
│   ├── fit3.json
│   ├── mi-band-8.json
│   └── apple-watch-se.json
└── pages/            ← HTMLs gerados (não commitar, ou commitar para GitHub Pages)
    ├── samsung-galaxy-fit3-vale-a-pena.html
    ├── xiaomi-mi-band-8-vale-a-pena.html
    └── apple-watch-se-vale-a-pena.html
```

## Como usar

### 1. Gerar as páginas

```bash
node build.js
```

### 2. Adicionar um novo review

Crie um arquivo em `data/novo-produto.json` seguindo a estrutura dos exemplos,
depois rode `node build.js` novamente.

### 3. Deploy no GitHub Pages

```bash
# Opção A: commitar a pasta pages/
git add pages/
git commit -m "build: gera páginas"
git push

# Opção B: usar GitHub Actions (ver abaixo)
```

## GitHub Actions — Deploy automático

Crie `.github/workflows/build.yml`:

```yaml
name: Build & Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: node build.js
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./pages
```

> **Atenção:** O `topbar.js`, `main.js` e `style.css` precisam estar na raiz do seu domínio.
> No GitHub Pages, coloque-os fora de `/pages` ou ajuste os caminhos no template.

## Campos JSON obrigatórios

| Campo | Descrição |
|-------|-----------|
| `PAGE_SLUG` | Nome do arquivo HTML gerado |
| `TITLE` / `META_DESCRIPTION` | SEO básico |
| `AFFILIATE_URL` | Link de afiliado (Mercado Livre, Amazon etc.) |
| `PRODUCT_PRICE` / `OLD_PRICE` / `NEW_PRICE` | Preços para exibição |
| `SECTIONS` | Array de seções do artigo (ID, TITLE, CONTENT HTML) |
| `COMPARE_TABLE` | Tabela comparativa (null para omitir) |
| `PROS` / `CONS` | Arrays de strings |
| `FAQS` | Array de {QUESTION, ANSWER} |
| `REVIEWS` | Array de avaliações de usuários |
| `TOC` | Sumário lateral {ID, LABEL} |

## Licença

MIT — use, modifique e redistribua à vontade.
