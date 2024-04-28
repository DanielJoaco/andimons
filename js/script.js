document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

import {random} from './utility.js';
import {createImage, updateStats, calculateDamage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, attackCost} from './funtions.js';

const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const acceptButton = document.getElementById('acceptButton');
const canvasElement = document.getElementById('canvas')
const canvas = canvasElement.getContext('2d')
let moveCharacterListener
let stopCharacterListener
const statsPlayerOne = document.getElementById('statsPlayerOne')
const statsPlayerTwo = document.getElementById('statsPlayerTwo')
const roundDiv = document.getElementById('round')
const resetDiv = document.getElementById('resetDiv');
const passTurnButton = document.getElementById('passTurn');
const playerAttacksDiv = document.getElementById('playerAttacks');
const playersStatistics = document.getElementsByClassName('playersStatistics');
const imgPlayerOne = document.getElementById('imgPlayerOne')
const imgPlayerTwo = document.getElementById('imgPlayerTwo')


class Andimons {
  constructor(name, type, img, head, x, y) {
    this.name = name;
    this.type = type;
    this.img = img;
    this.canvas = {
      head: new Image(),
      x: x,
      y: y,
      width: 40,
      height: 40,
      speedX: 0,
      speedY: 0
    };
    this.canvas.head.src = head; 
    this.skills = [
      { damage: [1, 5], staminaCost: 0, generatedShield: 2, emoji: '🛡', name: 'Escudo' },
      { damage: [5, 10], staminaCost:  [1, 3], generatedShield: 0, emoji: '💣', name: 'Ataque bomba' },
      { damage: [10, 15], staminaCost: [3, 4], generatedShield: 0, emoji: '💥', name: 'Ataque explosivo' },
      { damage: [15, 20], staminaCost: [5, 6], generatedShield: 0, emoji: '☣', name: 'Riesgo biologico' }
    ]  
  }
  paintAndimon(){
    canvas.drawImage(
      this.canvas.head,
      this.canvas.x,
      this.canvas.y,
      this.canvas.width,
      this.canvas.height
    )
  }
}


class Player {
  constructor(player) {
    this.player = player
    this.character = null; 
    this.health = 100;
    this.stamina = 10;
    this.shield = 0; 
    this.disabledAttack = -1;
    this.lifes = 5,
    this.wins = 0,
    this.turnStats = {
      attack: null,
      damage: 0,
      staminaCost: 0,
      shield: 0,
      staminaLow: false
    };
  }
}

const types = {
  flying: {name: 'flying', emoji: '🌪', strongType: 'bug'},
  bug: {name: 'bug', emoji: '🐞', strongType: 'water'},
  water: {name: 'water', emoji: '💧', strongType: 'fire'},
  fire: {name: 'fire', emoji: '🔥', strongType: 'plant'},
  plant: {name: 'plant', emoji: '🌱', strongType: 'earth'},
  earth: {name: 'earth', emoji: '⛰', strongType: 'flying'}
}


let voltair = new Andimons('Voltair', types['flying'], './assets/eagle.gif', './assets/eagle_head.gif', 440, 25)
let zumzum = new Andimons('Zumzum', types['bug'], './assets/bee.gif', './assets/bee_head.gif', 100, 235)
let chelonix = new Andimons('Chelonix', types['water'], './assets/turtle.gif', './assets/turtle_head.gif', 210, 125)
let krokotusk = new Andimons('Krokotusk', types['fire'], './assets/crocodile.gif', './assets/crocodile_head.gif', 280, 10)
let ursoptix = new Andimons('Ursoptix', types['plant'], './assets/spectacledBear.gif', './assets/spectacledBear_head.gif', 315, 140)
let jagtiger = new Andimons('Jagtiger', types['earth'], './assets/leopard.gif', './assets/leopard_head.gif', 60, 35)

