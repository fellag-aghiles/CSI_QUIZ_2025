// Retrieve losers from localStorage (ensure the data is already set)
const looosers1 = JSON.parse(localStorage.getItem("losers11"));
const looosers2 = JSON.parse(localStorage.getItem("losers12"));

// Build the teams array with names from local storage
const teams = [
  { name: looosers1[0], score: 0 },
  { name: looosers1[1], score: 0 },
  { name: looosers2[0], score: 0 },
  { name: looosers2[1], score: 0 },
];

// Create empty objects for team questions and question indexes based on the team names.
const teamQuestions = {};
const teamQuestionIndexes = {};

// Initialize the objects using the team names.
teams.forEach(team => {
  teamQuestions[team.name] = [];       // This will later be filled with questions from files.
  teamQuestionIndexes[team.name] = 0;    // Start each team at question index 0.
});

// Other global variables
let selectedTeamName = null;
const maxTime = 45;
let timeLeft = maxTime;
let timerInterval = null;
let timerRunning = false;
let teamListId = "teamList";
let clockAudio;

// On window load, load the questions and render the UI.
window.onload = async () => {
  await loadQuestions();
  renderTeams();
  renderTeamButtons();
  updateQuestionTitle();
};

// Load question files and populate teamQuestions for each team.
// Note: This example assumes a fixed mapping of question files to teams order.
// If each team should get different questions, adjust the logic accordingly.
async function loadQuestions() {
  try {
    // In this example we assume the first two teams get questions from q1rep.txt and q2repS.txt,
    // and the next two teams get questions from q3rep.txt and q4rep.txt.
    // Adjust as needed so that every team has its question file.
    
    // Load questions for teams[0]
    const response1 = await fetch('q1rep.txt');
    const text1 = await response1.text();
    teamQuestions[teams[0].name] = text1.split('\n').filter(q => q.trim() !== '');

    // Load questions for teams[1]
    const response2 = await fetch('q2repS.txt');
    const text2 = await response2.text();
    teamQuestions[teams[1].name] = text2.split('\n').filter(q => q.trim() !== '');

    // Load questions for teams[2]
    const response3 = await fetch('q3rep.txt');
    const text3 = await response3.text();
    teamQuestions[teams[2].name] = text3.split('\n').filter(q => q.trim() !== '');

    // Load questions for teams[3]
    const response4 = await fetch('q4rep.txt');
    const text4 = await response4.text();
    teamQuestions[teams[3].name] = text4.split('\n').filter(q => q.trim() !== '');
  } catch (error) {
    console.error('Error loading questions:', error);
  }
}

// Update the displayed question using the dynamically defined keys
function updateQuestionTitle() {
  const questionTitle = document.getElementById("questionTitle");
  if (!selectedTeamName) {
    questionTitle.innerText = 'No team selected';
    return;
  }

  const questions = teamQuestions[selectedTeamName];
  let index = teamQuestionIndexes[selectedTeamName] || 0;

  if (!questions || questions.length === 0) {
    questionTitle.innerText = 'No questions available';
    return;
  }

  // If index is out of bounds, wrap around to the beginning
  if (index >= questions.length) {
    index = 0;
    teamQuestionIndexes[selectedTeamName] = 0;
  }

  const currentQuestion = questions[index];
  questionTitle.innerText = `Question #${index + 1}: ${currentQuestion}`;

  console.log("Updating question for team:", selectedTeamName);
  console.log("Question index:", index);
  console.log("Question array:", questions);
}

// When switching teams, reset the question index for that team
function updateQuestionTitleFirst() {
  const questionTitle = document.getElementById("questionTitle");
  if (!selectedTeamName) {
    questionTitle.innerText = 'No team selected';
    return;
  }
  teamQuestionIndexes[selectedTeamName] = 0;
  updateQuestionTitle();
}

// Render team scores
function renderTeams() {
  teams.sort((a, b) => b.score - a.score);
  const teamList = document.getElementById(teamListId);
  const topScore = Math.max(...teams.map(team => team.score));
  const isTie = teams.filter(team => team.score === topScore).length > 1;

  teamList.innerHTML = "";

  teams.forEach((team, index) => {
    const li = document.createElement("li");
    if (isTie && team.score === topScore && team.score > 0) {
      li.classList.add("teamListTie");
    } else if (!isTie && index === 0) {
      li.classList.add("winner");
    }
    li.innerHTML = `<span>${team.name}</span><span>${team.score} points</span>`;
    teamList.appendChild(li);
  });
}

// Render team selection buttons using the team names from local storage.
function renderTeamButtons() {
  const container = document.getElementById("teamButtons");
  container.innerHTML = "";

  // Default to first team if none selected.
  if (!selectedTeamName && teams.length > 0) {
    selectedTeamName = teams[0].name;
  }

  teams.forEach(team => {
    const btn = document.createElement("button");
    btn.innerText = team.name;
    btn.className = selectedTeamName === team.name ? "selected" : "";
    btn.onclick = () => {
      selectedTeamName = team.name;
      highlightSelectedTeam();
      updateQuestionTitleFirst(); // Reset index and update question when switching teams
    };
    container.appendChild(btn);
  });
}

// Highlight the currently selected team button.
function highlightSelectedTeam() {
  const buttons = document.getElementById("teamButtons").children;
  for (let btn of buttons) {
    btn.className = btn.innerText === selectedTeamName ? "selected" : "";
  }
}

