// Data & Initialization
const winerssss = JSON.parse(localStorage.getItem("winners4")); // show the winner in the console

const teams = [
  { name: winerssss[0], score: 0 },
  { name: winerssss[1], score: 0 },
];


/*
const teams = [
  { name: "eq1", score: 0 },
  { name: "eq2", score: 0 },
];
*/

// Timer functionality                    // get timer counter
const startStopBtn = document.getElementById("startStopBtn");                 // get the start/stop button in timer
const resetTimer = document.getElementById("resetTimer");                     // get the reset timer button
const upAlert = document.getElementById("upAlert");                           // get the alert dialog  
const closeAlertBtn = document.getElementById("closeAlertBtn");               // get the close button in the alert dialog    
const alertMessage = document.getElementById("alertMessage");                 // get the message in the alert dialog 
const winnerAlert = document.getElementById("upWinner");                      // get the winner alert dialog
const winnerMessage = document.getElementById("winnerMessage"); 
const image = document.getElementById('imageCountry');


let selectedTeamName = null;              // selected team name
let currentQuestionIndex = 0;             // show the question number for the team
const maxTime = 30;                      // max time for the timer
let timeLeft = maxTime;                 // the variable which will be used to count down the time             
let timerRunning = false;               // boolean to check if the timer is running or no
let counteur = 0;                       // counter to check if the timer ended 4 times, to know when the phase ends, to show the winner dialog            
let questions = [];                       // we will the questions from the file
let teamListId = "teamList";                    // id of the team list, to change it when the winner is shown
let winners = [];                       // array to store the winners
let losers = [];                       // array to store the losers
let choiceType = null;

let clockAudio;
 // Base de données des questions
 const questionBank = {
  "Q1": {
      question: "Combien de médailles d'or l'Algérie a-t-elle remportées aux Jeux Olympiques ?"
  },
  "Q2": {
      question: "Quel projet secret mené pendant la Seconde Guerre mondiale a permis la création de la première bombe atomique, impliquant des scientifiques comme Robert Oppenheimer et des installations aux États-Unis ?"
  },
  "Q3": {
      question: "Comment appelle-t-on une technique de conception d’interface visant à manipuler les utilisateurs pour qu’ils prennent des décisions qu’ils ne prendraient pas autrement, comme s’abonner sans le vouloir ou partager plus de données ?"
  },
  "Q4": {
      question: "Quelle est la déesse de la chasse en mythologie grecque"
  },
  "Q5": {
      question: "Quelle lettre doit compléter cette suite logique ? J F M A M J _"
  },
  "Q6": {
    question: "Quel est le seul oiseau capable de voler en marche arrière ?"
  },
  "Q7": {
      question: "Quel jeu est le premier à avoir introduit le concept de \"mode furtif\" comme mécanique centrale ?"
  },
  "Q8": {
      question: "Ce drapeau est le drapeau de quel pays"
  },
  "Q9": {
      question: "Quel philosophe du XVIIIe siècle, auteur du \"Contrat social\", est célèbre pour ses idées sur la liberté individuelle et la souveraineté populaire ?"
  },
  "Q10": {
      question: "Quel mouvement artistique est caractérisé par l’utilisation de couleurs vives, de formes simplifiées, et une approche géométrique de l’abstraction ?"
  },
  "Q11": {
      question: "En quelle année le couscous a-t-il été inscrit au patrimoine culturel immatériel de l’UNESCO ?"
  },
  "Q12": {
      question: "Quel pays a remporté la toute première Coupe du monde de football, organisée en 1930 ?"
  },
  "Q13": {
      question: "Quel capteur est principalement utilisé pour permettre à un robot de percevoir la distance d’un objet grâce à la lumière ?"
  },
  "Q14": {
      question: "Quelle architecture a permis la création des modèles de langage de type GPT ?"
  },
  "Q15": {
      question: "Quel est le synonyme du mot \"ubuesque\" ?"
  },
  "Q16": {
      question: "De quel pays est originaire la marque automobile SsangYong ?"
  }
};

