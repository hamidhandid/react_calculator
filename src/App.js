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
    };
  }
  handlePressDigit = (digit) => {
    this.setState((prev) => {
      const screenText = prev.screenText
      return {
        screenText: digit === "0" && screenText === "0" ? screenText : screenText !== "0" ? screenText + digit.toString() : digit
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
            screenText: eval(prev.screenText).toString() + operator
          }
        } catch {
          const last = screenText.substring(screenText.length - 1)
          if (this.hasOperator(last) || last === "-") {
            return {
              screenText: prev.screenText.toString().substring(0, screenText.length - 1) + operator
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
          screenText: prev.screenText + operator
        }
      })
    }
  };
  hasOperator = (str) => {
    str = str.toString()
    return str.includes("+") || (str.length > 1 && str.substring(1).includes("-"))
      || str.includes("/") || str.includes("*") || str.includes("%")
  }
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
      const screenText = prev.screenText.toString();
      if (screenText === "0") {
        return
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
          screenText: eval(prev.screenText).toString()
        }
      } catch {
        return {
          screenText: "error"
        }
      }
    })
  };
  handlePressMC = () => {
    this.setState(() => {
      return {
        storedValue: "0"
      }
    })
  }
  handlePressMR = () => {
    this.setState((prev) => {
      return {
        screenText: prev.storedValue
      }
    })
  }
  handlePressMPlus = () => {
    try {
      this.setState((prev) => {
        let res = parseFloat(prev.storedValue) + parseFloat(eval(prev.screenText));
        return {
          storedValue: res.toString()
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
          storedValue: res.toString()
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
          storedValue: res.toString()
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
