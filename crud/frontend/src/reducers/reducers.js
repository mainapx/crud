const mystate={payload1:[],payload2:[],verify:[],update_todo:[],
	delete_todo:[],payload6:[],payload7:[],payload8:[],payload9:[],
	logout:[],payload11:[],payload12:[],payload13:[],payload14:[],payload15:[],payload16:[],todo_list:[]};


export default function DetailUsers(state=mystate,action){
	switch(action.type){
		case 'LOGIN_USER':
			return{
				...state.payload1,
				payload1:action.payload,
			}
		case 'REGISTER_USER':
			return{
				...state,
				payload2:action.payload
			}
		case 'Todo_List':
			return{
				...state,
				todo_list:action.payload
			}
		case 'UPDATE_TODO':
			return{
				...state,
				update_todo:action.payload
			}
		case 'UPDATE_TODO':
			return{
				...state,
				update_todo:action.payload
			}
		case 'ADD_TODO':
			return{
				...state,
				add_todo:action.payload
			}
		case 'DELETE_TODO':
			return{
				...state,
				delete_todo:action.payload
			}
		case 'LOGOUT':
			return{
				...state,
				logout:action.payload
			}
		default:
			return {...mystate}
	}
};
