document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

import { starCanvas } from './canvas.js';

const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const acceptButton = document.getElementById('acceptButton');
const canvasElement = document.getElementById('canvas')
const canvas = canvasElement.getContext('2d')

class Andimons {
  constructor(name, type, img, head, x, y) {
    this.name = name;
    this.type = type;
    this.img = img;
    this.canvas = {
      head: new Image(),
      x: x,
      y: y,
      width: 40,
      height: 40,
      speedX: 0,
      speedY: 0
    };
    this.canvas.head.src = head; 
    this.skills = [
      { damage: [1, 5], staminaCost: 0, generatedShield: 2, emoji: '🛡', name: 'Escudo' },
      { damage: [5, 10], staminaCost:  [1, 3], generatedShield: 0, emoji: '💣', name: 'Ataque bomba' },
      { damage: [10, 15], staminaCost: [3, 4], generatedShield: 0, emoji: '💥', name: 'Ataque explosivo' },
      { damage: [15, 20], staminaCost: [5, 6], generatedShield: 0, emoji: '☣', name: 'Riesgo biologico' }
    ]  
  }
  paintAndimon(){
    canvas.drawImage(
      this.canvas.head,
      this.canvas.x,
      this.canvas.y,
      this.canvas.width,
      this.canvas.height
    )
  }
}

class Player {
  constructor(player) {
    this.player = player
    this.character = null; 
    this.health = 100;
    this.stamina = 10;
    this.shield = 0; 
    this.disabledAttack = -1;
    this.lifes = 5,
    this.wins = 0,
    this.turnStats = {
      attack: null,
      damage: 0,
      staminaCost: 0,
      shield: 0,
      staminaLow: false
    };
  }
}

const types = {
  flying: {name: 'flying', emoji: '🌪', strongType: 'bug'},
  bug: {name: 'bug', emoji: '🐞', strongType: 'water'},
  water: {name: 'water', emoji: '💧', strongType: 'fire'},
  fire: {name: 'fire', emoji: '🔥', strongType: 'plant'},
  plant: {name: 'plant', emoji: '🌱', strongType: 'earth'},
  earth: {name: 'earth', emoji: '⛰', strongType: 'flying'}
}

let voltair = new Andimons('Voltair', types['flying'], './assets/eagle.gif', './assets/eagle_head.gif', 440, 25)
let zumzum = new Andimons('Zumzum', types['bug'], './assets/bee.gif', './assets/bee_head.gif', 100, 235)
let chelonix = new Andimons('Chelonix', types['water'], './assets/turtle.gif', './assets/turtle_head.gif', 210, 125)
let krokotusk = new Andimons('Krokotusk', types['fire'], './assets/crocodile.gif', './assets/crocodile_head.gif', 280, 10)
let ursoptix = new Andimons('Ursoptix', types['plant'], './assets/spectacledBear.gif', './assets/spectacledBear_head.gif', 315, 140)
let jagtiger = new Andimons('Jagtiger', types['earth'], './assets/leopard.gif', './assets/leopard_head.gif', 60, 35)

let andimons = [voltair, zumzum, chelonix, krokotusk, ursoptix, jagtiger]
let player = new Player('player');
let enemy = new Player('enemy');

function startGame() {

  andimons.forEach((andimon)=>{
    let andimonOptions = `<input type="radio" name="character" id=${andimon.name} />
    <label class="characterCard" for=${andimon.name}>
        <p class="characterName">${andimon.name}<br>${andimon.type.emoji}</p>
        <img src=${andimon.img} alt=${andimon.name} class="characterImg">            
    </label>`
    document.getElementById('cardContainer').innerHTML += andimonOptions
  })

  document.getElementById('characterButton').addEventListener('click', selectPlayerCharacter);  
}

function selectPlayerCharacter() {

  andimons.forEach((andimon) => {
    let input = document.getElementById(andimon.name);
    if (input && input.checked) {
        player.character = andimon;
        return; 
    }
  }); 

  if (!player.character) {
    const text = 'Selecciona un personaje'
    const section = 'selectCharacter'
    showModal(text, section);
    return;
  }
  starCanvas(player, enemy, andimons)
}

function showModal(text, section){  
  
  modal.style.display = 'flex'; 
  modalText.innerHTML = text
  if (section === 'selectCharacter'){
    acceptButton.addEventListener('click', () => {
    modal.style.display = 'none'; 
  });
  } else if (section === 'sectionAttack'){
    document.getElementById('divAcceptButton').style.display = 'none'
    document.getElementById('resetGame').style.display = 'flex'

  }
  
}

export { showModal }

             