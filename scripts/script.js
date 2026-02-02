const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod
log(new Date());

// FORM

setupForm();
function setupForm() {

  let formRef = document.querySelector('#form');

  formRef.addEventListener('submit', (event) => {
  event.preventDefault();
  
  saveFormData();

});

}

function saveFormData() {

    if (validateForm()) {

        let nickRef = document.querySelector('#nick');
        let ageRef = document.querySelector('#age');
        let radioBoyRef = document.querySelector('#boy');
        let radioGirlRef = document.querySelector('#girl');

        oGameData.trainerName = nickRef.value;
        oGameData.trainerAge = ageRef.value;
        if (radioBoyRef.checked) {
        oGameData.trainerGender = 'Boy';
        } else {
        oGameData.trainerGender = 'Girl';
        
        }

      // startGame(); (?)
        
    }
    
    let submitBtnRef = document.querySelector('#submitBtn');
    submitBtnRef.addEventListener('click', displayGameField);
    log(oGameData);
}

function displayGameField() {
  let gameFieldRef = document.querySelector('#gameField');
  gameFieldRef.classList.remove('d-none');
}
  


function validateForm() {

  let nickRef = document.querySelector('#nick')
  let ageRef = document.querySelector('#age')
  let radioBoyRef = document.querySelector('#boy')
  let radioGirlRef = document.querySelector('#girl')

  let errorMsgRef = document.querySelector('#error-msg')

  try {
    if (nickRef.value.length < 5 || nickRef.value.length > 10) {
      throw({ msg : 'Namnet måste vara mellan 5 och 10 tecken långt', nodeRef : nickRef });

    } else if (ageRef.value < 10 || ageRef.value > 15) {
      throw({ msg : 'Tränaren måste vara mellan 10 och 15 år gammal', nodeRef : ageRef });

    } else if (!radioBoyRef.checked && !radioGirlRef.checked ) {
      throw({ msg : 'Tränaren måste ha bockat i om hen är en pojke eller en flicka', nodeRef : radioBoyRef });
    }

  } catch (error) {
    errorMsgRef.innerText = error.msg;
    error.nodeRef.focus();
    
    return false;
  }

  return true;
}

// FÖRBEREDA SPELRUNDA

function generatePokemons() {
  
  for (let i = 0; i < 10; i++) {

    let randomIndex = Math.floor(Math.random() * 151 + 1);
    randomIndex = randomIndex.toString();

    if(randomIndex.length === 2) {
        randomIndex = randomIndex.padStart(3, '0');
    } else if(randomIndex.length === 1) {
        randomIndex = randomIndex.padStart(3, '0');
    }
      
    let imageRef = document.createElement('img');
    imageRef.id = randomIndex;
    imageRef.src = `../assets/pokemons/${randomIndex}.png`;

    imageRef.addEventListener('mouseover', catchPokemon);

    let gameFieldRef = document.querySelector('#gameField');
    gameFieldRef.appendChild(imageRef);
    
    oGameData.pokemonNumbers.push(imageRef);
    // log(oGameData);
    
  }
    
}

function catchPokemon(event) {

  let targettedPokemon = event.target;
  let currentSrc = targettedPokemon.getAttribute('src');
  
  
  if(currentSrc === '../assets/ball.webp') {
    targettedPokemon.src = `../assets/pokemons/${targettedPokemon.id}.png`;
    oGameData.nmbrOfCaughtPokemons--;
    
  } else if(currentSrc !== '../assets/ball.webp') {
    targettedPokemon.src = '../assets/ball.webp';
    oGameData.nmbrOfCaughtPokemons++;
  }
  
  log(oGameData.nmbrOfCaughtPokemons);
}

generatePokemons();

function movePokemon() {
  
  setInterval(function () {

    for (let i = 0; i < 10; i++) {
  
      let pokemonObj = oGameData.pokemonNumbers[i];
      
      let pokemonRef = document.getElementById(`${pokemonObj.id}`);
  
      pokemonRef.style.position = 'absolute';
  
      pokemonRef.style.left = oGameData.getLeftPosition() + 'px';
      pokemonRef.style.top = oGameData.getTopPosition() + 'px';
    
    }
    
  }, 3000);

  /*
  while(oGameData.nmbrOfCaughtPokemons.length < 10) {

    
  }
  */

  
}  


movePokemon();

/*
function movePokemon() {

  for (let i = 0; i < oGameData.pokemonNumbers.length; i++) {

    const pokemonObj = oGameData.pokemonNumbers[i];

    // 1. Hämta DOM-elementet
    const pokemonEl = document.querySelector(`#${pokemonObj.id}`);

    // 2. Se till att det går att flytta
    pokemonEl.style.position = 'absolute';

    // 3. Använd värden från objektet
    pokemonEl.style.left = pokemonObj.left + 'px';
    pokemonEl.style.top = pokemonObj.top + 'px';
  }
}
*/


// circle.style.top = Math.round(Math.random() * spaceWidth) + 'px';
// circle.style.left = Math.round(Math.random() * spaceHeight) + 'px';
/*
var circle = document.getElementById('circle');
var spaceWidth;
var spaceHeight;

function initCircle() {
  spaceWidth = document.body.offsetHeight - parseInt(circle.style.height);
  spaceHeight = document.body.offsetWidth - parseInt(circle.style.width);
  circle.addEventListener('click', moveCircle)
}

function moveCircle() {
  circle.style.top = Math.round(Math.random() * spaceWidth) + 'px';
  circle.style.left = Math.round(Math.random() * spaceHeight) + 'px';
}

initCircle();
*/