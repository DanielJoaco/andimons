import {startRound} from './fight.js';

const lifesPlaver = document.getElementById('lifesPlaver')
const winsPlayer = document.getElementById('winsPlayer')
const sectionCanvas = document.getElementById('sectionCanvas')
const selectCharacter = document.getElementById('selectCharacter')
const canvasElement = document.getElementById('canvas')
const canvas = canvasElement.getContext('2d')

let player
let enemy
let andimons
let moveCharacterListener
let stopCharacterListener
let inverval


function starCanvas(playerScript, enemyScript, andimonsScript = andimons){

  player = playerScript
  enemy = enemyScript
  andimons = andimonsScript

  lifesPlaver.innerHTML = `❤️= ${player.lifes}`
  winsPlayer.innerHTML = `🏆= ${player.wins}`
  sectionCanvas.style.display = 'flex';
  selectCharacter.style.display = 'none';

  deleteCharacterArray(player.character.name)

  moveCharacterListener = window.addEventListener('keydown', moveCharacter);
  stopCharacterListener = window.addEventListener('keyup', stopCharacter);
  player.character.canvas.x = 430
  player.character.canvas.y = 240
  inverval = setInterval(() => drawCanvas(player.character), 50)
  
  }
  
function deleteCharacterArray(name){
  console.log(name)
  console.log(andimons)
  const characterRemove = andimons.find(andimon => andimon.name === name)
  const indexToRemove = andimons.indexOf(characterRemove)

  if (indexToRemove !== -1) {
    andimons.splice(indexToRemove, 1);
  }
}
  
function drawCanvas(character){
  character.canvas.x = character.canvas.x + character.canvas.speedX
  character.canvas.y = character.canvas.y + character.canvas.speedY

  canvas.clearRect(0, 0, canvasElement.width, canvasElement.height)
  character.paintAndimon()
  andimons.forEach(andimon =>{
    andimon.paintAndimon()
    if (player.character.canvas.speedX != 0 || player.character.canvas.speedY != 0)
    checkCollision(andimon)
  })

}
  
  function moveCharacter(event) {
  
    let moveEvent
  
    if (event.type === 'keydown'){
      moveEvent = event.key
    } else{
      moveEvent = `Arrow${event.dataset.buttonId}`;
    }
  
    switch (moveEvent) {
      case 'ArrowUp':
        player.character.canvas.speedY = -5
        break;
      case 'ArrowDown':
        player.character.canvas.speedY = 5
      break;
      case 'ArrowLeft':
        player.character.canvas.speedX = -5
      break;
      case 'ArrowRight':
        player.character.canvas.speedX = 5
      break;
      default:
        break;
    }
  
  }
  
  function stopCharacter() {
    player.character.canvas.speedX = 0;
    player.character.canvas.speedY = 0;
    
  }
  
  function checkCollision(andimon){  
    const upAndimon = andimon.canvas.y 
    const downAndimon = andimon.canvas.y + andimon.canvas.height
    const leftAndimon = andimon.canvas.x 
    const rightAndimon = andimon.canvas.x + andimon.canvas.width
  
    const upPlayer = player.character.canvas.y 
    const downPlayer = player.character.canvas.y + player.character.canvas.height
    const leftPlayer = player.character.canvas.x 
    const rightPlayer = player.character.canvas.x + player.character.canvas.width
  
    if (upAndimon > downPlayer ||
        downAndimon < upPlayer ||
        leftAndimon > rightPlayer ||
        rightAndimon < leftPlayer){
      return
    }
  
    enemy.character = andimon
    moveCharacterListener = null;
    stopCharacterListener = null
    clearInterval(inverval)
  
    stopCharacter()
    startRound(player, enemy)
  }

export {starCanvas, deleteCharacterArray}

window.moveCharacter = moveCharacter;
window.stopCharacter = stopCharacter;