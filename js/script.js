document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

import {random, capitalize} from './utility.js';
import {calculateDamage, damage, checkEnableButton, decreaseShield, applyShield} from './funtions.js';

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
  location.reload();
});


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
let [enemyDamage, playerDamage] = []
let playerCharacter;
let enemyCharacter;
let playerHealth = 100; 
let enemyHealth = 100; 
let playerStamina = 10; 
let enemyStamina = 10;
let playerShield = 0;
let enemyShield = 0;
let round = 0;
let enemyAttackDisabledRound = -1;
let playerAttackDisabledRound  = -1;
let playerCharacterName;
let enemyCharacterName;
let playerAttackName;
let enemyAttackName;

const passTurnButton = document.getElementById('passTurn');
passTurnButton.addEventListener('click', passTurn);

function passTurn() {
  playerAttackName = null
  enemyRandomAttack(playerDamage, enemyDamage);
}



function startGame() {
  
  const buttonCharacterPlayed = document.getElementById('characterButton');
  buttonCharacterPlayed.addEventListener('click', selectPlayerCharacter);
  
  document.getElementById('playerHealth').innerHTML = playerHealth;
  document.getElementById('enemyHealth').innerHTML = enemyHealth;
  document.getElementById('playerStamina').innerHTML = playerStamina;
  document.getElementById('enemyStamina').innerHTML = enemyStamina; 
}


function selectPlayerCharacter() {

  let selectCumbiamon = document.getElementById('selectCumbiamon');
  selectCumbiamon.style.display = 'none';
  let selectAttack = document.getElementById('selectAttack');
  selectAttack.style.display = 'block';

  const spanPlayerCharacter = document.getElementById('playerCharacter');
  document.getElementById('playerAttacks').innerHTML = '';

  for (const name of names) {
      const input = document.getElementById(name);
      if (input && input.checked) {
          playerCharacterName = capitalize(name)
          playerCharacter = cumbiamon[playerCharacterName];
          spanPlayerCharacter.innerHTML = playerCharacterName;
          selectEnemyCharacter();
          return;
      }
  }
  spanPlayerCharacter.innerHTML = 'Ningún personaje seleccionado';
}

function selectEnemyCharacter() {
  const enemyCharacterIndex = random(0, names.length - 1);
  enemyCharacterName = capitalize(names[enemyCharacterIndex])
  enemyCharacter = cumbiamon[enemyCharacterName];
  document.getElementById('enemyCharacter').innerHTML = enemyCharacterName;
  [enemyDamage, playerDamage] = calculateDamage(playerCharacter, enemyCharacter);
  generateAttackButtons(playerCharacter);
}

function generateAttackButtons(character) {

  const playerAttacksDiv = document.getElementById('playerAttacks');
  let idCounter = 0; 

  for (const ability of character.skils) {
    const attackButton = document.createElement('button');
    attackButton.textContent = ability;
    attackButton.id = `${idCounter}`;
    idCounter++;  
    attackButton.addEventListener('click', () => {
      startFight(ability);
    });
    playerAttacksDiv.appendChild(attackButton);
  }
}


function startFight(playerAttack) {

  playerAttackName = playerAttack
  playerShield = decreaseShield(playerShield);
  enemyShield = decreaseShield(enemyShield);
  playerAttackDisabledRound = checkEnableButton(round, playerAttackDisabledRound) 
  if (round - enemyAttackDisabledRound  >= 5) {
    enemyAttackDisabledRound  = -1
  }

  enemyRandomAttack(playerDamage, enemyDamage);
}



function enemyRandomAttack(playerDamage, enemyDamage) {

  let enemyAttackIndex;

  if (enemyAttackDisabledRound  === -1) {
      enemyAttackIndex = random(0, enemyCharacter.skils.length - 1);
  } else {
      const availableAttacks = enemyCharacter.skils.filter((_, index) => index !== 2);
      enemyAttackIndex = random(0, availableAttacks.length - 1);
  }
  
  enemyAttackName = enemyCharacter.skils[enemyAttackIndex];
  let playerAttackIndex = playerCharacter.skils.indexOf(playerAttackName);
  let [totalDamagePlayer = 0, staminaCostPlayer = 0, playerShieldFunt = 0] = [];


  if (playerAttackName !== null){
    [totalDamagePlayer, staminaCostPlayer, playerShieldFunt] = damage(playerAttackIndex, playerDamage);
  }

  let [totalDamageEnemy, staminaCostEnemy, enemyShieldFunt] = damage(enemyAttackIndex, enemyDamage);

  playerShield = applyShield(playerShield, playerShieldFunt)
  enemyShield = applyShield(enemyShield, enemyShieldFunt)

  if (enemyShield > 0 && enemyAttackDisabledRound  === -1){
    enemyAttackDisabledRound  = round;
  }

  if (playerShield > 0 && playerAttackDisabledRound === -1) {
    const attackButtons = document.querySelectorAll('[id="2"]');
    attackButtons.forEach(button => {
      button.disabled = true;
      playerAttackDisabledRound = round;
    });
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
      paragraph.innerHTML = `Tu ${playerCharacterName} pasó turno.\n${enemyCharacterName} no tiene suficiente estamina.`;
      break;
    case (!playerAttackName):
      paragraph.innerHTML = `Tu ${playerCharacterName} pasó turno.\n${enemyCharacterName} atacó con ${enemyAttackName}, gastó ${staminaCostEnemy} puntos de estamina y realizó ${totalDamageEnemy} de daño.`;
      break;
    case (insufficientStaminaPlayer && insufficientStaminaEnemy):
      paragraph.innerHTML = `Tu ${playerCharacterName} no tiene suficiente estamina.\n${enemyCharacterName} no tiene suficiente estamina.`;
      break;
    case (insufficientStaminaPlayer):
      paragraph.innerHTML = `Tu ${playerCharacterName} no tiene suficiente estamina.\n${enemyCharacterName} atacó con ${enemyAttackName}, gastó ${staminaCostEnemy} puntos de estamina y realizó ${totalDamageEnemy} de daño.`;
      break;
    case (insufficientStaminaEnemy):
      paragraph.innerHTML = `Tu ${playerCharacterName} atacó con ${playerAttackName}, gastó ${staminaCostPlayer} puntos de estamina y realizó ${totalDamagePlayer} de daño.\n${enemyCharacterName} no tiene suficiente estamina.`;
      break;
    default:
      paragraph.innerHTML = `Tu ${playerCharacterName} atacó con ${playerAttackName}, gastó ${staminaCostPlayer} puntos de estamina y realizó ${totalDamagePlayer} de daño.\n${enemyCharacterName} atacó con ${enemyAttackName}, gastó ${staminaCostEnemy} puntos de estamina y realizó ${totalDamageEnemy} de daño.`;
      break;
  }

  sectionMessage.appendChild(paragraph);
}

function winner(){
  let sectionMessage = document.getElementById('sectionMessage');
  let paragraph = document.createElement('p')
  let selectPlayerAttacks = document.getElementById('playerAttacks');
  selectPlayerAttacks.style.display = 'none';
  const passTurnButton = document.getElementById('passTurn')
  passTurnButton.disabled = true;

  if (playerHealth > enemyHealth){
    paragraph.innerHTML = `Tu ${playerCharacterName} gano`
  }else{
    paragraph.innerHTML = `Tu rival gano`
  }
  
  sectionMessage.appendChild(paragraph);
}
