/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Count extends Component {
  render() {
    return <div>{this.props.count}</div>;
  }
}

class ClassInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: ['Just some demo tasks', 'As an example'],
      inputVal: '',
      isEdit: false,
      editedVal: null,
      count: 2,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editInput = this.editInput.bind(this);
  }

  increment() {
    this.setState((prev) => ({ count: prev.count + 1 }));
  }

  decrement() {
    if (this.state.count <= 0) {
      return { count: 0 };
    } else {
      return this.setState((prev) => ({ count: prev.count - 1 }));
    }
  }

  handleInputChange(e) {
    this.setState((state) => ({
      ...state,
      inputVal: e.target.value,
    }));
  }

  handleSubmit(e) {
    e.preventDefault();
    this.increment();
    this.setState((state) => ({
      todos: state.todos.concat(state.inputVal),
      inputVal: '',
    }));
  }

  editInput(e) {
    return this.setState({
      editedVal: e.target.value,
    });
  }

  editButton(index) {
    // create a copy of the desired array to mutate
    const updatedTodos = this.state.todos;
    // modify the desired index element
    updatedTodos[index] = this.state.editedVal;
    // assign the real todos array to the updated copy of it
    this.setState({
      todos: updatedTodos,
      isEdit: null,
    });
  }

  
  render() {
    return (
      <section>
        {/* eslint-disable-next-line react/prop-types */}
        <h3>{this.props.name}</h3>
        {/* The input field to enter To-Do's */}
        <form onSubmit={this.handleSubmit}>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor='task-entry'>Enter a task: </label>
          <input
            type='text'
            aria-label='task-entry'
            placeholder='enter your todo...'
            value={this.state.inputVal}
            onChange={this.handleInputChange}
          />
          <button type='submit'>Submit</button>
          <Count count={this.state.count} />
        </form>
        <h4>All the tasks!</h4>
        {/* The list of all the To-Do's, displayed */}
        <ul>
          {this.state.todos.map((todo, index) => (
            <div key={todo}>
              {this.state.isEdit !== index ? (
                <li>{todo}</li>
              ) : (
                <input
                  type='text'
                  data-testid={todo}        
                  // make sure you use the keyword 'this' for functions
                  onChange={e => this.editInput(e)}
                  // ensures input shows with the past value
                  value={
                    this.state.editedVal === null ? todo : this.state.editedVal
                  }
                />
              )}
              <button
                onClick={() => {
                  this.decrement();
                  this.setState(() => ({
                    todos: this.state.todos.filter((x) => x !== todo),
                  }));
                }}
              >
                Delete
              </button>

              {this.state.isEdit !== index ? (
                <button
                  data-testid={index}
                  onClick={() =>
                    this.setState({
                      isEdit: index,
                    })
                  }
                >
                  Edit
                </button>
              ) : (
                <button onClick={() => this.editButton(index)}>Resubmit</button>
              )}
            </div>
          ))}
        </ul>
      </section>
    );
  }
}

ClassInput.PropTypes = {
  name: PropTypes.string,
}

export default ClassInput;
