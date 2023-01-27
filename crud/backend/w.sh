heroku destroy serene-cove-82999
heroku create serene-cove-82999
rm -r .git
git init
git add .
git config user.name 'f'
git config user.email 'wfwfwfw@gmail.com'
git commit -m "sfwt"
heroku git:remote serene-cove-82999
heroku config:set DISABLE_COLLECTSTATIC=1
git push heroku master
heroku logs --tail
