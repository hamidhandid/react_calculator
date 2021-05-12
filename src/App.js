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
      end: false,
    };
  }
  handlePressDigit = (digit) => {
    this.setState((prev) => {
      const screenText = prev.screenText
      let indexOfOp = this.findOperatorIndex(screenText)
      if (indexOfOp !== -1 && screenText.length > indexOfOp + 1) {
        let nextCharAfterOp = screenText.substring(indexOfOp + 1, indexOfOp + 2)
        if (nextCharAfterOp === "0") {
          if (digit === "0") {
            return
          } else {
            return {
              screenText: screenText.substring(0, screenText.length - 1) + digit
            }
          }
        }
      }

      return {
        screenText: digit === "0" && screenText === "0" ? screenText : screenText !== "0" && !this.state.end && screenText !== "error" ? screenText + digit.toString() : digit.toString(),
        end: false
      }
    })
  };
  handlePressOperator = (operator) => {
    let screenText = this.state.screenText.toString();
    const containsOperator = this.hasOperator(screenText)
    if (containsOperator) {
      this.setState((prev) => {
        try {
          return {
            screenText: eval(prev.screenText).toString() + operator,
            end: false
          }
        } catch {
          const last = screenText.substring(screenText.length - 1)
          if (this.hasOperator(last) || last === "-") {
            return {
              screenText: prev.screenText.toString().substring(0, screenText.length - 1) + operator,
              end: false,
            }
          }
          return {
            screenText: "error"
          }
        }
      })
    } else {
      this.setState((prev) => {
        return {
          screenText: prev.screenText + operator,
          end: false,
        }
      })
    }
  };
  handlePressAC = () => {
    this.setState((_) => {
      return {
        screenText: "0"
      }
    })
  };
  handlePressDot = () => {
    this.setState((prev) => {
      const screenText = prev.screenText;
      if (screenText.includes(".")) {
        return;
      }
      return {
        screenText: screenText + "."
      }
    })
  };
  handlePressNegator = () => {
    this.setState((prev) => {
      const screenText = prev.screenText.toString().replace(/\s/g, '');
      if (screenText === "0") {
        return
      }
      if (this.hasOperator(screenText)) {
        let indexOfOp = this.findOperatorIndex(screenText)

        if (screenText.length > indexOfOp + 1) {
          let nextCharAfterOp = screenText.substring(indexOfOp + 1, indexOfOp + 2)
          if (nextCharAfterOp === "0") {
            return
          }
          else if (nextCharAfterOp === "-") {
            return {
              screenText: screenText.substring(0, indexOfOp + 1) + screenText.substring(indexOfOp + 2, screenText.length)
            }
          } else {
            return {
              screenText: screenText.substring(0, indexOfOp + 1) + " -" + screenText.substring(indexOfOp + 1, screenText.length)
            }
          }
        }
        else if (screenText.length > indexOfOp + 1) {
          return {
            screenText: screenText.substring(0, indexOfOp + 1) + "-" + screenText.substring(indexOfOp + 1, screenText.length)
          }
        }
      }
      if (screenText.startsWith("-")) {
        return {
          screenText: screenText.substring(1)
        }
      } else {
        return {
          screenText: "-" + screenText
        }
      }
    })
  };
  handlePressResult = () => {
    this.setState((prev) => {
      try {
        return {
          screenText: eval(prev.screenText).toString(),
          end: true,
        }
      } catch {
        const screenText = prev.screenText
        let indexOfOp = this.findOperatorIndex(screenText)
        if (indexOfOp === screenText.length - 1) {
          return {
            screenText: screenText.substring(0, screenText.length - 1)
          }
        }
        return {
          screenText: "error"
        }
      }
    })
  };
  handlePressMC = () => {
    this.setState(() => {
      return {
        storedValue: "0",
        end: true,
      }
    })
  }
  handlePressMR = () => {
    this.setState((prev) => {
      return {
        screenText: prev.storedValue,
        end: true,
      }
    })
  }
  handlePressMPlus = () => {
    try {
      this.setState((prev) => {
        let res = parseFloat(prev.storedValue) + parseFloat(eval(prev.screenText));
        return {
          storedValue: res.toString(),
          end: true,
        }
      })
    }
    catch {
      this.setState((_) => {
        return {
          screenText: "error"
        }
      })
    }
  }
  handlePressMMinus = () => {
    try {
      this.setState((prev) => {
        let res = parseFloat(prev.storedValue) - parseFloat(eval(prev.screenText));
        return {
          storedValue: res.toString(),
          end: true,
        }
      })
    }
    catch {
      this.setState((_) => {
        return {
          screenText: "error"
        }
      })
    }
  }
  handlePressMS = () => {
    try {
      this.setState((prev) => {
        let res = parseFloat(eval(prev.screenText));
        return {
          storedValue: res.toString(),
          end: true,
        }
      })
    }
    catch {
      this.setState((_) => {
        return {
          screenText: "error"
        }
      })
    }
  }
  hasOperator = (str) => {
    let text = str.toString()
    return text.includes("+") || (text.length > 1 && text.substring(1).includes("-"))
      || text.includes("/") || text.includes("*") || text.includes("%")
  }
  findOperatorIndex = (str) => {
    let text = str.toString()
    let operators = ["+", "*", "/"]
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
