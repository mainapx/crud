import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import AOS from 'aos';
import validator from 'validator';
import './register.css';
import {Registerhandler} from '../../actions/action.js';

const mapStateToProps=state=>{
	const ENDPOINT_REDIRECT="https://serene-cove-82999.herokuapp.com/verify";
	try{
		if(state.crudHandler.payload2.status==="OK"){
			setTimeout(()=>{
				document.getElementById('regbtn').setAttribute("class","btn btn-default disabled");
			},2000);

			setTimeout(()=>{
				localStorage.setItem('authorization',JSON.parse(state.crudHandler.payload2.data[0]).authorization)
				localStorage.setItem('email',JSON.parse(state.crudHandler.payload2.data[0]).username)
				window.location=ENDPOINT_REDIRECT;
			},4000);
		}else{
			if(state.crudHandler.payload2.length!=0){
				setTimeout(()=>{
					const n=(<div className="alert alert-danger" id="reg" style={{backgroundColor:'red',color:'white'}} data-aos='fade-down' 
						data-aos-duration='800'><center>{state.crudHandler.payload2.message}
						</center></div>);
				ReactDOM.render(n,document.getElementById("Errusers"));			
			},1000)
		}

	}			setTimeout(()=>{ReactDOM.render("",document.getElementById("Errusers"))},6000);
}catch(e){}
}
class RegisterSystem extends React.Component
{
	constructor(props){
		super(props);
		AOS.init();
		this.state={Firstname:'',Lastname:'',Username:'',Password:''}
		this.Changestate=this.Changestate.bind(this);
	}
	Changestate(e){
			this.setState({[e.target.name]:e.target.value});
	}
	render()
	{

		return(
				<div className="container">
					<div className="row">
						<div className="col-lg-3"></div>
						<div className="col-lg-6">
													<div id="Errusers"></div>

							<div className="card shadow p-4" id="mylogincard">
								<div className="card-header">
									<center><h4 style={{color:'purple'}}>Registration</h4></center>
								</div>
								<div className="card-body">
									<div className="form-group">
										<br/>
										<input type="text" 
											onChange={this.Changestate} name="Firstname" placeholder="Firstname" className="form-control"/>
										<br/>
										<input type="text" 
											onChange={this.Changestate} name="Lastname" placeholder="Lastname" className="form-control"/>
										<br/>
										<input type="email" 

											onChange={this.Changestate} 
											onKeyUp={(e)=>!validator.isEmail(e.target.value)?(
												ReactDOM.render("Invalid Email Address",document.getElementById("checkEmailValid"))):ReactDOM.render("",document.getElementById("checkEmailValid"))}
												name="Username" placeholder="example@mail.com" className="form-control"/>
											<span id="checkEmailValid" style={{color:'red'}} ></span>
										<br/>
										<input type="password" 

											onChange={this.Changestate} name="Password" placeholder="Password" className="form-control"/>
										<br/>
										<a  id="regbtn" onClick={()=>this.props.RegistrationUser(this.state)} className="btn btn-primary"><center style={{color:'white'}}>Next</center></a>
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
		RegistrationUser:data=>{
			dispatch(Registerhandler(data))
		}
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(RegisterSystem);