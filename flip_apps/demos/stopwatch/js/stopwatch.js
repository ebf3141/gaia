var startStopButton = document.getElementById("start-button");
startStopButton.addEventListener("click",start);
var timeDisplay = document.getElementById("time");
var resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click",reset);
var startTime;
var paused = false;
var endTime;
var elapsed;
var totalElapsed;
var previousElapsed = 0;
var timing = false;

window.addEventListener('keydown', function(e) {
  console.log(e.key);
  if (e.key === "F1") {
    reset();
  };
  if (e.key === "Enter") {
    start();
  };
});

function start() {
    if  (timing === false && paused === false) {
	startTime =  performance.now();
	requestAnimationFrame(update);
	timing = true
	previousElapsed = 0;
	startStopButton.textContent = "Stop"
    }
    else if (timing === false && paused === true){
	startTime = performance.now();
	requestAnimationFrame(update);
	timing = true
	startStopButton.textContent = "Stop"
    } 
    else {
	endTime = performance.now();
	timing = false;
	paused = true;
	previousElapsed = previousElapsed + elapsed;
	startStopButton.textContent = "Resume"
    }
}

function update() {
    if (timing === true) {
	var now = performance.now();
	elapsed = now - startTime;
	totalElapsed = previousElapsed + elapsed;
	display(totalElapsed);
	requestAnimationFrame(update);
    }
}
function display(rawTime) {
    var rawMinutes = Math.floor(rawTime/60000);
    if (rawMinutes < 10) {
	var minutes = "0" + rawMinutes;
    }
    else {
      var minutes = rawMinutes
    };
    
    var rawSeconds = Math.floor(rawTime/1000) % 60;
    if (rawSeconds < 10) {
	var seconds = "0" + rawSeconds;
    }
    else {
	var seconds = rawSeconds};

    var rawHundredths = Math.round(rawTime/10) % 100;
    if (rawHundredths < 10) {
	var hundredths = "0" + rawHundredths;
    }
    else {
	var hundredths = rawHundredths;
    }
    var displayThis = minutes + ":" + seconds + "." + hundredths;
    timeDisplay.textContent = displayThis;
}

function reset() {
    startStopButton.textContent = "Start";
    timeDisplay.textContent = "00:00.00";
    timing = false;
    paused = false;
}
