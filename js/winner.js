import { starCanvas, deleteCharacterArray } from './canvas.js';
import { showModal } from './script.js';

const resetDiv = document.getElementById('resetDiv');
const cotinueButton = document.getElementById('cotinueButton');
const resultsParagraph = document.getElementById('resultsParagraph');
const playersStatistics = document.getElementsByClassName('playersStatistics');
const sectionAttack = document.getElementById('sectionAttack');
const playerAttacksDiv = document.getElementById('playerAttacks')
const passTurnButton = document.getElementById('passTurn');


let player
let enemy

function winner(playerFight, enemyFight){  

    player = playerFight
    enemy = enemyFight

    deleteCharacterArray(enemy.character.name)
  
    let paragraph = ''
    const attackButtons = playerAttacksDiv.getElementsByTagName('button');
  
    disabledAttacksButtons(true, attackButtons)
    disabledPassTurnButton(true)
    showPlayersStatistics(false) 
    resetDiv.style.display = 'flex' 
  
    if (player.health > enemy.health){
      paragraph = `🎊 Tu ${player.character.name} gano 🎉 🏆`
      player.wins++
    }else{
      paragraph = `⚰💀 Tu ${player.character.name} perdio ☠️🪦`
      player.lifes--
    }
  
    resultsParagraph.innerHTML = paragraph;
  
    checkEndGame()
    cotinueButton.addEventListener('click', () => {
      resetStats(attackButtons);
    });
}
  
function disabledAttacksButtons(bolean, attackButtons){
    for (const button of attackButtons) {
        if (bolean){
        button.disabled = true;

        } else{
        button.disabled = false;
        }
    } 
}
  
function disabledPassTurnButton(bolean){
    if (bolean){
        passTurnButton.disabled = true;
        passTurnButton.style.color = '#9de5de';
    } else{
        passTurnButton.disabled = false;
    passTurnButton.style.color = '#396365';
    }
}
  
function showPlayersStatistics(bolean){
    for (let i = 0; i < playersStatistics.length; i++) {
        if (!bolean){
        playersStatistics[i].style.display = 'none'; 
        } else{
        playersStatistics[i].style.display = 'flex'; 
        }
    } 
}
  
function checkEndGame(){

    if(player.lifes <= 2){
        const text = 'Has perdido el juego'
        const section = 'sectionAttack'
        showModal(text, section);
    } else if (player.wins >= 3){
        const text = 'Has ganado el juego'
        const section = 'sectionAttack'
        showModal(text, section);
    }
}
  
function resetStats(attackButtons){

    enemy.character = null
    enemy.health = 100
    player.health = 100
    enemy.stamina = 10
    player.stamina = 10
    enemy.shield = 0
    player.shield = 0
    enemy.disabledAttack = -1;
    player.disabledAttack = -1;

    disabledAttacksButtons(false, attackButtons)
    disabledPassTurnButton(false)
    showPlayersStatistics(false)
    resetDiv.style.display = 'none'
    sectionAttack.style.display = 'none';
        
    starCanvas(player, enemy)
}

const resetButtons = document.querySelectorAll('#resetButton, #resetButtonModal');

resetButtons.forEach(button => {
    button.addEventListener('click', () => {
        location.reload();
    });
});

export {winner}