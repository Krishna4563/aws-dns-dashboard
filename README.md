# THE ROUTE 53 ACCESS IS FREEZED AS OF NOW, DUE TO AWS RESOURCE BILLING.
 
# aws-dns-dashboard

This is a DNS manager dashboard created using the MERN stack to manage the DNS records of the hosted domain via AWS Route53. In this app, the domain is hosted in a private hosted zone from which the records are accessed. Implemented CRUD operations for users to view, create, update or delete a record from the hosted zone.

The app is styled using Tailwiind CSS and is completely mobile responsive.

Tech stack used for frontend - React(using Vite) and Tailwind CSS as the styling framework. Tech stack used for Backend - Node.js and Express.js for creating API endpoints.

# Install Dependencies -

Frontend - (cd client in terminal)
```bash
npm install axios
```

Backend - (cd server in terminal)
```bash
npm install aws-sdk body-parser cors dotenv express nodemon
```

To start the frontend -
```bash
cd client
npm run dev
```


To start the server -
```bash
cd server
npm start
```