let andimons = [voltair, zumzum, chelonix, krokotusk, ursoptix, jagtiger]
let player = new Player('player');
let enemy = new Player('enemy');
let round = 0;
let inverval

function passTurn() {
  player.turnStats.damage = null;
  player.turnStats.staminaCost = 0;
  enemyRandomAttack(player.turnStats);
}

function startGame() {

  andimons.forEach((andimon)=>{
    let andimonOptions = `<input type="radio" name="character" id=${andimon.name} />
    <label class="characterCard" for=${andimon.name}>
        <p class="characterName">${andimon.name}<br>${andimon.type.emoji}</p>
        <img src=${andimon.img} alt=${andimon.name} class="characterImg">            
    </label>`
    document.getElementById('cardContainer').innerHTML += andimonOptions
  })

  document.getElementById('characterButton').addEventListener('click', selectPlayerCharacter);  
}

function selectPlayerCharacter() {

  andimons.forEach((andimon) => {
    let input = document.getElementById(andimon.name);
    if (input && input.checked) {
        player.character = andimon;
        return; 
    }
  }); 

  if (!player.character) {
    const text = 'Selecciona un personaje'
    const section = 'selectCharacter'
    showModal(text, section);
    return;
  }
  starCanvas()
}

function showModal(text, section){  
  
  modal.style.display = 'flex'; 
  modalText.innerHTML = text
  if (section === 'selectCharacter'){
    acceptButton.addEventListener('click', () => {
    modal.style.display = 'none'; 
  });
  } else if (section === 'sectionAttack'){
    document.getElementById('divAcceptButton').style.display = 'none'
  }
  
}

function starCanvas(){

  console.log('Vidas jugador = ', player.lifes, 'Victorias jugador = ', player.wins)

  deleteCharacterArray(player.character.name)
  document.getElementById('sectionCanvas').style.display = 'flex';
  document.getElementById('selectCharacter').style.display = 'none';
  moveCharacterListener = window.addEventListener('keydown', moveCharacter);
  stopCharacterListener = window.addEventListener('keyup', stopCharacter);
  player.character.canvas.x = 430
  player.character.canvas.y = 240
  inverval = setInterval(() => drawCanvas(player.character), 50)
}

function deleteCharacterArray(name){

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
  inverval = null
  stopCharacter()
  startRound()
}


function startRound() {

  document.getElementById('sectionCanvas').style.display = 'none';
  document.getElementById('sectionAttack').style.display = 'flex';

  createImage(player, imgPlayerOne)
  createImage(enemy, imgPlayerTwo)

  statsPlayerOne.innerHTML = updateStats(player);
  statsPlayerTwo.innerHTML = updateStats(enemy);
  roundDiv.innerHTML = `Ronda: ${round}`

  generateAttackButtons(player.character);
}

function generateAttackButtons(character) {
  passTurnButton.addEventListener('click', passTurn);
  playerAttacksDiv.innerHTML = '' 
  
  character.skills.forEach((ability, i) => {
    let attackButton = document.createElement('button');
    attackButton.textContent = ability.emoji;
    attackButton.id = `buttonAttack_${i}`; 
    attackButton.classList.add('buttonsAttacks');
    playerAttacksDiv.appendChild(attackButton)
    attackButton.addEventListener('click', () => enemyRandomAttack(ability));
    
});
}

function enemyRandomAttack(playerAttack) {

  const enemyAttack = chooseEnemyAttack(enemy);
  const damageResults = calculateDamage(playerAttack.damage, enemyAttack.damage, player.character.type, enemy.character.type);
  updateStatsPlayers(player, enemy, damageResults, playerAttack, enemyAttack);
    
  enableAttacks();
}

function chooseEnemyAttack(enemy) {
  let enemyAttackEmoji = randomAttack(enemy.disabledAttack, enemy.character.skills)
  let enemyAttack = findSkillByEmoji(enemy.character.skills, enemyAttackEmoji)
  return enemyAttack;
}

