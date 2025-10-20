// Data & Initialization
const winnerss1 = JSON.parse(localStorage.getItem("winners11")); // show the winner in the console
const winnerss2 = JSON.parse(localStorage.getItem("winners12")); // show the winner in the console
const winnerphase3 = JSON.parse(localStorage.getItem("winner3")); // show the winner in the console


const teams = [
  { name: "eq1", score: 0 },
  { name: "eq2", score: 0 },
  { name: "eq3", score: 0 },
  { name: "eq4", score: 0 },
  { name: "eq5", score: 0 },
];


/*const teams = [
  { name: winnerss1[0], score: 0 },
  { name:winnerss1[1], score: 0 },
  { name: winnerss2[0], score: 0 },
  { name: winnerss2[1], score: 0 },
  { name: winnerphase3[0], score: 0 },
];*/



let selectedTeamName = null;              // selected team name
let currentQuestionIndex = 0;             // show the question number for the team
const maxTime = 25;                      // max time for the timer
let timeLeft = maxTime;                 // the variable which will be used to count down the time
let timerInterval = null;               
let timerRunning = false;               // boolean to check if the timer is running or no
let counteur = 0;                       // counter to check if the timer ended 4 times, to know when the phase ends, to show the winner dialog            
let questions = [];                       // we will the questions from the file
let teamListId = "teamList";                    // id of the team list, to change it when the winner is shown
const maxpoints = 4;  
const numberOfWinners = 2; // Number of winners to end the round
let clockAudio;

// Initialize on page load, it shows how we load things
window.onload = async () => {
  await loadQuestions();
  renderTeams();
  renderTeamButtons();
  updateQuestionTitle();
};

