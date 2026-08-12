/*=========================================
    CRONÔMETRO DO SIMULADO
=========================================*/

const DURACAO = 40 * 60; // 40 minutos
const timer = document.getElementById("timer");

let inicio = localStorage.getItem("inicioSimulado");
let intervalo;

if (!inicio) {
    inicio = Date.now();
    localStorage.setItem("inicioSimulado", inicio);
} else {
    inicio = Number(inicio);
}

/*=========================================
    GABARITO
=========================================*/

const gabarito = {
    questao1: "c",
    questao2: "b",
    questao3: "c",
    questao4: "c",
    questao5: "c"
};

/*=========================================
    CRONÔMETRO
=========================================*/

function atualizarCronometro() {

    if (!timer) return;

    const agora = Date.now();

    const tempoDecorrido =
        Math.floor((agora - inicio) / 1000);

    const tempoRestante =
        DURACAO - tempoDecorrido;

    if (tempoRestante <= 0) {

        clearInterval(intervalo);

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

/*=========================================
    SALVAR RESPOSTAS
=========================================*/

const radios =
document.querySelectorAll("input[type='radio']");

radios.forEach((radio)=>{

    const respostaSalva =
        localStorage.getItem(radio.name);

    if(respostaSalva===radio.id){

        radio.checked=true;

    }

    radio.addEventListener("change",()=>{

        localStorage.setItem(
            radio.name,
            radio.id
        );

    });

});

/*=========================================
    FINALIZAR
=========================================*/

function finalizarSimulado(){

    let acertos=0;

    let erros=0;

    const detalhes=[];

    Object.keys(gabarito).forEach((questao)=>{

        const resposta =
            localStorage.getItem(questao);

        const correta =
            gabarito[questao];

        const acertou =
            resposta===correta;

        if(acertou){

            acertos++;

        }else{

            erros++;

        }

        detalhes.push({

            questao,

            resposta,

            correta,

            acertou

        });

    });

    const porcentagem =
        Math.round((acertos/5)*100);

    localStorage.setItem(
        "acertos",
        acertos
    );

    localStorage.setItem(
        "erros",
        erros
    );

    localStorage.setItem(
        "resultado",
        porcentagem
    );

    localStorage.setItem(
        "detalhes",
        JSON.stringify(detalhes)
    );

    localStorage.removeItem(
        "inicioSimulado"
    );

    clearInterval(intervalo);

    window.location.href =
        "resultado-simulado.html";

}

/*=========================================
    BOTÃO FINALIZAR
=========================================*/

const botaoFinalizar =
document.querySelector(".btn-finalizar");

if(botaoFinalizar){

    botaoFinalizar.addEventListener(
        "click",
        function(e){

            e.preventDefault();

            finalizarSimulado();

        }
    );

}