// Choix prédéfinis pour chaque niveau de difficulté
const choicesData = {
  0: [
      ["Vrai", "Faux",0], // Pour les questions de type 0 choix (oui/non)
  ],
  2: [
      ["6", "7",1],
      ["Projet Manhattan", "Projet Trinity",0],
      ["User Centric Design", "Dark Pattern",1],
      ["Artémis", "Héra",0],
      ["J", "F",0],
      ["Colibri", "Moineau",0],
      ["GoldenEye 007", "Metal Gear",1],
      ["Surinam", "Somalie",1],
      ["Voltaire", " Jean-Jacques Rousseau",1],
      ["Fauvisme", "Dadaïsme",0],
      ["2020", "2022",0],
      ["Uruguay", "Angleterre",0],
      ["Caméra stéréoscopique", "Lidar",1],
      ["Réseau de Hopfield", "Transformer",1],
      ["Grotesque", "Pathétique",0],
      ["Japon", "Corée du Sud",1],
  ],
  4: [
      ["5", "6", "7", "8",2],
      ["Projet Manhattan","Projet Mercury", "Projet Apollo", "Projet Trinity",0],
      ["User Centric Design", "Dark Pattern", "Behavioral Design", "Persuasive Pattern", 1],
      ["Athéna", "Aphrodite","Artémis", "Héra",2],
      ["J", "F","M", "U",0],
      ["Moineau", "Aigle","Colibri", "Faucon",2],
      ["Metal Gear", "Splinter Cell","Thief: The Dark Project", "GoldenEye 007",0],
      ["Suriname", "Somalie","Palaos", "Tonga",1],
      ["Montesquieu", "Voltaire","Jean-Jacques", "Diderot",2],
      ["Fauvisme", "Surréalisme","Dadaïsme", "Art nouveau",0],
      ["2015", "2010","2020", "2022",2],
      ["Brésil", "Allemagne","Uruguay", "Angleterre",2],
      ["Lidar", "Radar","Caméra stéréoscopique", "Capteur ultrasonique",0],
      ["Transformer", "Réseau bayésien","Vecteurs de support", "Réseau de Hopfield",0],
      ["Pathétique", "Ironique","Grotesque", "Didactique",2],
      ["Chine", "Japon","Corée du Sud", "Thaïlande",2],

  ]
};

// Points par nombre de choix
const pointsData = {
  0: 5, // 0 choix (vrai/faux) = 5 points
  2: 1, // 2 choix = 1 point
  4: 3  // 4 choix = 3 points
};

// Variables globales
let timerInterval;
let currentQuestionId = null;
let currentChoiceType = null;
let correctAnswerIndex = 0; // Par défaut, la première option est correcte
let id = null;

const timerDisplay = document.getElementById("timer");   
// Éléments DOM
const questionIdInput = document.getElementById('question-id');
//const submitBtn = document.getElementById('submit-btn');
const questionText = document.getElementById('question-text');
const choiceSelect = document.getElementById('choice-select');
const choicesContainer = document.getElementById('choices-container');
const winnerBtn = document.getElementById('winner-btn');



// Charger une question
function loadQuestion(id) {
  // Vérifier si l'ID existe
  if (!questionBank[id]) {
      questionText.textContent = "Question non trouvée. Veuillez vérifier l'ID.";
      choiceSelect.style.display = 'none';
      choicesContainer.style.display = 'none';
      return;
  }

  // Récupérer la question
  const question = questionBank[id];
  currentQuestionId = id;

  if (getIdAsNumberInArray() == 7 ){
    image.classList.remove("hidden");
    
  }else{
    image.classList.add("hidden");
  }
  // Afficher la question
  questionText.textContent = question.question;

  // Réinitialiser et afficher les options de choix
  choiceSelect.style.display = 'block';
  choicesContainer.style.display = 'none';
  timerDisplay.textContent = maxTime.toString();
  timeLeft = maxTime;
  
  // Arrêter tout timer en cours
  stopTimer();
}

