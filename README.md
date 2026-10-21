# Renan Marques — Portfolio

Portfólio pessoal de Product / UX/UI Designer.

**Status:** Alpha / Work in Progress

## Stack

- Next.js
- TypeScript
- Framer Motion

O projeto ainda está em desenvolvimento. Os cases e a experiência completa do Renan Labz estão em preparação. O protótipo de recados existente utiliza apenas o armazenamento local do navegador.

## Executar

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Verificar e executar em produção

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Vercel

Importar o repositório usando o preset Next.js, Node.js 24.x e o diretório raiz do projeto. Build: `pnpm build`. Manter a instalação automática pela detecção do `pnpm-lock.yaml` (pnpm 10). O projeto fixa pnpm 10.34.2 e mantém o lockfile no Git. Não são necessárias variáveis de ambiente de aplicação para esta ALFA.

### Testar o Mini Renan
Em desenvolvimento, abra /?resetMiniRenan para limpar o desbloqueio e alcançar Sobre novamente. O modo destruição é temporário: Reconstruir site restaura os elementos; reload sempre encerra o jogo. Controles: A/D ou setas, Espaço para pular e X/Enter para atacar. Há controles touch.

