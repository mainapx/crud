import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import  MIMEText
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework import status
import time
import json

max_otp_valid_time=None

CONST_SUBJECT="Verify emailaddress"
class SMTPSender(APIView):
	
	def __init__(self,useremailid,otpsend):
		self.useremailid=useremailid
		self.otpsend=otpsend

	def Sender(self):
		try:
			message=MIMEMultipart()
			message['From']='--email--'
			message['To']=self.useremailid
			message['Subject']=CONST_SUBJECT
			if type(self.otpsend) is int:
				message.attach(MIMEText('Verification code %s' % (int(self.otpsend)),'plain'))
			else:
				message.attach(MIMEText('Invitation link  %s' % (str(self.otpsend)),'plain'))
			mailhandler=smtplib.SMTP('smtp.gmail.com',587)
			mailhandler.starttls()
			mailhandler.login('--emailid--','--password--')
			finalmsg=message.as_string()
			mailhandler.sendmail('--emailid--',self.useremailid,finalmsg)
		except Exception as e:
			c=Response(json.dumps({'status':'Failed','message':'Verification code send failed please try again letter'}),status=status.HTTP_400_BAD_REQUEST)
			c.headers['Content-Type']='application/json'
		d=Response(json.dumps({'status':'OK','message':'success'}),status=status.HTTP_200_OK)
		d.headers['Content-Type']='application/json'
		return d
		
if __name__ == "__main__":
	pass