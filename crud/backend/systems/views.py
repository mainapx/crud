from django.shortcuts import render,redirect
from django.views import View
from django.db import connection
from rest_framework.views import APIView
from rest_framework import status
from .mailer import SMTPSender
from rest_framework.decorators import api_view
from rest_framework.response import Response
import re,random,hashlib
from django.http import HttpResponse
from systems.models import Login,Register,CrudApi,Admin
import codecs
import json,jwt,schedule

register_jwt_update=[]
login_jwt_update=[]

MAIN_OTP={}
def JWTHandler(**kwargs):
	BIND_TOKEN={}
	BIND_TOKEN['Firstname']=kwargs['firstname']
	BIND_TOKEN['Lastname']=kwargs['lastname']
	BIND_TOKEN['Email']=kwargs['username']
	BIND_TOKEN['isActive']='True'
	BIND_TOKEN['Roles']='User'
	return jwt.encode(BIND_TOKEN,"Authorized",algorithm="HS256")

def Refresh_JWT():
	refresh_register=Register.objects.values()
	for x in list(refresh_register):
		update_register={}
		test_add=[]
		test_add.append('Firstname=%s' % x['firstname'])
		test_add.append('Lastname=%s' % x['lastname'])
		test_add.append('Email=%s' % x['username'])
		test_add.append('Roles=%s' % 'User')
		test_add.append('isActive=%s' % 'True')
		random.shuffle(test_add)
		for i in test_add:
			p=i.split("=")
			update_register[p[0]]=p[1]
		set_jwt=jwt.encode(update_register,"Authorized",algorithm="HS256")
		registercheck=Register.objects.filter(username=x['username']).update(authorization=codecs.decode(set_jwt,"utf-8"))

schedule.every().day.at("02:00").do(Refresh_JWT)
schedule.run_pending()

class RegisterHandler(APIView):
	def post(self,request):
		if request.method == "POST":
			try:
				body=request.data
				firstname=str(body['Firstname'])
				username=str(body['Username'])
				password=str(body['Password'])
				lastname=str(body['Lastname'])
				authorization_token=codecs.decode(JWTHandler(firstname=firstname,username=username,password=password,lastname=lastname),"utf-8")
				if Register.objects.filter(username=username).count() == 0 and username is not  "" and password is not  "" and  re.findall(".*@.*(.com|.in|.org.|.gov)$",username):
					a=Register(firstname=firstname,username=username,password=password,lastname=lastname,authorization=authorization_token)
					b=Login(password=password,username_id=username,authorization=authorization_token,verify="False")
					a.save()
					b.save()
					request.session['LoggedIN']='AUTHORIZED'
					new_register={'status':'OK','message':'Account Created','data':[json.dumps(Register.objects.filter(authorization=authorization_token).values()[0])]}
					h=Response(new_register,status=status.HTTP_201_CREATED)
					return h
				elif Register.objects.filter(username=username).count() == 1 and username is not  "" and password is not  "" and  re.findall(".*@.*(.com|.in|.org.|.gov)$",username):
					h={'status':'Failed','message':'Account Already Exists'}
					return Response(h,status=status.HTTP_400_BAD_REQUEST)
				return Response({'status':'Failed','message':'Invalid Parameters'},status=status.HTTP_422_UNPROCESSABLE_ENTITY)
			except:
				return Response({'status':'Failed','message':'Something is Wrong Please Try Again'},status=status.HTTP_422_UNPROCESSABLE_ENTITY)
		return Response({'status':'Failed','message':'Method Not Allowed'},status=status.HTTP_405_METHOD_NOT_ALLOWED)

	def get(self,request):
		return Response({'status':'Failed','message':'Method Not Allowed'},status=status.HTTP_405_METHOD_NOT_ALLOWED)

