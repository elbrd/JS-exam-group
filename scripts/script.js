const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod
log(new Date());

function setupMusic() {
  
  const audioBtnRef = document.querySelector('.audio-btn');
  audioBtnRef.addEventListener('click', playPauseMusic);

  const audioRef = document.querySelector('audio');
  audioRef.load();
  
}
  
// MUSIC 

function playPauseMusic() {
  const audioBtnRef = document.querySelector('.audio-btn');
  const audioRef = document.querySelector('audio');
  const audioImageRef = document.querySelector('.audio-img');

  if (audioRef.paused) {
    audioRef.play();
    audioImageRef.src = './assets/audio.png';
  
  } else {
    audioRef.pause();
    audioImageRef.src = './assets/audio-mute.png';
  }

}





// FORM

setupForm();

function setupForm() {

  let gameFieldRef = document.querySelector('#gameField');
  gameFieldRef.classList.add('d-none');
 
  let formRef = document.querySelector('#form');

  const audioBtnRef = document.querySelector('.audio-btn');
  // audioBtnRef.classList.add('d-none');

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

      startGame(); 
        
    }
    
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

// SPELRUNDA

function startGame() {
  
  generatePokemons();
  
  setTimeout(function () {
    
    let formWrapperRef = document.querySelector('#formWrapper');
    formWrapperRef.classList.add('d-none');
    
    let gameFieldRef = document.querySelector('#gameField');
    gameFieldRef.classList.remove('d-none');
    
    let highScoreRef = document.querySelector('#highScore');
    highScoreRef.classList.add('d-none');
    
    let bodyRef = document.querySelector('body');
    bodyRef.style.backgroundImage = "url('../assets/arena-background.png')";
    
    oGameData.startTimeInMilliseconds();
    
    setupMusic();

    const audioBtnRef = document.querySelector('.audio-btn');
    audioBtnRef.classList.remove('d-none');

    const audioRef = document.querySelector('audio');
    audioRef.play();
  
  }, 3000);

}
  
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
    imageRef.classList.add(randomIndex);
    imageRef.id = randomIndex;
    imageRef.src = `../assets/pokemons/${randomIndex}.png`;

    imageRef.addEventListener('mouseover', catchPokemon);

    let gameFieldRef = document.querySelector('#gameField');
    gameFieldRef.appendChild(imageRef);
    
    oGameData.pokemonNumbers.push(imageRef);
  }

  movePokemon();
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
    endGame();
  }
}


function movePokemon() {
  
  let intervalId = setInterval(function () {

    if (checkForGameOver()) {
      clearInterval(intervalId);
      return;
    }

    for (let i = 0; i < oGameData.pokemonNumbers.length; i++) {
      
      let pokemonObj = oGameData.pokemonNumbers[i];
      pokemonObj.style.left = oGameData.getLeftPosition() + 'px';
      pokemonObj.style.top = oGameData.getTopPosition() + 'px';
    
    }
    
  }, 3000);

}


// AVSLUTA SPELRUNDA

function checkForGameOver() {

  if(oGameData.nmbrOfCaughtPokemons >= 10) {
    return true;
  } else {
    return false;
  }

}

function endGame() {

  if (checkForGameOver()) {
    
    const gameFieldRef = document.querySelector('#gameField');
    const imagesRef = gameFieldRef.querySelectorAll('img');
    imagesRef.forEach(img => img.remove());
  
    oGameData.endTimeInMilliseconds();
    let gameTime = oGameData.nmbrOfMilliseconds();
  
    compareScore(gameTime);
  }
}

function compareScore(gameTime) {

  let highScore = JSON.parse(localStorage.getItem('highScore')) || [];

  highScore.push({
    
    name : oGameData.trainerName,
    age : oGameData.trainerAge,
    gender : oGameData.trainerGender,
    time : gameTime

  });

  // Sortera (snabbast tid först)
  highScore.sort((a, b) => a.time - b.time);

  // Behåll bara topp 10
  highScore = highScore.slice(0, 10);

  // Kolla så spelrundans resultat är kvar
  let isTop10 = highScore.some(
    score => score.name === oGameData.trainerName && score.time === gameTime          
  );

  // Om ovan är sant så sparas den uppdaterade arrayen, om inte görs inget
  if(isTop10) {
    
    localStorage.setItem('highScore', JSON.stringify(highScore));
    
  }

  displayHighScore();
  
}

function displayHighScore() {
  
  let highScore = JSON.parse(localStorage.getItem('highScore'));
  const highScoreListRef = document.querySelector('#highscoreList');
  highScoreListRef.innerHTML = '';

  const highScoreRef = document.querySelector('#highScore');
  highScoreRef.classList.remove('d-none');

  
  const audioBtnRef = document.querySelector('.audio-btn');
  audioBtnRef.classList.add('d-none');

  const audioRef = document.querySelector('audio');
  audioRef.pause();
  
  
  for (let i = 0; i < highScore.length; i++) {
    const currentScore = highScore[i];
    const listItemRef = document.createElement('li');

    listItemRef.textContent = `${currentScore.name}, ${currentScore.age} år, 
    ${currentScore.gender}, ${currentScore.time} ms`;
    
    highScoreListRef.appendChild(listItemRef);
    
  }

  let playAgainBtnRef = document.querySelector('#playAgainBtn');
  playAgainBtnRef.addEventListener('click', resetGame);
  
}

function resetGame() {

  let formWrapperRef = document.querySelector('#formWrapper');
  formWrapperRef.classList.remove('d-none');
  
  let gameFieldRef = document.querySelector('#gameField');
  gameFieldRef.classList.add('d-none');

  let highScoreRef = document.querySelector('#highScore');
  highScoreRef.classList.add('d-none');

  let bodyRef = document.querySelector('body');
  bodyRef.style.backgroundImage = '';

  oGameData.init();

}

