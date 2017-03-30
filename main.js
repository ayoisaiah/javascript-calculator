"use strict";

const input = document.querySelector(".input");
const result = document.querySelector(".result");
const deleteBtn = document.querySelector(".delete");
const keys = document.querySelectorAll(".bottom span");

let operation = "";
let answer;
let decimalAdded = false;

let operators = ["+", "-", "x", "÷"];

function handleKeyPress (e) {
  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  // Prevent = from being recorded
  if (key === "=") {
    return;
  }

  // Allow only one decimal point in the input
  if (key === "." && decimalAdded) {
    return;
  }

  if (operators.indexOf(key) !== -1) {
    decimalAdded = false;
  }

  // If operation is empty and first entry is minus, allow it to be added
  if (operation.length === 0 && key === "-") {
    operation += key;
    input.innerHTML = operation;
    return;
  }

  //  The first entry cannot be an operator except minus
  if (operation.length === 0 && operators.indexOf(key) !== -1) {
    input.innerHTML = operation;
    return;
  }

  // If the last character is an operator, don't allow any other operators to be added immediately afterwards. Instead replace the operator with any other operator that is clicked

  if (operators.indexOf(lastChar) !== -1 && operators.indexOf(key) !== -1) {
    operation = operation.replace(/.$/, key);
    input.innerHTML = operation;
    return;
  }

  if (key) {
    if (key === ".") decimalAdded = true;
    operation += key;
    input.innerHTML = operation;
    return;
  }

}

function evaluate(e) {
  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  if (key === "=" && operators.indexOf(lastChar) !== -1) {
    operation = operation.slice(0, -1);
  }

  if (operation.length === 0) {
    answer = "";
    result.innerHTML = answer;
    return;
  }


  try {

    const final = operation.replace(/x/g, "*").replace(/÷/g, "/");
    answer = eval(final);

    if (key === "=") {
      decimalAdded = false;
      operation = `${answer}`;
      answer = "";
      input.innerHTML = operation;
      result.innerHTML = answer;
      return;
    }

    result.innerHTML = answer;

  } catch (e) {
    if (key === "=") {
      decimalAdded = false;
      input.innerHTML = `<span class="error">${operation}</span>`;
      result.innerHTML = `<span class="error">Bad Expression</span>`;
    }
    console.log(e);
  }

}

function clearInput (e) {

  if (e.type === "dblclick") {
    operation = "";
    answer = "";
    input.innerHTML = operation;
    result.innerHTML = answer;
    return;
  }

  operation = operation.slice(0, -1);
  input.innerHTML = operation;

}

deleteBtn.addEventListener("click", clearInput);
deleteBtn.addEventListener("dblclick", clearInput);
keys.forEach((key) => key.addEventListener("click", handleKeyPress));
keys.forEach((key) => key.addEventListener("click", evaluate));
