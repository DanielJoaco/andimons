document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

import {random, capitalize} from './utility.js';
import {calculateDamage, damage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, staminaCost} from './funtions.js';

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
  location.reload();
});

const passTurnButton = document.getElementById('passTurn');
passTurnButton.addEventListener('click', passTurn);

const cumbiamon = {
  'Chocoramon': {
    type: 'Dulce',
    strongAgainst: 'Psíquico',
    skils: [ 'Bomba de Chocolate', 'Tormenta de Gominolas', 'Torrones de Azúcar', 'Dulce Encanto', 'Arequipito']
  },
  'Marimondex': {
    type: 'Psíquico',
    strongAgainst: 'Rocoso',
    skils: ['Confusión Carnavalera', 'Telequinesis de Tambor', 'Barrera de Maracas', 'Realismo mágico', 'Cumbia control']
  },
  'Paramón': {
    type: 'Rocoso',
    strongAgainst: 'Lucha',
    skils: ['Avalancha Andina', 'Terremoto Tropiandes', 'Muralla de Selva', 'Deslizamiento de Río', 'Roca Afilada de Guatapé']
  },
  'Palenqueta': {
    type: 'Lucha',
    strongAgainst: 'Metal',
    skils: ['Golpe de Tambores', 'Patada de Marimba', 'Resguardo Ancestral','Salto de Cimarrón', 'Rebelión']
  },
  'Doradón': {
    type: 'Metal',
    strongAgainst: 'Dulce' ,
    skils: ['Destello de Oro', 'Martillo del Dorado', 'Escudo Esmeralda', 'Diamantruenos', 'Estocada de Oricalco']
  },
};

const names = Object.keys(cumbiamon).map(name => name.toLowerCase());

let player = {
  name: null,
  properties: null,  
  health: 100,
  stamina: 10,
  shield: 0,
  damage: null,
  attackDisabledRound: -1,
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
  attackDisabledRound: -1,
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

  document.getElementById('playerHealth').innerHTML = player.health;
  document.getElementById('enemyHealth').innerHTML = enemy.health;
  document.getElementById('playerStamina').innerHTML = player.stamina;
  document.getElementById('enemyStamina').innerHTML = enemy.stamina;
  document.getElementById('playerShield').innerHTML = player.shield;
  document.getElementById('enemyShield').innerHTML = enemy.shield;
  const buttonCharacterPlayed = document.getElementById('characterButton');
  buttonCharacterPlayed.addEventListener('click', selectPlayerCharacter);  
}


function selectPlayerCharacter() {

  let sectionCumbiamon = document.getElementById('sectionCumbiamon');
  sectionCumbiamon.style.display = 'none';
  let sectionAttack = document.getElementById('sectionAttack');
  sectionAttack.style.display = 'flex';

  const spanPlayerCharacter = document.getElementById('playerCharacter');

  for (const name of names) {
      const input = document.getElementById(name);
      if (input && input.checked) {
          player.name = capitalize(name)
          player.properties = cumbiamon[player.name];
          spanPlayerCharacter.innerHTML = player.name;
          selectEnemyCharacter();
          return;
      }
  }
    ;
}

function selectEnemyCharacter() {

  const enemyCharacterIndex = random(0, names.length - 1);
  enemy.name = capitalize(names[enemyCharacterIndex])
  enemy.properties = cumbiamon[enemy.name];
  document.getElementById('enemyCharacter').innerHTML = enemy.name;

  generateAttackButtons(player.properties);
}

function generateAttackButtons(properties) {

  const playerAttacksDiv = document.getElementById('playerAttacks');
  let idCounter = 0; 

  for (const ability of properties.skils) {
    const attackButton = document.createElement('button');
    attackButton.textContent = ability;
    attackButton.id = `${idCounter}`;
    attackButton.classList.add('buttonAttack');
    idCounter++;  
    attackButton.addEventListener('click', () => {
      startFight(ability);
    });
    playerAttacksDiv.appendChild(attackButton);
  }
}


function startFight(playerAttack) {

  [player.damage, enemy.damage] = calculateDamage(player.properties, enemy.properties);
  player.turnStatistics.attackName = playerAttack
    player.attackDisabledRound = checkEnableButton(round, player.attackDisabledRound) 
  if (round - enemy.attackDisabledRound  >= 5) {
    enemy.attackDisabledRound  = -1
  }

  enemyRandomAttack();
}

function enemyRandomAttack() {

  let playerAttackIndex = player.properties.skils.indexOf(player.turnStatistics.attackName);
  enemy.turnStatistics.attackName = randomAttack(enemy.attackDisabledRound, enemy.properties.skils)
  let enemyAttackIndex = enemy.properties.skils.indexOf(enemy.turnStatistics.attackName);
  battle(playerAttackIndex, enemyAttackIndex);
}

