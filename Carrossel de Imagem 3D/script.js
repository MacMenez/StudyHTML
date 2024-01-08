//ARQUIVO FONTE: https://gist.github.com/HoangTran0410/efcb3395e799eb67247d4bd8b1fbe476

//CONFIGURAÇÕES GERAIS
var radius = 240; //tamanho do raio
var autoRotacao = true; //Rotação ativa ou não
var velocidadeRotacao = -60; //Calculo: segundo / 360 graus
var imgWidth = 120; //Largura da imagem (medida em px)
var imgHeight = 170; //Altura da imagem (medida em px)

//Configurar música de fundo - Marque 'null' para desativar a múscia de fundo
var bgMusicURL = 'https://api.soundcloud.com/tracks/191576787/stream?client_id=587aa2d384f7333a886010d5f52f302a';
var bgMusicControls = true; // Mostrar o UI de Controle de Musica

//INIMAÇÃO E CONFIGURAÇÕES PELO JS
setTimeout(init, 1000); //Iniciar após 1000 milissegundos

var album = document.getElementById('album-container');
var rotacaoFoto = document.getElementById('rodar-container');
var foto = rotacaoFoto.getElementsByTagName('img');
var video = rotacaoFoto.getElementsByTagName('video');
var carrossel = [...foto, ...video]; //Combinação de 2 vetores

//Tamanho das imagens

rotacaoFoto.style.width = imgWidth + "px";
rotacaoFoto.style.height = imgHeight + "px";

//Tamanho da base - depende do tamanho do raio
var base = document.getElementById('base');
base.style.width = radius * 3 + "px";
base.style.height = radius * 3 + "px";

//Ajustar imagens e rotação
function init(tempoDelay) {
    for (var i = 0; i < carrossel.length; i++) {
        carrossel[i].style.transform = "rotateY(" + (i * (360 / carrossel.length)) +"deg) translateZ(" + radius + "px)";
        carrossel[i].style.transition = "transform 1s";
        carrossel[i].style.transitionDelay = tempoDelay || (carrossel.length - i) / 4 + "s";
    }
}

function aplicarTransoformacao(obj) {
    //Restringir o ângulo da câmera (Faixa de 0 até 180)
    if (tY > 180) {tY = 180;}
    if (tY < 0) {tY = 0;}

    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function ativarRotacao(yes) {
    rotacaoFoto.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;

//Rotação automática
if(autoRotacao){
    var nomeAnimacao = (velocidadeRotacao > 0 ? 'rodar':'rodarReverso');
    rotacaoFoto.style.animation = `${nomeAnimacao} ${Math.abs(velocidadeRotacao)}s infinite linear`;
}

//Adicionar Música de Fundo
if (bgMusicURL) {
    document.getElementById('audio-container').innerHTML+= `
    <audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop>    
    <p>If you are reading this, it is because your browser does not support the audio element.</p>
    </audio>
    `;
}

//Configurando Eventos
document.onpointerdown = function (e){
    clearInterval(album.timer);
    e = e || window.event;
    
    var sX = e.clientX, sY = e.clientY;

    this.onpointermove = function (e){
        e = e || window.event;
        
        var nX = e.clientX, nY = e.clientY;
        
        desX = nX - sX;
        desY = nY - sY;

        tX += desX * 0.1;
        tY += desY * 0.1;

        aplicarTransoformacao(album);
        sX = nX;
        sY = nY;
    }

    this.onpointerup = function(e){
        album.timer = setInterval(function (){
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;

            aplicarTransoformacao(album);
            
            ativarRotacao(false);

            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(album.timer);
                ativarRotacao(true);
                
            }
        }, 17);
        this.onpointermove = this.onpointerup = null;
    };
    return false;
};

document.onmousewheel = function (e){
    e = e || window.event;
    var d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    init(1);
};