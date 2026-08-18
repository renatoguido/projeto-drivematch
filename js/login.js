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

/* ==========================================
   HEADER TOGGLE - MENU OCULTO POR PADRÃO
========================================== */

document.addEventListener('DOMContentLoaded', function () {

    const header = document.querySelector('.header');
    const headerToggle = document.getElementById('header-toggle');

    if (!header || !headerToggle) {
        console.warn('Header ou botão toggle não encontrados.');
        return;
    }

    // 🔥 Inicia com o menu oculto
    header.classList.add('oculto');

    const icon = headerToggle.querySelector('i');
    const texto = headerToggle.querySelector('span');

    // Atualiza o texto do botão para "Mostrar menu"
    if (icon) icon.className = 'fa-solid fa-chevron-down';
    if (texto) texto.textContent = 'Mostrar menu';

    // Evento de toggle
    headerToggle.addEventListener('click', function () {
        const oculto = header.classList.toggle('oculto');

        if (oculto) {
            if (icon) icon.className = 'fa-solid fa-chevron-down';
            if (texto) texto.textContent = 'Mostrar menu';
        } else {
            if (icon) icon.className = 'fa-solid fa-chevron-up';
            if (texto) texto.textContent = 'Ocultar menu';
        }
    });

});

/* ==========================================
   ACESSIBILIDADE - PAINEL
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('acc-toggle');
    const closeBtn = document.getElementById('acc-close');
    const panel = document.getElementById('acc-panel');

    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('acc-hidden');
            const isHidden = panel.classList.contains('acc-hidden');
            panel.setAttribute('aria-hidden', isHidden);
        });
    }

    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.classList.add('acc-hidden');
            panel.setAttribute('aria-hidden', 'true');
        });
    }
});

/* ==========================================
   ACESSIBILIDADE - FUNÇÕES
========================================== */

let fontSizeRatio = 100;

function updateUI() {
    const body = document.body;
    const html = document.documentElement;

    const btnPlus = document.getElementById('btn-font-plus');
    const btnMinus = document.getElementById('btn-font-minus');
    if (btnPlus) btnPlus.classList.toggle('is-active', fontSizeRatio > 100);
    if (btnMinus) btnMinus.classList.toggle('is-active', fontSizeRatio < 100);

    toggleCardState('btn-spacing', body.classList.contains('acc-wide-spacing'));
    toggleCardState('btn-line-height', body.classList.contains('acc-tall-line'));
    toggleCardState('btn-contrast', body.classList.contains('acc-contrast'));
    toggleCardState('btn-monochrome', html.classList.contains('acc-monochrome'));
    toggleCardState('btn-hide-images', body.classList.contains('acc-hide-images'));

    const isAnyActive = fontSizeRatio !== 100 || html.classList.contains('acc-monochrome') || [
        'acc-wide-spacing', 'acc-tall-line', 'acc-contrast', 'acc-hide-images'
    ].some(cls => body.classList.contains(cls));

    body.classList.toggle('accessibility-active', isAnyActive);
}

function toggleCardState(id, isActive) {
    const card = document.getElementById(id);
    if (card) {
        card.classList.toggle('is-active', isActive);
    }
}

function changeFontSize(direction) {
    fontSizeRatio += direction * 10;
    if (fontSizeRatio < 80) fontSizeRatio = 80;
    if (fontSizeRatio > 140) fontSizeRatio = 140;
    document.documentElement.style.fontSize = `${fontSizeRatio}%`;
    updateUI();
}

function toggleWideSpacing() {
    document.body.classList.toggle('acc-wide-spacing');
    updateUI();
}

function toggleLineHeight() {
    document.body.classList.toggle('acc-tall-line');
    updateUI();
}

function toggleHighContrast() {
    document.body.classList.toggle('acc-contrast');
    updateUI();
}

function toggleMonochrome() {
    document.documentElement.classList.toggle('acc-monochrome');
    updateUI();
}

function toggleHideImages() {
    document.body.classList.toggle('acc-hide-images');
    updateUI();
}

function resetAccessibility() {
    fontSizeRatio = 100;
    document.documentElement.style.fontSize = '100%';
    document.documentElement.classList.remove('acc-monochrome');
    document.body.classList.remove(
        'acc-contrast',
        'acc-wide-spacing',
        'acc-tall-line',
        'acc-hide-images',
        'accessibility-active'
    );
    updateUI();
}