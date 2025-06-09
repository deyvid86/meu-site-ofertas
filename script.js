// Utiliza LocalStorage para salvar ofertas
const form = document.getElementById("form-oferta");
const ofertasDiv = document.getElementById("ofertas");

function salvarOfertas(ofertas) {
  localStorage.setItem("ofertas", JSON.stringify(ofertas));
}

function carregarOfertas() {
  const data = localStorage.getItem("ofertas");
  return data ? JSON.parse(data) : [];
}

function criarQR(texto) {
  const qr = document.createElement("div");
  new QRCode(qr, {
    text: texto,
    width: 100,
    height: 100
  });
  return qr;
}

function renderizarOfertas() {
  ofertasDiv.innerHTML = "";
  const ofertas = carregarOfertas();
  ofertas.forEach((oferta, index) => {
    const div = document.createElement("div");
    div.className = "oferta";
    div.innerHTML = `
      <h3>${oferta.produto}</h3>
      <p><strong>R$ ${oferta.preco}</strong></p>
      ${oferta.descricao ? `<p>${oferta.descricao}</p>` : ""}
      ${oferta.imagem ? `<img src="${oferta.imagem}" alt="Imagem">` : ""}
      <button onclick="removerOferta(${index})">Remover</button>
    `;
    const qr = criarQR(`${oferta.produto} - R$${oferta.preco}`);
    qr.classList.add("qr");
    div.appendChild(qr);
    ofertasDiv.appendChild(div);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const produto = document.getElementById("produto").value;
  const preco = document.getElementById("preco").value;
  const descricao = document.getElementById("descricao").value;
  const imagem = document.getElementById("imagem").value;

  const novaOferta = { produto, preco, descricao, imagem };
  const ofertas = carregarOfertas();
  ofertas.push(novaOferta);
  salvarOfertas(ofertas);
  renderizarOfertas();
  form.reset();
});

function removerOferta(index) {
  const ofertas = carregarOfertas();
  ofertas.splice(index, 1);
  salvarOfertas(ofertas);
  renderizarOfertas();
}

function exportarJSON() {
  const dataStr = JSON.stringify(carregarOfertas(), null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ofertas.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importarJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const ofertas = JSON.parse(e.target.result);
      salvarOfertas(ofertas);
      renderizarOfertas();
    } catch (err) {
      alert("Erro ao importar arquivo JSON");
    }
  };
  reader.readAsText(file);
}

renderizarOfertas();
