Angular Final Exam, Fall 2024

3 tasks, each task 33% of 20 points. ~6.6

Important: There a lot of stuff going on in this project, but my tasks will only require you to modify things you actually know. 

1. HttpClient requests for Articles are not working to due to issue with server. Replace article requests with observables, return mock data so that project will show an actual data.

2. Modify Auth component so that I can login using mock data. Remove API calls and edit "login" method of User.service so that it will setUser regardless.

32. I removed all guards related to "/profile/:username" route. Edit the code so that accessing URL "*yourprojecturl*/profile/smth" will show mock data.

  Explanation: 
  3.1 Create new TS file with 1 variable: mockUser, make it Profile type.
  3.2 Import this variable into Profile component, check if URL is "profile/smth"
  3.3 If true, show your mock data, if false, show "Wrong user" text.

