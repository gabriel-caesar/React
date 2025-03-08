import { ACTIONS } from './Reducer'

export default function Todo({ todo, dispatch }) {
  return (
    <div className="todoCard">
      <h3 style={ {textDecoration: 'underline'} }>{todo.name}</h3>

      <p style={{ color: todo.complete ? '#00ff00' : '#ff0000' }}>
        {todo.complete ? 'Completed' : 'Imcomplete'}
      </p>

      <button onClick={() => dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id: todo.id } })}>Toggle</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_TODO, payload: { id: todo.id } })}>Delete</button>
    </div>
  )
}