class LoginHandler(APIView):
	def post(self,request):
		if request.method == "POST":
			username=None
			password=None
			getbody=None
			try:
				try:
					getbody=request.data
					print(getbody)
					username=getbody['username']
					password=getbody['password']
				except Exception as e:
					print(e)
					return Response({'status':'Failed','message':'Invalid Parameters'},status=status.HTTP_400_BAD_REQUEST)

				try:
					connection_object=connection.cursor()
					pass_hash=hashlib.new('md5')
					pass_hash.update(codecs.encode(password,"utf-8"))
					pass_hashtest=str(pass_hash.hexdigest())
					connection_object=Admin.objects.filter(admin_email=username,admin_password=pass_hashtest).values()
					if len(connection_object) == 1:
						admin_data={}
						admin_data['authorization']=connection_object[0]['token']
						admin_data['email']=connection_object[0]['admin_email']
						admin_data['role']=connection_object[0]['role']				
						self.request.session['LoggedIN']='AUTHORIZED'
						return Response({'status':'OK','messsage':'Success','isAdmin':'true','data':admin_data},status=status.HTTP_200_OK)
					else:
						w=Login.objects.filter(username_id=username,password=password).values()
						if w:
							data=Register.objects.filter(username=username).values()[0]
							val=data['username']
							del data['username']
							data['email']=val
							self.request.session['LoggedIN']='AUTHORIZED'
							return Response({'status':'OK','message':'Success','data':data},status=status.HTTP_200_OK)
					return Response({'status':'Failed','message':'Invalid Username or Password'},status=status.HTTP_400_BAD_REQUEST)
				except Exception as e:
					print(e)
					return Response({'status':'Failed','message':'Something is Wrong Please Try Again'},status=status.HTTP_403_FORBIDDEN)
			except:
				return Response({'status':'Failed','message':'Invalid Parameters'},status=status.HTTP_400_FORBIDDEN)
	def get(self,request):
		return Response({'status':'Failed','message':'Method Not Allowed'},status=status.HTTP_405_METHOD_NOT_ALLOWED)

class IndexHandler(View):
	def get(self,request):
		test=render(request,"index.html")
		test['Cache-Control']="no-cache, must-revalidate"
		return test

class LoginView(View):
	def get(self,request):
		return render(request,"index.html")

class RegisterView(View):
	def get(self,request):
		return render(request,"index.html")

class LogoutHandler(APIView):
	def get(self,request):
		if 'LoggedIN' in self.request.session:
			del request.session['LoggedIN']
			return Response({'status':'OK','message':'Logout Successfully'},status=status.HTTP_200_OK)
		return HttpResponse({'status':'Failed','message':'Unauthorized'},status=401,content_type="application/json")

class AdminHanlder(APIView):
	def get(self,request):
		if 'LoggedIN' in request.session:
			return render(request,"index.html")
		return redirect("/login")

