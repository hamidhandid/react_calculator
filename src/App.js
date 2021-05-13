import React from "react";

import Keypad from "./components/Keypad";
import Screen from "./components/Screen";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenText: "0",
      storedValue: "0",
      firstNumber: 0,
      secondNumber: 0,
      operator: "",
      isCalculationEnded: false,
    };
  }

  handlePressDigit = (digit) => {
    this.setState((prev) => {
      const screenText = prev.screenText.toString()
      const indexOfOp = this._findOperatorIndex(screenText)
      const containsOp = indexOfOp !== -1
      const digitIsZero = digit === 0 || digit === "0"
      const isCalculationEnded = prev.isCalculationEnded
      if (containsOp && screenText.length > indexOfOp + 1) {
        const nextCharAfterOp = screenText.charAt(indexOfOp + 1)
        if (nextCharAfterOp === "0") {
          if (digitIsZero) {
            return
          } else {
            return {
              screenText: screenText.substring(0, screenText.length - 1) + digit,
              firstNumber: prev.firstNumber,
              secondNumber: parseFloat((screenText.substring(indexOfOp + 1) + digit).trim()),
              isCalculationEnded: false
            }
          }
        }
      }
      return {
        screenText: digitIsZero && screenText === "0" ? screenText : screenText !== "0" && !this.state.isCalculationEnded && !screenText.includes("error") ? screenText + digit.toString() : digit.toString(),
        firstNumber: isCalculationEnded ? parseFloat(digit) : containsOp ? prev.firstNumber : parseFloat((screenText + digit.toString()).trim()),
        secondNumber: containsOp ? parseFloat((screenText.substring(indexOfOp + 1) + digit).trim()) : prev.secondNumber,
        isCalculationEnded: false
      }
    })
  };

  handlePressOperator = (operator) => {
    const screenText = this.state.screenText.toString()
    const indexOfOp = this._findOperatorIndex(screenText)
    const containsOperator = indexOfOp !== -1
    const isOperationLastChar = indexOfOp === screenText.length - 1

    this.setState((prev) => {
      return {
        screenText: isOperationLastChar ?
          screenText.substring(0, screenText.length - 1) + operator.toString() :
          containsOperator ? (this._calculate().toString() !== "error" ? this._calculate().toString() + operator.toString() : "error")
            : (prev.screenText !== "error" ? prev.screenText + operator.toString() : "error"),
        operator: operator,
        firstNumber: containsOperator ? parseFloat(this._calculate()) : prev.firstNumber,
        secondNumber: 0,
        isCalculationEnded: false
      }
    })
  };

  handlePressAC = () => {
    this.setState((_) => {
      return {
        screenText: "0",
        firstNumber: 0,
        secondNumber: 0,
      }
    })
  };

  handlePressDot = () => {
    this.setState((prev) => {
      const screenText = prev.screenText;
      const indexOfOp = this._findOperatorIndex(screenText)
      const containsOp = indexOfOp !== -1
      const firstNumStr = containsOp ? screenText.substring(0, indexOfOp).trim() : screenText
      const secondNumStr = containsOp ? screenText.substring(indexOfOp + 1).trim() : ""
      if ((!containsOp && firstNumStr.includes("."))
        || (containsOp && secondNumStr.includes("."))) {
        return
      } else {
        return {
          screenText: !screenText.includes("error") ? screenText + "." : screenText,
          firstNumber: containsOp ? prev.firstNumber : parseFloat(prev.firstNumber.toString() + "."),
          secondNumber: containsOp ? parseFloat(prev.secondNumber.toString() + ".") : prev.secondNumber,
        }
      }
    })
  };

  handlePressNegator = () => {
    this.setState((prev) => {
      const screenText = prev.screenText.toString().replace(/\s/g, '');
      const indexOfOp = this._findOperatorIndex(screenText)
      const containsOp = indexOfOp !== -1
      let firstNumber = prev.firstNumber
      let secondNumber = prev.secondNumber
      if ((!containsOp && firstNumber === 0) || (containsOp && secondNumber === 0)) {
        return
      }
      if (containsOp) {
        secondNumber = -secondNumber
      } else {
        firstNumber = -firstNumber
      }
      return {
        screenText: !screenText.includes("error") ? (containsOp ? firstNumber.toString() + prev.operator + (secondNumber < 0 ? " " : "") + secondNumber.toString() : firstNumber.toString()) : "error",
        firstNumber: firstNumber,
        secondNumber: secondNumber,
      }
    })
  };

  handlePressResult = () => {
    this.setState((prev) => {
      const screenText = prev.screenText
      const indexOfOp = this._findOperatorIndex(screenText.toString())
      const isOperationLastChar = indexOfOp === screenText.length - 1
      const containsOp = indexOfOp !== -1
      const result = isOperationLastChar ?
        screenText.substring(0, screenText.length - 1) :
        !containsOp ? screenText : this._calculate()
      return {
        screenText: result.toString(),
        firstNumber: parseFloat(result),
        secondNumber: 0,
        isCalculationEnded: true,
      }
    })
  };

  handlePressMC = () => {
    this.setState(() => {
      return {
        storedValue: "0",
        isCalculationEnded: true,
      }
    })
  }

  handlePressMR = () => {
    this.setState((prev) => {
      const screenText = prev.screenText
      const containsOp = this._findOperatorIndex(screenText) !== -1
      const value = prev.storedValue
      const firstNumber = !containsOp ? parseFloat(value) : prev.firstNumber
      const secondNumber = containsOp ? parseFloat(value) : prev.secondNumber
      return {
        screenText: containsOp ? firstNumber.toString() + prev.operator + secondNumber.toString() : firstNumber.toString(),
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        isCalculationEnded: true,
      }
    })
  }

  handlePressMPlus = () => {
    this.setState((prev) => {
      const res = parseFloat(prev.storedValue) + parseFloat(this._valueToStore(prev));
      return {
        storedValue: res.toString(),
        isCalculationEnded: true,
      }
    })
  }

  handlePressMMinus = () => {
    this.setState((prev) => {
      const res = parseFloat(prev.storedValue) - parseFloat(this._valueToStore(prev));
      return {
        storedValue: res.toString(),
        isCalculationEnded: true,
      }
    })
  }

  handlePressMS = () => {
    this.setState((prev) => {
      const value = this._valueToStore(prev)
      return {
        storedValue: value,
        isCalculationEnded: true,
      }
    })
  }

  _valueToStore = (prev) => {
    const screenText = prev.screenText
    const indexOfOp = this._findOperatorIndex(screenText)
    const containsOp = indexOfOp !== -1
    return containsOp ? (screenText.length - 1 === indexOfOp ? screenText.substring(0, screenText.length - 1) : prev.secondNumber.toString()) : screenText
  }

  _findOperatorIndex = (str) => {
    let text = str.toString()
    const operators = ["+", "*", "/", "%"]
    let res = -1;
    for (let i = 0; i < operators.length; i++) {
      res = text.indexOf(operators[i])
      if (res !== -1) {
        return res
      }
    }
    if (text.length > 1) {
      text = text.substring(1)
      res = text.indexOf("-")
    }
    return res !== -1 ? res + 1 : res;
  }

  _calculate() {
    const firstNumber = this.state.firstNumber
    const secondNumber = this.state.secondNumber
    const operator = this.state.operator
    let result = 0
    switch (operator) {
      case "+":
        result = firstNumber + secondNumber
        break
      case "-":
        result = firstNumber - secondNumber
        break
      case "*":
        result = firstNumber * secondNumber
        break
      case "/":
        if (secondNumber === 0) {
          return "error"
        }
        result = firstNumber / secondNumber
        break
      case "%":
        if (secondNumber === 0) {
          return "error"
        }
        try {
          result = firstNumber % secondNumber
        } catch {
          return "error"
        }
        break
      default:
        result = 0
    }
    return result
  }

  render() {
    return (
      <div>
        <Screen text={this.state.screenText} />
        <Keypad
          onPressDigit={this.handlePressDigit}
          onPressOperator={this.handlePressOperator}
          onPressAC={this.handlePressAC}
          onPressDot={this.handlePressDot}
          onPressNegator={this.handlePressNegator}
          onPressResult={this.handlePressResult}
          onPressMC={this.handlePressMC}
          onPressMR={this.handlePressMR}
          onPressMPlus={this.handlePressMPlus}
          onPressMMinus={this.handlePressMMinus}
          onPressMS={this.handlePressMS}
        />
      </div>
    );
  }
}

export default App;
