# Páginas de estudo de caso (scroll horizontal) — design

Data: 2026-11-21 · Status: aguardando aprovação do Renan

## 1. Intenção

Os cards da home levam a páginas de projeto que não existem (`/projetos/ava`, `/projetos/optimiz-ai` → 404), e o
único projeto com material real (Condomínio Waldemar) leva direto ao site no ar, sem contar nada sobre o trabalho.

O Renan quer páginas de case **focadas na interface, com pouco texto**, no formato de layout de
`karinasirqueira.com/projects/mta` (trilha horizontal de painéis em tela cheia, fundo escuro, nome do projeto fixo no
canto e um "×" para voltar), com o mínimo de história do case de `jonasmilan.cc/cases/santa-maria`: **contexto e
objetivo** em poucas linhas.

Isso atende ao `docs/PORTFOLIO_QUALITY_CONTEXT.md` (o case precisa dizer contexto, objetivo e papel), sem virar um
relatório longo.

## 2. Objetivos, não-objetivos, anti-objetivos

**Objetivos**
- Um modelo de página de case reutilizável, com o Waldemar como primeiro (e por ora único) case publicado.
- Sensação de "a rodinha move a trilha para o lado" no desktop.
- Pouco texto: título-gancho, etiquetas, contexto, objetivo, papel e no máximo uma ou duas frases grandes entre as
  imagens. O resto é interface.
- Fim da trilha que converte: "Ver site", voltar aos projetos e "Vamos conversar".
- Português e inglês, como o resto do site.
- Nenhum link quebrado na home.

**Não-objetivos (agora)**
- Cases de AVA e Optimiz.ai: não há material. Os cards ficam "Em breve", sem link, até existir.
- Seção "Resultado"/"Impacto": não há dados. Não entra.
- CMS ou conteúdo dinâmico.

**Anti-objetivos (falha mesmo que funcione)**
- Inventar métricas, clientes, depoimentos ou fatos sobre o Waldemar.
- Sequestrar a rodinha do mouse (body `overflow: hidden` + captura de `wheel`) quebrando teclado, barra de rolagem,
  trackpad ou o Lenis.
- Adicionar dependências novas (Framer Motion e Lenis já resolvem).
- Mexer no visual de seções já aprovadas da home além do necessário nos cards.

## 3. Restrições

- Next.js 16 com mudanças em relação ao conhecido: ler `node_modules/next/dist/docs/` (rotas dinâmicas, `params`,
  `generateStaticParams`, metadata) antes de escrever código. Rodar `pnpm install --frozen-lockfile` primeiro.
- Rotas por idioma seguem o padrão existente: pt-BR na raiz em `app/(pt)/…`, inglês em `app/(en)/en/…`; textos em
  `i18n/dictionaries/pt-BR.ts` e `en.ts` (mesmas chaves); estrutura (imagens, links) em `config/`.
- `SmoothScroll` (Lenis) está ativo em todas as páginas e respeita `prefers-reduced-motion`.
- Acessibilidade conta (critério da V1).
- Sem framework de testes no projeto; verificação = `pnpm lint`, `pnpm typecheck`, `pnpm build` + capturas com
  Playwright (desktop 1440×900 e celular 390×844).

## 4. Abordagens consideradas

| | Abordagem | Trade-off |
|---|---|---|
| **A (escolhida)** | **Scroll vertical nativo move uma trilha presa (sticky) para o lado.** Uma seção alta (altura = largura da trilha), com um container `position: sticky` de 100dvh; `useScroll` + `useTransform` do Framer Motion convertem o progresso vertical em `translateX`. | Mesma sensação da referência; mantém barra de rolagem, teclado, trackpad, Lenis e links por âncora. Exige medir a largura da trilha (ResizeObserver). |
| B | Sequestrar a rodinha, como a Karina faz. | Idêntico à referência, mas quebra teclado/scrollbar/trackpad, briga com o Lenis e piora acessibilidade. |
| C | Faixa com `overflow-x` nativo + scroll-snap. | Ótima no toque, mas no desktop a rodinha vertical não move nada sem JS, recaindo nos problemas do B. |

O Renan escolheu **A**.

## 5. Decisões