function battle(playerAttackIndex, enemyAttackIndex){
  
  [player.turnStatistics.damageGenerated, player.turnStatistics.staminaCost, player.turnStatistics.shieldGenerated] = damage(playerAttackIndex, player.damage, player.turnStatistics.attackName);
  [enemy.turnStatistics.damageGenerated, enemy.turnStatistics.staminaCost, enemy.turnStatistics.shieldGenerated] = damage(enemyAttackIndex, enemy.damage, enemy.turnStatistics.attackName);
  

  console.log(player,enemy)
  
  if (enemy.shield > 0 && enemy.attackDisabledRound  === -1){
    enemy.attackDisabledRound  = round;
  }

  [player.stamina, enemy.health, player.turnStatistics.insufficientStamina, player.turnStatistics.damageGenerated] = staminaCost(player, enemy);
  [enemy.stamina, player.health, enemy.turnStatistics.insufficientStamina, enemy.turnStatistics.damageGenerated] = staminaCost(enemy, player);
  
  player.shield = decreaseShield(player.shield, enemy.turnStatistics.insufficientStamina);
  enemy.shield = decreaseShield(enemy.shield, player.turnStatistics.insufficientStamina);

  


  player.shield = applyShield(player.shield, player.turnStatistics.shieldGenerated)
  enemy.shield = applyShield(enemy.shield, enemy.turnStatistics.shieldGenerated)
  player.attackDisabledRound = disabledShieldButton(player.shield, player.attackDisabledRound, round)
  document.getElementById('playerHealth').innerHTML = player.health;
  document.getElementById('enemyHealth').innerHTML = enemy.health;  
  document.getElementById('playerStamina').innerHTML = player.stamina;
  document.getElementById('enemyStamina').innerHTML = enemy.stamina;
  document.getElementById('playerShield').innerHTML = player.shield;
  document.getElementById('enemyShield').innerHTML = enemy.shield;
  document.getElementById('round').innerHTML = `Ronda: ${round}`;
  round += 1;
  player.stamina += 1;
  enemy.stamina += 1;  

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
  let sectionMessage = document.getElementById('sectionMessage');
  let paragraph = document.createElement('p')

  switch (true) {
    case (!player.turnStatistics.attackName && enemy.turnStatistics.insufficientStamina):
      paragraph.innerHTML = `Tu ${player.name} pasó turno.\n El ${enemy.name} rival no tiene suficiente estamina.`;
      break;
    case (!player.turnStatistics.attackName):
      paragraph.innerHTML = `Tu ${player.name} pasó turno.\n El ${enemy.name} rival atacó con ${enemy.turnStatistics.attackName}, gastó ${enemy.turnStatistics.staminaCost} puntos de estamina y realizó ${enemy.turnStatistics.damageGenerated} de daño.`;
      break;
    case (player.turnStatistics.insufficientStamina && enemy.turnStatistics.insufficientStamina):
      paragraph.innerHTML = `Tu ${player.name} no tiene suficiente estamina.\n El ${enemy.name} rival no tiene suficiente estamina.`;
      break;
    case (player.turnStatistics.insufficientStamina):
      paragraph.innerHTML = `Tu ${player.name} no tiene suficiente estamina.\n El ${enemy.name} rival atacó con ${enemy.turnStatistics.attackName}, gastó ${enemy.turnStatistics.staminaCost} puntos de estamina y realizó ${enemy.turnStatistics.damageGenerated} de daño.`;
      break;
    case (enemy.turnStatistics.insufficientStamina):
      paragraph.innerHTML = `Tu ${player.name} atacó con ${player.turnStatistics.attackName}, gastó ${player.turnStatistics.staminaCost} puntos de estamina y realizó ${player.turnStatistics.damageGenerated} de daño.\n El ${enemy.name} rival no tiene suficiente estamina.`;
      break;
    default:
      paragraph.innerHTML = `Tu ${player.name} atacó con ${player.turnStatistics.attackName}, gastó ${player.turnStatistics.staminaCost} puntos de estamina y realizó ${player.turnStatistics.damageGenerated} de daño.\n El ${enemy.name} rival atacó con ${enemy.turnStatistics.attackName}, gastó ${enemy.turnStatistics.staminaCost} puntos de estamina y realizó ${enemy.turnStatistics.damageGenerated} de daño.`;
      break;
  }

  sectionMessage.appendChild(paragraph);
  sectionMessage.scrollTop = sectionMessage.scrollHeight;
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
             