export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  