function findSkillByEmoji(skills, emoji){
  for (const propertyIndex in skills) {
    const skillObjectItem = skills[propertyIndex]; // Objeto dentro de la propiedad numérica
    for (const skillProperty in skillObjectItem) {
      if (typeof skillObjectItem[skillProperty] === 'string' && skillObjectItem[skillProperty].includes(emoji)) {
        return skills[propertyIndex]; // Concatena la propiedad numérica y la propiedad del objeto
      }
    }
  }
  return null; 
}

function updateStatsPlayers(player, enemy, damageResults, playerAttack, enemyAttack) {

  player.turnStats.damage = damageResults[0]
  enemy.turnStats.damage = damageResults[1]

  player.turnStats.attack = playerAttack.name
  enemy.turnStats.attack = enemyAttack.name

  if (playerAttack.name != 'Escudo' && player.turnStats.damage != null){ 
    player.turnStats.staminaCost = -random(playerAttack.staminaCost)
  } else{
    player.turnStats.staminaCost = playerAttack.staminaCost
  }

  if (enemyAttack.name != 'Escudo'){
    enemy.turnStats.staminaCost = -random(enemyAttack.staminaCost)
  } else{
    enemy.turnStats.staminaCost = enemyAttack.staminaCost
  }

  if (playerAttack.name === 'Escudo'){
    player.turnStats.shield = playerAttack.generatedShield
    } 
  if (enemyAttack.name === 'Escudo'){
    enemy.turnStats.shield = enemyAttack.generatedShield
  }
}

function enableAttacks() {

  player.disabledAttack = checkEnableButton(round, player.disabledAttack) 
  if (round - enemy.disabledAttack  >= 5) {
    enemy.disabledAttack  = -1
  }

  battle();
}



function battle(){

  [player.stamina, player.turnStats.staminaLow, player.turnStats.damage, enemy.health] = attackCost(player, enemy);
  [enemy.stamina, enemy.turnStats.staminaLow, enemy.turnStats.damage, player.health] = attackCost(enemy, player);
  

  player.shield = decreaseShield(player.shield, enemy.turnStats.staminaLow);
  enemy.shield = decreaseShield(enemy.shield, player.turnStats.staminaLow);

  player.shield = applyShield(player.shield, player.turnStats.shield)
  enemy.shield = applyShield(enemy.shield, enemy.turnStats.shield)
  
  
 
  if (enemy.shield > 0 && enemy.disabledAttack  === -1){
    enemy.disabledAttack  = round;
  }

  player.disabledAttack = disabledShieldButton(player.shield, player.disabledAttack, round)

  round += 1;
  player.stamina += 1;
  enemy.stamina += 1;
  player.turnStats.shield = 0
  enemy.turnStats.shield = 0
  statsPlayerOne.innerHTML = updateStats(player);
  statsPlayerTwo.innerHTML = updateStats(enemy);
  roundDiv.innerHTML = `Ronda: ${round}`
    
  checkWinner()
}

function checkWinner(){

  if (player.health > 0 && enemy.health > 0){
    createMessage()
  } else {
    winner()
  } 
}

function createMessage() {

  document.getElementById('sectionMessage').style.display = 'flex'; 
  let playerMessage
  let enemyMessage

  playerMessage = getPlayerMessage(player);
  enemyMessage = getPlayerMessage(enemy);

  document.getElementById('playerOneStatistics').innerHTML = playerMessage;
  document.getElementById('playerTwoStatistics').innerHTML = enemyMessage;

}

