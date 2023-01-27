import React from 'react';
import ReactDOM from 'react-dom';
import './header.css'
import {useRef,useState,useEffect} from 'react';

const Header=(props)=>{

	const [isHidden,isShow]=useState({navBarStatus:'none',bcolor:'purple',checking:false,width:'none',transition:'margin-right 0.2s',display:'none',margin:'',left:''});
		if(isHidden.checking===true){
			document.body.style.backgroundColor='black';
		}else{
			document.body.style.backgroundColor="white";
		}

	function Sidebarshow(e)
	{
		if(isHidden.display==="none"){
			isShow({display:'block',bcolor:'black',trans:'2s margin-right',width:'50%'})
		}else{
		isShow({display:"none",trans:'margin-left 2s'});
		}
	}
	return(
			<>
			<nav className="navbar navbar-dark bg-warning navbar-static-top navbar fixed-top shadow p-2" id="headerbar">
				<div className="navbar-brand">
					<h5 id="mytitle">TodoApp</h5>
				</div>
				
					<ul className="nav nav-pills" id="myul">
						<li className="nav-item" id="MyId">{props.LocationIcon}</li>
						<li className={props.homelink} style={props.homestyle}>{props.homeuser}</li>
						<li className={props.loginlink} style={props.loginstyle}>{props.loginuser}</li>
						<li className={props.registerlink} style={props.registerstyle}>{props.registeruser}</li>
						<li className={props.feedbacklink} style={props.feedbackstyle2}>{props.feedbackuser2}</li>
						<li className={props.feedbacklink} style={props.feedbackstyle}>{props.feedbackuser}</li>
						<li className={props.aboutlink} style={props.aboutstyle}>{props.aboutuser}</li>
						<li className={props.adminLink} style={props.adminStyle}>{props.adminUser}</li>
					</ul>
						
			</nav>
			</>
		);
}
export default Header;