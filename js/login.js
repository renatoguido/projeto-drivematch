/* ==========================================
   SCRIPT TELA DE LOGIN
========================================== */

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const modal = document.getElementById("modal");
const fechar = document.getElementById("fechar");
const togglePassword = document.getElementById("togglePassword");

/* ==========================================
   LOGIN
========================================== */

form.addEventListener("submit", function (e) {

    e.preventDefault();

    let valid = true;

    // ===============================
    // EMAIL
    // ===============================

    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {

        email.classList.add("error");
        document.getElementById("emailError").classList.add("show");

        valid = false;

    } else {

        email.classList.remove("error");
        document.getElementById("emailError").classList.remove("show");

    }

    // ===============================
    // SENHA
    // ===============================

    if (password.value.length < 6) {

        password.classList.add("error");
        document.getElementById("passwordError").classList.add("show");

        valid = false;

    } else {

        password.classList.remove("error");
        document.getElementById("passwordError").classList.remove("show");

    }

    // ===============================
    // LOGIN SIMULADO
    // ===============================

    if (valid) {

        loginBtn.disabled = true;

        loginBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Autenticando...';

        setTimeout(() => {

            loginBtn.innerHTML =
                '<i class="fa-solid fa-check"></i> Login realizado';

            modal.classList.add("active");

            // Aguarda 2 segundos e redireciona
            setTimeout(() => {

                window.location.href = "../dashboard/dashboard.html";

            }, 2000);

        }, 1800);

    }

});

/* ==========================================
   MOSTRAR / OCULTAR SENHA
========================================== */

togglePassword.addEventListener("click", function () {

    const icon = this.querySelector("i");

    if (password.type === "password") {

        password.type = "text";
        icon.className = "fa-solid fa-eye-slash";

    } else {

        password.type = "password";
        icon.className = "fa-solid fa-eye";

    }

});

/* ==========================================
   BOTÃO CONTINUAR
========================================== */

fechar.addEventListener("click", () => {

    window.location.href = "dashboard/dashboard.html";

});

/* ==========================================
   FECHAR MODAL CLICANDO FORA
========================================== */

modal.addEventListener("click", function (e) {

    if (e.target === modal) {

        modal.classList.remove("active");

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Entrar";

    }

});

/* ==========================================
   FECHAR MODAL COM ESC
========================================== */

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        modal.classList.remove("active");

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Entrar";

    }

});