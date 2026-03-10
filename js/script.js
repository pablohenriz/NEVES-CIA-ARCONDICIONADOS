const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((element) => observer.observe(element));

const imagens = [
"/img/img-1-hero.webp",
"/img/imagem de serviço1.webp",
"/img/imagem-limpeza.webp"
]

let indice = 0

const hero = document.querySelector(".hero")
const backgrounds = document.querySelectorAll(".hero-bg")

backgrounds[0].style.backgroundImage = `url('${imagens[0]}')`

let ativo = 0

function trocarImagem(dir){

    if(dir === "right"){
        indice = (indice + 1) % imagens.length
    } else {
        indice = (indice - 1 + imagens.length) % imagens.length
    }

    const atual = backgrounds[ativo]
    const proxima = backgrounds[ativo === 0 ? 1 : 0]

    proxima.style.backgroundImage = `url('${encodeURI(imagens[indice])}')`

    proxima.style.opacity = 1
    atual.style.opacity = 0

    ativo = ativo === 0 ? 1 : 0
}

function btnRgth(){
    trocarImagem("right")
}

function btnLft(){
    trocarImagem("left")
}