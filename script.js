const senha = "123456"

function login(){

const key = document.getElementById("key").value

if(key === senha){

document.getElementById("login").style.display = "none"
document.getElementById("panel").style.display = "block"

ativarControles()

}else{

alert("Senha incorreta")

}

}

function ativarControles(){

const precision = document.getElementById("precision")
const recoil = document.getElementById("recoil")
const lag = document.getElementById("lag")

precision.addEventListener("change",()=>{

if(precision.checked){

engine.sensitivity.x = 0.9
engine.sensitivity.y = 0.7

}else{

engine.sensitivity.x = 0.7
engine.sensitivity.y = 0.45

}

})

recoil.addEventListener("change",()=>{

if(recoil.checked){

engine.maxPixels = 60

}else{

engine.maxPixels = 120

}

})

lag.addEventListener("change",()=>{

if(lag.checked){

engine.noiseAlpha = 0.1

}else{

engine.noiseAlpha = 0.25

}

})

}

function openGame(){

window.location.href="freefire://"

}
