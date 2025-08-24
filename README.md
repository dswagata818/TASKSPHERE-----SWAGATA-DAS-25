# TASKSPHERE-----SWAGATA-DAS-25
A Personal Task Management  Web App
Objective:
Build a full-stack web application where users can register, log in, and manage their tasks(Create, Read, Update, Delete). The app will store data in MongoDB, use Node.js andExpress.js for the backend, and HTML/CSS/JS for the frontend.

preview:

#Screenshots:

###Dashboard Page For Existing User
![Dashboard](image/dashboard.png)

### Add Task Form
![Add Task](images/addtask.png)
Tech Stack:
Backend: Node.js, Express.js
Database: MongoDB (with Mongoose)
Frontend: HTML, CSS,JavaScript
Optional (Bonus): JWT or Session-based authentication

Core Features (Requirements):

1. User Authentication
● Registration with name, email, password
● Login system with sessions or JWT
● Hash passwords using bcrypt
● Restrict routes: only logged-in users can manage tasks

3. Task Management
Create a task with:
○ title (required)
○ description
○ dueDate
○ priority (Low, Medium, High)
○ status (Pending, Completed)
● View all tasks 
● Edit a task
● Delete a task
● Mark task as completed
● Show count of pending vs. completed tasks

4. Frontend Pages
● Registration Page
● Login Page
● Dashboard Page (after login) showing task list
● Task Form (add/edit)
● Logout option

✅ Sample Scenario
1. User registers on the platform.
2. She logs in and is redirected to her dashboard.
3. She creates 3 tasks:
○ “Submit assignment” – High priority, due in 1 day.
○ “Buy groceries” – Low priority.
4. She edits the “Buy groceries” task and changes its status to completed.
5. She logs out, and redirect to login page.

Licence: 
This project created for educational and learning purpose

