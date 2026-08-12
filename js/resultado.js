// ================================
// ESTATÍSTICAS
// ================================

const acertos = Number(localStorage.getItem("acertos")) || 0;
const erros = Number(localStorage.getItem("erros")) || 0;
const resultado = Number(localStorage.getItem("resultado")) || 0;

document.getElementById("acertos").textContent = acertos;
document.getElementById("erros").textContent = erros;
document.getElementById("resultado").textContent = resultado + "%";

// ================================
// CABEÇALHO
// ================================

const titulo = document.querySelector(".result-header h1");
const texto = document.querySelector(".result-header p");
const icone = document.querySelector(".result-icon");

if (resultado >= 70) {

    titulo.textContent = "Aprovado!";
    texto.textContent = "Parabéns! Você atingiu a nota mínima.";

    icone.classList.remove("failed");
    icone.classList.add("approved");

} else {

    titulo.textContent = "Reprovado";
    texto.textContent = "Você não atingiu a nota mínima.";

    icone.classList.remove("approved");
    icone.classList.add("failed");

}

// ================================
// REVISÃO DAS QUESTÕES
// ================================

const detalhes = JSON.parse(localStorage.getItem("detalhes")) || [];

const revisao = document.getElementById("revisao");

revisao.innerHTML = "";

detalhes.forEach((item, index) => {

    revisao.innerHTML += `

    <article class="question ${item.acertou ? "success" : "error"}">

        <header>

            <i class="fa-solid ${item.acertou ? "fa-circle-check" : "fa-circle-xmark"}"></i>

            <h3>Questão ${index + 1}</h3>

        </header>

        <ul>

            <li>
                Sua resposta:
                <strong>${item.resposta ? item.resposta.toUpperCase() : "-"}</strong>
            </li>

            <li class="correct">
                Resposta correta:
                <strong>${item.correta.toUpperCase()}</strong>
            </li>

        </ul>

    </article>

    `;

});