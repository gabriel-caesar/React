import styles from '../css_modules/Login.module.css';
import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import Loading from '../components/reusable_components/Loading';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

// Form action
export async function action({ request }) {
  // getting form data
  let formData = await request.formData();
  let email = formData.get('email');
  let pass = formData.get('pass');

  if (email === '' || pass === '') {
    // handling blank input fields
    return { message: `Fill up all the input fields` };
  }
  try {
    // function to log user in
    await signInWithEmailAndPassword(auth, email, pass);
    return redirect('/');
  } catch {
    return { message: 'Invalid account' };
  }
}

function Login() {
  let data = useActionData(); // tracks messages coming from the action function
  const navigation = useNavigation(); // tracks the form state (useful to handle loading animations)
  const navigate = useNavigate();

  return (
    <div className={styles.mainContainer}>
      <Form method='post' className={styles.loginContainer}>
        {navigation.state === 'submitting' ? (
          <Loading marginTop={'12rem'} />
        ) : (
          <>
            <h1>Log in to your account</h1>
            <label className={styles.label}>
              Email
              <input
                type='text'
                name='email'
                className={styles.input}
                style={data && { backgroundColor: 'var(--errorTheme)' }}
                aria-label='email-field'
                placeholder='some@email.com...'
              />
            </label>
            <label className={styles.label}>
              Password
              <input
                type='password'
                name='pass'
                className={styles.input}
                style={data && { backgroundColor: 'var(--errorTheme)' }}
                aria-label='password-field'
                placeholder='Password...'
              />
            </label>
            {data && (
              <span className={styles.errorFeedback}>{data.message}</span>
            )}
            <button className={styles.loginButton}>Log In</button>
            <button
              className={styles.createAccountButton}
              type='button'
              id='new-account'
              onClick={() => {
                return navigate('/signup');
              }}
            >
              Create a new account
            </button>
          </>
        )}
      </Form>
    </div>
  );
}

export default Login;
