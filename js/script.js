document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

import {random, capitalize} from './utility.js';
import {calculateDamage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, attackCost, updateStats} from './funtions.js';

const resetButton = document.getElementById('resetButton');
const resetDiv = document.getElementById('resetDiv');
const passTurnButton = document.getElementById('passTurn');
const buttonCharacterPlayed = document.getElementById('characterButton');
const imgCharacters = document.getElementById('imgCharacters')
const playerAttacksDiv = document.getElementById('playerAttacks');
const cardContainer = document.getElementById('cardContainer')
const selectCharacter = document.getElementById('selectCharacter');
const sectionAttack = document.getElementById('sectionAttack');
const sectionMessage = document.getElementById('sectionMessage');
const playerOneStatistics = document.getElementById('playerOneStatistics');
const playerTwoStatistics = document.getElementById('playerTwoStatistics');
const selectPlayerAttacks = document.getElementById('playerAttacks');
const playersStatistics = document.getElementsByClassName('playersStatistics');

class Andimons {  
  constructor(name, type, img){
    this.name = name;
    this.type = type;
    this.img = img
    this.skills = {
      0: {damage: [1, 5], staminaCost: 0, generatedShield: 2, emoji: '🛡', name: 'Escudo'},
      1: {damage: [5, 10], staminaCost:  [1, 3], generatedShield: 0, emoji: '💣', name: 'Ataque bomba'},
      2: {damage: [10, 15], staminaCost: [3, 4], generatedShield: 0, emoji: '💥', name: 'Ataque explosivo'},
      3: {damage: [15, 20], staminaCost: [5, 6], generatedShield: 0, emoji: '☣', name: 'Riesgo biologico'},
    }
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


let voltair = new Andimons('Voltair', types['flying'], './assets/eagle.gif')
let zumzum = new Andimons('Zumzum', types['bug'], './assets/bee.gif')
let chelonix = new Andimons('Chelonix', types['water'], './assets/turtle.gif')
let krokotusk = new Andimons('Krokotusk', types['fire'], './assets/crocodile.gif')
let ursoptix = new Andimons('Ursoptix', types['plant'], './assets/spectacledBear.gif')
let jagtiger = new Andimons('Jagtiger', types['earth'], './assets/leopard.gif')

let andimons = [voltair, zumzum, chelonix, krokotusk, ursoptix, jagtiger]
let player = new Player('player');
let enemy = new Player('enemy');
let round = 1;

function passTurn() {
  player.turnStats.attack = null;
  player.turnStats.damage = 0;
  player.turnStats.staminaCost = 0;
  startFight(player.turnStats.attack);
}

function startGame() {

  andimons.forEach((andimon)=>{
    let andimonOptions = `<input type="radio" name="character" id=${andimon.name} />
    <label class="characterCard" for=${andimon.name}>
        <p class="characterName">${andimon.name}<br>${andimon.type.emoji}</p>
        <img src=${andimon.img} alt=${andimon.name} class="characterImg">            
    </label>`
    cardContainer.innerHTML += andimonOptions
  })

  buttonCharacterPlayed.addEventListener('click', selectPlayerCharacter);  
}

function selectPlayerCharacter() {

  andimons.forEach((andimon) => {
    let input = document.getElementById(andimon.name);
    if (input && input.checked) {
        player.character = andimon;
        document.getElementById('playerCharacter').innerHTML = player.character.name;        
        return; 
    }
  }); 

  if (!player.character) {
    alert('Por favor selecciona un personaje.');
    return;
  } 
  selectCharacter.style.display = 'none';
  sectionAttack.style.display = 'flex';
  startRound()
}

function startRound() {
  selectEnemyCharacter();

  crearImagen(player)
  crearImagen(enemy)

  updateStats(player, enemy, round);
  generateAttackButtons(player.character);
}

function selectEnemyCharacter() {
  const enemyCharacterIndex = random([0, andimons.length - 1]);
  enemy.character = andimons[enemyCharacterIndex];
  document.getElementById('enemyCharacter').innerHTML = enemy.character.name;
}

function crearImagen(player) { 
  const img = document.createElement('img');
  img.src = player.character.img;
  img.alt = player.character.name;
  img.id = `img_${player.player}`
  imgCharacters.appendChild(img); 
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

  if (playerAttack.name != 'Escudo'){ 
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
  updateStats(player, enemy, round)
    
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
  
  let playerMessage
  let enemyMessage

  playerMessage = getPlayerMessage(player, player.turnStats.staminaLow);
  enemyMessage = getPlayerMessage(enemy, enemy.turnStats.staminaLow);

  playerOneStatistics.innerHTML = playerMessage;
  playerTwoStatistics.innerHTML = enemyMessage;

}

function getPlayerMessage(player, isLowStamina) {

  const playerMessages = {
    player: {
      attackMessage: `<strong>${player.character.name}</strong><strong>Uso:</strong>${player.turnStats.attack}<strong>Estamina:</strong>${player.turnStats.staminaCost}<strong>Daño:</strong>${player.turnStats.damage}`,
      noStaminaMessage: `<strong>${player.character.name}</strong>sin estamina`,
    },
    enemy: {
      attackMessage: `<strong>${enemy.character.name}</strong><strong>Uso:</strong>${enemy.turnStats.attack}<strong>Estamina:</strong>${enemy.turnStats.staminaCost}<strong>Daño:</strong>${enemy.turnStats.damage}`,
      noStaminaMessage: `<strong>${enemy.character.name}</strong>sin estamina`,
    },
  };

  const playerType = player === enemy ? 'enemy' : 'player';
  return isLowStamina ? playerMessages[playerType].noStaminaMessage : playerMessages[playerType].attackMessage;
}

function winner(){  

  resetDiv.style.display = 'flex'
  resetButton.addEventListener('click', () => {
    location.reload();
  });
  
  let paragraph = document.createElement('p')
  const attackButtons = selectPlayerAttacks.getElementsByTagName('button');
  console.log(attackButtons)
  
  for (const button of attackButtons) {
    button.disabled = true;
  }

  passTurnButton.disabled = true;
  passTurnButton.style.color = '#9de5de';
  console.log(playersStatistics)
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
             