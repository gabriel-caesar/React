import styles from '../css_modules/SignUp.module.css';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

function SignUp() {
  const navigate = useNavigate();

  // form data
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // userObject and dispatch need to be here because the
  // destructuring requires the variables to be destructured in order
  const [ userObject, dispatch, bridge, setBridge ] = useOutletContext();

  // error handler
  const [error, setError] = useState(null);

  // summarizing the error for readability
  if (error === `Couldn't create auth record. Firebase: Error (auth/email-already-in-use).`) {
    setError('Email already in use');
  }

  // email rule
  const emailRegex =
    /^(?!.*_.*_.*)(?!.*\.\.)[^\s._#!?][a-zA-Z0-9_.!#?]+\@(hotmail\.com|gmail\.com|outlook\.com|yahoo\.com)$/gi;

  // user data handlers
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePass(e) {
    setPass(e.target.value);
  }
  function handleConfirmPass(e) {
    setConfirmPass(e.target.value);
  }

  // custom submit function
  async function submit(e) {
    e.preventDefault();
    // making sure all the input fields are not blank
    if (email === '' || pass === '' || confirmPass === '') {
      return setError(`Fill up all the input fields`);
    }

    // checks the email with the regex rules
    if (!emailRegex.test(email)) {
      return setError(`Invalid email`);
    }

    // if passwords match
    if (pass !== confirmPass) {
      return setError(`Passwords don't match`);
    }

    // password rules
    if (pass.length < 10) {
      return setError(`Password too short (10 char. min.)`);
    } else if (pass.length > 30) {
      return setError(`Password too big (30 char. max.)`);
    } else if (!pass.match(/[a-z]/g)) {
      return setError(`Include lowercase letters`);
    } else if (!pass.match(/[A-Z]/g)) {
      return setError(`Include a uppercase letter`);
    } else if (!pass.match(/[0-9]/g)) {
      return setError(`Include numbers`);
    } else if (!pass.match(/[#|@|!|$|%|^|&|*|(|)|-|+|<|>|?|.]/g)) {
      return setError(`Please include a special character (#, @, !, ...)`);
    }

    // reseting error if everything is good
    setError(null);

    // condition to render the outlet
    setBridge(true);

    // redirecting user to fill its profile details
    return navigate('fill-profile');
  }

  return (
    <div className={styles.mainContainer}>
      {bridge ? (
        <Outlet context={{ email, pass, error, setError, setBridge }} />
      ) : (
        <form
          method='post'
          className={styles.signUpContainer}
          onSubmit={(e) => submit(e)}
        >
          <h1>Sign up a new account</h1>
          <label className={styles.label}>
            Email
            <input
              type='text'
              name='email'
              aria-label='email-field'
              style={error ? { backgroundColor: 'var(--errorTheme)' } : {}}
              className={styles.input}
              placeholder='some@email.com...'
              value={email}
              onChange={(e) => handleEmail(e)}
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type='password'
              name='pass'
              aria-label='password-field'
              style={error ? { backgroundColor: 'var(--errorTheme)' } : {}}
              className={styles.input}
              placeholder='Password...'
              value={pass}
              onChange={(e) => handlePass(e)}
            />
          </label>
          <label className={styles.label}>
            Confirm password
            <input
              type='password'
              name='confirmPass'
              aria-label='confirm-password-field'
              style={error ? { backgroundColor: 'var(--errorTheme)' } : {}}
              className={styles.input}
              placeholder='Confirm password...'
              value={confirmPass}
              onChange={(e) => handleConfirmPass(e)}
            />
          </label>
          {error !== null && (
            <span className={styles.errorFeedback}>{error}</span>
          )}
          <button className={styles.submitBtn}>Next</button>
        </form>
      )}
    </div>
  );
}

export default SignUp;
