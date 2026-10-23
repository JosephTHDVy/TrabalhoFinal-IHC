const KEY = "hauntiary";
const $ = (s) => document.querySelector(s);

const PADRAO = {
  ativo: null,
  bestiarios: [{
    id: "b1", nome: "Bestiário 1",
    criaturas: [{ id: "c1", nome: "Criatura de exemplo", resumo: "Resumo curto da criatura.", descricao: "Descrição completa da criatura.", img: "" }]
  }]
};

function novoId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function carregar() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && Array.isArray(d.bestiarios)) return d;
  } catch {}
  return structuredClone(PADRAO);
}

function atualizar(fn) {
  const d = carregar();
  fn(d);
  try { localStorage.setItem(KEY, JSON.stringify(d)); return true; }
  catch { aviso("Não foi possível salvar (armazenamento cheio). Tente uma imagem menor."); return false; }
}

function bestiarioAtivo() {
  const d = carregar();
  return d.bestiarios.find((b) => b.id === d.ativo) || null;
}

// Páginas que dependem de um bestiário selecionado
function exigirBestiario() {
  const b = bestiarioAtivo();
  if (!b) { location.replace("index.html"); throw new Error("Nenhum bestiário selecionado"); }
  return b;
}

function aviso(msg) {
  let a = $("#aviso");
  if (!a) { a = document.createElement("div"); a.id = "aviso"; a.setAttribute("role", "status"); document.body.append(a); }
  a.textContent = msg; a.hidden = false;
  setTimeout(() => (a.hidden = true), 2500);
}

// Mensagem que sobrevive à troca de página
function irComAviso(url, msg) {
  try { sessionStorage.setItem("flash", msg); } catch {}
  location.href = url;
}
try {
  const f = sessionStorage.getItem("flash");
  if (f) { sessionStorage.removeItem("flash"); aviso(f); }
} catch {}

// Barra superior: busca e criatura aleatória
const busca = $("#busca");
if (busca) busca.addEventListener("submit", (e) => {
  e.preventDefault();
  location.href = "lista.html?q=" + encodeURIComponent($("#busca-input").value.trim());
});

const aleatoria = $("#btn-aleatoria");
if (aleatoria) aleatoria.addEventListener("click", () => {
  const b = bestiarioAtivo();
  if (!b || !b.criaturas.length) return aviso("Este bestiário ainda não tem criaturas.");
  const c = b.criaturas[Math.floor(Math.random() * b.criaturas.length)];
  location.href = "detalhe.html?id=" + encodeURIComponent(c.id);
});
