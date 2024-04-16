document.addEventListener('DOMContentLoaded', () => {
  startGame();
});
const cumbiamon = {
  'Chocoramon': {
    tipo: 'Dulce',
    habilidades: [ 'Bomba de Chocolate', 'Tormenta de Gominolas', 'Torrones de Azúcar', 'Dulce Encanto', 'Arequipito']
  },
  'Marimondex': {
    tipo: 'Psíquico',
    habilidades: ['Confusión Carnavalera', 'Telequinesis de Tambor', 'Barrera de Maracas', 'Realismo mágico', 'Cumbia control']
  },
  'Paramón': {
    tipo: 'Rocoso',
    habilidades: ['Avalancha Andina', 'Terremoto Tropiandes', 'Muralla de Selva', 'Deslizamiento de Río', 'Roca Afilada de Guatapé']
  },
  'Palenqueta': {
    tipo: 'Lucha',
    habilidades: ['Golpe de Tambores', 'Patada de Marimba', 'Resguardo Ancestral','Salto de Cimarrón', 'Rebelión']
  },
  'Doradón': {
    tipo: 'Metal',
    habilidades: ['Destello de Oro', 'Martillo del Dorado', 'Escudo Esmeralda', 'Diamantruenos', 'Estocada de Oricalco']
  },
};

const names = Object.keys(cumbiamon).map(name => name.toLowerCase());
let playerCharacter
let enemyCharacter

function startGame() {
  const buttonCharacterPlayed = document.getElementById('characterButton');
  buttonCharacterPlayed.addEventListener('click', selectPlayerCharacter);
}

function selectPlayerCharacter() {
  const spanPlayerCharacter = document.getElementById('playerCharacter');

  for (const name of names) {
    const input = document.getElementById(name);
    if (input && input.checked) {
      spanPlayerCharacter.innerHTML = capitalize(name);
      selectEnemyCharacter();
      return;
    }
  }
  spanPlayerCharacter.innerHTML = 'Ningún personaje seleccionado';
}

function selectEnemyCharacter() {
  const enemyCharacterIndex = random(0, names.length - 1);
  enemyCharacter = capitalize(names[enemyCharacterIndex]);
  document.getElementById('enemyCharacter').innerHTML = enemyCharacter;
}


function random(min, max){
  return Math.floor(Math.random()*(max - min + 1) + min)
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}