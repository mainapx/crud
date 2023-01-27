import {combineReducers} from 'redux';
import DetailUsers from './reducers.js';

const rootreducer=combineReducers({
	crudHandler:DetailUsers
});
export default rootreducer