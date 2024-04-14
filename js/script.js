function starGame (){
    buttonCharacterPlayed = document.getElementById('characterButton')
    buttonCharacterPlayed.addEventListener('click', selectplayercharacter)
}
function selectPlayerCharacter() {
    const inputs = [
      'marimondex',
      'chocoramon',
      'palenqueta',
      'paramon',
      'doradon'
    ];
  
    for (const inputId of inputs) {
      const input = document.getElementById(inputId);
      if (input.checked) {
        // Aquí puedes colocar la lógica específica para cada personaje seleccionado
        switch (inputId) {
          case 'marimondex':
            // Código para el personaje marimondex
            break;
          case 'chocoramon':
            // Código para el personaje chocoramon
            break;
          case 'palenqueta':
            // Código para el personaje palenqueta
            break;
          case 'paramon':
            // Código para el personaje paramon
            break;
          case 'doradon':
            // Código para el personaje doradon
            break;
          default:
            break;
        }
        return; // Salimos de la función después de procesar el personaje seleccionado
      }
    }
  
    // Si ningún personaje está seleccionado
  }
  


window.addEventListener('load', starGame())