"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type View = "dashboard" | "projects" | "analytics" | "security";
type ProjectStatus = "Online" | "Em progresso" | "Planejamento";

const navItems: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "◫" },
  { id: "projects", label: "Projetos", icon: "◇" },
  { id: "analytics", label: "Análises", icon: "⌁" },
  { id: "security", label: "Segurança", icon: "⬡" },
];

const projects = [
  { name: "Portfolio PA", category: "Website", status: "Online" as ProjectStatus, progress: 100, health: 98, updated: "há 8 min" },
  { name: "Nexus Dashboard", category: "SaaS", status: "Em progresso" as ProjectStatus, progress: 76, health: 94, updated: "agora" },
  { name: "Security Lab", category: "Cybersecurity", status: "Em progresso" as ProjectStatus, progress: 48, health: 91, updated: "há 2 h" },
  { name: "Atlas API", category: "Backend", status: "Planejamento" as ProjectStatus, progress: 15, health: 86, updated: "ontem" },
];

const activity = [
  { type: "deploy", title: "Novo deploy em produção", meta: "Nexus Dashboard · main", time: "2 min" },
  { type: "security", title: "Scan de segurança concluído", meta: "Nenhuma vulnerabilidade crítica", time: "18 min" },
  { type: "project", title: "Projeto atualizado", meta: "Portfolio PA · 4 arquivos", time: "41 min" },
  { type: "member", title: "Novo acesso registrado", meta: "São Paulo, BR · Chrome", time: "1 h" },
];

const chartValues = [22, 29, 27, 42, 38, 51, 49, 63, 58, 72, 68, 84];
const chartLabels = ["Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];

function statusClass(status: ProjectStatus) {
  return status === "Online" ? "statusOnline" : status === "Em progresso" ? "statusProgress" : "statusPlan";
}

function Sparkline({ values }: { values: number[] }) {
  const width = 620;
  const height = 210;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / (max - min || 1)) * (height - 36) - 18;
    return `${x},${y}`;
  }).join(" ");

  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg className="lineChart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolução mensal de acessos em dados demonstrativos">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d73562" stopOpacity=".28" />
          <stop offset="100%" stopColor="#d73562" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((line) => (
        <line key={line} x1="0" x2={width} y1={35 + line * 48} y2={35 + line * 48} className="gridLine" />
      ))}
      <polygon points={area} fill="url(#areaGradient)" />
      <polyline points={points} className="chartLine" />
      {values.map((value, index) => {
        const [x, y] = points.split(" ")[index].split(",");
        return <circle key={index} cx={x} cy={y} r={index === values.length - 1 ? "5" : "3"} className={index === values.length - 1 ? "chartDot active" : "chartDot"} />;
      })}
    </svg>
  );
}

