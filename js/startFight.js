import { random } from './utility.js';
import { applyBonusDamage, checkEnableButton, decreaseShield } from './funtions.js';
import { round, playerShield, enemyShield, roundDisabled, playerCharacter, enemyCharacter, enemyRandomAttack } from './script.js';

export function startFight(playerAttack) {
  round += 1;
  decreaseShield(playerShield, enemyShield);
  console.log(round, roundDisabled);
  checkEnableButton(round, roundDisabled);
  const baseDamage = {
    low: random(1, 5),
    standard: random(5, 10),
    medium: random(10, 15),
    high: random(15, 20),
  };

  let playerDamage = baseDamage;
  let enemyDamage = baseDamage;

  if (playerCharacter && enemyCharacter) {
    let enemyIsStrong = enemyCharacter.strongAgainst === playerCharacter.type;
    let playerIsStrong = playerCharacter.strongAgainst === enemyCharacter.type;

    if (enemyIsStrong) {
      enemyDamage = applyBonusDamage(baseDamage);
    } else if (playerIsStrong) {
      playerDamage = applyBonusDamage(baseDamage);
    }

    enemyRandomAttack(playerAttack, playerDamage, enemyDamage);

  } else {
    console.log('Hubo un error');
  }
}
