import {random} from './utility.js';

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

function decreaseShield(playerShield, staminaEnemy) {
  if (!staminaEnemy) {
    if (playerShield > 0) {
      return playerShield - 1;
    }
  }
  return playerShield;
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

function randomAttack(attackDiseabled, skils){
  let rivalAttackIndex;
  let attackName;
  if (attackDiseabled  === -1) {
    rivalAttackIndex = random(0, skils.length - 1);
    attackName = skils[rivalAttackIndex];
  } else {
      const availableAttacks = skils.filter((_, index) => index !== 2);
      rivalAttackIndex = random(0, availableAttacks.length - 1);
      attackName = availableAttacks[rivalAttackIndex]
  }
  return attackName;
}

function damage(skillIndex, damage, attackName) {

  let attackDamage = 0
  let staminaCost = 0
  let shield = 0

  if (attackName !== null){
    if (skillIndex === 1 || skillIndex === 3) {
      attackDamage = damage['standard'];
      staminaCost = random(1, 3);
    } else if (skillIndex === 0) {
      attackDamage = damage['medium'];
      staminaCost = random(3, 4);
    } else if (skillIndex === 2) {
      attackDamage = damage['low'];
      staminaCost = 0;
      shield = 2;
    } else {
      attackDamage = damage['high'];
      staminaCost = random(4, 5);
    }
  }


  return [attackDamage, staminaCost, shield];
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

function staminaCost(player, rival){

    let insufficientStamina = false;
    let damageGenerated = player.turnStatistics.damageGenerated

  if (player.turnStatistics.staminaCost < player.stamina) {
    if (rival.shield > 0) {
      rival.health -= player.turnStatistics.damageGenerated / 2; 
      damageGenerated /= 2;
    } else {
      rival.health -= player.turnStatistics.damageGenerated;
    }
    player.stamina -= player.turnStatistics.staminaCost; 
  } else {
    insufficientStamina = true
  }
  return [player.stamina, rival.health, insufficientStamina, damageGenerated]
}

export { calculateDamage, damage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, staminaCost}