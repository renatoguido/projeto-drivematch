/* =========================================
   SIMULADO DE LEGISLAÇÃO
========================================= */

const PREFIXO = "sinalizacao";
const DURACAO = 40 * 60;

const timer = document.getElementById("timer");

const chaveInicio = `${PREFIXO}_inicio`;

let inicio = localStorage.getItem(chaveInicio);
let intervalo;


/* =========================================
   INICIAR / RECUPERAR SIMULADO
========================================= */

if (!inicio) {

    inicio = Date.now();

    localStorage.setItem(
        chaveInicio,
        inicio
    );

} else {

    inicio = Number(inicio);

}


/* =========================================
   GABARITO
========================================= */

const gabarito = {

    questao1: "b",
    questao2: "c",
    questao3: "c",
    questao4: "b",
    questao5: "c"

};


/* =========================================
   CRONÔMETRO
========================================= */

function atualizarCronometro() {

    if (!timer) {
        return;
    }

    const agora = Date.now();

    const tempoDecorrido =
        Math.floor((agora - inicio) / 1000);

    const tempoRestante =
        DURACAO - tempoDecorrido;


    if (tempoRestante <= 0) {

        clearInterval(intervalo);

        timer.textContent = "00:00";

        finalizarSimulado();

        return;
    }


    const minutos =
        Math.floor(tempoRestante / 60);

    const segundos =
        tempoRestante % 60;


    timer.textContent =
        `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

}


if (timer) {

    atualizarCronometro();

    intervalo = setInterval(
        atualizarCronometro,
        1000
    );

}


/* =========================================
   RESPOSTAS
========================================= */

const radios =
    document.querySelectorAll(
        "input[type='radio']"
    );


radios.forEach((radio) => {

    const chaveResposta =
        `${PREFIXO}_${radio.name}`;


    const respostaSalva =
        localStorage.getItem(chaveResposta);


    if (respostaSalva === radio.id) {

        radio.checked = true;

    }


    radio.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                chaveResposta,
                radio.id
            );

        }
    );

});


/* =========================================
   FINALIZAR SIMULADO
========================================= */

function finalizarSimulado() {

    let acertos = 0;
    let erros = 0;

    const detalhes = [];


    Object.keys(gabarito).forEach(
        (questao) => {

            const chaveResposta =
                `${PREFIXO}_${questao}`;


            const resposta =
                localStorage.getItem(
                    chaveResposta
                );


            const correta =
                gabarito[questao];


            const acertou =
                resposta === correta;


            if (acertou) {

                acertos++;

            } else {

                erros++;

            }


            detalhes.push({

                questao: questao,

                resposta: resposta,

                correta: correta,

                acertou: acertou

            });

        }
    );


    const porcentagem =
        Math.round((acertos / 5) * 100);


    /* =====================================
       SALVAR RESULTADO
    ===================================== */

    localStorage.setItem(
        `${PREFIXO}_acertos`,
        acertos
    );


    localStorage.setItem(
        `${PREFIXO}_erros`,
        erros
    );


    localStorage.setItem(
        `${PREFIXO}_resultado`,
        porcentagem
    );


    localStorage.setItem(
        `${PREFIXO}_detalhes`,
        JSON.stringify(detalhes)
    );

    /* =========================================
   APAGAR RESPOSTAS DO SIMULADO
========================================= */

for (let i = 1; i <= 5; i++) {

    localStorage.removeItem(
        `${PREFIXO}_questao${i}`
    );

}


    /* =====================================
       LIMPAR CRONÔMETRO
    ===================================== */

    localStorage.removeItem(
        chaveInicio
    );


    clearInterval(intervalo);


    /* =====================================
       IR PARA RESULTADO
    ===================================== */
localStorage.setItem(
    "simuladoAtual",
    PREFIXO
);

window.location.href =
    `../resultado-simulado.html?simulado=${PREFIXO}`;
}


/* =========================================
   BOTÃO FINALIZAR
========================================= */

const botaoFinalizar =
    document.querySelector(".btn-finalizar");


if (botaoFinalizar) {

    botaoFinalizar.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            finalizarSimulado();

        }
    );

}