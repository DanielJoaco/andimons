import {random} from './utility.js';



function applyBonusDamage(baseDamage) {

  const bonusDamage = 1.2
  let modifiedDamage = {};

  for (let key in baseDamage) {
    modifiedDamage[key] = Math.round(baseDamage[key] * bonusDamage);
  }
  return modifiedDamage;
}

function calculateDamage(playerCharacter, enemyCharacter) {
  const baseDamage = {
    low: random(1, 5),
    standard: random(5, 10),
    medium: random(10, 15),
    high: random(15, 20),
  };
  let enemyDamage = { ...baseDamage };
  let playerDamage = { ...baseDamage };
  
  if (playerCharacter && enemyCharacter) {
    let enemyIsStrong = enemyCharacter.strongAgainst === playerCharacter.type;
    let playerIsStrong = playerCharacter.strongAgainst === enemyCharacter.type;
    
    if (enemyIsStrong) {
      enemyDamage = applyBonusDamage(baseDamage);
    } else if (playerIsStrong) {
      playerDamage = applyBonusDamage(baseDamage);
    }    
  }
  return [enemyDamage, playerDamage];
}
  

function damage(skillIndex, damage) {

  let attackDamage;
  let staminaCost;
  let shield;

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

  return [attackDamage, staminaCost, shield];
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
  

function decreaseShield(shield){
  if (shield > 0){
    return shield - 1;
  } else {
    return shield;
  }
}

function applyShield(shield, shieldMod){
  if (Number.isInteger(shieldMod)) {
    shield += shieldMod;
    return shield;
  } 
  return shield
}

export { calculateDamage, damage, checkEnableButton, decreaseShield, applyShield }