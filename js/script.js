document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

import {random, capitalize} from './utility.js';
import {calculateDamage, damage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, staminaCost, updateStats} from './funtions.js';

/* const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
  location.reload();
}); */

const passTurnButton = document.getElementById('passTurn');
passTurnButton.addEventListener('click', passTurn);

class Andimons {
  constructor(name, type, strongType, img){
    this.name = name;
    this.type = type;
    this.strongType = strongType;
    this.img = img
    this.skills = [];
  }
}

let voltair = new Andimons('Voltair', 'flying','bug', './assets/eagle.png')
let zumzum = new Andimons('Zumzum', 'bug', 'water',  './assets/bee.png')
let chelonix = new Andimons('Chelonix', 'water', 'fire',  './assets/turtle.png')
let krokotusk = new Andimons('Krokotusk', 'fire', 'earth',  './assets/crocodile.png')
let ursoptix = new Andimons('Ursoptix', 'earth', 'flying',  './assets/spectacledBear.png')

voltair.skills.push('Pico certero', 'Garra aérea', 'Viento huracanado', 'Vista afilada', 'Elevación majestuosa')
zumzum.skills.push('Aguijonada venenosa', 'Enjambre furioso', 'Zumbido ensordecedor', 'Vuelo relámpago', 'Danza de polen')
chelonix.skills.push('Mordida aplastante', 'Caparazón giratorio', 'Remolino marino', 'Cabezazo demoledor', 'Hidroshielding')
krokotusk.skills.push('Mordida ígnea', 'Cola flamígera', 'Rugido incandescente', 'Hidrocalor', 'Camuflaje de cenizas')
ursoptix.skills.push('Garrazo terrateniente', 'Pisotón sísmico', 'Rugido intimidante', 'Avalancha de rocas', 'Bosque frondoso')

let andimons = [voltair, zumzum, chelonix, krokotusk, ursoptix]

let cardContainer = document.getElementById('cardContainer')

let player = {
  name: null,
  properties: null,  
  health: 100,
  stamina: 10,
  shield: 0,
  damage: null,
  hasDisabledAttack: -1,
  turnStatistics: {
    attackName: null,
    damageGenerated: 0,
    staminaCost: 0,
    shieldGenerated: 0,
    insufficientStamina: false
  }
};
let enemy = {
  name: null,
  health: 100,
  stamina: 10,
  shield: 0,
  damage: null,
  hasDisabledAttack: -1,
  turnStatistics: {
    attackName: null,
    damageGenerated: 0,
    staminaCost: 0,
    shieldGenerated: 0,
    insufficientStamina: false
  }
};
let round = 1;

function passTurn() {
  player.turnStatistics.attackName = null;
  player.turnStatistics.damageGenerated = 0;
  player.turnStatistics.staminaCost = 0;
  enemyRandomAttack();
}

function startGame() {

  andimons.forEach((andimon)=>{
    let andimonOptions = `<input type="radio" name="character" id=${andimon.name} />
    <label class="characterCard" for=${andimon.name}>
        <p class="characterName">${andimon.name}</p>
        <img src=${andimon.img} alt=${andimon.name} class="characterImg">            
    </label>`
    cardContainer.innerHTML += andimonOptions
  })

  const buttonCharacterPlayed = document.getElementById('characterButton');
  buttonCharacterPlayed.addEventListener('click', selectPlayerCharacter);  
}


function selectPlayerCharacter() {

  const spanPlayerCharacter = document.getElementById('playerCharacter');

  names.forEach((name) => {
    const input = document.getElementById(name);
    if (input && input.checked) {
        player.name = capitalize(name);
        player.properties = cumbiamon[player.name];
        spanPlayerCharacter.innerHTML = player.name;
        return; 
    }
  }); 

  if (!player.name) {
    alert('Por favor selecciona un personaje.');
    return;
  } 
  let sectionCumbiamon = document.getElementById('sectionCumbiamon');
  sectionCumbiamon.style.display = 'none';
  let sectionAttack = document.getElementById('sectionAttack');
  sectionAttack.style.display = 'flex';
  startRound()
}

function startRound() {
  selectEnemyCharacter();
  updateStats(player, enemy, round);
  generateAttackButtons(player.properties);
}

function selectEnemyCharacter() {
  const enemyCharacterIndex = random(0, names.length - 1);
  enemy.name = capitalize(names[enemyCharacterIndex])
  enemy.properties = cumbiamon[enemy.name];
  document.getElementById('enemyCharacter').innerHTML = enemy.name;
}

function generateAttackButtons(properties) {

  const playerAttacksDiv = document.getElementById('playerAttacks');

  const firstRow = document.createElement('div');
  firstRow.id = 'attack-row-1';
  const secondRow = document.createElement('div');
  secondRow.id = 'attack-row-2';
  const thirdRow = document.createElement('div');
  thirdRow.id = 'attack-row-3';
  const rows = [firstRow, secondRow, thirdRow];

  let currentRow = 0;
  let buttonIndex = 0; 

  properties.skills.forEach(ability => {
      const attackButton = document.createElement('button');
      attackButton.textContent = ability;
      attackButton.id = `attack-button-${buttonIndex}`; 
      attackButton.classList.add('buttonAttack');
      attackButton.addEventListener('click', () => startFight(ability));

      rows[currentRow].appendChild(attackButton);

      currentRow++;
      buttonIndex++;
      if (currentRow >= rows.length) {
          currentRow = 0;
      }
  });
  rows.forEach(row => playerAttacksDiv.appendChild(row));
}

