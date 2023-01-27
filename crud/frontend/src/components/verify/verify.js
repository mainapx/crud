import React,{useEffect,useState,useRef} from 'react';
import {connect} from 'react-redux';
import './verify.css';
import AOS from 'aos';
import {OTPHandler,OTPVerify} from '../../actions/action.js'
import ReactDOM from 'react-dom';


function VerifyDispatch(e){
	return e
}
const VerifyUser=(props,dispatch)=>{
	const first=useRef([0,0,0,0,0]);
	AOS.init();
	const [totalmin,totalsec]=useState({totalminute:0,totalsecond:59,authorization:localStorage.getItem("authorization"),email:localStorage.getItem('email')});
	
	function myHandler(){
		props.OTPSend({authorization:totalmin.authorization,email:totalmin.email});
		const myinterval=setInterval(()=>{
			totalsec(previous=>({totalminute:previous.totalminute,totalsecond:previous.totalsecond-1}));
		
		},1000);
	}


	function ResendOTP(){
		props.OTPSend({authorization:totalmin.authorization,email:totalmin.email});
		setTimeout(()=>{

		if(props.ResendUserOTP==="OK"){ReactDOM.render(<div className="alert alert-success" data-aos-duration="500" 
			data-aos="fade-down"><center style={{alignItems:'center'}}>{"Successfully Resend"}</center></div>,
		document.getElementById("SrvResponse"));
			ReactDOM.render(<span>{"Maximum OTP Allowed Range Limit 0-1 Try Again Letter"}</span>,document.getElementById("linkexpire"));
			setTimeout(()=>{ReactDOM.render("",document.getElementById("SrvResponse"))},2000)}
		},1000);
	}
	useEffect(()=>{
		window.location="https://serene-cove-82999.herokuapp.com/admin"
		myHandler()
	},[])
	if(totalmin.totalsecond===0){
		const myresendbtn=(<a type="button" onClick={ResendOTP} className="btn btn-link">Resend OTP</a>);
			ReactDOM.render(myresendbtn,document.getElementById('linkexpire'));
	}
	
	
	const bw=document.querySelectorAll('#otpinputs > li>input');
	useEffect(()=>{
	document.getElementById("hi").addEventListener('input',()=>{
		if(first.current[0].value && first.current[1].value && first.current[2].value && first.current[3].value&&first.current[4].value){
			for(let x=0;x<=4;x++){
				first.current[x].setAttribute('disabled','');
			}
			const spinertest=(<div className="spinner-border"></div>);
			ReactDOM.render(spinertest,document.getElementById('linkexpire'));
			let otpvalue=first.current[0].value+""+first.current[1].value+""+first.current[2].value+""+first.current[3].value+""+first.current[4].value;
			props.OTPVerify({authorization:totalmin.authorization,otp:otpvalue,emailid:totalmin.email});	
			
		}	
	});
	},[]);
	

	return(
			<div className="row">
				<div className="col-lg-3"></div>
				<div className="col-lg-6">
					<div id="SrvResponse"></div>
					<div className="jumbotron shadow p-4" id="myjumboverify">
						<center><h4>We Send a Verification Code to You Email</h4>
							<span> Check You Email or 5 Digit OTP in Your Spam Folder and verify</span>
						</center>
						<br/>
						<div className="form-group">
							<ul className="nav nav-pills flex-columns justify-content-center" id="otpinputs">
								<li className="nav-item"><input type="text" ref={e=>first.current[0]=e} id="ab" maxlength="1"  className="form-control nav-item"/></li>
								<li className="nav-item"><input type="text"  ref={e=>first.current[1]=e} id="cd" maxlength="1" className="form-control nav-item"/></li>
								<li className="nav-item"><input type="text" ref={e=>first.current[2]=e} id="ef" maxlength="1" className="form-control nav-item"/></li>
								<li className="nav-item"><input type="text"  ref={e=>first.current[3]=e} id="fg" maxlength="1" className="form-control nav-item"/></li>
								<li className="nav-item"><input type="text" ref={e=>first.current[4]=e} id="hi" maxlength="1" className="form-control nav-item"/></li>
							</ul>
						</div>
						<br/>
						<center><span id="linkexpire">{totalmin.totalminute}:{totalmin.totalsecond}</span></center>
					</div>
				</div>
			</div>
		);
}
export default VerifyUser;