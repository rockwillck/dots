var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.getElementById("download").addEventListener('click', function(e) {
  const link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
});

function resized() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.fillStyle = `hsla(${background[0]}, 50%, ${background[1]}%, 1)`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

var background = [parseInt(document.getElementById("background").value), parseInt(document.getElementById("sat").value), 1/parseInt(document.getElementById("bloom").value)]
ctx.fillStyle = `rgba(${background[0]}, ${background[1]}, ${background[2]}, 1)`
ctx.fillRect(0, 0, canvas.width, canvas.height)
let dots = [[0, 0, coordinates => [coordinates[0] + speed, coordinates[1] + speed]]]
var threshhold = parseInt(document.getElementById("thresh").value)
const speed = 1
var starter = parseInt(document.getElementById("hue").value)
var colors = [starter]
var range = parseInt(document.getElementById("step").value)
var common = parseInt(document.getElementById("common").max) - parseInt(document.getElementById("common").value) + 1
var current = 0
function animate() {
  requestAnimationFrame(animate)
  current += 1
  starter = parseInt(document.getElementById("hue").value)
  range = parseInt(document.getElementById("step").value)
  threshhold = parseInt(document.getElementById("thresh").value)
  background = [parseInt(document.getElementById("background").value), parseInt(document.getElementById("sat").value), 1/parseInt(document.getElementById("bloom").value)]
  common = parseInt(document.getElementById("common").max) - parseInt(document.getElementById("common").value) + 1
  ctx.fillStyle = `hsla(${background[0]}, 50%, ${background[1]}%, ${background[2]})`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  dots.forEach((dot, index) => {
    ctx.fillStyle = `hsl(${colors[index]}, 50%, 50%)`
    ctx.beginPath()
    ctx.arc(dot[0], dot[1], 5, 0, 2 * Math.PI);
    ctx.fill()
    dot[0] = dot[2]([dot[0], dot[1]])[0]
    dot[1] = dot[2]([dot[0], dot[1]])[1]
    dots.forEach((dot2, index) => {
      if (Math.sqrt((dot[0] - dot2[0])**2 + (dot[1] - dot2[1])**2) < threshhold) {
        colors[index] += range
      }
    })
    dots.forEach((dot2, index) => {
      if (Math.sqrt((dot[0] - dot2[0])**2 + (dot[1] - dot2[1])**2) < threshhold) {
        ctx.strokeStyle = `hsl(${colors[index]}, 50%, 50%)`
        ctx.beginPath();
        ctx.moveTo(dot[0], dot[1]);
        ctx.lineTo(dot2[0], dot2[1]);
        ctx.stroke();
      }
    })
    if (dot[0] > canvas.width || dot[0] < 0 || dot[1] > canvas.height || dot[1] < 0 ) {
      dots.splice(index, 1)
    }
    colors[index] = starter
  })
  const newS = Math.random()*speed
  const negative = Math.random() < 0.5 ? -1 : 1
  const negative2 = Math.random() < 0.5 ? -1 : 1
  if (current % common == 0) {
    dots.push([Math.random()*canvas.width, Math.random()*canvas.height, coordinates => [coordinates[0] + negative*newS, coordinates[1] + negative2*Math.sqrt(1 - newS**2)]])
  }
  colors.push(starter)
}

animate()