function startFight(playerAttack) {

  [player.damage, enemy.damage] = calculateDamage(player.properties, enemy.properties);
  player.turnStatistics.attackName = playerAttack
  player.hasDisabledAttack = checkEnableButton(round, player.hasDisabledAttack) 
  if (round - enemy.hasDisabledAttack  >= 5) {
    enemy.hasDisabledAttack  = -1
  }

  enemyRandomAttack();
}

function enemyRandomAttack() {

  let playerAttackIndex = player.properties.skills.indexOf(player.turnStatistics.attackName);
  enemy.turnStatistics.attackName = randomAttack(enemy.hasDisabledAttack, enemy.properties.skills)
  let enemyAttackIndex = enemy.properties.skills.indexOf(enemy.turnStatistics.attackName);
  battle(playerAttackIndex, enemyAttackIndex);
}

function battle(playerAttackIndex, enemyAttackIndex){
  
  [player.turnStatistics.damageGenerated, player.turnStatistics.staminaCost, player.turnStatistics.shieldGenerated] = damage(playerAttackIndex, player.damage, player.turnStatistics.attackName);
  [enemy.turnStatistics.damageGenerated, enemy.turnStatistics.staminaCost, enemy.turnStatistics.shieldGenerated] = damage(enemyAttackIndex, enemy.damage, enemy.turnStatistics.attackName);
  
  if (enemy.shield > 0 && enemy.hasDisabledAttack  === -1){
    enemy.hasDisabledAttack  = round;
  }

  [player.stamina, enemy.health, player.turnStatistics.insufficientStamina, player.turnStatistics.damageGenerated] = staminaCost(player, enemy);
  [enemy.stamina, player.health, enemy.turnStatistics.insufficientStamina, enemy.turnStatistics.damageGenerated] = staminaCost(enemy, player);
  
  player.shield = decreaseShield(player.shield, enemy.turnStatistics.insufficientStamina);
  enemy.shield = decreaseShield(enemy.shield, player.turnStatistics.insufficientStamina);

  player.shield = applyShield(player.shield, player.turnStatistics.shieldGenerated)
  enemy.shield = applyShield(enemy.shield, enemy.turnStatistics.shieldGenerated)
  player.hasDisabledAttack = disabledShieldButton(player.shield, player.hasDisabledAttack, round)

  round += 1;
  player.stamina += 1;
  enemy.stamina += 1;
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
  let playerOneStatistics = document.getElementById('playerOneStatistics');
  let playerTwoStatistics = document.getElementById('playerTwoStatistics');
  let paragraphOne = ''
  let paragraphTwo = ''

  switch (true) {
    case (!player.turnStatistics.attackName && enemy.turnStatistics.insufficientStamina):
      paragraphOne.innerHTML = `${player.name}<br>pasó turno.` ;
      paragraphTwo.innerHTML = `${enemy.name} <br> sin estamina.`;
      break;
    case (!player.turnStatistics.attackName):
      paragraphOne = `${player.name} <br> pasó turno` ;
      paragraphTwo = `${enemy.name}<br>Atacó con:<br>${enemy.turnStatistics.attackName}<br>Estamina:<br>-${enemy.turnStatistics.staminaCost}<br>Daño realizado:<br>${enemy.turnStatistics.damageGenerated}`;
      break;
    case (player.turnStatistics.insufficientStamina && enemy.turnStatistics.insufficientStamina):
      paragraphOne = `${player.name}<br>sin estamina`;
      paragraphTwo = `${enemy.name}<br>sin estamina`;
      break;
    case (player.turnStatistics.insufficientStamina):
      paragraphOne = `${player.name}<br>sin estamina`;
      paragraphTwo = `${enemy.name}<br>Atacó con:<br>${enemy.turnStatistics.attackName}<br>Estamina:<br>-${enemy.turnStatistics.staminaCost}<br>Daño realizado:<br>${enemy.turnStatistics.damageGenerated}`;
      break;
    case (enemy.turnStatistics.insufficientStamina):
      paragraphOne = `${player.name}<br>Atacó con:<br>${player.turnStatistics.attackName}<br>Estamina:<br>-${player.turnStatistics.staminaCost}<br>Daño realizado:<br>${player.turnStatistics.damageGenerated}`;
      paragraphTwo = `${enemy.name}<br>sin estamina`;
      break;
    default:
      paragraphOne = `${player.name}<br>Atacó con:<br>${player.turnStatistics.attackName}<br>Estamina:<br>-${player.turnStatistics.staminaCost}<br>Daño realizado:<br>${player.turnStatistics.damageGenerated}`;
      paragraphTwo = `${enemy.name}<br>Atacó con:<br>${enemy.turnStatistics.attackName}<br>Estamina:<br>-${enemy.turnStatistics.staminaCost}<br>Daño realizado:<br>${enemy.turnStatistics.damageGenerated}`;
      break;
  }

  playerOneStatistics.innerHTML = paragraphOne;
  playerTwoStatistics.innerHTML = paragraphTwo;
/* 
  let sectionMessage = document.getElementById('sectionMessage')
  sectionMessage.scrollTop = sectionMessage.scrollHeight; */
}

function winner(){
  let sectionMessage = document.getElementById('sectionMessage');
  let paragraph = document.createElement('p')

  let selectPlayerAttacks = document.getElementById('playerAttacks');
  const attackButtons = selectPlayerAttacks.getElementsByTagName('button');
  for (const button of attackButtons) {
    button.disabled = true;
  }

  passTurnButton.disabled = true;

  if (player.health > enemy.health){
    paragraph.innerHTML = `Tu ${player.name} gano`
  }else{
    paragraph.innerHTML = `Tu rival gano`
  }
  
  sectionMessage.appendChild(paragraph);
}
             