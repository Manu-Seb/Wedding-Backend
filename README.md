# Wedding Backend API

A multi-tenant wedding planner backend built with Node.js, Express.js, and MongoDB. This API provides organization management and admin authentication for wedding planning services.

## 🚀 Features

- **Multi-tenant Architecture**: Support for multiple wedding organizations
- **Admin Authentication**: Secure JWT-based authentication system
- **Organization Management**: Full CRUD operations for wedding organizations
- **Password Security**: Bcrypt hashing for secure password storage
- **Comprehensive Logging**: Detailed logging for debugging and monitoring
- **CORS Enabled**: Cross-origin resource sharing configured
- **Input Validation**: Request validation and sanitization

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Bcryptjs
- **Validation**: Express Validator
- **Development**: Nodemon for auto-restart

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Wedding-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://weddinguser:weddingpassword@cluster0.dqki4fc.mongodb.net/?appName=Cluster0
   JWT_SECRET=supersecretjwttoken
   ```

4. **Start the server**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` by default.

## 🔗 API Endpoints

### Organization Management

#### Create Organization

```bash
curl -X POST http://localhost:5000/org/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-wedding-org",
    "adminEmail": "admin@example.com",
    "adminPassword": "securepassword123"
  }'
```

#### Get Organization

```bash
curl -X GET http://localhost:5000/org/get/my-wedding-org \
  -H "x-auth-token: YOUR_JWT_TOKEN_HERE"
```

#### Update Organization

```bash
curl -X PUT http://localhost:5000/org/update/my-wedding-org \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "updated-wedding-org"
  }'
```

#### Delete Organization

```bash
curl -X DELETE http://localhost:5000/org/delete/my-wedding-org \
  -H "x-auth-token: YOUR_JWT_TOKEN_HERE"
```

### Admin Authentication

#### Admin Login

```bash
curl -X POST http://localhost:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123"
  }'
```

#### Get Admin Details

```bash
curl -X GET http://localhost:5000/admin \
  -H "x-auth-token: YOUR_JWT_TOKEN_HERE"
```

## 🏗️ Project Structure

```
Wedding-backend/
├── app.js                 # Main application entry point
├── package.json           # Project dependencies and scripts
├── .env                   # Environment variables
├── test_apis.sh          # API testing script
├── controllers/           # Business logic controllers
│   ├── authController.js  # Authentication controller
│   └── orgController.js   # Organization controller
├── models/               # Database models
│   ├── Admin.js          # Admin user model
│   └── Organization.js   # Organization model
├── routes/               # API route definitions
│   ├── authRoutes.js     # Authentication routes
│   └── orgRoutes.js      # Organization routes
├── middleware/           # Custom middleware
│   └── auth.js           # JWT authentication middleware
└── utils/               # Utility functions
    └── db.js             # Database connection utility
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Send credentials to `/admin/login` to receive a JWT token
2. **Protected Routes**: Include the token in the `x-auth-token` header
3. **Token Expiration**: Tokens expire after 1 hour
4. **Authorization**: Each admin can only manage their own organization

### Example Authenticated Request

```bash
curl -X GET http://localhost:5000/org/get/my-organization \
  -H "x-auth-token: your-jwt-token-here"
```

## 🧪 Testing

A comprehensive test script is provided (`test_apis.sh`) that tests all API endpoints:

```bash
# Make the script executable
chmod +x test_apis.sh

# Run the tests
./test_apis.sh
```

The script tests:

1. Organization creation
2. Admin login
3. Organization retrieval
4. Organization update
5. Organization deletion

## 🔍 Logging

The application includes comprehensive logging for debugging and monitoring:

- **Request Logging**: All incoming requests are logged with timestamps
- **Response Logging**: All responses are logged with status codes
- **Error Logging**: Detailed error messages and stack traces
- **Authentication Logging**: Authentication attempts and token validation

Logs are formatted with timestamps and component identifiers (e.g., `[ORG]`, `[AUTH]`, `[APP]`).

## 🔧 Environment Variables

| Variable     | Description                      | Default  |
| ------------ | -------------------------------- | -------- |
| `PORT`       | Server port number               | 5000     |
| `MONGO_URI`  | MongoDB connection string        | Required |
| `JWT_SECRET` | Secret key for JWT token signing | Required |

## 🚨 Error Handling

The API includes proper error handling for:

- **Validation Errors**: Input validation and sanitization
- **Authentication Errors**: Invalid or missing tokens
- **Authorization Errors**: Insufficient permissions
- **Database Errors**: Connection and query errors
- **Server Errors**: General application errors

## 📊 Database Schema

### Organization Model

```javascript
{
  name: String (required, unique),
  date: Date (default: current date)
}
```

### Admin Model

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  organization: ObjectId (reference to Organization),
  role: String (default: "admin")
}
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Request data validation and sanitization
- **CORS Configuration**: Properly configured cross-origin policies
- **Authorization Checks**: Users can only access their own organizations

## 📈 Monitoring

The application provides detailed logging for monitoring:

- All API requests and responses are logged
- Database operations include timing information
- Authentication attempts are tracked
- Error conditions are logged with full stack traces

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Note**: This is a backend API designed for wedding planning applications. Ensure proper security measures are in place before deploying to production.
