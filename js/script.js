// EDITA ESTA LISTA PARA ADICIONAR OS TEUS TRABALHOS.
// Coloca os ficheiros na pasta "assets" e indica o caminho em "files".
const projects = [
  {
    id: 1,
    title: "Implementação de um Somador de 1 Bit",
    description: "Projeto e implementação de um somador de 1 bit utilizando portas lógicas, com análise de funcionamento e testes de simulação.",
    category: "Lógica Digital",
    tags: ["Lógica Digital", "Verilog", "Simulação"],
    symbol: "∑",
    image: "",
    details: "Neste trabalho são exploradas as operações lógicas necessárias para somar dois bits e um carry de entrada. Adiciona aqui os teus objetivos, metodologia, resultados e conclusões.",
    files: [
      // { name: "Relatório PDF", url: "assets/relatorio-somador.pdf" },
      // { name: "Código Verilog", url: "assets/somador.v" }
    ]
  },
  {
    id: 2,
    title: "Processador RISC-V (Pipeline)",
    description: "Desenvolvimento de um processador RISC-V com pipeline de 5 estágios, incluindo controlo de hazards e forwarding.",
    category: "Processadores",
    tags: ["RISC-V", "Pipeline", "Verilog"],
    symbol: "CPU",
    image: "",
    details: "Apresenta aqui a arquitetura do processador, os estágios implementados, as instruções suportadas e os testes efetuados.",
    files: []
  },
  {
    id: 3,
    title: "Análise da Hierarquia de Memória",
    description: "Estudo comparativo entre os diferentes níveis de memória, com análise de tempos de acesso, capacidade e impacto no desempenho.",
    category: "Memória",
    tags: ["Memória", "Desempenho", "Análise"],
    symbol: "▤",
    image: "",
    details: "Acrescenta os dados recolhidos, tabelas comparativas e as conclusões sobre cache, RAM e armazenamento secundário.",
    files: []
  }
];

const grid = document.getElementById("projectGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const emptyState = document.getElementById("emptyState");
const dialog = document.getElementById("projectDialog");
const dialogContent = document.getElementById("dialogContent");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[c]);
}

function populateCategories() {
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function renderProjects() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = projects.filter(p => {
    const searchable = [p.title, p.description, p.category, ...(p.tags || [])].join(" ").toLowerCase();
    return searchable.includes(term) && (category === "all" || p.category === category);
  });

  grid.innerHTML = filtered.map(p => `
    <article class="project-card">
      <div class="project-art">
        ${p.image ? `<img src="${escapeHTML(p.image)}" alt="Imagem do projeto ${escapeHTML(p.title)}">` : `<span class="art-symbol">${escapeHTML(p.symbol || "⌘")}</span>`}
      </div>
      <div class="project-body">
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.description)}</p>
        <div class="tags">${(p.tags || []).map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
        <button class="details-button" data-project="${p.id}">Ver detalhes &nbsp; →</button>
      </div>
    </article>`).join("");

  emptyState.hidden = filtered.length !== 0;
}

function openProject(id) {
  const p = projects.find(project => project.id === Number(id));
  if (!p) return;
  const links = (p.files || []).map(file =>
    `<a class="file-link" href="${escapeHTML(file.url)}" target="_blank" rel="noopener">${escapeHTML(file.name)} ↗</a>`
  ).join("");
  dialogContent.innerHTML = `
    <p class="eyebrow">${escapeHTML(p.category || "TRABALHO DE AC")}</p>
    <h2>${escapeHTML(p.title)}</h2>
    <div class="dialog-art">${p.image ? `<img src="${escapeHTML(p.image)}" alt="" style="max-width:100%;max-height:100%;object-fit:contain">` : `<span class="art-symbol">${escapeHTML(p.symbol || "⌘")}</span>`}</div>
    <div class="dialog-content"><p>${escapeHTML(p.description)}</p><p>${escapeHTML(p.details || "")}</p>
    ${links ? `<h3>Ficheiros do trabalho</h3><div class="file-links">${links}</div>` : `<p class="admin-note">Ainda não foram adicionados ficheiros a este trabalho.</p>`}</div>`;
  dialog.showModal();
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-project]");
  if (button) openProject(button.dataset.project);
});
searchInput.addEventListener("input", renderProjects);
categoryFilter.addEventListener("change", renderProjects);
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("ac-theme", document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem("ac-theme") === "light") document.body.classList.add("light");
document.getElementById("year").textContent = new Date().getFullYear();

populateCategories();
renderProjects();
