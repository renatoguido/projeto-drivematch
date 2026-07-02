function validarCampo(input, valido) {

    const check = input.parentElement.querySelector(".ok");

    if (!check) return;

    if (valido) {
        check.classList.add("show");
    } else {
        check.classList.remove("show");
    }

}
/*NOME*/
const nome = document.getElementById("nome");

nome.addEventListener("input", () => {

    validarCampo(nome, nome.value.trim().length >= 5);

});

// ======================================
// MOSTRAR / OCULTAR SENHA
// ======================================
const senha = document.getElementById("senha");
const mostrarSenha = document.getElementById("mostrarSenha");

mostrarSenha.addEventListener("click", () => {

    if (senha.type === "password") {

        senha.type = "text";
        mostrarSenha.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        senha.type = "password";
        mostrarSenha.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

// ======================================
// FORÇA DA SENHA
// ======================================

const barras = document.querySelectorAll(".forca span");
const nivel = document.getElementById("nivelSenha");

senha.addEventListener("input", () => {

    const valor = senha.value;

    barras.forEach(barra => barra.classList.remove("active"));

    let pontos = 0;

    if (valor.length >= 6) pontos++;
    if (/[A-Z]/.test(valor)) pontos++;
    if (/[0-9]/.test(valor)) pontos++;
    if (/[^A-Za-z0-9]/.test(valor)) pontos++;

    for (let i = 0; i < pontos; i++) {

        barras[i].classList.add("active");

    }

    switch (pontos) {

        case 0:
        case 1:
            nivel.textContent = "Senha fraca";
            break;

        case 2:
            nivel.textContent = "Senha média";
            break;

        case 3:
            nivel.textContent = "Senha boa";
            break;

        case 4:
            nivel.textContent = "Senha forte";
            break;

    }
    validarCampo(senha, pontos >= 3);

});

// ======================================
// DATA DE NASCIMENTO
// ======================================

const data = document.getElementById("dataNascimento");

data.addEventListener("change", () => {

    if (!data.value) {
        validarCampo(data, false);
        data.setCustomValidity("Informe sua data de nascimento.");
        return;
    }

    const nascimento = new Date(data.value);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    if (idade >= 18) {
        validarCampo(data, true);
        data.setCustomValidity("");
    } else {
        validarCampo(data, false);
        data.setCustomValidity("É necessário ter pelo menos 18 anos.");
    }

});

// ======================================
// CATEGORIAS
// ======================================

const categorias = document.querySelectorAll(".categorias button");

categorias.forEach(botao => {

    botao.addEventListener("click", () => {

        categorias.forEach(c => c.classList.remove("ativo"));

        botao.classList.add("ativo");

    });

});

// ======================================
// DIAS
// ======================================

const dias = document.querySelectorAll(".dias button");

dias.forEach(dia => {

    dia.addEventListener("click", () => {

        dia.classList.toggle("active");

    });

});

// ======================================
// MÁSCARA CPF
// ======================================

document.getElementById("cpf").addEventListener("input", e => {

    let v = e.target.value.replace(/\D/g, "");

    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = v;
    validarCampo(e.target, v.length === 14);

});

// ======================================
// TELEFONE
// ======================================

document.getElementById("telefone").addEventListener("input", e => {

    let v = e.target.value.replace(/\D/g, "");

    v = v.replace(/^(\d{2})(\d)/, "($1) $2");

    v = v.replace(/(\d)(\d{4})$/, "$1-$2");

    e.target.value = v;
    validarCampo(e.target, v.replace(/\D/g, "").length === 11);

});
// ======================================
// EMAIL
// ======================================

const email = document.getElementById("email");

email.addEventListener("input", () => {

    validarCampo(email, email.checkValidity());

});
// ======================================
// CEP
// ======================================

const cep = document.getElementById("cep");

cep.addEventListener("input", e => {

    let v = e.target.value.replace(/\D/g, "");

    v = v.replace(/(\d{5})(\d)/, "$1-$2");

    e.target.value = v;

});

// ======================================
// VIA CEP
// ======================================

cep.addEventListener("blur", () => {

    const valor = cep.value.replace(/\D/g, "");

    if (valor.length != 8) return;

    fetch(`https://viacep.com.br/ws/${valor}/json/`)

        .then(res => res.json())

        .then(dados => {

            if (dados.erro) return;

            document.getElementById("cidade").value =
                dados.localidade;

            document.getElementById("bairro").value =
                dados.bairro;

        });

});

// ======================================
// VALOR
// ======================================

document.getElementById("valor").addEventListener("input", e => {

    let valor = e.target.value.replace(/\D/g, "");

    valor = (valor / 100).toFixed(2);

    valor = valor.replace(".", ",");

    e.target.value = valor;

});

// ======================================
// MODAL
// ======================================

const botao = document.getElementById("criarConta");

const overlay = document.getElementById("overlay");

const fechar = document.getElementById("fecharModal");

botao.addEventListener("click", () => {

    const obrigatorios = document.querySelectorAll("input");

    let ok = true;

    obrigatorios.forEach(input => {

        if (input.value.trim() == "") {

            input.style.borderColor = "#ff4b4b";

            ok = false;

        } else {

            input.style.borderColor = "#00d26a";

        }

    });

    if (ok) {

        overlay.classList.add("active");

    }

});

fechar.addEventListener("click", () => {

    overlay.classList.remove("active");

});

// Fecha clicando fora

overlay.addEventListener("click", (e) => {

    if (e.target === overlay) {

        overlay.classList.remove("active");

    }

});

// Fecha com ESC

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        overlay.classList.remove("active");

    }

});