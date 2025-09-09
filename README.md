The Online Legal Consultation System is a web-based platform designed to bridge the gap between clients and qualified legal professionals. It allows individuals, businesses, and organizations to seek legal advice and services without the need for in-person visits, making the process more convenient, secure, and time-efficient.

Through this system, users can:

Register/Login securely as clients or lawyers

Search and connect with lawyers based on expertise

Book appointments online for legal consultations

Chat in real-time with lawyers using integrated WebSockets

Manage legal queries and consultation history through a user-friendly dashboard

This system is especially useful for people in remote areas, busy professionals, or anyone who prefers digital-first legal solutions.

🎯 Objectives

Provide easy access to legal guidance anytime, anywhere

Ensure secure communication between clients and lawyers

Save time and resources by eliminating the need for physical visits

Create a transparent and efficient consultation process
Follow these steps to run the Online Legal Consultation System (Backend) on your local machine:

1. Clone the Repository
git clone https://github.com/your-username/online-legal-consultation-backend.git
cd online-legal-consultation-backend

2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env file in the root folder based on .env.example:

PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/legal_consultation
JWT_SECRET=your_jwt_secret
