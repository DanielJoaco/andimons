document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

import {random, capitalize} from './utility.js';
import {calculateDamage, damage, checkEnableButton, decreaseShield, applyShield} from './funtions.js';

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
  attackName: null
};
let enemy = {
  character: null,
  name: null,
  health: 100,
  stamina: 10,
  shield: 0,
  damage: null,
  attackDisabledRound: -1,
  attackName: null
};
let round = 0;

function passTurn() {
  playerAttackName = null
  enemyRandomAttack(player.damage, enemy.damage);
}

function startGame() {

  document.getElementById('playerHealth').innerHTML = player.health;
  document.getElementById('enemyHealth').innerHTML = enemy.health;
  document.getElementById('playerStamina').innerHTML = player.stamina;
  document.getElementById('enemyStamina').innerHTML = enemy.stamina; 
  
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

  [player.damage, enemy.damage] = calculateDamage(player.properties, enemy.properties);

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

  player.attackName = playerAttack
  player.shield = decreaseShield(player.shield);
  enemy.shield = decreaseShield(enemy.shield);
  player.attackDisabledRound = checkEnableButton(round, player.attackDisabledRound) 

  if (round - enemy.attackDisabledRound  >= 5) {
    enemy.attackDisabledRound  = -1
  }

  enemyRandomAttack();
}

function enemyRandomAttack() {

  let enemyAttackIndex;
  let playerAttackIndex = player.properties.skils.indexOf(player.attackName);
  let [totalDamagePlayer = 0, staminaCostPlayer = 0, playerShieldFunt = 0] = [];

  if (enemy.attackDisabledRound  === -1) {
      enemyAttackIndex = random(0, enemy.properties.skils.length - 1);
  } else {
      const availableAttacks = enemy.properties.skils.filter((_, index) => index !== 2);
      enemyAttackIndex = random(0, availableAttacks.length - 1);
      console.log(availableAttacks, enemyAttackIndex)
  }
  
  enemy.attackName = enemy.properties.skils[enemyAttackIndex];
  
  if (player.attackName !== null){
    [totalDamagePlayer, staminaCostPlayer, playerShieldFunt] = damage(playerAttackIndex, player.damage);
  }

  let [totalDamageEnemy, staminaCostEnemy, enemyShieldFunt] = damage(enemyAttackIndex, enemy.damage);

  player.shield = applyShield(player.shield, playerShieldFunt)
  enemy.shield = applyShield(enemy.shield, enemyShieldFunt)

  if (player.shield > 0 && player.attackDisabledRound === -1) {
    const attackButtons = document.querySelectorAll('[id="2"]');
    attackButtons.forEach(button => {
      button.disabled = true;
      player.attackDisabledRound = round;
    });
  }

  if (enemy.shield > 0 && enemy.attackDisabledRound  === -1){
    enemy.attackDisabledRound  = round;
  }

  let insufficientStaminaPlayer = false;
  let insufficientStaminaEnemy = false;

  if (staminaCostPlayer < playerStamina) {
    if (enemyShield > 0) {
        enemyHealth -= totalDamagePlayer / 2; 
    } else {
        enemyHealth -= totalDamagePlayer;
    }
    playerStamina -= staminaCostPlayer; 
  } else {
    insufficientStaminaPlayer = true
    console.log('Estamina insuficiente');
  }

  if (staminaCostEnemy < enemyStamina) {
    if (playerShield > 0) {
        playerHealth -= totalDamageEnemy / 2; 
    } else {
        playerHealth -= totalDamageEnemy;
    }
    enemyStamina -= staminaCostEnemy; 
  } else {
    insufficientStaminaEnemy = true
    console.log('Estamina insuficiente');
  }
  
  document.getElementById('playerHealth').innerHTML = playerHealth;
  document.getElementById('enemyHealth').innerHTML = enemyHealth;  
  document.getElementById('playerStamina').innerHTML = playerStamina;
  document.getElementById('enemyStamina').innerHTML = enemyStamina; 
  round += 1;
  playerStamina += 1;
  enemyStamina += 1;
  if (playerHealth > 0 && enemyHealth > 0){
    createMessage(staminaCostPlayer, totalDamagePlayer, staminaCostEnemy, totalDamageEnemy, insufficientStaminaPlayer, insufficientStaminaEnemy)
  } else {
    winner()
  }

}

function createMessage(staminaCostPlayer, totalDamagePlayer, staminaCostEnemy, totalDamageEnemy, insufficientStaminaPlayer, insufficientStaminaEnemy) {
  let sectionMessage = document.getElementById('sectionMessage');
  let paragraph = document.createElement('p')

  switch (true) {
    case (!playerAttackName && insufficientStaminaEnemy):
      paragraph.innerHTML = `Tu ${playerCharacterName} pasó turno.\n El ${enemyCharacterName} rival no tiene suficiente estamina.`;
      break;
    case (!playerAttackName):
      paragraph.innerHTML = `Tu ${playerCharacterName} pasó turno.\n El ${enemyCharacterName} rival atacó con ${enemyAttackName}, gastó ${staminaCostEnemy} puntos de estamina y realizó ${totalDamageEnemy} de daño.`;
      break;
    case (insufficientStaminaPlayer && insufficientStaminaEnemy):
      paragraph.innerHTML = `Tu ${playerCharacterName} no tiene suficiente estamina.\n El ${enemyCharacterName} rival no tiene suficiente estamina.`;
      break;
    case (insufficientStaminaPlayer):
      paragraph.innerHTML = `Tu ${playerCharacterName} no tiene suficiente estamina.\n El ${enemyCharacterName} rival atacó con ${enemyAttackName}, gastó ${staminaCostEnemy} puntos de estamina y realizó ${totalDamageEnemy} de daño.`;
      break;
    case (insufficientStaminaEnemy):
      paragraph.innerHTML = `Tu ${playerCharacterName} atacó con ${playerAttackName}, gastó ${staminaCostPlayer} puntos de estamina y realizó ${totalDamagePlayer} de daño.\n El ${enemyCharacterName} rival no tiene suficiente estamina.`;
      break;
    default:
      paragraph.innerHTML = `Tu ${playerCharacterName} atacó con ${playerAttackName}, gastó ${staminaCostPlayer} puntos de estamina y realizó ${totalDamagePlayer} de daño.\n El ${enemyCharacterName} rival atacó con ${enemyAttackName}, gastó ${staminaCostEnemy} puntos de estamina y realizó ${totalDamageEnemy} de daño.`;
      break;
  }

  sectionMessage.appendChild(paragraph);
}

function winner(){
  let sectionMessage = document.getElementById('sectionMessage');
  let paragraph = document.createElement('p')

  let selectPlayerAttacks = document.getElementById('playerAttacks');
  const attackButtons = selectPlayerAttacks.getElementsByTagName('button');
  for (const button of attackButtons) {
    button.disabled = true;
  }

  const passTurnButton = document.getElementById('passTurn')
  passTurnButton.disabled = true;

  if (playerHealth > enemyHealth){
    paragraph.innerHTML = `Tu ${playerCharacterName} gano`
  }else{
    paragraph.innerHTML = `Tu rival gano`
  }
  
  sectionMessage.appendChild(paragraph);
}
