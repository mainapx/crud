import React,{useEffect,useState,useRef} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import './todo.css';
import AOS from 'aos';
import {GetAllTodo,PutTodoItem,CreateTodoItem,DeleteTodoItem} from '../../actions/action.js';
import {useSelector,useDispatch} from 'react-redux';
import ReactDOM from 'react-dom';

const TodoHandler=(props)=>{
	AOS.init();
	const [getState,setStateHandler]=useState('');
	const [getid,setId]=useState(500000);
	const [mobileStyle,setStyle]=useState({color:'black'})
	const [refreshState,setRefreshState]=useState('fa fa-refresh');
	const [getTodoid,settodoid]=useState(100000);
	const [getInputStyle,setInputStyle]=useState({});
	const [DeleteStyle,setDeleteStyle]=useState({});
	const [getTrashRefresh,setTrashRefresh]=useState({fontSize:'5vw'})
	const dispatcher=useDispatch();
	const inputRef=useRef();
	useEffect(()=>{
		if(navigator.userAgent.toString().toLowerCase().match(/android|iphone/g)){
			setInputStyle({width:'85%',fontSize:'5vw',border:'1px solid blue',outline:'1px solid blue'});
			ReactDOM.findDOMNode(inputRef.current).style.cssText="width:85%;font-size:5vw;border:1px solid blue;outline:1px solid blue";
			setTrashRefresh({fontSize:'5vw',position:'realtive',right:'10vw'})
			setDeleteStyle({fontSize:'5vw'})
		}
		dispatcher(GetAllTodo(localStorage.getItem('authorization')));
		settodoid(58456448)
	},[])
	const selector=useSelector(state=>{
		if(state.crudHandler.todo_list.status==="OK"){
				return state.crudHandler.todo_list.todo_list.map(p=>(
					<ul className="list-group" style={{display:'flex',justifyContent:'space-between'}} data-main-id={p.todo_id}>
						<li className="list-group-item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
							<span contenteditable="true" disabled style={{width:'200px',wordBreak:'break-all'}}>{p.name}</span>
							<a className="btn btn-default" onClick={UpdateTodo}>
								<i style={getTrashRefresh} className={state.crudHandler.todo_list.todo_list[0].role==="user"?(alert()||'fa fa-edit disabled'
							):'fa fa-edit'} data-toggle="tooltip" title="edit" data-placement="top" style={{position:'relative',left:'50px'}}></i></a>
							<a className="btn btn-default" onClick={DeleteTodo}><i style={DeleteStyle} data-toggle="tooltip" title="delete" data-placement="top" className="fa fa-trash"></i></a>
						</li>
			</ul>))
		}
	});
	const updater=useSelector(state=>{
		if(state.crudHandler.update_todo.status==="OK"){
			return <div className="alert alert-primary" data-aos="fade-down" data-aos-duration="600"><center>{state.crudHandler.update_todo.message}</center></div>
		}else if(state.crudHandler.delete_todo.status=="OK"){
			return <div className="alert alert-success" data-aos="fade-down" data-aos-duration="600"><center>{state.crudHandler.delete_todo.message}</center></div>
		}else if(state.crudHandler.delete_todo.status=="Failed"||state.crudHandler.delete_todo.status=="Failed"){
			return <div className="alert alert-success" data-aos="fade-down" data-aos-duration="600"><center>{state.crudHandler.delete_todo.message}</center></div>
		}else{}
	});

	function DeleteTodo(e){
		const parentHandler=e.target.parentElement.parentElement.parentElement.getAttribute('data-main-id');
		dispatcher(DeleteTodoItem({authorization:localStorage.getItem('authorization'),'todoid':parentHandler}))
		setTimeout(()=>{ReactDOM.render("",document.getElementById("respUpdate"))},2000);
	}	
	function UpdateTodo(e){
		e.target.setAttribute("class",refreshState);
		e.target.addEventListener('click',e=>{
			const parentHandler=e.target.parentElement.parentElement.parentElement
			dispatcher(PutTodoItem({authorization:localStorage.getItem('authorization'),
				'todoid':parentHandler.getAttribute('data-main-id'),
				'name':parentHandler.childNodes[0].childNodes[0].innerHTML}))
			setRefreshState('fa fa-edit');
			setTimeout(()=>{ReactDOM.render("",document.getElementById("respUpdate"))},2000);
		});
	}	
	function CreateTodo(e){
		const creater=document.createElement("div");
		creater.setAttribute("id",getTodoid);
		document.querySelector('.card-body').appendChild(creater);
		const jsxHandler=(
				<ul className="list-group d-flex" data-main-id={getTodoid}>
					<li className="list-group-item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
							<span contenteditable="true" style={{width:'200px',wordBreak:'break-all'}}>{inputRef.current.value}</span>
						<a className="btn btn-default" onClick={UpdateTodo}><i style={getTrashRefresh} data-toggle="tooltip" title="edit" data-placement="top" className='fa fa-edit' style={{position:'relative',left:'50px'}}></i></a>
						<a className="btn btn-default" onClick={DeleteTodo}><i style={DeleteStyle} data-toggle="tooltip" title="delete" data-placement="top" className="fa fa-trash"></i></a>
					</li>
				</ul>
			);
		ReactDOM.render(jsxHandler,document.getElementById(getTodoid));
		document.querySelector('.card-body').scrollTo({top:100000});
		dispatcher(CreateTodoItem({authorization:localStorage.getItem('authorization'),'todoID':getTodoid,'name':inputRef.current.value}));
		setId(getid+1);setStateHandler('');inputRef.current.value="";settodoid(getTodoid+1);
	}
	return(
				<div id="main_todo">
					<span id="respUpdate">{updater}</span>
					<div className="card" id="todcard">
						<div className="card-header">
							<center><h4>TodoList</h4>
							<div className="form-group">
								<input type="text"
									ref={inputRef}
									style={getInputStyle}
								 placeholder="Item Name" id="todinput"/>
								<a className="btn btn-default"><i style={getTrashRefresh} className="fa fa-plus"
								 data-toggle="tooltip" title="add" data-placement="top"
								 onClick={CreateTodo}></i></a>
							</div></center>
						</div>
						<div className="card-body" style={{height:'400px',overflowY:'scroll'}}>
							{selector}
						</div>
					</div>
				</div>
		);
}
export default TodoHandler;