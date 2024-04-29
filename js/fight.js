import {random} from './utility.js';
import {winner} from './winner.js';

const sectionCanvas = document.getElementById('sectionCanvas')
const sectionAttack = document.getElementById('sectionAttack')
const imgPlayerOne = document.getElementById('imgPlayerOne')
const imgPlayerTwo = document.getElementById('imgPlayerTwo')
const playerAttacksDiv = document.getElementById('playerAttacks')
const statsPlayerOne = document.getElementById('statsPlayerOne')
const statsPlayerTwo = document.getElementById('statsPlayerTwo')
const roundDiv = document.getElementById('round')
const passTurnButton = document.getElementById('passTurn');
const sectionMessage = document.getElementById('sectionMessage');

let round
let player
let enemy

function startRound(playerCanvas, enemyCanvas) {

    player = playerCanvas
    enemy = enemyCanvas
    round = 0

    sectionCanvas.style.display = 'none';
    sectionAttack.style.display = 'flex';
  
    createImage(player, imgPlayerOne)
    createImage(enemy, imgPlayerTwo)
  
    statsPlayerOne.innerHTML = updateStats(player);
    statsPlayerTwo.innerHTML = updateStats(enemy);
    roundDiv.innerHTML = `Ronda: ${round}`
  
    generateAttackButtons(player.character);
  
}

function createImage(player, htmlElementet) { 
const img = document.createElement('img');
img.src = player.character.img;
img.alt = player.character.name;
img.id = `img_${player.player}`
htmlElementet.innerHTML = ''
htmlElementet.appendChild(img); 
}

function updateStats(player) {
    const progressBar = (value, max) => {
      value = value < 0 ? 0 : value;
      const percentage = Math.min(100, Math.round(value / max * 100));
      const barLength = 10; 
      const filledLength = Math.round(percentage * barLength / 100);
      const emptyLength = barLength - filledLength;
  
      return `[${"|".repeat(filledLength)}${" ".repeat(emptyLength)}] ${percentage}%`;
    };
  
    let paragraphStats = `
      <strong>${player.player}</strong> 
      <br>${player.character.name} 
      <br>Vida: <strong>${progressBar(player.health, 100)}</strong> 
      <br>Estamina: <strong>${progressBar(player.stamina, 10)}</strong> 
      <br>Escudo: <strong>${progressBar(player.shield, 2)}</strong> 
    `;
  
    return paragraphStats;
}

function generateAttackButtons(character) {

    passTurnButton.addEventListener('click', passTurn);
    playerAttacksDiv.innerHTML = '' 

    character.skills.forEach((attack, i) => {
        let attackButton = document.createElement('button');
        attackButton.textContent = attack.emoji;
        attackButton.id = `buttonAttack_${i}`; 
        attackButton.classList.add('buttonsAttacks');
        playerAttacksDiv.appendChild(attackButton)
        attackButton.addEventListener('click', () => enemyRandomAttack(attack));    
    });
}

function passTurn() {

    player.turnStats.damage = null;
    player.turnStats.staminaCost = 0;
    enemyRandomAttack(player.turnStats);
}
  
function enemyRandomAttack(playerAttack) {

    const enemyAttack = chooseEnemyAttack(enemy);
    const damageResults = calculateDamage(playerAttack.damage, enemyAttack.damage, player.character.type, enemy.character.type);
    updateStatsPlayers(damageResults, playerAttack, enemyAttack);
        
    enableAttacks();
}

function chooseEnemyAttack() {

    let enemyAttackEmoji = randomAttack()
    let enemyAttack = findSkillByEmoji(enemyAttackEmoji)
    return enemyAttack;
}

function randomAttack(){

    let rivalAttackIndex;
    let attackEmoji;

    if (enemy.disabledAttack  === -1) {
        rivalAttackIndex = random([0, enemy.character.skills.length - 1]);
        attackEmoji = enemy.character.skills[rivalAttackIndex].emoji;
    } else {
        const availableAttacks = enemy.character.skills.filter((_, index) => index !== 0);

        rivalAttackIndex = random([0, availableAttacks.length - 1]);
        attackEmoji = availableAttacks[rivalAttackIndex].emoji
    }
    return attackEmoji;
}
  
