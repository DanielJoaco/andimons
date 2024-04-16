document.addEventListener('DOMContentLoaded', () => {
  startGame();
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
const bonusDamage = 1.2
let playerCharacter;
let enemyCharacter;
let playerHealth = 100; 
let enemyHealth = 100; 
let playerStamina = 50; 
let enemyStamina = 50; 


function startGame() {
  const buttonCharacterPlayed = document.getElementById('characterButton');
  buttonCharacterPlayed.addEventListener('click', selectPlayerCharacter);
}

function selectPlayerCharacter() {
  const spanPlayerCharacter = document.getElementById('playerCharacter');
  document.getElementById('playerAttacks').innerHTML = '';

  for (const name of names) {
      const input = document.getElementById(name);
      if (input && input.checked) {
          playerCharacter = cumbiamon[capitalize(name)];
          spanPlayerCharacter.innerHTML = capitalize(name);
          selectEnemyCharacter();
          return;
      }
  }
  spanPlayerCharacter.innerHTML = 'Ningún personaje seleccionado';
}

function selectEnemyCharacter() {
  const enemyCharacterIndex = random(0, names.length - 1);
  enemyCharacter = cumbiamon[capitalize(names[enemyCharacterIndex])];
  document.getElementById('enemyCharacter').innerHTML = capitalize(names[enemyCharacterIndex]);
  generateAttackButtons(playerCharacter);
}

function generateAttackButtons(character) {
  const playerAttacksDiv = document.getElementById('playerAttacks');

  for (const ability of character.skils) {
      const attackButton = document.createElement('button');
      attackButton.textContent = ability;
      attackButton.addEventListener('click', () => {
          startFight(ability);
      });
      playerAttacksDiv.appendChild(attackButton);
  }
}


function startFight(playerAttack) {
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
    console.log(
      'El tipo del enemigo es: ', enemyCharacter.type,
      'es fuerte contra', enemyCharacter.strongAgainst,
      'El enemigo es fuerte?', enemyIsStrong,
      'El tipo del jugador es: ', playerCharacter.type,
      'es fuerte contra', playerCharacter.strongAgainst,
      'El jugador es fuerte?', playerIsStrong
    )
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

function applyBonusDamage(baseDamage) {
  let modifiedDamage = {};
  for (let key in baseDamage) {
    modifiedDamage[key] = baseDamage[key] * bonusDamage;
  }
  return modifiedDamage;
}

function enemyRandomAttack(playerAttack, playerDamage, enemyDamage) {
  console.log(playerAttack, playerDamage, enemyDamage);
}


function enemyRandomAttack(playerAttack, playerDamage, enemyDamage){
  console.log(playerAttack, playerDamage, enemyDamage);
}


function random(min, max){
  return Math.floor(Math.random()*(max - min + 1) + min)
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}