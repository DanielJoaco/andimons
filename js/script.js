document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

function startGame() {
  const buttonCharacterPlayed = document.getElementById('characterButton');
  buttonCharacterPlayed.addEventListener('click', selectPlayerCharacter);
}

function selectPlayerCharacter() {
  const inputs = {
    marimondex: 'Marimondex',
    chocoramon: 'Chocoramon',
    palenqueta: 'Palenqueta',
    paramon: 'Paramon',
    doradon: 'Doradon'
  };
  const spanPlayerCharacter = document.getElementById('playerCharacter');

  for (const [inputId, characterName] of Object.entries(inputs)) {
    const input = document.getElementById(inputId);
    if (input && input.checked) {
      spanPlayerCharacter.innerHTML = characterName;
      selectEnemyCharacter()
      return;
    }
  }
  spanPlayerCharacter.innerHTML = 'Ningún personaje seleccionado';
}

function selectEnemyCharacter() {
  const enemyCharacter = random(1, 5);
  const spanEnemyCharacter = document.getElementById('enemyCharacter');

  const inputs = {
    1: 'Marimondex',
    2: 'Chocoramon',
    3: 'Palenqueta',
    4: 'Paramon',
    5: 'Doradon'
  };

  for (const [inputId, characterName] of Object.entries(inputs)) {
    if (parseInt(inputId) === enemyCharacter) {
      spanEnemyCharacter.innerHTML = characterName;
      return;
    }
  }
}


function random(min, max){
  return Math.floor(Math.random()*(max - min + 1) + min)
}