function MiniBars() {
  const bars = [46, 62, 52, 76, 68, 88, 73, 96, 80, 90, 74, 100];
  return (
    <div className="miniBars" aria-hidden="true">
      {bars.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [securityScanning, setSecurityScanning] = useState(false);
  const [securityScore, setSecurityScore] = useState(94);
  const notificationRef = useRef<HTMLDivElement>(null);
  const scanTimerRef = useRef<number | null>(null);

  const filteredProjects = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return projects;
    return projects.filter((project) =>
      `${project.name} ${project.category} ${project.status}`.toLowerCase().includes(normalized)
    );
  }, [search]);

  useEffect(() => {
    function closeNotifications(event: PointerEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setSidebarOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeNotifications);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeNotifications);
      document.removeEventListener("keydown", closeOnEscape);
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    };
  }, []);

  function openView(next: View) {
    setView(next);
    setSidebarOpen(false);
  }

  function runSecurityScan() {
    setSecurityScanning(true);
    if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    scanTimerRef.current = window.setTimeout(() => {
      setSecurityScore(96);
      setSecurityScanning(false);
    }, 1500);
  }

  return (
    <main className="appShell">
      <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : ""}`} aria-label="Menu do Nexus">
        <div className="brandRow">
          <div className="brandMark">N</div>
          <div>
            <strong>NEXUS</strong>
            <span>CONTROL CENTER</span>
          </div>
        </div>

        <nav className="sidebarNav" aria-label="Navegação principal">
          <span className="navLabel">WORKSPACE</span>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? "navItem active" : "navItem"}
              onClick={() => openView(item.id)}
            >
              <span className="navIcon">{item.icon}</span>
              {item.label}
              {item.id === "security" && <i className="navBadge">{securityScore}</i>}
            </button>
          ))}
        </nav>

        <div className="sidebarBottom">
          <div className="serverStatus">
            <span className="liveDot" />
            <div>
              <strong>Ambiente demonstrativo</strong>
              <small>Dados locais e simulados</small>
            </div>
          </div>

          <div className="profileCard">
            <div className="avatar">PA</div>
            <div>
              <strong>Pedro Assunção</strong>
              <small>Frontend & Security</small>
            </div>
            <button type="button" aria-label="Mais opções">•••</button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebarBackdrop" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu" />}

      <section className="workspace">
        <header className="topbar">
          <button className="mobileMenu" type="button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">☰</button>

          <div className="searchBox">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar projetos"
              aria-label="Buscar projetos"
            />
          </div>

          <div className="topbarActions">
            <div className="notificationWrap" ref={notificationRef}>
              <button
                type="button"
                className="iconButton"
                onClick={() => setNotificationsOpen((open) => !open)}
                aria-label="Notificações"
                aria-expanded={notificationsOpen}
                aria-controls="notification-panel"
              >
                ◌
                <span className="notificationDot" />
              </button>
              {notificationsOpen && (
                <div className="notificationPanel" id="notification-panel">
                  <div className="notificationHead">
                    <strong>Notificações</strong>
                    <span>3 novas</span>
                  </div>
                  <div className="notificationItem">
                    <i className="noticeAccent" />
                    <div><strong>Deploy concluído</strong><small>Evento incluído nos dados de exemplo.</small></div>
                  </div>
                  <div className="notificationItem">
                    <i className="noticeOk" />
                    <div><strong>Análise simulada</strong><small>Nenhum risco crítico nos dados de exemplo.</small></div>
                  </div>
                  <div className="notificationItem">
                    <i />
                    <div><strong>Análises</strong><small>A série de exemplo foi atualizada.</small></div>
                  </div>
                </div>
              )}
            </div>
            <button className="primaryAction" type="button" onClick={() => openView("projects")}>Ver projetos</button>
          </div>
        </header>

        <div className="pageContent">
          {view === "dashboard" && (
            <>
              <div className="pageHeading">
                <div>
                  <p className="eyebrow">VISÃO GERAL</p>
                  <h1>Painel de projetos</h1>
                  <p>Visão consolidada de métricas, andamento e eventos do ambiente de demonstração.</p>
                </div>
                <div className="dateChip">Dados demonstrativos</div>
              </div>

              <section className="metricGrid">
                <article className="metricCard">
                  <div className="metricTop"><span>Projetos ativos</span><i>◇</i></div>
                  <strong>12</strong>
                  <div className="metricFooter"><b>+3</b><span>nos últimos 30 dias</span></div>
                </article>
                <article className="metricCard">
                  <div className="metricTop"><span>Usuários</span><i>◎</i></div>
                  <strong>1.284</strong>
                  <div className="metricFooter"><b>+12,8%</b><span>vs. mês passado</span></div>
                </article>
                <article className="metricCard">
                  <div className="metricTop"><span>Performance</span><i>↗</i></div>
                  <strong>98<span>%</span></strong>
                  <div className="metricFooter"><b>+2,1%</b><span>Lighthouse médio</span></div>
                </article>
                <article className="metricCard accentCard">
                  <div className="metricTop"><span>Security score</span><i>⬡</i></div>
                  <strong>{securityScore}<span>/100</span></strong>
                  <div className="metricFooter"><b>Excelente</b><span>sem riscos críticos</span></div>
                </article>
              </section>

              <section className="dashboardGrid">
                <article className="panel trafficPanel">
                  <div className="panelHead">
                    <div>
                      <span className="panelLabel">TRÁFEGO</span>
                      <h2>Acessos mensais</h2>
                    </div>
                    <select aria-label="Período"><option>Últimos 12 meses</option><option>Últimos 6 meses</option></select>
                  </div>
                  <div className="chartSummary">
                    <strong>84.2K</strong>
                    <span><b>+14,2%</b> em relação ao período anterior</span>
                  </div>
                  <Sparkline values={chartValues} />
                  <div className="chartLabels">{chartLabels.map((label) => <span key={label}>{label}</span>)}</div>
                </article>

                <article className="panel securityPanel">
                  <div className="panelHead">
                    <div>
                      <span className="panelLabel">SEGURANÇA</span>
                      <h2>Índice de segurança</h2>
                    </div>
                    <button className="ghostButton" onClick={() => openView("security")}>Detalhes ↗</button>
                  </div>
                  <div className="scoreRing" style={{ "--score": `${securityScore * 3.6}deg` } as React.CSSProperties}>
                    <div>
                      <strong>{securityScore}</strong>
                      <span>/100</span>
                    </div>
                  </div>
                  <div className="securityChecks">
                    <div><span className="check ok">✓</span><p><strong>SSL / TLS</strong><small>Configuração válida</small></p></div>
                    <div><span className="check ok">✓</span><p><strong>Security headers</strong><small>7 de 8 ativos</small></p></div>
                    <div><span className="check warn">!</span><p><strong>Dependências</strong><small>2 atualizações sugeridas</small></p></div>
                  </div>
                </article>

                <article className="panel projectPanel">
                  <div className="panelHead">
                    <div>
                      <span className="panelLabel">PROJETOS</span>
                      <h2>Em andamento</h2>
                    </div>
                    <button className="ghostButton" onClick={() => openView("projects")}>Ver todos ↗</button>
                  </div>
                  <div className="projectRows">
                    {projects.slice(0, 3).map((project) => (
                      <div className="projectRow" key={project.name}>
                        <div className="projectInitial">{project.name.charAt(0)}</div>
                        <div className="projectName"><strong>{project.name}</strong><span>{project.category}</span></div>
                        <div className="progressCell">
                          <div><span>{project.progress}%</span></div>
                          <div className="progressTrack"><i style={{ width: `${project.progress}%` }} /></div>
                        </div>
                        <span className={`status ${statusClass(project.status)}`}>{project.status}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel activityPanel">
                  <div className="panelHead">
                    <div>
                      <span className="panelLabel">ATIVIDADE</span>
                      <h2>Eventos recentes</h2>
                    </div>
                  </div>
                  <div className="activityList">
                    {activity.map((item) => (
                      <div className="activityItem" key={item.title}>
                        <span className={`activityIcon ${item.type}`}>{item.type === "deploy" ? "↗" : item.type === "security" ? "✓" : item.type === "project" ? "◇" : "○"}</span>
                        <div><strong>{item.title}</strong><small>{item.meta}</small></div>
                        <time>{item.time}</time>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </>
          )}

          {view === "projects" && (
            <>
              <div className="pageHeading">
                <div>
                  <p className="eyebrow">PROJETOS</p>
                  <h1>Projetos</h1>
                  <p>Acompanhe progresso, status e índice de qualidade dos itens cadastrados.</p>
                </div>
                <span className="demoBadge">Dados demonstrativos</span>
              </div>

              <div className="projectToolbar">
                <div className="projectSearch"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filtrar projetos" aria-label="Filtrar projetos" /></div>
                <div className="toolbarStats"><span><b>{projects.length}</b> total</span><span><b>2</b> ativos</span><span><b>1</b> planejamento</span></div>
              </div>

              <section className="projectsTable panel">
                <div className="tableHead"><span>Projeto</span><span>Status</span><span>Progresso</span><span>Qualidade</span><span>Atualizado</span></div>
                {filteredProjects.map((project) => (
                  <div className="tableRow" key={project.name}>
                    <div className="tableProject"><span className="projectInitial">{project.name.charAt(0)}</span><div><strong>{project.name}</strong><small>{project.category}</small></div></div>
                    <span className={`status ${statusClass(project.status)}`}>{project.status}</span>
                    <div className="tableProgress"><div className="progressTrack"><i style={{ width: `${project.progress}%` }} /></div><span>{project.progress}%</span></div>
                    <strong className={project.health >= 94 ? "healthGood" : "healthNeutral"}>{project.health}</strong>
                    <span className="muted">{project.updated}</span>
                  </div>
                ))}
              </section>
            </>
          )}

          {view === "analytics" && (
            <>
              <div className="pageHeading">
                <div>
                  <p className="eyebrow">ANÁLISES</p>
                  <h1>Desempenho</h1>
                  <p>Métricas simuladas de uso, crescimento e estabilidade do produto.</p>
                </div>
                <div className="dateChip">01 Jul — 08 Ago</div>
              </div>

              <section className="metricGrid">
                <article className="metricCard"><div className="metricTop"><span>Visualizações</span><i>◫</i></div><strong>84,2 mil</strong><div className="metricFooter"><b>+14,2%</b><span>crescimento</span></div></article>
                <article className="metricCard"><div className="metricTop"><span>Sessões</span><i>◎</i></div><strong>31,8 mil</strong><div className="metricFooter"><b>+9,7%</b><span>crescimento</span></div></article>
                <article className="metricCard"><div className="metricTop"><span>Taxa de rejeição</span><i>↘</i></div><strong>21<span>%</span></strong><div className="metricFooter"><b>-4,1%</b><span>melhoria</span></div></article>
                <article className="metricCard"><div className="metricTop"><span>Tempo médio</span><i>◷</i></div><strong>4:38</strong><div className="metricFooter"><b>+32s</b><span>por sessão</span></div></article>
              </section>

              <section className="analyticsGrid">
                <article className="panel analyticsMain">
                  <div className="panelHead"><div><span className="panelLabel">CRESCIMENTO</span><h2>Tráfego do produto</h2></div></div>
                  <Sparkline values={[18, 24, 30, 27, 45, 51, 49, 61, 68, 72, 78, 91]} />
                  <div className="chartLabels">{chartLabels.map((label) => <span key={label}>{label}</span>)}</div>
                </article>
                <article className="panel sourcePanel">
                  <div className="panelHead"><div><span className="panelLabel">ORIGEM</span><h2>Canais</h2></div></div>
                  <div className="sourceList">
                    {[["Direto", 42], ["Busca orgânica", 31], ["Social", 18], ["Referências", 9]].map(([name, value]) => (
                      <div key={name as string}><div><strong>{name}</strong><span>{value}%</span></div><div className="progressTrack"><i style={{ width: `${value}%` }} /></div></div>
                    ))}
                  </div>
                  <MiniBars />
                </article>
              </section>
            </>
          )}

          {view === "security" && (
            <>
              <div className="pageHeading">
                <div>
                  <p className="eyebrow">CENTRAL DE SEGURANÇA</p>
                  <h1>Segurança</h1>
                  <p>Leitura simulada de controles web para demonstrar a interface. Nenhuma análise real é executada.</p>
                </div>
                <button className="primaryAction large" onClick={runSecurityScan} disabled={securityScanning}>
                  {securityScanning ? "Simulando análise..." : "Simular nova análise"}
                </button>
              </div>

              <section className="securityOverview">
                <article className="panel bigScore">
                  <div className="scoreRing large" style={{ "--score": `${securityScore * 3.6}deg` } as React.CSSProperties}>
                    <div><strong>{securityScore}</strong><span>/100</span></div>
                  </div>
                  <div><span className="panelLabel">ÍNDICE DE SEGURANÇA</span><h2>{securityScore >= 95 ? "Excelente" : "Muito bom"}</h2><p>Resultado calculado a partir dos dados demonstrativos desta tela.</p></div>
                </article>

                <article className="panel riskCard">
                  <span className="panelLabel">RISCOS ABERTOS</span>
                  <div className="riskNumbers"><div><strong>0</strong><span>Críticos</span></div><div><strong>1</strong><span>Médio</span></div><div><strong>2</strong><span>Baixos</span></div></div>
                </article>
              </section>

              <section className="panel checksPanel">
                <div className="panelHead"><div><span className="panelLabel">SEGURANÇA WEB</span><h2>Controles da amostra</h2></div><span className="muted">Sem varredura real</span></div>
                <div className="securityTable">
                  {[
                    ["HTTPS / TLS", "TLS 1.3 ativo", "Aprovado"],
                    ["Content-Security-Policy", "Política configurada", "Aprovado"],
                    ["Strict-Transport-Security", "max-age configurado", "Aprovado"],
                    ["X-Content-Type-Options", "nosniff", "Aprovado"],
                    ["Referrer-Policy", "strict-origin", "Aprovado"],
                    ["Permissions-Policy", "Revisão sugerida", "Atenção"],
                  ].map(([control, description, result]) => (
                    <div className="securityRow" key={control}>
                      <span className={result === "Aprovado" ? "check ok" : "check warn"}>{result === "Aprovado" ? "✓" : "!"}</span>
                      <div><strong>{control}</strong><small>{description}</small></div>
                      <span className={result === "Aprovado" ? "resultOk" : "resultWarn"}>{result}</span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