// Timer logic
const timerDisplay = document.getElementById("timer");
const startStopBtn = document.getElementById("startStopBtn");
const resetTimer = document.getElementById("resetTimer");
const upAlert = document.getElementById("upAlert");
const closeAlertBtn = document.getElementById("closeAlertBtn");
const alertMessage = document.getElementById("alertMessage");
const winnerAlert = document.getElementById("upWinner");
const winnerMessage = document.getElementById("winnerMessage");
const showwinnersBtn = document.getElementById("showWinners");

startStopBtn.addEventListener("click", () => {
  timerRunning ? stopTimer() : startTimer();
});

resetTimer.addEventListener("click", () => {
  stopTimer();
  timeLeft = maxTime;
  updateTimerDisplay();
  timerDisplay.classList.remove("warning");
});

function startTimer() {
  timerRunning = true;
  startStopBtn.innerText = "Stop";
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 20) {
      timerDisplay.classList.add("warning");
      playSoundClock();
    } else {
      timerDisplay.classList.remove("warning");
      stopSoundClock();
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timeLeft = maxTime;
      updateTimerDisplay();
      startStopBtn.innerText = "Start";
      timerDisplay.classList.remove("warning");
      // Reset the question index for the current team
      teamQuestionIndexes[selectedTeamName] = 0;
      updateQuestionTitle();
      stopSoundClock();
      showUpAlert("Time's up!", true);
    }
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  startStopBtn.innerText = "Start";
  timerDisplay.classList.remove("warning");
  stopSoundClock();
}

function updateTimerDisplay() {
  const seconds = timeLeft % 60;
  timerDisplay.innerText = `${String(seconds).padStart(2, "0")}`;
}

// Event listener for "Next Question" button
document.getElementById("nextQuestionBtn").addEventListener("click", () => {
  if (!selectedTeamName) return showUpAlert("Please select a team first!", false);

  const questions = teamQuestions[selectedTeamName];
  if (questions.length > 0) {
    teamQuestionIndexes[selectedTeamName]++;
    updateQuestionTitle();
  } else {
    teamQuestionIndexes[selectedTeamName] = 0;
    updateQuestionTitle();
    showUpAlert("No more questions available!", false);
  }
});

// Event listener for "Validate & Next" button
document.getElementById("validateNextBtn").addEventListener("click", () => {
  if (!timerRunning) return showUpAlert("Please start the timer first!", false);
  if (!selectedTeamName) return showUpAlert("Please select a team first!", false);

  // Increase the team score, update display, and play sound.
  const team = teams.find(t => t.name === selectedTeamName);
  team.score += 1;
  renderTeams();
  playSoundWinner();

  const questions = teamQuestions[selectedTeamName];
  const index = teamQuestionIndexes[selectedTeamName];

  console.log("Validating for:", selectedTeamName);
  console.log("Current question before splice:", questions[index]);

  // Remove the current question from the team's question array
  if (questions.length > 0) {
    questions.splice(index, 1);
    if (index >= questions.length) {
      teamQuestionIndexes[selectedTeamName] = 0;
    }
    updateQuestionTitle();
  } else {
    teamQuestionIndexes[selectedTeamName] = 0;
    updateQuestionTitle();
    showUpAlert("No more questions available!", false);
  }
});

// End Round Logic
showwinnersBtn.addEventListener("click", () => {
  localStorage.setItem("winner3", JSON.stringify(getWinnersNames()));
  endRound();
});

function endRound() {
  document.getElementById('validateNextBtn').style.display = 'none';
  document.getElementById('nextQuestionBtn').style.display = 'none';
  document.getElementById('nextRoundBtn').style.display = 'block';
  document.getElementById('questionTitle').style.display = 'none';

  const winners = getWinnersNames();
  const losers = getLosersNames();

  const winnerList = document.getElementById("winnerList");
  const loserList = document.getElementById("loserList");

  winnerList.innerHTML = '';
  loserList.innerHTML = '';

  winners.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    winnerList.appendChild(li);
  });

  losers.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    loserList.appendChild(li);
  });

  document.getElementById("resultsSection").classList.remove("hidden");
}

document.getElementById("nextRoundBtn").addEventListener("click", () => {
  const topTeams = getTopScoringTeams();
  window.location.href = topTeams.length > 1 ? "phase3.html" : "phase4.html";
});

// Utility functions for retrieving winners and losers.
function getTopScoringTeams() {
  const max = Math.max(...teams.map(t => t.score));
  return teams.filter(t => t.score === max);
}

function getWinnersNames() {
  const max = Math.max(...teams.map(t => t.score));
  return teams.filter(t => t.score === max).map(t => t.name);
}

function getLosersNames() {
  const max = Math.max(...teams.map(t => t.score));
  return teams.filter(t => t.score !== max).map(t => t.name);
}

function showUpAlert(message, timeup) {
  if (!timeup) {        
    upAlert.classList.remove("overlaytime");
    upAlert.classList.add("overlay");
    closeAlertBtn.classList.remove("alert-btn-time");
    closeAlertBtn.classList.add("alert-btn");
    alertMessage.innerText = message;
    upAlert.classList.remove("hidden");
  } else {
    upAlert.classList.remove("overlay");
    upAlert.classList.add("overlaytime");
    closeAlertBtn.classList.remove("alert-btn");
    closeAlertBtn.classList.add("alert-btn-time");
    alertMessage.innerText = message;
    upAlert.classList.remove("hidden");
    endSoundClock();
  }
}

function showWinnerAlert(message) {
  winnerMessage.innerText = message;
  winnerAlert.classList.remove("hidden");
}

closeAlertBtn.addEventListener("click", () => {
  alertMessage.innerText = "";
  upAlert.classList.add("hidden");
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
  if (!clockAudio) {
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

function endSoundClock() {
  const audio = new Audio('endclock.mp3');
  audio.play();
}