// Load questions from file
async function loadQuestions() {
  try {
    const response = await fetch('prv3uno.txt');                       // get the file
    const text = await response.text();                           // Get the text from the file
    questions = text.split('\n').filter(q => q.trim() !== '');    // split the text by line and remove empty lines

  } catch (error) { // in case of error, show the error in the console and set a default question
    console.error('Error loading questions:', error);
    questions = ['Sample question goes here'];
  }
}

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

    if (isTie && team.score === topScore && team.score>0 && team.score!= maxpoints) {  // If there's a tie, add a class of tie ( it show them silver)
      li.classList.add("teamListTie");
    } else if(team.score>0 && team.score=== topScore && winners.length <=numberOfWinners) {  // If there is no tie, and this is the first team, mark it as the winner
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

// change the question 
function updateQuestionTitle() {
  const questionTitle = document.getElementById("questionTitle");                                 // get its id
  const currentQuestion = questions[currentQuestionIndex] || 'No more questions available';       // get the current question, 
  questionTitle.innerText = `Question #${currentQuestionIndex+1}: ${currentQuestion}`;          // show the question number and the question
}

// Next Question (no score)
document.getElementById("nextQuestionBtn").addEventListener("click", () => {
  stopTimer();
  timeLeft = maxTime;
  updateTimerDisplay();
  

  /*if (!timerRunning) {             Note:     you can change this, i thought its better to cchange the question without starting the timer
    alert("Please start the timer first!");
    return;
  }*/

  if (!selectedTeamName) { // show a diaglog if the team is not selected
    showUpAlert("Please select a team first!", false);
    return;
  }

  if (currentQuestionIndex < questions.length - 1) { //  if there still questions, then show the next question
    currentQuestionIndex = currentQuestionIndex + 1;
    updateQuestionTitle();
  } else { //  if there is no more questions, show a dialog
    showUpAlert("No more questions available!", false);
  }
});

// Validate answer and update score
const winners = [];
const loosers = [];
document.getElementById("validateNextBtn").addEventListener("click", () => {
   

  stopTimer();
  timeLeft = maxTime;
  updateTimerDisplay();
  playSoundWinner();
 
  
  if (!selectedTeamName) {
    showUpAlert("Please select a team first!" ,false);
    return;
  }


  const team = teams.find(t => t.name === selectedTeamName);
  if (team) {

    if (team.score < maxpoints){ // check if the team is not already a winner, to avoid adding points to it
    if(currentQuestionIndex <=10){
      team.score += 1;
     }else if( currentQuestionIndex > 10 && currentQuestionIndex <=20){
      team.score += 1;
     }else{
      team.score += 1;
     } // Increment the score of the selected team
    renderTeams();
    }
    // ✅ Check if this team reached 12 points and is not already in winners
    if (team.score === maxpoints && !winners.includes(team.name)) {
      winners.push(team.name);
    }

    // ✅ If 4 teams reached 12, end the round
    if (winners.length === numberOfWinners) {
      filter_loosers();
      // Save winners to localStorage
      localStorage.setItem("winners4", JSON.stringify(winners)); // you can delete this, it just pass the winners to another page


    }
  }

});

// Timer functionality
const timerDisplay = document.getElementById("timer");                        // get timer counter
const startStopBtn = document.getElementById("startStopBtn");                 // get the start/stop button in timer
const resetTimer = document.getElementById("resetTimer");                     // get the reset timer button
const upAlert = document.getElementById("upAlert");                           // get the alert dialog  
const closeAlertBtn = document.getElementById("closeAlertBtn");               // get the close button in the alert dialog    
const alertMessage = document.getElementById("alertMessage");                 // get the message in the alert dialog 
const winnerAlert = document.getElementById("upWinner");                      // get the winner alert dialog
const winnerMessage = document.getElementById("winnerMessage");               // get the message in the winner alert dialog

function showQuestoin(){
  const questionTitle = document.getElementById("questionTitle"); 
  questionTitle.classList.remove("hidden")
}

function maskQuestoin(){
  const questionTitle = document.getElementById("questionTitle"); 
  questionTitle.classList.add("hidden")
}
// Event listeners for timer 
startStopBtn.addEventListener("click", () => {
  if (!timerRunning) {      
                                                //  if the timer is not running, start it
  
    startTimer();
  } else { 
                                                                //  if the timer is running, stop it
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
    
    if (timeLeft <= 12) {                                               // if the time left is less than 20 seconds, put it in a warning state                   
      timerDisplay.classList.add("warning");
      playSoundClock();
    } else {                                                            // if the time left is more than 20 seconds, remove the warning state
      timerDisplay.classList.remove("warning");
      stopSoundClock();
    }
    
    if (timeLeft <= 0) {                                             // if the time left is 0                     
      clearInterval(timerInterval);                                  // stop the timer                    
      timerRunning = false;                                          // set the timer to not running                     
      startStopBtn.innerText = "Start";                              // change the button text to start       
      timeLeft = maxTime;                                            // reset the time left to the max time           
      updateTimerDisplay();                                          // show the time left visually         
      timerDisplay.classList.remove("warning");                      // remove the warning state
      stopSoundClock();                                             // remove the warning state

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



// Stop timer function
function stopTimer() {
  timerRunning = false;                                               // set the timer to not running
  startStopBtn.innerText = "Start";                                   // change the button text to start                    
  clearInterval(timerInterval);                                       // stop the timer          
  timerDisplay.classList.remove("warning");  
  stopSoundClock();                         // remove the warning state
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);                      // Get minutes by dividing the time left by 60         
  const seconds = timeLeft % 60;                                 // Get seconds by getting the remainder of the time left  
  timerDisplay.innerText = `${String(seconds).padStart(2, "0")}`; // Format the time 
}

// Show alert message
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
    endSoundClock();                                 // show the alert dialog, by removing the hidden class
  }                                  // show the alert dialog, by removing the hidden class
}

function showWinnerAlert(message) {                                    // show the winner dialog
  winnerMessage.innerText = message;                                   // show the winner                  
  winnerAlert.classList.remove("hidden");                              // show the dialog, by removing the hidden class
}

// Close alert dialog
closeAlertBtn.addEventListener("click", () => {
  alertMessage.innerText = "";                                          // clear the message
  upAlert.classList.add("hidden");                                      // hide the alert dialog
});

// filtrer les equipes 
function filter_loosers() {
  const valide_button = document.getElementById('validateNextBtn');
  const pass_button = document.getElementById('nextQuestionBtn');
  const next_round_button = document.getElementById('nextRoundBtn');
  const question_title = document.getElementById('questionTitle');
  
  valide_button.style.display = 'none';
  pass_button.style.display = 'none';
  next_round_button.style.display = 'block';
  question_title.style.display = 'none';
  

  teams.forEach(team => {
    if (!winners.includes(team.name)) {
      loosers.push(team.name);
    }
  });
  console.log(loosers);
  endRound(winners,loosers);
}
 

// pour faire afficher les winners et les losers 

function endRound(winners, loosers) {
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
  loosers.forEach(loser => {
    const li = document.createElement("li");
    li.textContent = loser;
    loserList.appendChild(li);
  });
}


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