// Afficher les choix selon le type sélectionné
function showChoices(choiceType) {
  currentChoiceType = parseInt(choiceType);
  
  // Cacher la sélection du nombre de choix
  choiceSelect.style.display = 'none';
  
  // Préparer les choix
  choicesContainer.innerHTML = '';
  
  let choices;
  if (currentChoiceType === 0) {
      // Question vrai/faux
      choices = choicesData[0][0]; // Toujours ["Vrai", "Faux"]
  } else  {
      // Autres types de questions (2 ou 4 choix)
      // Sélectionner un ensemble de choix au hasard parmi ceux disponibles
      const availableChoices = choicesData[currentChoiceType];
      choices = availableChoices[getIdAsNumberInArray()];
  }
  
  // Définir aléatoirement la bonne réponse
  correctAnswerIndex = choices[choices.length -1];
  //console.log(getIdAsNumberInArray());
  
  // Créer les boutons de choix
  choices.forEach((choice, index) => {

    if (index < choices.length -1){
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => selectAnswer(index));
      choicesContainer.appendChild(btn);
    }
  });
  
  // Afficher les choix
  choicesContainer.style.display = 'block';
  
  // Démarrer le chronomètre
  startTimer();
}


// Gérer la fin du chronomètre
function handleTimerEnd() {
  resetQuestionArea();
}

// Sélectionner une réponse
function selectAnswer(index) {
  clearInterval(timerInterval);
  
  const isCorrect = index === correctAnswerIndex;
  
  // Afficher la bonne réponse
  const choices = choicesContainer.querySelectorAll('.choice-btn');
  choices.forEach((btn, i) => {
      if (i === correctAnswerIndex) {
          btn.classList.add('correct');
      } else if (i === index && !isCorrect) {
          btn.classList.add('incorrect');
      }
      btn.disabled = true;
  });
  
  const team = teams.find(t => t.name === selectedTeamName);
  // Ajouter les points si correct
  if (isCorrect) {

    if (choiceType == 0)  {
        team.score += 5;}
      else if (choiceType == 2) {team.score += 1;}
        else if (choiceType == 4) {team.score += 3;}
    playSoundWinner();
    renderTeams();
  }else {
    playSoundLoser();
  }
  
  // Attendre 2 secondes avant de passer à l'équipe suivante
  setTimeout(() => {
    timerDisplay.classList.remove("warning"); 
      resetQuestionArea();   
  }, 1000);
}

// Réinitialiser la zone de question
function resetQuestionArea() {
  questionText.textContent = "Aucune question sélectionnée";
  choiceSelect.style.display = 'none';
  choicesContainer.style.display = 'none';
  timerDisplay.textContent = maxTime.toString();
  questionIdInput.value = "";
  image.classList.add("hidden");
}
// Mettre à jour le classement

/*
// Event Listeners pour la recherche de question
submitBtn.addEventListener('click', () => {
  id = questionIdInput.value.trim();
  if (id) {
      loadQuestion(id);
  }
});

questionIdInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
      submitBtn.click();
  }
});*/

questionIdInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    id = questionIdInput.value.trim();
    if (id) {
        loadQuestion(id);
    }
  }
});


// Event Listeners pour la sélection du nombre de choix
const choiceButtons = document.querySelectorAll('.choice-type-btn');
choiceButtons.forEach(button => {
  button.addEventListener('click', () => {
     choiceType = button.getAttribute('data-choices');
      showChoices(choiceType);
  });
});


winnerBtn.addEventListener('click', () =>{
  const topTeams = getTopScoringTeams();
  localStorage.setItem('winnerCsi', JSON.stringify(getWinnersNames()));

  window.location.href = topTeams.length > 1 ? "finale.html" : "3.html";


})


function getIdAsNumberInArray(){
  
const match = id.match(/\d+$/); // Match one or more digits at the end of the string

if (match) {
  const number = parseInt(match[0], 10);
  return (number -1);
} else {
  console.log("No number found at the end of the string.");
}

}

// Initialize on page load, it shows how we load things
window.onload = async () => {
  renderTeams();
  renderTeamButtons();
  //resetQuestionArea();
 
};

// Render teams in scoreboard

/* it render the teams ins resultas, each time its called it sort and render them,
 then it shows the winner, or the tie*/
 function renderTeams() {

  teams.sort((a, b) => b.score - a.score);                                // Sort the teams array in descending order based on score
  const teamList = document.getElementById(teamListId);                   // Get where the teams will be listed
  const topScore = Math.max(...teams.map(team => team.score));            // Find the highest score among all the teams
   const topTeams = teams.filter(team => team.score === topScore);          // get all teams that have the highest score
  const isTie = teams.filter(team => team.score === topScore).length > 1;  // Check if there is a tie 
  teamList.innerHTML = "";                                                  // Clear the current content in the team list
  
  teams.forEach((team, index) => {  //  create list item for each team
    const li = document.createElement("li");  

    if (isTie && team.score === topScore && team.score>0) {  // If there's a tie, add a class of tie ( it show them silver)
      li.classList.add("teamListTie");
    } else if (!isTie && index === 0) {  // If there is no tie, and this is the first team, mark it as the winner
      li.classList.add("winner");
    }

    // put the team name and score
    li.innerHTML = `
      <span>${team.name}</span>
      <span>${team.score} points</span>
    `;
    
    teamList.appendChild(li);  // add the item to the list
  });
}


