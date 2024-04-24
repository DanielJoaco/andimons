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

function calculateDamage(playerOne, playerTwo) {
  const baseDamage = {
    low: random(1, 5),
    standard: random(5, 10),
    medium: random(10, 15),
    high: random(15, 20),
  };
  let playerOneDamage = { ...baseDamage };
  let playerTwoDamage = { ...baseDamage };

  if (playerOne && playerTwo) {
    let playerOneIsStrong = playerOne.strongAgainst === playerTwo.type;
    let playerTwoIsStrong = playerTwo.strongAgainst === playerOne.type;
    
    if (playerOneIsStrong) {
      playerOneDamage = applyBonusDamage(baseDamage);
    } else if (playerTwoIsStrong) {
      playerTwoDamage = applyBonusDamage(baseDamage);
    }    
  } 
  return [playerOneDamage, playerTwoDamage];
}

function applyBonusDamage(baseDamage) {

  const bonusDamage = 1.2
  let modifiedDamage = {};

  for (let key in baseDamage) {
    modifiedDamage[key] = Math.round(baseDamage[key] * bonusDamage);
  }
  return modifiedDamage;
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

function randomAttack(isDisabled, skills){
  let rivalAttackIndex;
  let attackName;
  if (isDisabled  === -1) {
    rivalAttackIndex = random(0, skills.length - 1);
    attackName = skills[rivalAttackIndex];
  } else {
      const availableAttacks = skills.filter((_, index) => index !== 2);
      rivalAttackIndex = random(0, availableAttacks.length - 1);
      attackName = availableAttacks[rivalAttackIndex]
  }
  return attackName;
}

function damage(skillIndex, attack, attackName) {

  const attackProperties = {
    1: { damage: 'standard', staminaCost: [1, 3] },
    3: { damage: 'standard', staminaCost: [1, 3] },
    0: { damage: 'medium', staminaCost: [3, 4] }, 
    2: { damage: 'low', staminaCost: 0, shield: 2 },
    4: { damage: 'high', staminaCost: [4, 5] },
  };
  let attackDamage = 0
  let staminaCost = 0
  let shield = 0

  if (attackName !== null) {
    const properties = attackProperties[skillIndex] || {};
    attackDamage = attack[properties.damage] || 0; 
    staminaCost = random(...properties.staminaCost || [0, 0]); 
    shield = properties.shield || 0;
  }

  return [attackDamage, staminaCost, shield];
}

function staminaCost(player, rival){

  let insufficientStamina = false;
  let damageGenerated = player.turnStats.damageGenerated

if (player.turnStats.staminaCost < player.stamina) {
  if (rival.shield > 0) {
    rival.health -= player.turnStats.damageGenerated / 2; 
    damageGenerated /= 2;
  } else {
    rival.health -= player.turnStats.damageGenerated;
  }
  player.stamina -= player.turnStats.staminaCost; 
} else {
  insufficientStamina = true
}
return [player.stamina, rival.health, insufficientStamina, damageGenerated]
}

function decreaseShield(playerShield, staminaEnemy) {
  if (!staminaEnemy) {
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
  return shield
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

export {calculateDamage, damage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, staminaCost, updateStats}