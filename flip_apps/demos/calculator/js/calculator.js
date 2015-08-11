'use strict';

var Calculator = {

 // display: document.querySelector('#output div'),
  display: document.getElementById('output'),
  significantDigits: 9,
  currentOperationEle: null,
  result: 0,
  currentInput: '',
  operationToBeApplied: '',
  inputDigits: 0,
  decimalMark: false,

  updateDisplay: function updateDisplay() {
    var value = this.currentInput || this.result.toString();

    var infinite = new RegExp((1 / 0) + '', 'g');
    var outval = value.replace(infinite, '∞').replace(NaN, 'Error');
    this.display.textContent = outval;

    var screenWidth = this.display.parentNode.offsetWidth - 60;
    var valWidth = this.display.offsetWidth;
    var scaleFactor = Math.min(1, screenWidth / valWidth);
    //this.display.style.MozTransform = 'scale(' + scaleFactor + ')';
    // Work around for bug #989403
    this.display.style.fontSize = 5.5 * scaleFactor + 'rem';
  },

  appendDigit: function appendDigit(value) {
    if (this.inputDigits + 1 > this.significantDigits ||
        this.currentInput === '0' && value === '0') {
      return;
    }
    if (value === '.') {
      if (this.decimalMark) {
        return;
      } else {
        this.decimalMark = true;
      }
      if (!this.currentInput) {
        this.currentInput += '0';
      }
    } else {
      if (this.currentInput === '0' && value !== '0') {
        this.currentInput = '';
      } else {
        ++this.inputDigits;
      }
    }
    if (!this.operationToBeApplied) {
      this.result = 0;
    }
    this.currentInput += value;
    this.updateDisplay();
  },

  appendOperator: function appendOperator(value) {
    this.decimalMark = false;
    if (this.operationToBeApplied && this.currentInput) {
      this.calculate();
    } else if (!this.result) {
      this.result = parseFloat(this.currentInput);
      this.currentInput = '';
    }
    switch (value) {
      case '+':
        this.operationToBeApplied = '+';
        break;
      case '-':
        if (this.currentInput || this.result) {
          this.operationToBeApplied = '-';
        } else {
          this.currentInput += '-';
          this.updateDisplay();
        }
        break;
      case '×':
        this.operationToBeApplied = '*';
        break;
      case '÷':
        this.operationToBeApplied = '/';
        break;
    }
    this.inputDigits = 0;
  },

  backSpace: function backSpace() {
    this.currentInput = '';
    this.operationToBeApplied = '';
    this.result = 0;
    this.inputDigits = 0;
    this.decimalMark = false;
    this.updateDisplay();
  },

  calculate: function calculate() {
    var tempResult = 0,
        result = parseFloat(this.result),
        currentInput = parseFloat(this.currentInput);
    // Can't use eval here since this will be a packaged app.
    switch (this.operationToBeApplied) {
      case '+':
        tempResult = result + currentInput;
        break;
      case '-':
        tempResult = result - currentInput;
        break;
      case '*':
        tempResult = result * currentInput;
        break;
      case '/':
        if (currentInput == 0) {
            tempResult = NaN;
        } else {
            tempResult = result / currentInput;
        }
        break;
    }
    this.result = parseFloat(tempResult.toPrecision(this.significantDigits));
    if (tempResult >  this.maxDisplayableValue ||
        tempResult < -this.maxDisplayableValue) {
      this.result = this.result.toExponential();
    }

    this.currentInput = '';
    this.operationToBeApplied = '';
    this.inputDigits = 0;
    this.decimalMark = false;
    this.updateDisplay();
  },

 // handles the operator highlight
  removeCurrentOperationEle: function removeCurrentOperationEle() {
//    if (this.currentOperationEle) {
//      this.currentOperationEle.classList.remove('active');
//      this.currentOperationEle = null;
//    }
  },

 
  init: function init() {
      this.display.style.lineHeight = + this.display.offsetHeight + "px";
      document.addEventListener('keydown', this);
  },

  handleEvent: function handleEvent(evt) {
    var key = evt.key;
    function type(key) {
      if (key === '1' || key === '2' || key === '3' || key === '4' || key === '5' || key === '6' || key === '7' || key === '8' || key === '9' || key === '0') {
	  return 'value';
      }
      if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
         return 'operator'
      }
      if (key === 'Enter' || key === "Backspace") {
        return 'command'
      }
      if (key === '*') {
        return 'point'
      }
    }
    function operator(key) {
	switch (key) {
	case 'ArrowUp':
	    return "+";
	    break;
	case 'ArrowDown':
	    return "-";
	    break;
	case 'ArrowLeft':
	    return "÷";
	    break;
	case 'ArrowRight':
	    return '×';
	    break;
	}
    }
    switch (type(key)) {
      case 'value':
        this.appendDigit(parseInt(key));
        break;
      case 'operator':
        if (key === 'ArrowDown' && this.currentInput === '-') {
          return;
        }
        this.removeCurrentOperationEle();
       // if (this.currentInput || this.result) {
         // target.classList.add('active');
       // }
        this.currentOperationEle = key;
        if (this.currentInput || this.result || key === 'ArrowDown') {
	    this.appendOperator(operator(key));
        }
        break;
      case 'point':
	this.appendDigit('.');
	break;
      case 'command':
        switch (key) {
          case 'Enter':
            if (this.currentInput && this.operationToBeApplied &&
                typeof this.result === 'number') {
              this.removeCurrentOperationEle();
              this.calculate();
            }
            break;
          case 'Backspace':
            this.removeCurrentOperationEle();
            this.backSpace();
            break;
        }
        break;
    }
  }
};

// String concatenation then number subtraction
Calculator.maxDisplayableValue = '1e' + Calculator.significantDigits - 1;

window.addEventListener('load', function load(evt) {
  window.removeEventListener('load', load);
  Calculator.init();
});
