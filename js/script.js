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
const buttonCharacterPlayed = document.getElementById('characterButton');
const playerAttacksDiv = document.getElementById('playerAttacks');
const cardContainer = document.getElementById('cardContainer')
const spanPlayerCharacter = document.getElementById('playerCharacter');
const sectionCumbiamon = document.getElementById('sectionCumbiamon');
const sectionAttack = document.getElementById('sectionAttack');

class Andimons {
  constructor(name, type, strongType, img){
    this.name = name;
    this.type = type;
    this.strongType = strongType;
    this.img = img
    this.skills = [];
  }
}

class Player {
  constructor() {
    this.character = null; 
    this.health = 100;
    this.stamina = 10;
    this.shield = 0; 
    this.damage = null;
    this.hasDisabledAttack = -1; 
    this.turnStats = {
      attack: null,
      damageGenerated: 0,
      staminaCost: 0,
      shieldGenerated: 0,
      insufficientStamina: false
    };
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
let player = new Player();
let enemy = new Player();
console.log(player, enemy)
let round = 1;

function passTurn() {
  player.turnStats.attack = null;
  player.turnStats.damageGenerated = 0;
  player.turnStats.staminaCost = 0;
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

  buttonCharacterPlayed.addEventListener('click', selectPlayerCharacter);  
}


function selectPlayerCharacter() {

  andimons.forEach((andimon) => {
    let input = document.getElementById(andimon.name);
    if (input && input.checked) {
        player.character = andimon;
        console.log(player, andimon)
        spanPlayerCharacter.innerHTML = player.character.name;        
        return; 
    }
  }); 

  if (!player.character) {
    alert('Por favor selecciona un personaje.');
    return;
  } 
  
  sectionCumbiamon.style.display = 'none';  
  sectionAttack.style.display = 'flex';
  startRound()
}

function startRound() {
  selectEnemyCharacter();
  updateStats(player, enemy, round);
  generateAttackButtons(player.character);
}

function selectEnemyCharacter() {
  const enemyCharacterIndex = random(0, andimons.length - 1);
  enemy.character = andimons[enemyCharacterIndex];
  console.log(enemy)
  document.getElementById('enemyCharacter').innerHTML = enemy.character.name;
}

function generateAttackButtons(character) {

  passTurnButton.addEventListener('click', passTurn);
  const firstRow = document.createElement('div');
  firstRow.id = 'attack-row-1';
  const secondRow = document.createElement('div');
  secondRow.id = 'attack-row-2';
  const thirdRow = document.createElement('div');
  thirdRow.id = 'attack-row-3';
  const rows = [firstRow, secondRow, thirdRow];

  let currentRow = 0;
  let buttonIndex = 0; 

  character.skills.forEach(ability => {
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

  [player.damage, enemy.damage] = calculateDamage(player.character, enemy.character);
  player.turnStats.attack = playerAttack
  player.hasDisabledAttack = checkEnableButton(round, player.hasDisabledAttack) 
  if (round - enemy.hasDisabledAttack  >= 5) {
    enemy.hasDisabledAttack  = -1
  }

  enemyRandomAttack();
}

function enemyRandomAttack() {

  let playerAttackIndex = player.character.skills.indexOf(player.turnStats.attack);
  enemy.turnStats.attack = randomAttack(enemy.hasDisabledAttack, enemy.character.skills)
  let enemyAttackIndex = enemy.character.skills.indexOf(enemy.turnStats.attack);
  battle(playerAttackIndex, enemyAttackIndex);
}

function battle(playerAttackIndex, enemyAttackIndex){
  
  [player.turnStats.damageGenerated, player.turnStats.staminaCost, player.turnStats.shieldGenerated] = damage(playerAttackIndex, player.damage, player.turnStats.attack);
  [enemy.turnStats.damageGenerated, enemy.turnStats.staminaCost, enemy.turnStats.shieldGenerated] = damage(enemyAttackIndex, enemy.damage, enemy.turnStats.attack);
  
  if (enemy.shield > 0 && enemy.hasDisabledAttack  === -1){
    enemy.hasDisabledAttack  = round;
  }

  [player.stamina, enemy.health, player.turnStats.insufficientStamina, player.turnStats.damageGenerated] = staminaCost(player, enemy);
  [enemy.stamina, player.health, enemy.turnStats.insufficientStamina, enemy.turnStats.damageGenerated] = staminaCost(enemy, player);
  
  player.shield = decreaseShield(player.shield, enemy.turnStats.insufficientStamina);
  enemy.shield = decreaseShield(enemy.shield, player.turnStats.insufficientStamina);

  player.shield = applyShield(player.shield, player.turnStats.shieldGenerated)
  enemy.shield = applyShield(enemy.shield, enemy.turnStats.shieldGenerated)
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
    case (!player.turnStats.attack && enemy.turnStats.insufficientStamina):
      paragraphOne.innerHTML = `${player.name}<br>pasó turno.` ;
      paragraphTwo.innerHTML = `${enemy.name} <br> sin estamina.`;
      break;
    case (!player.turnStats.attack):
      paragraphOne = `${player.name} <br> pasó turno` ;
      paragraphTwo = `${enemy.name}<br>Atacó con:<br>${enemy.turnStats.attack}<br>Estamina:<br>-${enemy.turnStats.staminaCost}<br>Daño realizado:<br>${enemy.turnStats.damageGenerated}`;
      break;
    case (player.turnStats.insufficientStamina && enemy.turnStats.insufficientStamina):
      paragraphOne = `${player.name}<br>sin estamina`;
      paragraphTwo = `${enemy.name}<br>sin estamina`;
      break;
    case (player.turnStats.insufficientStamina):
      paragraphOne = `${player.name}<br>sin estamina`;
      paragraphTwo = `${enemy.name}<br>Atacó con:<br>${enemy.turnStats.attack}<br>Estamina:<br>-${enemy.turnStats.staminaCost}<br>Daño realizado:<br>${enemy.turnStats.damageGenerated}`;
      break;
    case (enemy.turnStats.insufficientStamina):
      paragraphOne = `${player.name}<br>Atacó con:<br>${player.turnStats.attack}<br>Estamina:<br>-${player.turnStats.staminaCost}<br>Daño realizado:<br>${player.turnStats.damageGenerated}`;
      paragraphTwo = `${enemy.name}<br>sin estamina`;
      break;
    default:
      paragraphOne = `${player.name}<br>Atacó con:<br>${player.turnStats.attack}<br>Estamina:<br>-${player.turnStats.staminaCost}<br>Daño realizado:<br>${player.turnStats.damageGenerated}`;
      paragraphTwo = `${enemy.name}<br>Atacó con:<br>${enemy.turnStats.attack}<br>Estamina:<br>-${enemy.turnStats.staminaCost}<br>Daño realizado:<br>${enemy.turnStats.damageGenerated}`;
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
             