# Wedding Backend API

A multi-tenant wedding planner backend built with Node.js, Express.js, and MongoDB. This API provides organization management and admin authentication for wedding planning services.

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
   MONGO_URI=<Mongodb url>
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

| Variable     | Description                      | Default  |
| ------------ | -------------------------------- | -------- |
| `PORT`       | Server port number               | 5000     |
| `MONGO_URI`  | MongoDB connection string        | Required |
| `JWT_SECRET` | Secret key for JWT token signing | Required |

## Database Schema

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
