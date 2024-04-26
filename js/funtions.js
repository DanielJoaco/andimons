import {random} from './utility.js';

function updateStats(player, enemy, round) {
  document.getElementById('playerHealth').innerHTML = player.health;
  document.getElementById('enemyHealth').innerHTML = enemy.health;
  document.getElementById('playerStamina').innerHTML = player.stamina;
  document.getElementById('enemyStamina').innerHTML = enemy.stamina;
  document.getElementById('playerShield').innerHTML = player.shield;
  document.getElementById('enemyShield').innerHTML = enemy.shield;
  document.getElementById('round').innerHTML = `Ronda: ${round}`;
}

function randomAttack(isDisabled, skills){
  let rivalAttackIndex;
  let attackName;
  if (isDisabled  === -1) {
    rivalAttackIndex = random([0, Object.keys(skills).length - 1]);
    attackName = skills[rivalAttackIndex].emoji;
  } else {
      const availableAttacks = Object.values(skills).filter((_, index) => index !== 0);
      console.log(availableAttacks)
      rivalAttackIndex = random([0, availableAttacks.length - 1]);
      attackName = availableAttacks[rivalAttackIndex].emoji
  }
  return attackName;
}

function calculateDamage(attackPlayerOne, attackPlayerTwo, typePlayerOne, typePlayerTwo) {
 
  const bonusDamage = 1.2;
  let damagePlayerOne = random(attackPlayerOne)
  let damagePlayerTwo = random(attackPlayerTwo)
  let playerOneIsStrong = typePlayerOne.strongType === typePlayerTwo.name;
  let playerTwoIsStrong = typePlayerTwo.strongType === typePlayerOne.name;

  if (playerOneIsStrong) {
    damagePlayerOne *= bonusDamage; 
  } else if (playerTwoIsStrong) {
    damagePlayerTwo *= bonusDamage; 
  } 

  return [Math.round(damagePlayerOne), Math.round(damagePlayerTwo)];
}


function checkEnableButton(round, roundDisabled) {
  if (round - roundDisabled >= 5) {
    const attackButtons = document.querySelectorAll('[id="2"]');
    attackButtons.forEach(button => {
      button.disabled = false;
    });
    return -1;
  }
  return roundDisabled;
}

function disabledShieldButton(shield, roundDisabled, round){

  if (shield > 0 && roundDisabled === -1) {
    const attackButtons = document.querySelectorAll('[id="2"]');
    attackButtons.forEach(button => {
      button.disabled = true;
      roundDisabled = round;
    });
  }
  return roundDisabled
}

function attackCost(player, rival){
  console.log('log funtion', player, rival)
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

function decreaseShield(playerShield, staminaLessRival) {
  if (!staminaLessRival) {
    if (playerShield > 0) {
      return playerShield - 1;
    }
  }
  return playerShield;
}

function applyShield(shield, shieldMod){
  if (Number.isInteger(shieldMod)) {
    shield += shieldMod;
    return shield;
  } 
  return [shield]
}


export {calculateDamage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, attackCost, updateStats}