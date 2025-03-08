import { Component } from 'react';
import Button from './Buttons';
import { FaRegSave } from 'react-icons/fa';
import Account from './Account';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.username || '',
      password: props.password || '',
      balance: 0,
      auth: null,
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    // destructuring the state variables
    const { username, password } = this.state;
    const { user } = this.props;

    if (user.username === username && user.password === password) {
      // faking fetching data...
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({ auth: true, loading: false });
      }, 500);
    }
    return this.setState({ auth: false });
  }

  render() {
    if (!this.state.auth && this.state.loading) {
      return (
        <>
          <div className="flex flex-col bg-green-900 text-gray-200 rounded-sm p-10 mr-10">
            <h1>Logging in...</h1>
          </div>
        </>
      );
    } else if (this.state.auth && !this.state.loading) {
      return (

        <Account props={this.state} />

      );
    } else
      return (
        <>
          <form
            className="flex flex-col bg-green-900 text-gray-200 rounded-sm p-10 mr-10"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-3xl">Welcome, dear customer</h3>

            <label className="flex flex-col text-lg mt-6">
              Username
              <input
                className={
                  this.state.auth === false
                    ? 'bg-red-700 border-b-2 text-gray-100 focus-within:outline-none px-2 w-1xl rounded-t-sm transition-colors'
                    : 'bg-green-800 border-b-2 text-gray-100 focus-within:outline-none px-2 w-1xl rounded-t-sm transition-colors'
                }
                type="text"
                value={this.state.username}
                onChange={(e) => {
                  this.setState(() => {
                    const updated = e.target.value;
                    return { username: updated };
                  });
                }}
                required
              />
            </label>

            <label className="flex flex-col relative text-lg">
              Password
              <input
                className={
                  this.state.auth === false
                    ? 'bg-red-700 border-b-2 text-gray-100 focus-within:outline-none px-2 w-1xl rounded-t-sm transition-colors'
                    : 'bg-green-800 border-b-2 text-gray-100 focus-within:outline-none px-2 w-1xl rounded-t-sm transition-colors'
                }
                type="password"
                value={this.state.password}
                onChange={(e) => {
                  this.setState(() => {
                    const updated = e.target.value;
                    return { password: updated };
                  });
                }}
                required
              />
              <Button text="Show" className="absolute top-7 left-68" />
            </label>

            <label className="flex justify-between items-center mt-2">
              <div className="flex">
                <input type="checkbox" className="w-4 mr-2" />
                Remember me
              </div>
              <FaRegSave />
            </label>

            <Button
              text="Sign In"
              className="bg-gray-200 text-green-900 font-bold text-lg rounded-sm mt-8"
              onClick={this.handleSubmit}
            />
          </form>
        </>
      );
  }
}
