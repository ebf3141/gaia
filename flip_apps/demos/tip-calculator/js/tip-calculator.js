var tipOutput = document.getElementById("tip");
var totalOutput = document.getElementById("total");
var perPersonOutput = document.getElementById("perPerson");
var costInput = document.getElementById("cost");
var percentInput = document.getElementById("percent");
var peopleInput = document.getElementById("people");
var resetButton = document.getElementById("reset-button");
resetButton.onclick = reset;
costInput.onchange = calculateTip;
percentInput.onchange = calculateTip;
peopleInput.onchange = calculateTip;

function calculateTip() {
    var cost = parseFloat(costInput.value);
    var percent = parseFloat(percentInput.value) / 100;
    var people = parseInt(peopleInput.value);
    var tip = Math.round(cost * percent * 100) / 100;
    var total = Math.round((tip + cost) * 100) / 100;
    var perPerson = Math.round((total / people) * 100) / 100;
    tipOutput.textContent = "$" + tip;
    totalOutput.textContent = "$"+ total;
    perPersonOutput.textContent = "$" + perPerson;
}

function reset() {
    tipOutput.textContent = "$0.00";
    totalOutput.textContent = "$0.00";
    perPersonOutput.textContent = "$0.00";
    costInput.value = "";
    percentInput.value = "";
    peopleInput.value = "";

}