// Render team selection buttons
function renderTeamButtons() {
  const teamButtonsContainer = document.getElementById("teamButtons");      // Get the container where the buttons will be rendered
  teamButtonsContainer.innerHTML = "";  // Clear any existing buttons

  // Select the first team if none is selected
  if (!selectedTeamName && teams.length > 0) {                              // If no team is selected, choose the first team by default
    selectedTeamName = teams[0].name;
  }

  teams.forEach((team) => {                                                
    const btn = document.createElement("button");                           // Create a button element for each team
    btn.innerText = team.name;                                              // put the current team name in the button
    btn.className = selectedTeamName === team.name ? "selected" : "";       // Add "selected" class if this team is the selected one (the class add borders to show that its selected)
    btn.onclick = () => {                                                   
      selectedTeamName = team.name;                                         // Set the selected team when the button is clicked
      highlightSelectedTeam();                                              // Call a function to visually highlight the selected team
    };
    teamButtonsContainer.appendChild(btn);                                  // Append the button to the container
  });
 
}


// Highlight selected team button
function highlightSelectedTeam() {
  const teamButtons = document.getElementById("teamButtons").children;
  for (let btn of teamButtons) {
    btn.className = btn.innerText === selectedTeamName ? "selected" : "";
  }
}

              // get the message in the winner alert dialog
 //  when the user clicks on the choices container, it will show the choices
// Event listeners for timer 
startStopBtn.addEventListener("click", () => {
  if (!timerRunning) {                                                      //  if the timer is not running, start it
    startTimer();
  } else {                                                                  //  if the timer is running, stop it
    stopTimer();
  }
});

// Reset timer event
resetTimer.addEventListener("click", () => {
  if (timerRunning) {    
    stopTimer();                                                      // stop the timer if its running               
  }
  timeLeft = maxTime;                                             // set it to the start time
  updateTimerDisplay();                                           //make change visually
  timerDisplay.classList.remove("warning");                       //remove the warning, cause its reset
});


// Start timer function
function startTimer() {
  timerRunning = true;                                                  // set the timer to running
  startStopBtn.innerText = "Stop";                                      // change the button text to stop                       
  
  timerInterval = setInterval(() => {                                   // start the timer
    timeLeft--;                                                         // decrement the time left
    updateTimerDisplay();                                               // show it visually                        
    
    if (timeLeft <= 15) {                                               // if the time left is less than 20 seconds, put it in a warning state                   
      timerDisplay.classList.add("warning");
      playSoundClock(); // play the sound
    } else {                                                            // if the time left is more than 20 seconds, remove the warning state
      timerDisplay.classList.remove("warning");
      stopSoundClock(); // stop the sound
    }
    
    if (timeLeft <= 0) {                                             // if the time left is 0                     
      currentQuestionIndex = 0;                                     // reset the question index (-1 cause it will be incremented )
      clearInterval(timerInterval);                                  // stop the timer                    
      timerRunning = false;                                          // set the timer to not running                     
      startStopBtn.innerText = "Start";                              // change the button text to start       
      timeLeft = maxTime;                                            // reset the time left to the max time           
      updateTimerDisplay();                                          // show the time left visually         
      timerDisplay.classList.remove("warning");                      // remove the warning state
      stopSoundClock(); // stop the sound

                                              // this means we passed through all the teams, so we announce the winner teams(tie case included)  
      //announceTopTeams();
      //localStorage.setItem("winners", JSON.stringify(getWinnersNames())); // save the winners to localStorage
      //alert(getWinnersNames())
      //endRound();
      // Save winners to localStorage
                                                             // if we are not in the end, then show that the time is up, normally
      showUpAlert("Time's up!", true);
  }
  }, 1000);
}

