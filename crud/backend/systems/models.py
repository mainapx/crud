from django.db import models


class Register(models.Model):
	firstname=models.CharField(max_length=30)
	lastname=models.CharField(max_length=30)
	username=models.CharField(max_length=30,primary_key=True)
	password=models.CharField(max_length=30)
	authorization=models.CharField(max_length=255)

class Login(models.Model):
	username=models.ForeignKey(Register,on_delete=models.CASCADE)
	password=models.CharField(max_length=50)
	authorization=models.CharField(max_length=255)
	verify=models.BooleanField(False)

class Admin(models.Model):
	token=models.CharField(max_length=255)
	admin_email=models.CharField(max_length=50,primary_key=True)
	admin_password=models.CharField(max_length=120)
	role=models.BooleanField(True)
	
class CrudApi(models.Model):
	register_email=models.ForeignKey(Admin,on_delete=models.CASCADE)
	name=models.CharField(max_length=255)
	todo_id=models.CharField(max_length=50)
	role=models.CharField(max_length=8)

