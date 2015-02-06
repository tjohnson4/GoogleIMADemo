###Deploying To Heroku
- Ensure NODE_ENV is set to production
- push updates to heroku 
    - $git push heroku <branch name>
- ensure process is running 
    - $heroku ps:scale web=1
- open in default browser 
    - $heroku open
    
###Watch Logs
- $heroku logs --tail  
  
  
    