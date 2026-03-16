export class ColorScanner{

constructor(){

this.video=document.createElement("video")
this.canvas=document.createElement("canvas")
this.ctx=this.canvas.getContext("2d")

this.isRunning=false

}

async init(){

this.video.srcObject =
await navigator.mediaDevices.getDisplayMedia({video:true})

this.video.play()

this.isRunning=true

}

scan(){

if(!this.isRunning)
return {x:0,y:0,found:false}

const size=120

this.canvas.width=size
this.canvas.height=size

this.ctx.drawImage(
this.video,
(this.video.videoWidth/2)-(size/2),
(this.video.videoHeight/2)-(size/2),
size,size,
0,0,size,size
)

const pixels=this.ctx.getImageData(0,0,size,size).data

for(let i=0;i<pixels.length;i+=4){

if(
pixels[i]>220 &&
pixels[i+1]<60 &&
pixels[i+2]<60
){

return{

x:((i/4)%size)-(size/2),
y:Math.floor((i/4)/size)-(size/2),
found:true

}

}

}

return {x:0,y:0,found:false}

}

}