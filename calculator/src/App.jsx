import './index.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  EVALUATE: 'evaluate',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        };
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state;
      if (payload.digit === '.' && state.currentOperand.includes('.'))
        return state;
      return {
        ...state, // state.currentOperand is there to maintain old values as new ones get output
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.currentOperand !== 'undefined' || state.currentOperand !== '') {
        const reference = state.currentOperand.split('');
        reference.pop();
        return {
          ...state,
          currentOperand: reference.join(''),
        };
      }
      return state;
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.previousOperand == null) {
        return {
          currentOperand: null,
          operator: payload.operation,
          previousOperand: state.currentOperand,
        };
      }
      if (state.currentOperand == null)
        return { ...state, operator: payload.operation };
      return {
        operator: payload.operation,
        currentOperand: null,
        previousOperand: evaluate(state),
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (state.currentOperand === undefined || state.currentOperand === null)
        return state;
      return {
        overwrite: true,
        operator: null,
        currentOperand: evaluate(state),
        previousOperand: null,
      };
  }
}

function evaluate(state) {
  const current = parseFloat(state.currentOperand);
  const previous = parseFloat(state.previousOperand);
  if (!isNaN(current) && !isNaN(previous)) {
    let calculation;
    switch (state.operator) {
      case '+':
        calculation = current + previous;
        break;
      case '-':
        calculation = current - previous;
        break;
      case '/':
        calculation = previous / current;
        break;
      case '*':
        calculation = current * previous;
        break;
    }

    return calculation
      .toFixed(2)
      .toString()
      .replace(/^[^0-9]/, '');
  }
}

export default function App() {
  const [{ currentOperand, previousOperand, operator }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand}
          {operator}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>

      <div className="row">
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="/" dispatch={dispatch} />
      </div>
      <div className="row">
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
      </div>
      <div className="row">
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
      </div>
      <div className="row">
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
      </div>
      <div className="row">
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}
