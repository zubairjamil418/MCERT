import React, { useState } from "react";
import Card from "components/card";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const inputOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperator);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const Button = ({ onClick, className, children, ...props }) => (
    <button
      className={`h-16 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <div className="col-span-1 h-fit">
        <Card className="mx-auto h-full w-full max-w-md p-6">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
              Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Perform basic calculations
            </p>
          </div>

          {/* Display */}
          <div className="mb-6 rounded-lg bg-gray-100 p-4 dark:bg-navy-700">
            <div className="overflow-hidden text-right font-mono text-3xl font-bold text-navy-700 dark:text-white">
              {display}
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* First Row */}
            <Button
              onClick={clearAll}
              className="col-span-2 bg-red-500 text-white hover:bg-red-600"
            >
              Clear
            </Button>
            <Button
              onClick={clearEntry}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              CE
            </Button>
            <Button
              onClick={() => inputOperator("÷")}
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              ÷
            </Button>

            {/* Second Row */}
            <Button
              onClick={() => inputNumber(7)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              7
            </Button>
            <Button
              onClick={() => inputNumber(8)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              8
            </Button>
            <Button
              onClick={() => inputNumber(9)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              9
            </Button>
            <Button
              onClick={() => inputOperator("×")}
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              ×
            </Button>

            {/* Third Row */}
            <Button
              onClick={() => inputNumber(4)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              4
            </Button>
            <Button
              onClick={() => inputNumber(5)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              5
            </Button>
            <Button
              onClick={() => inputNumber(6)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              6
            </Button>
            <Button
              onClick={() => inputOperator("-")}
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              -
            </Button>

            {/* Fourth Row */}
            <Button
              onClick={() => inputNumber(1)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              1
            </Button>
            <Button
              onClick={() => inputNumber(2)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              2
            </Button>
            <Button
              onClick={() => inputNumber(3)}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              3
            </Button>
            <Button
              onClick={() => inputOperator("+")}
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              +
            </Button>

            {/* Fifth Row */}
            <Button
              onClick={() => inputNumber(0)}
              className="col-span-2 bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              0
            </Button>
            <Button
              onClick={inputDecimal}
              className="bg-gray-200 text-navy-700 hover:bg-gray-300 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
            >
              .
            </Button>
            <Button
              onClick={performCalculation}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              =
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