// Get all  top scoring teams
function getTopScoringTeams() {
  const maxScore = Math.max(...teams.map(team => team.score));        // get the max score
  return teams.filter(team => team.score === maxScore);               // get all teams that have the max score
}


function getWinnersNames() {
  const maxScore = Math.max(...teams.map(team => team.score));        // get the max score
  return teams.filter(team => team.score === maxScore).map(team => team.name);               // get all teams that have the max score
              
}

function getLosersNames() {
  const maxScore = Math.max(...teams.map(team => team.score));
  return teams.filter(team => team.score !== maxScore).map(team => team.name); // get their names
 
}

// Stop timer function
function stopTimer() {
  timerRunning = false;                                               // set the timer to not running
  startStopBtn.innerText = "Start";                                   // change the button text to start                    
  clearInterval(timerInterval);                                       // stop the timer          
  timerDisplay.classList.remove("warning");                           // remove the warning state
  stopSoundClock(); // stop the sound
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);                      // Get minutes by dividing the time left by 60         
  const seconds = timeLeft % 60;                                 // Get seconds by getting the remainder of the time left  
  timerDisplay.innerText = `${String(seconds).padStart(2, "0")}`; // Format the time 
}


function showUpAlert(message, timeup) {
  if (!timeup) {           
    upAlert.classList.remove("overlaytime");                                  // hide the alert dialog, by removing the hidden class
    upAlert.classList.add("overlay");// if the time is up, then show the message

  closeAlertBtn.classList.remove("alert-btn-time");                      // show the close button
  closeAlertBtn.classList.add("alert-btn");                      // show the close button
  alertMessage.innerText = message;                                     // show the message in the alert
  upAlert.classList.remove("hidden"); }else{

    upAlert.classList.remove("overlay");                                  // hide the alert dialog, by removing the hidden class
    upAlert.classList.add("overlaytime");                                  // hide the alert dialog, by removing the hidden class
    closeAlertBtn.classList.remove("alert-btn");                      // show the close button

    closeAlertBtn.classList.add("alert-btn-time");                       // show the close button
    alertMessage.innerText = message;                                     // show the message in the alert
    upAlert.classList.remove("hidden");  
    endSoundClock();                                // show the alert dialog, by removing the hidden class
  }                                  // show the alert dialog, by removing the hidden class
}

// pour faire afficher les winners et les losers 

function endRound() {
  const valide_button = document.getElementById('validateNextBtn');
  const pass_button = document.getElementById('nextQuestionBtn');
  const next_round_button = document.getElementById('nextRoundBtn');
  const question_title = document.getElementById('questionTitle');
  
  valide_button.style.display = 'none';
  pass_button.style.display = 'none';
  next_round_button.style.display = 'block';
  question_title.style.display = 'none';

  const winners = getWinnersNames(); // Get the winners names
  const losers = getLosersNames(); // Get the losers names
  // Display the results section
  const resultsSection = document.getElementById("resultsSection");
  resultsSection.classList.remove("hidden");

  // Get the winners and losers list elements
  const winnerList = document.getElementById("winnerList");
  const loserList = document.getElementById("loserList");

  // Clear previous results
  winnerList.innerHTML = '';
  loserList.innerHTML = '';

  // Display the winners
  winners.forEach(winner => {
    const li = document.createElement("li");
    li.textContent = winner;
    winnerList.appendChild(li);
  });

  // Display the losers
  losers.forEach(loser => {
    const li = document.createElement("li");
    li.textContent = loser;
    loserList.appendChild(li);
  });
}

// Close alert dialog
closeAlertBtn.addEventListener("click", () => {
  alertMessage.innerText = "";                                          // clear the message
  upAlert.classList.add("hidden");                                      // hide the alert dialog
});


function playSoundWinner() {
  const audio = new Audio('winner.mp3');
  audio.play();
}


function playSoundLoser() {
  const audio = new Audio('losers.mp3');
  audio.play();
}


function playSoundClock() {
  if(!clockAudio){
  clockAudio = new Audio('ticksound.mp3');
  }
  clockAudio.play();
}


function stopSoundClock() {
  if (clockAudio) {
    clockAudio.pause();
    clockAudio.currentTime = 0;
  }
}


function endSoundClock(){
  const audio = new Audio('endclock.mp3');
  audio.play();
}

