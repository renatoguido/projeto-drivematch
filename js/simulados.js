const cards = document.querySelectorAll(".card");

function mostrarTodos() {

    cards.forEach(card => {

        card.style.display = "flex";

    });

}

function filtrarDificuldade(nivel) {

    if (nivel === "todas") {

        mostrarTodos();

        return;

    }

    cards.forEach(card => {

        if (card.dataset.dificuldade === nivel) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

}

function filtrarTema(tema) {

    if (tema === "todos") {

        mostrarTodos();

        return;

    }

    cards.forEach(card => {

        if (card.dataset.tema === tema) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

}