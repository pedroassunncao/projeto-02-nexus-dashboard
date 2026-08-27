# Nexus Dashboard — Projeto 02

Interface SaaS demonstrativa criada para o portfólio de Pedro Assunção. O projeto concentra projetos, métricas, eventos e controles de segurança em um painel responsivo.

[Demonstração](https://projeto-02-nexus-dashboard.vercel.app/)

## O que pode ser explorado

- navegação entre visão geral, projetos, análises e segurança;
- busca e filtragem de projetos;
- painel de notificações com fechamento por clique externo ou tecla Escape;
- gráficos em SVG e CSS, sem biblioteca de visualização externa;
- tabela responsiva, indicadores de progresso e estados de status;
- simulação explícita de uma análise de segurança;
- navegação para telas menores por menu lateral.

## Dados demonstrativos

Todos os projetos, números, eventos e percentuais são fictícios. O botão de análise altera apenas o estado local da interface; ele não inspeciona sites, servidores ou dependências.

## Tecnologias

- Next.js 16 e React 19;
- TypeScript;
- CSS;
- SVG acessível para os gráficos.

## Executar localmente

Requer Node.js 20.9 ou mais recente.

~~~bash
npm install
npm run dev
~~~

Acesse http://localhost:3000.

Para definir a URL usada nos metadados, copie .env.example para .env.local e ajuste NEXT_PUBLIC_SITE_URL.

## Verificação

~~~bash
npm run check
npm run build
~~~

## Estrutura

~~~text
app/
  globals.css   # sistema visual e responsividade
  layout.tsx    # metadados
  page.tsx      # dados, estados e telas do dashboard
public/
  og.png        # imagem de compartilhamento
next.config.ts  # configuração e headers HTTP
~~~