function getPlayerMessage(player, isLowStamina) {
  const playerMessages = {
    player: {
      attackMessage: `<strong>${player.character.name}</strong><strong>Uso:</strong>${player.turnStats.attack}<strong>Estamina:</strong>${player.turnStats.staminaCost}<strong>Daño:</strong>${player.turnStats.damage}`,
      attackShieldMessage: `<strong>${player.character.name}</strong><strong>Uso:</strong>${player.turnStats.attack}<strong>Estamina:</strong>${player.turnStats.staminaCost}<strong>Daño:</strong>${player.turnStats.damage}<strong>Escudo:</strong>+${player.shield}`,
      noStaminaMessage: `<strong>${player.character.name}</strong>sin estamina`,
      passTurn: `<strong>${player.character.name}</strong>Paso turno`
    },
    enemy: {
      attackMessage: `<strong>${enemy.character.name}</strong><strong>Uso:</strong>${enemy.turnStats.attack}<strong>Estamina:</strong>${enemy.turnStats.staminaCost}<strong>Daño:</strong>${enemy.turnStats.damage}`,
      attackShieldMessage: `<strong>${enemy.character.name}</strong><strong>Uso:</strong>${enemy.turnStats.attack}<strong>Estamina:</strong>${enemy.turnStats.staminaCost}<strong>Daño:</strong>${enemy.turnStats.damage}<strong>Escudo:</strong>+${enemy.shield}`,
      noStaminaMessage: `<strong>${enemy.character.name}</strong>sin estamina`,
      passTurn: `<strong>${enemy.character.name}</strong>Paso turno`
    },
  };

  const playerType = player === enemy ? 'enemy' : 'player';

  if (player.turnStats.damage === null) {
    return playerMessages[playerType].passTurn; 
  }

  if (player.turnStats.attack === 'Escudo') {
    return playerMessages[playerType].attackShieldMessage;
  }

  return player.turnStats.staminaLow ? playerMessages[playerType].noStaminaMessage : playerMessages[playerType].attackMessage; 
}

function winner(){  
  deleteCharacterArray(enemy.character.name)

  resetDiv.style.display = 'flex'

  document.getElementById('cotinueButton').addEventListener('click', () => {
    resetStats(attackButtons);
  });
  
  let paragraph = ''
  const attackButtons = playerAttacksDiv.getElementsByTagName('button');
  
  for (const button of attackButtons) {
    button.disabled = true;
  }

  passTurnButton.disabled = true;
  passTurnButton.style.color = '#9de5de';
  for (let i = 0; i < playersStatistics.length; i++) {
    playersStatistics[i].style.display = 'none'; 
  }

  if (player.health > enemy.health){
    paragraph = `🎊 Tu ${player.character.name} gano 🎉 🏆`
    player.wins++
  }else{
    paragraph = `⚰💀 Tu ${player.character.name} perdio ☠️🪦`
    player.lifes--
  }

  if(player.lifes <= 2){
    const text = 'Has perdido el juego'
    const section = 'sectionAttack'
    showModal(text, section);
  } else if (player.wins >= 3){
    const text = 'Has ganado el juego'
    const section = 'sectionAttack'
    showModal(text, section);
  }
  document.getElementById('resultsParagraph').innerHTML = paragraph;
}

function resetStats(attackButtons){

  enemy.character = null
  enemy.health = 100
  player.health = 100
  enemy.stamina = 10
  player.stamina = 10
  enemy.shield = 0
  player.shield = 0
  enemy.disabledAttack = -1;
  player.disabledAttack = -1;
  round = 0

  for (const button of attackButtons) {
    button.disabled = false;
  }
  passTurnButton.disabled = false;
  passTurnButton.style.color = '#396365';
  document.getElementById('sectionAttack').style.display = 'none';
  for (let i = 0; i < playersStatistics.length; i++) {
    playersStatistics[i].style.display = 'flex'; 
  }
  resetDiv.style.display = 'none'

  starCanvas()

}
resetButtonModal
document.getElementById('resetButton').addEventListener('click', () => {
  location.reload();
});
document.getElementById('resetButtonModal').addEventListener('click', () => {
  location.reload();
});
window.moveCharacter = moveCharacter;
window.stopCharacter = stopCharacter;
             