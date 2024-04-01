# CRUD_API_ROLE_BASED

## Description

This project is a Node.js application built with Express.js that provides APIs for user authentication, user management, course management, and course enrollment. It includes routes for authentication, user management, course management, and course enrollment. Additionally, it implements access control measures to restrict certain routes to specific roles.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Saurabhdixit93/CRUD_API_ROLE_BASED.git
```

2. Navigate to the project directory:

```bash
cd CRUD_API_ROLE_BASED
```

3. Install dependencies:

```bash
npm install
```

## Usage

1. Start the server:

```bash
npm start
```

2. Once the server is running, you can access the APIs using a tool like Postman or by integrating them into your frontend application.

## Routes

- `/auth`: Routes for user authentication.
- `/user`: Routes for user management. Requires authentication.
- `/course`: Routes for course management. Requires authentication and SUPER-ADMIN role.
- `/course-enrollment`: Routes for course enrollment. Requires authentication.

## Access Control

Access to certain routes is restricted based on the user's role:

- `/user` and `/course-enrollment` routes require authentication.
- `/course` routes require authentication and a SUPER-ADMIN role.

## Dependencies

- express: Web application framework for Node.js.
- bcryptjs: Library for hashing passwords.
- jsonwebtoken: Library for generating JSON web tokens.
- mongoose: MongoDB object modeling tool.
- dotenv: Library for loading environment variables.
- etc.

## Contributors

- [Saurabh Dixit](https://github.com/saurabhdixit93)

## License

This project is licensed under the [MIT License](LICENSE).
