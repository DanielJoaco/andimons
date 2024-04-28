document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

import {random} from './utility.js';
import {crearImagen, updateStats, calculateDamage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, attackCost} from './funtions.js';

const canvasElement = document.getElementById('canvas')
const canvas = canvasElement.getContext('2d')
const statsPlayerOne = document.getElementById('statsPlayerOne')
const statsPlayerTwo = document.getElementById('statsPlayerTwo')
const roundDiv = document.getElementById('round')
const resetDiv = document.getElementById('resetDiv');
const passTurnButton = document.getElementById('passTurn');
const playerAttacksDiv = document.getElementById('playerAttacks');
const playersStatistics = document.getElementsByClassName('playersStatistics');

class Andimons {  
  constructor(name, type, img, head) {
    this.name = name;
    this.type = type;
    this.img = img;
    this.canvas = {
      head: new Image(),
      x: 430,
      y: 240,
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
    ];
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


let voltair = new Andimons('Voltair', types['flying'], './assets/eagle.gif', './assets/eagle_head.gif')
let zumzum = new Andimons('Zumzum', types['bug'], './assets/bee.gif', './assets/bee_head.gif')
let chelonix = new Andimons('Chelonix', types['water'], './assets/turtle.gif', './assets/turtle_head.gif')
let krokotusk = new Andimons('Krokotusk', types['fire'], './assets/crocodile.gif', './assets/crocodile_head.gif')
let ursoptix = new Andimons('Ursoptix', types['plant'], './assets/spectacledBear.gif', './assets/spectacledBear_head.gif')
let jagtiger = new Andimons('Jagtiger', types['earth'], './assets/leopard.gif', './assets/leopard_head.gif')

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
    alert('Por favor selecciona un personaje.');
    return;
  }
  document.getElementById('sectionCanvas').style.display = 'flex';
  document.getElementById('selectCharacter').style.display = 'none';
  inverval = setInterval(() => drawCanvas(player.character.canvas), 50)
/* 
  startRound() */
}

function drawCanvas(canvasParameters){
  canvasParameters.x = canvasParameters.x + canvasParameters.speedX
  canvasParameters.y = canvasParameters.y + canvasParameters.speedY

  canvas.clearRect(0, 0, canvasElement.width, canvasElement.height)
  
  canvas.drawImage(
    canvasParameters.head,
    canvasParameters.x,
    canvasParameters.y,
    canvasParameters.width,
    canvasParameters.height
  );
}

function moveCharacter(button) {

  const buttonId = button.dataset.buttonId;
  switch (buttonId) {
    case 'up':
      player.character.canvas.speedY = -5
      break;
    case 'down':
      player.character.canvas.speedY = 5
    break;
    case 'left':
      player.character.canvas.speedX = -5
    break;
    case 'right':
      player.character.canvas.speedX = 5
    break;
    default:
      console.log('Boton no definido')
      break;
  }

}

function stopCharacter() {
  player.character.canvas.speedX = 0;
  player.character.canvas.speedY = 0;
  
}


function startRound() {
  document.getElementById('selectCharacter').style.display = 'none';
  document.getElementById('sectionAttack').style.display = 'flex';
  selectEnemyCharacter();

  crearImagen(player)
  crearImagen(enemy)

  statsPlayerOne.innerHTML = updateStats(player);
  statsPlayerTwo.innerHTML = updateStats(enemy);
  roundDiv.innerHTML = `Ronda: ${round}`


  generateAttackButtons(player.character);
}

function selectEnemyCharacter() {
  const enemyCharacterIndex = random([0, andimons.length - 1]);
  enemy.character = andimons[enemyCharacterIndex];
}

function generateAttackButtons(character) {
  passTurnButton.addEventListener('click', passTurn); 
  
  Object.values(character.skills).forEach((ability, i) => {
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
  console.log(player.turnStats.damage)
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
      attackShieldMessage: `<strong>${player.character.name}</strong><strong>Uso:</strong>${player.turnStats.attack}<strong>Estamina:</strong>${player.turnStats.staminaCost}<strong>Daño:</strong>${player.turnStats.damage}<strong>Escudo:</strong>+${player.turnStats.shield}`,
      noStaminaMessage: `<strong>${player.character.name}</strong>sin estamina`,
      passTurn: `<strong>${player.character.name}</strong>Paso turno`
    },
    enemy: {
      attackMessage: `<strong>${enemy.character.name}</strong><strong>Uso:</strong>${enemy.turnStats.attack}<strong>Estamina:</strong>${enemy.turnStats.staminaCost}<strong>Daño:</strong>${enemy.turnStats.damage}`,
      attackShieldMessage: `<strong>${enemy.character.name}</strong><strong>Uso:</strong>${enemy.turnStats.attack}<strong>Estamina:</strong>${enemy.turnStats.staminaCost}<strong>Daño:</strong>${enemy.turnStats.damage}<strong>Escudo:</strong>+${enemy.turnStats.shield}`,
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

  resetDiv.style.display = 'flex'
  document.getElementById('resetButton').addEventListener('click', () => {
    location.reload();
  });
  
  let paragraph = document.createElement('p')
  const attackButtons = playerAttacksDiv.getElementsByTagName('button');
  console.log(attackButtons)
  
  for (const button of attackButtons) {
    button.disabled = true;
  }

  passTurnButton.disabled = true;
  passTurnButton.style.color = '#9de5de';
  for (let i = 0; i < playersStatistics.length; i++) {
    playersStatistics[i].style.display = 'none'; 
  }

  if (player.health > enemy.health){
    paragraph.innerHTML = `🎊 Tu ${player.character.name} gano 🎉 🏆`
  }else{
    paragraph.innerHTML = `⚰💀 Tu ${player.character.name} perdio ☠️🪦`
  }
  resetDiv.appendChild(paragraph);
}

window.moveCharacter = moveCharacter;
window.stopCharacter = stopCharacter;
             