function findSkillByEmoji(emoji){

    let skills = enemy.character.skills

    for (let i in skills) {
        const skillObjectItem = skills[i]; 
        for (const skillProperty in skillObjectItem) {
        if (typeof skillObjectItem[skillProperty] === 'string' && skillObjectItem[skillProperty].includes(emoji)) {
            return skills[i];
            }   
        }
    }
    return null; 
}

function calculateDamage(attackPlayer, attackEnemy) {

    const bonusDamage = 1.2;
    let typePlayer = player.character.type
    let typeEnemy = enemy.character.type

    if (attackPlayer === null) {
        if (typeEnemy.strongType === typePlayer.name) {
        return [null, Math.round(random(attackEnemy) * bonusDamage)];
        } else {
        return [null, Math.round(random(attackEnemy))];
        }
    }

    let damagePlayer = random(attackPlayer)
    let damageEnemy = random(attackEnemy)
    let playerIsStrong = typePlayer.strongType === typeEnemy.name;
    let enemyTwoIsStrong = typeEnemy.strongType === typePlayer.name;

    if (playerIsStrong) {
        damagePlayer *= bonusDamage; 
    } else if (enemyTwoIsStrong) {
        damageEnemy *= bonusDamage; 
    } 

    return [Math.round(damagePlayer), Math.round(damageEnemy)];
}

function updateStatsPlayers(damageResults, playerAttack, enemyAttack) {

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

    if (round - player.disabledAttack >= 5) {
        const attackButtons = document.querySelectorAll('[id="buttonAttack_0"]');
        attackButtons.forEach(button => {
        button.disabled = false;
        });
        player.disabledAttack = -1;
    }

    if (round - enemy.disabledAttack  >= 5) {
        enemy.disabledAttack  = -1
    }

    battle();
}

function battle(){
  
    [player.stamina, player.turnStats.staminaLow, player.turnStats.damage, enemy.health] = attackCost(player, enemy);
    [enemy.stamina, enemy.turnStats.staminaLow, enemy.turnStats.damage, player.health] = attackCost(enemy, player);

    updateShields()
    disabledShielAttack()

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

function attackCost(player, rival){

    let staminaLow = false;
    let damageGenerated = player.turnStats.damage

    if (-player.turnStats.staminaCost < player.stamina) {
    if (rival.shield > 0) {
        rival.health -= player.turnStats.damage / 2; 
        damageGenerated /= 2;
    } else {
        rival.health -= player.turnStats.damage;
    }
    player.stamina += player.turnStats.staminaCost; 
    } else {
    staminaLow = true
    }
    return [player.stamina, staminaLow, damageGenerated, rival.health]
}

function updateShields() {

    if (!enemy.turnStats.staminaLow && player.shield > 0) {
        player.shield -= 1;
    }

    if (!player.turnStats.staminaLow && enemy.shield > 0) {
        enemy.shield -= 1;
    }

    if (Number.isInteger(player.turnStats.shield)) {
        player.shield += player.turnStats.shield;
    }

    if (Number.isInteger(enemy.turnStats.shield)) {
        enemy.shield += enemy.turnStats.shield;
    }

}

function disabledShielAttack(){

    if (enemy.shield > 0 && enemy.disabledAttack === -1) {
        enemy.disabledAttack = round;
    }

    if (player.shield > 0 && player.disabledAttack === -1) {
      const attackButtons = document.querySelectorAll('[id="buttonAttack_0"]');
      attackButtons.forEach(button => {
        button.disabled = true;
        player.disabledAttack = round;
      });
    }
  }
  
function checkWinner(){

    if (player.health > 0 && enemy.health > 0){
        createMessage()
    } else {
        winner(player, enemy)
    } 
}

function createMessage() {

    sectionMessage.style.display = 'flex'; 
    let playerMessage
    let enemyMessage
  
    playerMessage = getPlayerMessage(player);
    enemyMessage = getPlayerMessage(enemy);
  
    document.getElementById('playerOneStatistics').innerHTML = playerMessage;
    document.getElementById('playerTwoStatistics').innerHTML = enemyMessage;
  
  }
  
  function getPlayerMessage(player) {

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




export {startRound}