<<<<<<< HEAD
# AmicaConnect

1. Install dependencies:
   `npm install`
3. Run the app:
   `npm run dev`
=======
<h1>Backend Authentication API (JWT)</h1>

This repository contains a fully functional backend authentication system built with Django & Django REST Framework, secured using JWT (JSON Web Tokens).
The API provides user registration, login, logout, profile management, password change, and user listing.

<h2>🚀 Features</h2>

User Registration

User Login with JWT Authentication

Secure Logout

User Profile Fetch & Update

Change Password

List All Users (Admin/Authorized Access)

JWT-based protected routes

<h2>🛠 Tech Stack</h2>

Python

Django

Django REST Framework (DRF)

JWT Authentication

SQLite (configurable)



<h1>⚙️ Project Setup (Windows)</h1>
1️⃣ Clone Repository<br/>
git clone [https://github.com/Amica-Connect-Technologies/Amecia-Web-Portal.git] <br/>
cd Amecia-Web-Portal

2️⃣ Create Virtual Environment
python -m venv venv <br/><br/>

3️⃣ Activate Virtual Environment
Command Prompt (CMD)<br/>
venv\Scripts\activate
<br/>
Then activate again.

4️⃣ Install Dependencies
pip install -r requirements.txt


If requirements.txt is not available:

pip install django djangorestframework djangorestframework-simplejwt

5️⃣ Apply Database Migrations <br/>
python manage.py makemigrations<br/><br/>
python manage.py migrate<br/>

6️⃣ Create Superuser (Optional)<br/>
python manage.py createsuperuser

7️⃣ Run Django Server<br/><br/>
python manage.py runserver

🌐 Application URLs

Backend Server:

http://127.0.0.1:8000/

Admin Panel:

http://127.0.0.1:8000/admin/

>>>>>>> 042172cbd12c43bbe10193810805ed9486f48794
