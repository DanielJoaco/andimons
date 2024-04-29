/* import {random} from './utility.js'; */

/* function createImage(player, htmlElementet) { 
  const img = document.createElement('img');
  img.src = player.character.img;
  img.alt = player.character.name;
  img.id = `img_${player.player}`
  htmlElementet.innerHTML = ''
  htmlElementet.appendChild(img); 
} */

/* function updateStats(player) {
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
} */


/* function randomAttack(isDisabled, skills){
  let rivalAttackIndex;
  let attackName;
  if (isDisabled  === -1) {
    rivalAttackIndex = random([0, skills.length - 1]);
    attackName = skills[rivalAttackIndex].emoji;
  } else {
      const availableAttacks = skills.filter((_, index) => index !== 0);

      rivalAttackIndex = random([0, availableAttacks.length - 1]);
      attackName = availableAttacks[rivalAttackIndex].emoji
  }
  return attackName;
} */

/* function calculateDamage(attackPlayerOne, attackPlayerTwo, typePlayerOne, typePlayerTwo) {

  const bonusDamage = 1.2;

  if (attackPlayerOne === null) {
    if (typePlayerTwo.strongType === typePlayerOne.name) {
      return [null, Math.round(random(attackPlayerTwo) * bonusDamage)];
    } else {
      return [null, Math.round(random(attackPlayerTwo))];
    }
  }
  
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
} */


/* function checkEnableButton(round, roundDisabled) {
  if (round - roundDisabled >= 5) {
    const attackButtons = document.querySelectorAll('[id="buttonAttack_0"]');
    attackButtons.forEach(button => {
      button.disabled = false;
    });
    return -1;
  }
  return roundDisabled;
} */

/* function disabledShieldButton(shield, roundDisabled, round){

  if (shield > 0 && roundDisabled === -1) {
    const attackButtons = document.querySelectorAll('[id="buttonAttack_0"]');
    attackButtons.forEach(button => {
      button.disabled = true;
      roundDisabled = round;
    });
  }
  return roundDisabled
} */
/* 
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
} */

/* function decreaseShield(playerShield, staminaLessRival) {
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
} */


/* export {createImage, calculateDamage, checkEnableButton, decreaseShield, applyShield, randomAttack, disabledShieldButton, attackCost, updateStats} */