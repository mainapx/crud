import React from 'react';
import ReactDOM from 'react-dom';
import './login.css';
import {connect} from 'react-redux';
import AOS from 'aos';
import {Redirect} from 'react-router';
import {Loginhandler} from '../../actions/action.js';

const mapStateToProps=(state)=>{
	try{
	if(state.crudHandler.payload1.status==="Failed"){
		const b=(
			<div className="alert alert-danger" id="loginerror" data-aos="fade-down" data-aos-duration="500"><center>{state.crudHandler.payload1.message}
			</center></div>
		);
		setTimeout(()=>{
				ReactDOM.render(b,document.getElementById("MsgID"));
				},2000)		
		setTimeout(()=>{
				ReactDOM.render("",document.getElementById("MsgID"));
			},4000)
		}else{

			Object.entries(state.crudHandler.payload1.data).map(([key,value])=>{
				if(key!="password"){localStorage.setItem(key,value)}else{console.log("BAD")};
			document.getElementById("myloginbtn").setAttribute("class","btn btn-default disabled");
			setTimeout(()=>{
				window.location="/admin"},6000)})
	}}catch(e){}
}
			
class LoginSystem extends React.Component
{
	constructor(props){
		super(props);
		this.state={loginemail:'',loginpassword:''}
		AOS.init();
		localStorage.clear();
	}
	render()
	{
		return(
				<div className="container">
					<center>
							<span id="MsgID"></span>
					</center>
					<div className="row">
						<div className="col-lg-3"></div>
						<div className="col-lg-6">
							<div className="card shadow p-4" id="mylogincard">
								<div className="card-header">
									<center><h4 style={{color:'#E3A4BB'}}>Signin</h4></center>
								</div>
								<div className="card-body">
									<div className="form-group">
										<br/>
										<input onChange={(e)=>this.setState({loginemail:e.target.value})} type="text" placeholder="example@mail.com" className="form-control"/>
										<br/>
										<input onChange={(e)=>this.setState({loginpassword:e.target.value})} type="password" placeholder="Password" className="form-control"/>
										<br/>
										<a type="button" onClick={()=>this.props.MySend(this.state)} id="myloginbtn" className="btn btn-default"><center style={{color:'white'}}>Login</center></a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			);
	}
}
const mapDispatchToProps=(dispatch)=>{
	return{
		MySend:data=>{
			dispatch(Loginhandler(data))
		}
		
	};
}
export default connect(mapStateToProps,mapDispatchToProps)(LoginSystem);