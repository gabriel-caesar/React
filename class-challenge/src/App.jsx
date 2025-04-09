import FunctionalInput from './components/FunctionalInput.jsx';
import ClassInput from './components/ClassInput.jsx';
import './index.css';

export default function App() {
  return (
    <>
      <FunctionalInput name="Functional component!" />
      <div className="divider" />
      <ClassInput name="Class based component!" />
    </>
  );
}