### Decididas pelo Renan
- Formato de layout da Karina; conteúdo mínimo do Jonas (contexto + objetivo).
- Abordagem A.
- Waldemar como primeiro case. Papel: design e desenvolvimento, feito só por ele.
- Texto do case (abaixo), escrito a partir de fatos do site e do objetivo que ele contou ("criar um contexto para as
  pessoas conhecerem o condomínio").

### Chamadas minhas (o Renan pode corrigir)
- **Celular (< 768px) e `prefers-reduced-motion`:** sem trilha horizontal; os mesmos painéis em coluna vertical. O
  Renan não se opôs ao propor isso.
- **Ano "2026"** tirado do rodapé do site do Waldemar; **público "quem ainda não conhece"** do objetivo. Não
  confirmados explicitamente.
- **Rotas:** `/projetos/waldemar` (pt-BR) e `/en/projects/waldemar` (en).
- **Cards da home:** Waldemar passa a abrir o case (link interno, cursor "Ver projeto"); AVA e Optimiz viram
  `soon: true` sem link, como o card 04.
- **Visual:** fundo escuro do painel de projetos (`#171a18`, texto `#eceee8`), tipografia do site (`--type-display`,
  `--type-body`, `--type-accent`). Coerente com a seção Projetos da home.
- **Cabeçalho do case:** barra mínima fixa, no lugar do Header do site: nome do projeto à esquerda e "×" à direita
  (link para `/#projetos`, ou `/en#projetos`), com rótulo acessível "Voltar aos projetos". Ao lado do "×", o
  seletor de idioma existente (`LanguageSelector`) em versão compacta, levando ao mesmo case no outro idioma; a página
  monta o `I18nProvider` com a rota do case. Sem Footer do site e sem Mini Renan na página.
- **Indicador de progresso:** linha fina na base da tela no desktop, acompanhando o progresso da trilha.
- **Imagens:** capturas reais do site no ar, feitas com Playwright, salvas em `public/cases/waldemar/` como `.webp`.

### Conteúdo do case Waldemar

pt-BR (aprovado em conversa):

- **Título-gancho:** Uma pequena cidade dentro da cidade — e um lugar para ser conhecida.
- **Etiquetas:** Website · UI Design · Desenvolvimento · Rio Grande, RS · 2026
- **Contexto:** O Parque Residencial Waldemar Pereira Duarte faz parte de Rio Grande desde 1991. Moradia, comércio,
  ginásio, áreas abertas e espaços infantis convivem ali há mais de três décadas, quase como um bairro próprio.
- **Objetivo:** Criar um site que apresente o condomínio para quem ainda não o conhece: mostrar a rotina, a estrutura e
  como chegar, com a mesma sensação de comunidade de quem vive lá.
- **Meu papel:** Design e desenvolvimento: organização do conteúdo, interface, front-end e publicação.
- **Frase grande:** Diferentes partes da rotina acontecem por aqui.

en: tradução fiel do texto acima, sem acrescentar fatos. O Renan revisa no fim.

### Sequência de painéis do Waldemar

1. **Abertura:** título-gancho (h1) + etiquetas.
2. **Sobre:** Contexto, Objetivo, Meu papel (rótulos pequenos, 2–3 linhas cada).
3. **Hero do site:** captura de tela cheia da primeira dobra (desktop), grande.
4. **Frase grande.**
5. **História e números:** captura da seção "Sobre" + faixa 1991 / 30+ / Av. Itália / Rio Grande.
6. **Rotina e estrutura:** captura dos cards de rotina e da galeria de espaços.
7. **Mobile:** 3 capturas de celular lado a lado (hero, rotina, galeria).
8. **Fim:** "Ver site ↗" (nova aba), "Voltar aos projetos", "Vamos conversar" (WhatsApp, como o Contato).

Painéis de imagem ocupam a altura útil da tela; a largura de cada um vem da proporção da imagem. Painéis de texto
têm largura fixa confortável de leitura.

## 6. Estrutura técnica (direção, não plano)

- `config/cases.ts`: lista de cases com slug, link do site, e a sequência de painéis (tipo + imagem + proporção).
  Textos ficam no dicionário (`cases.waldemar…` e rótulos compartilhados como "Contexto", "Objetivo", "Meu papel").
- `i18n/config.ts`: rotas dos cases entram em `ROUTES` (o seletor de idioma, o sitemap e os `alternates` já usam
  esse mapa); ajustar `pageMetadata` para títulos/descrições de case.
- `components/Pages/CasePage.tsx` + `components/CaseTrack/` (trilha, painéis, barra do topo, progresso).
- Páginas em `app/(pt)/projetos/…` e `app/(en)/en/projects/…`; imagens de compartilhamento seguindo o padrão
  `opengraph-image.tsx` existente.
- Atualizar `config/projects.ts`, `ProjectVisual` (link interno) e o comentário de `config/projects.ts`.
- HTML na ordem de leitura; um h1; imagens com `alt` descritivo; foco visível; a trilha não pode prender o foco.
  Quando um elemento focado (ex.: link do fim) estiver fora da tela, o scroll vertical deve trazê-lo (rolar até a
  posição correspondente).

## 7. Deixado para quem construir

- Detalhes de espaçamento, tamanhos de tipo e proporções exatas dos painéis, dentro do visual descrito.
- Se a rota usa segmento dinâmico com `generateStaticParams` ou pastas estáticas por case.
- Quais trechos exatos do site capturar em cada painel, desde que cubram as seções listadas.
- Easing/suavização da trilha (respeitando reduced motion).

## 8. Critério de pronto

- `/projetos/waldemar` e `/en/projects/waldemar` funcionam no desktop (trilha horizontal) e no celular (vertical).
- Teclado, barra de rolagem e trackpad funcionam; nada quebra com reduced motion.
- Cards da home: nenhum leva a 404; Waldemar abre o case.
- Sitemap, metadata, hreflang e imagem de compartilhamento do case existem.
- `pnpm lint`, `pnpm typecheck` e `pnpm build` passam; capturas desktop e celular conferidas.
- Nenhum texto do case afirma algo além do aprovado aqui.
