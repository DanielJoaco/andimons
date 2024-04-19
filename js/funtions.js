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

function decreaseShield(shield){
  if (shield > 0){
    return shield - 1;
  } else {
    return shield;
  }
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


  



function applyShield(shield, shieldMod){
  if (Number.isInteger(shieldMod)) {
    shield += shieldMod;
    return shield;
  } 
  return shield
}

export { calculateDamage, damage, checkEnableButton, decreaseShield, applyShield }