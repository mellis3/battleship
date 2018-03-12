import { combineReducers } from 'redux';

// reducers.js
const test = ( todos, filter ) => {
  switch ( filter ) {
    case 'SHOW_COMPLETED':
      return todos.filter( t => t.completed );
    case 'SHOW_ACTIVE':
      return todos.filter( t => !t.completed );
    case 'SHOW_ALL':
    default:
      return todos;
  }
};

export const reducers = combineReducers( {
  test
} );
