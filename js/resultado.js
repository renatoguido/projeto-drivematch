/* =========================================
   RESULTADO DO SIMULADO
========================================= */

const acertosElemento = document.getElementById("acertos");
const errosElemento = document.getElementById("erros");
const resultadoElemento = document.getElementById("resultado");
const revisaoElemento = document.getElementById("revisao");


/* =========================================
   IDENTIFICAR O SIMULADO
========================================= */

const parametros = new URLSearchParams(
    window.location.search
);

let simulado = parametros.get("simulado");


/*
    Caso a URL não tenha ?simulado=...
    tentamos recuperar do localStorage.
*/

if (!simulado) {

    simulado =
        localStorage.getItem("simuladoAtual");

}


/*
    Se ainda não existir, usamos legislação
    como padrão.
*/

if (!simulado) {

    simulado = "legislacao";

}


/* =========================================
   CHAVES DO LOCALSTORAGE
========================================= */

const chaveAcertos =
    `${simulado}_acertos`;

const chaveErros =
    `${simulado}_erros`;

const chaveResultado =
    `${simulado}_resultado`;

const chaveDetalhes =
    `${simulado}_detalhes`;


/* =========================================
   RECUPERAR RESULTADO
========================================= */

const acertos =
    Number(
        localStorage.getItem(chaveAcertos)
    ) || 0;

const erros =
    Number(
        localStorage.getItem(chaveErros)
    ) || 0;

const resultado =
    Number(
        localStorage.getItem(chaveResultado)
    ) || 0;


/* =========================================
   MOSTRAR ESTATÍSTICAS
========================================= */

acertosElemento.textContent =
    acertos;

errosElemento.textContent =
    erros;

resultadoElemento.textContent =
    `${resultado}%`;


/* =========================================
   STATUS DO RESULTADO
========================================= */

const resultHeader =
    document.querySelector(".result-header");

const resultIcon =
    document.querySelector(".result-icon");

const titulo =
    resultHeader.querySelector("h1");

const descricao =
    resultHeader.querySelector("p");


if (resultado >= 70) {

    titulo.textContent =
        "Aprovado!";

    descricao.textContent =
        "Você atingiu a nota mínima de aprovação.";

    resultIcon.classList.add("approved");

} else {

    titulo.textContent =
        "Reprovado";

    descricao.textContent =
        "Você não atingiu a nota mínima de aprovação.";

    resultIcon.classList.remove("approved");

}


/* =========================================
   REVISÃO DAS QUESTÕES
========================================= */

const detalhesSalvos =
    localStorage.getItem(chaveDetalhes);


if (detalhesSalvos) {

    const detalhes =
        JSON.parse(detalhesSalvos);

    detalhes.forEach(
        (detalhe, index) => {

            criarQuestao(
                detalhe,
                index + 1
            );

        }
    );

}


/* =========================================
   CRIAR QUESTÃO NA REVISÃO
========================================= */

function criarQuestao(
    detalhe,
    numero
) {

    const article =
        document.createElement("article");

    article.classList.add("question");


    if (detalhe.acertou) {

        article.classList.add("success");

    } else {

        article.classList.add("error");

    }


    const header =
        document.createElement("header");


    const icone =
        document.createElement("i");


    if (detalhe.acertou) {

        icone.className =
            "fa-regular fa-circle-check";

    } else {

        icone.className =
            "fa-regular fa-circle-xmark";

    }


    const titulo =
        document.createElement("h3");


    titulo.textContent =
        `${numero}. ${detalhe.pergunta || "Questão " + numero}`;


    header.appendChild(icone);
    header.appendChild(titulo);


    const lista =
        document.createElement("ul");


    /*
        Caso o seu JS já esteja salvando
        as alternativas da questão.
    */

    if (detalhe.alternativas) {

        detalhe.alternativas.forEach(
            (alternativa) => {

                const item =
                    document.createElement("li");

                item.textContent =
                    alternativa.texto;


                if (
                    alternativa.id ===
                    detalhe.correta
                ) {

                    item.classList.add(
                        "correct"
                    );

                    item.textContent +=
                        " ✓";

                }


                if (
                    alternativa.id ===
                    detalhe.resposta &&
                    !detalhe.acertou
                ) {

                    item.classList.add(
                        "wrong"
                    );

                    item.textContent +=
                        " ✗";

                }


                lista.appendChild(item);

            }
        );

    }


    article.appendChild(header);
    article.appendChild(lista);

    revisaoElemento.appendChild(article);

}


/* =========================================
   BOTÕES
========================================= */

const botoes =
    document.querySelectorAll(
        ".result-actions a"
    );


/*
    Botão "Outros Simulados"
*/

if (botoes[0]) {

    botoes[0].href =
        "simulados.html";

}

/* =========================================
   BOTÃO REFazer
========================================= */

if (botoes[1]) {

    switch (simulado) {

        case "legislacao":

            botoes[1].href =
                "legislacao/questoes1.html";

            break;


        case "sinalizacao":

            botoes[1].href =
                "sinalizacaovertical/questoes1.html";

            break;


        case "direcao":

            botoes[1].href =
                "direcaodefensiva/questoes1.html";

            break;


        default:

            botoes[1].href =
                "simulados.html";

            break;

    }

}