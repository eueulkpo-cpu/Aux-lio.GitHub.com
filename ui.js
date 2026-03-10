const fovSlider = document.getElementById("fovSlider")
const fovValue = document.getElementById("fovValue")

fovSlider.addEventListener("input",()=>{

fovValue.innerText = fovSlider.value + "%"

})

document.getElementById("horizontalToggle").addEventListener("change",(e)=>{

if(e.target.checked){

engine.config.horizontalBoost = 1.4

}else{

engine.config.horizontalBoost = 1.0

}

})