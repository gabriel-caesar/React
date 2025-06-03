import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../css_modules/RegisterProfile.module.css';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { useState } from 'react';
import Loading from '../components/reusable_components/Loading';

function RegisterProfile() {
  // context from parent component
  const { email, pass, error, setError, setBridge } = useOutletContext();

  // used to redirect user
  const navigate = useNavigate();

  // form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // custom submit function
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    
    const addressRegex =
      /^(?!.*\'.*\')(?!.*\.\.)[0-9]+\s[a-zA-Z'.]+(\s[a-zA-Z'.]+)?$/g;

    try {

      // making sure all the input fields are not blank
      if (
        firstName === '' ||
        lastName === '' ||
        phoneNumber === '' ||
        address === ''
      ) {
        return setError('Fill up all the input fields');
      }

      // checking for first name
      if (firstName.length > 11) {
        return setError(`First name too big (11 char. max.)`);
      } else if (!firstName.match(/(?!.*\'.*\')[a-zA-Z']+/)) {
        return setError(`Invalid first name`);
      }

      // checking for last name
      if (lastName.length > 11) {
        return setError(`Last name too big (11 char. max.)`);
      } else if (firstName === lastName) {
        return setError(`You can't have the same last and first name`);
      } else if (!lastName.match(/(?!.*\'.*\')[a-zA-Z']+/)) {
        return setError(`Invalid last name`);
      }

      // checking for valid phone numbers
      if (!phoneNumber.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)) {
        return setError(`Invalid phone number (use format: xxx-xxx-xxxx)`);
      }

      // checking for address validity
      if (!addressRegex.test(address)) {
        return setError(`Invalid address (try similar: 12 Main St)`);
      }

      // attempts to create an auth record
      await tryCreatingUser(email, pass);

      // custom object with user credentials
      const newUser = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        address: address,
        cart: []
      };

      await saveUserToFirestore(newUser); // saving the user in the firestore
      return navigate('/'); // redirecting user to main page
    } catch (error) {
      console.log('error on submit');
      setError(error.message); // sends the error message
      throw new Error(`Couldn't submit. ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // checks if the user input a valid email
  async function tryCreatingUser(e, p) {
    try {
      await createUserWithEmailAndPassword(auth, e, p);
    } catch (error) {
      console.log('error on tryCreatingUser');
      setError(error.message); // setting the error message for feedback
      setBridge(false); // closes the bridge to avoid rendering Outlet again
      navigate(-1); // navigate back to the sign up page
      throw new Error(`Couldn't create auth record. ${error.message}`);
    }
  }

  // function that communicates with firebase
  async function saveUserToFirestore(userObject) {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid); // user reference
      await setDoc(userRef, userObject); // setting (creating) a new user
      await sendEmailVerification(auth.currentUser); // sending email verification to user's email
    } catch (error) {
      console.log('error on saveUserToFirestore');
      setError(error.message);
      throw new Error(`Couldn't create user on cloud. ${error.message}`);
    }
  }

  return (
    <form
      method='post'
      className={styles.formContainer}
      onSubmit={(e) => submit(e)}
    >
      {loading ? (
        <Loading marginTop={'12rem'} />
      ) : (
        <>
          <h1>Profile Details</h1>
          <label>
            First Name
            <input
              type='text'
              name='first-name'
              className={styles.input}
              aria-label='first-name-field'
              placeholder='John...'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Last Name
            <input
              type='text'
              name='last-name'
              className={styles.input}
              aria-label='last-name-field'
              placeholder='Doe...'
              maxLength='20'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            Phone number
            <input
              type='text'
              name='phone-number'
              className={styles.input}
              aria-label='phone-number-field'
              placeholder='xxx-xxx-xxxx...'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </label>
          <label>
            Address
            <input
              type='text'
              name='address'
              className={styles.input}
              aria-label='address-field'
              placeholder='1 Main St...'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          {error && <span className={styles.errorFeedback}>{error}</span>}
          <button>Create</button>
        </>
      )}
    </form>
  );
}

export default RegisterProfile;
