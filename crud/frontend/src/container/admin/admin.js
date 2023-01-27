import React from 'react';
import Header from '../../components/header/header.js';
import {connect} from 'react-redux';
import TodoHandler from '../../components/admin/todolist.js';
import Avatar from '@material-ui/core/Avatar';
import AOS from 'aos';
import ReactDOM from 'react-dom';
import {LogoutHandler} from '../../actions/action.js';
import {useDispatch,useSelector} from 'react-redux';

const Admin=(props)=>{
	const dispatch=useDispatch();
	const test={position:'absolute',left:'300px',width:'50%'};
	const loginstyle={borderLeft:'none',transition:'0.3s border',color:'#1DD9D8'};	

	const selectorhandler=useSelector(state=>{
		return state.crudHandler.logout.status==="OK"?window.location="/login":console.log("Something is Wrong for Logout")
	})
	return(
			<>
				<Header
					adminLink={"nav-item"}
					adminStyle={{backgroundColor:'transparent'}} 
					adminUser={
							<Avatar id="lastavt">{localStorage.getItem('email').charAt(0).toUpperCase()}</Avatar>
					}
					registeruser={<a className="btn btn-link" id="logbtn" onClick={()=>dispatch(LogoutHandler({authorization:localStorage.getItem('authorization')}))}>Logout</a>}
				/>
				<span id="err">{selectorhandler}</span>
				<br />
				<br /><br />
				<div className="row">
					<div className="col-lg-3"></div>
					<div className="col-lg-5">
						<TodoHandler />
					</div>
				</div>
			</>
		);
}

export default Admin;