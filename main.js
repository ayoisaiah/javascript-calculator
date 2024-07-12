"use strict";

const input = document.querySelector(".input");
const result = document.querySelector(".result");
const deleteBtn = document.querySelector(".delete");
const keys = document.querySelectorAll(".bottom span");

let operation = "";
let answer;
let decimalAdded = false;

const operators = ["+", "-", "x", "÷"];

function handleKeyPress(e) {
  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  // Prevent action if the key is "="
  if (key === "=") return;

  // Prevent multiple decimals in a number
  if (key === "." && decimalAdded) return;

  // Reset decimalAdded flag when an operator is pressed
  if (operators.includes(key)) {
    decimalAdded = false;
  }

  // Allow leading minus sign for negative numbers
  if (operation.length === 0 && key === "-") {
    operation += key;
    input.innerHTML = operation;
    return;
  }

  // Prevent leading operators other than minus
  if (operation.length === 0 && operators.includes(key)) {
    input.innerHTML = operation;
    return;
  }

  // Replace the last operator with the new one if two operators are pressed consecutively
  if (operators.includes(lastChar) && operators.includes(key)) {
    operation = operation.slice(0, -1) + key;
    input.innerHTML = operation;
    return;
  }

  // Add the pressed key to the operation
  if (key) {
    if (key === ".") decimalAdded = true;
    operation += key;
    input.innerHTML = operation;
    return;
  }
}

function evaluateExpression(e) {
  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  // Remove the last operator if "=" is pressed
  if (key === "=" && operators.includes(lastChar)) {
    operation = operation.slice(0, -1);
  }

  // Display empty result if no operation is present
  if (operation.length === 0) {
    answer = "";
    result.innerHTML = answer;
    return;
  }

  try {
    // Remove leading zero unless it's a decimal number
    if (operation[0] === "0" && operation[1] !== "." && operation.length > 1) {
      operation = operation.slice(1);
    }

    // Replace custom operators with JavaScript operators and evaluate
    const finalExpression = operation.replace(/x/g, "*").replace(/÷/g, "/");
    answer = +(eval(finalExpression)).toFixed(5);

    if (key === "=") {
      decimalAdded = false;
      operation = `${answer}`;
      answer = "";
      input.innerHTML = operation;
      result.innerHTML = answer;
      return;
    }

    result.innerHTML = answer;
  } catch (error) {
    if (key === "=") {
      decimalAdded = false;
      input.innerHTML = `<span class="error">${operation}</span>`;
      result.innerHTML = `<span class="error">Bad Expression</span>`;
    }
    console.error(error);
  }
}

function clearInput(e) {
  // Clear all input if Ctrl key is pressed
  if (e.ctrlKey) {
    operation = "";
    answer = "";
    input.innerHTML = operation;
    result.innerHTML = answer;
    return;
  }

  // Remove the last character from the operation
  operation = operation.slice(0, -1);
  input.innerHTML = operation;
}

// Add event listeners
deleteBtn.addEventListener("click", clearInput);
keys.forEach(key => {
  key.addEventListener("click", handleKeyPress);
  key.addEventListener("click", evaluateExpression);
});
