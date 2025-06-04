import { useOutletContext } from 'react-router-dom';
import { Pencil, CircleAlert, CircleCheck } from 'lucide-react';
import styles from '../css_modules/Account.module.css';
import { useState } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Loading from '../components/reusable_components/Loading';

function Account() {
  const [userObject, dispatch, goToCheckout, setGoToCheckout, isUserLogged] =
    useOutletContext();

  // edit flag
  const [edit, setEdit] = useState(false);

  // form data
  const [firstName, setFirstName] = useState(
    userObject && userObject.firstName
  );
  const [lastName, setLastName] = useState(userObject && userObject.lastName);
  const [phoneNumber, setPhoneNumber] = useState(
    userObject && userObject.phoneNumber
  );
  const [address, setAddress] = useState(userObject && userObject.address);
  const [loading, setLoading] = useState(false);

  // error feedback
  const [error, setError] = useState(null);

  // address input rules
  const addressRegex =
    /^(?!.*\'.*\')(?!.*\.\.)[0-9]+\s[a-zA-Z'.]+(\s[a-zA-Z'.]+)?$/g;

  // function to update the user object
  async function updateUserObject() {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid); // user reference

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

      const update = {
        ...userObject,
        firstName,
        lastName,
        phoneNumber,
        address,
      }; // updated user object
      await updateDoc(userRef, update); // update the firebase
      dispatch({ type: 'update-user', payload: update }); // update the userObject state
      setError(null); // reseting error feedback
      return setEdit(false); // close the edit form
    } catch (error) {
      setError(error.message); // updating the error feedback
      throw new Error(`Couldn't update user. ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.profileContainer}>
        {userObject ? (
          loading ? (
            <Loading marginTop={'12rem'} />
          ) : (
            <>
              {' '}
              <span
                className={styles.editButton}
                onClick={() => setEdit(!edit)}
              >
                <Pencil strokeWidth={1} size={32} />
              </span>
              <h1>Profile Details</h1>
              <div className={styles.inputWrapper}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  {auth.currentUser.emailVerified ? (
                    <CircleCheck color={'#a2c11c'}/>
                  ) : (
                    <CircleAlert color={'#ec2f2fd2'}/>
                  )}
                  <p
                    className={styles.verification}
                    style={
                      auth.currentUser.emailVerified
                        ? { color: '#a2c11c' }
                        : { color: '#ec2f2fd2' }
                    }
                  >
                    {auth.currentUser.emailVerified
                      ? 'Email verified'
                      : `Email not verified (check spam)`}
                  </p>
                </div>
                <label className={styles.emailLabel}>
                  Email:
                  <p>{userObject.email}</p>
                </label>

                <label>
                  First name:
                  {edit ? (
                    <input
                      autoFocus
                      type='text'
                      name='first-name'
                      className={styles.input}
                      aria-label='first-name-field'
                      placeholder='John...'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && updateUserObject()}
                    />
                  ) : (
                    <p>{userObject.firstName}</p>
                  )}
                </label>
                <label>
                  Last name:
                  {edit ? (
                    <input
                      type='text'
                      name='last-name'
                      className={styles.input}
                      aria-label='last-name-field'
                      placeholder='Doe...'
                      maxLength='20'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && updateUserObject()}
                    />
                  ) : (
                    <p>{userObject.lastName}</p>
                  )}
                </label>
                <label>
                  Phone number:
                  {edit ? (
                    <input
                      type='text'
                      name='phone-number'
                      className={styles.input}
                      aria-label='phone-number-field'
                      placeholder='xxx-xxx-xxxx...'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && updateUserObject()}
                    />
                  ) : (
                    <p>{userObject.phoneNumber}</p>
                  )}
                </label>
                <label>
                  Address:
                  {edit ? (
                    <input
                      type='text'
                      name='address'
                      className={styles.input}
                      aria-label='address-field'
                      placeholder='1 Main St...'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && updateUserObject()}
                    />
                  ) : (
                    <p>{userObject.address}</p>
                  )}
                </label>
              </div>
              {error && <span className={styles.errorFeedback}>{error}</span>}
              {edit ? (
                <button onClick={() => updateUserObject()}>Save</button>
              ) : (
                <h4>Click on the pencil to edit</h4>
              )}
            </>
          )
        ) : (
          <Loading marginTop={'10rem'} />
        )}
      </div>
    </div>
  );
}

export default Account;