@api_view(['POST'])
def CreateTodoHandler(request,id):
	if 'LoggedIN' in request.session:
		try:
			get_authorization=request.data['authorization']
			todo_id=request.get_full_path().split("/")[-1]
			dataname=request.data['name']
			connection_object=Admin.objects.filter(token=get_authorization).values()
			if len(connection_object):
				if not CrudApi.objects.filter(register_email_id=connection_object[0]['admin_email'],todo_id=todo_id).values():
			
					data=CrudApi(name=dataname,register_email_id=connection_object[0]['admin_email'],todo_id=int(todo_id),role="admin")
					data.save()
					rsp=Response({'status':'OK','message':'Todo Created'},status=status.HTTP_201_CREATED)
					return rsp
				return Response({'status':'Failed','message':'Todo Already Created'},status=status.HTTP_422_UNPROCESSABLE_ENTITY)
			return Response({'status':'Failed','message':'Only Admin User are Allowed'},status=status.HTTP_401_UNAUTHORIZED)
		except Exception as e:
			return Response({'status':'Failed','message':'Invalid Parameters'},status=status.HTTP_400_BAD_REQUEST)
	return Response({'status':'Failed','message':'Invalid Token You Need to Login'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def SingleTodoParser(request,id):
	if 'LoggedIN' in request.session:
		try:
			get_authorization=request.META['HTTP_AUTHORIZATION']
			single_todo_id=request.get_full_path().split("/")[-1]

			connection_object=Admin.objects.filter(token=get_authorization).values()
			if len(connection_object):
				tests=CrudApi.objects.filter(register_email_id=connection_object[0]['admin_email'],todo_id=single_todo_id).values()
				for x in tests:
					x.pop('register_email_id')	
				rsps=Response({'status':'OK','message':'Success','todo_list':list(tests)},status=status.HTTP_200_OK)
				return rsps
			return Response({'status':'Failed','message':'Only Admin User are Allowed'},status=status.HTTP_401_UNAUTHORIZED)
		except Exception as e:
			print(e)
			return Response({'status':'Failed','message':'Invalid Authorization Token'},status=status.HTTP_403_FORBIDDEN)		
	return Response({'status':'Failed','message':'Invalid Token You Need to Login'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def PutTodoHandler(request,id):
	if 'LoggedIN' in request.session:
		try:
			todo_id_handler=request.get_full_path().split("/")[-1]
			todo_authorization=request.data['authorization']
			todo_name=request.data['name']

			connection_object=Admin.objects.filter(token=todo_authorization).values()
			if len(connection_object):
				CrudApi.objects.filter(todo_id=int(todo_id_handler)).update(name=todo_name)
				return Response({'status':'OK','message':'Updated'},status=status.HTTP_200_OK)
			return Response({'status':'Failed','message':'Only Admin User are Allowed'},status=status.HTTP_401_UNAUTHORIZED)
		except:
			return Response({'status':'Failed','message':'Invalid Parameters'},status=status.HTTP_403_FORBIDDEN)
	return Response({'status':'Failed','message':'Invalid Token You Need to Login'},status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def DeleteTodoHandler(request,id):
	if 'LoggedIN' in request.session:
		try:
			todo_authorization=request.META['HTTP_AUTHORIZATION']

			connection_object=Admin.objects.filter(token=todo_authorization).values()
			print(connection_object)
			if len(connection_object):
				print("hacked")
				todo_id_handler=request.get_full_path().split("/")[-1]
				print(todo_id_handler)
				CrudApi.objects.filter(todo_id=int(todo_id_handler)).delete()
				return Response({'status':'OK','message':'Todo Deleted'},status=status.HTTP_200_OK)
			return Response({'status':'Failed','message':'Only Admin User are Allowed'},status=status.HTTP_401_UNAUTHORIZED)
		except Exception as e:
			return Response({'status':'Failed','message':'Authorization Header is Missing or Invalid'},status=status.HTTP_403_FORBIDDEN)
	return Response({'status':'Failed','message':'Invalid Token You Need to Login'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def MultiTodoParser(request):
		try:
			get_authorization=request.META['HTTP_AUTHORIZATION']
			tests=None
			try:
				tests=Login.objects.filter(authorization=get_authorization).values()
				if not len(tests):
					if Admin.objects.filter(token=get_authorization):
						tests=Admin.objects.filter(token=get_authorization).values()[0]['admin_email']
						tests=CrudApi.objects.filter(register_email_id=tests).values()
						print(tests)
				else:
					tests=list(CrudApi.objects.all().values())
			except:
				pass
			if len(tests):
				for x in tests:
					try:
						x.pop('Token')
					except:
						x.pop('register_email_id')
				rsps=Response({'status':'OK','message':'Success','todo_list':list(tests)},status=status.HTTP_200_OK)
				return rsps
			return Response({'status':'Failed','message':'Authorization Token is Invalid'},status=status.HTTP_403_FORBIDDEN)
		except Exception as e:
			print(e)
			return Response({'status':'Failed','message':'Authorization Token is Missing'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def OTPSend(request):
	http_authorization=request.META['HTTP_AUTHORIZATION']
	tests=list(Login.objects.filter(authorization=get_authorization).values())
	mail_id=tests[0]['username_id']
	if len(tests):
		otp_value=random.randint(500000,100000000)
		MAIN_OTP['mail_id']=otp_value
		return SMTPSender(mail_id,otp_value) 
	return Response({'status':'Failed','message':'Invalid Token or Missing Authorization'},status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def VerifyOTP(request):
	auth=request.data['authorization']
	otp=request.data['OTP']
	if len(list(Login.objects.filter(authorization=auth).values())):
		if str(otp) in str(MAIN_OTP.values()):
			return Response({'status':'OK','message':'Verified'},status=status.HTTP_201_CREATED)
		return Response({'status':'Failed','message':'Invalid OTP Please Try Again'},status=status.HTTP_400_BAD_REQUEST)
	return Response({'status':'Failed','message':'Invalid Token or Missing Authorization'},status=status.HTTP_403_FORBIDDEN)

