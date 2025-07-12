# ReWear - Community Clothing Exchange

A sustainable fashion platform where users can exchange unused clothing through swaps or point-based redemption.

## Features

### 🎯 Core Functionality
- **User Authentication**: Secure login/registration with JWT tokens
- **Item Upload**: Upload clothing items with multiple images
- **Browse & Search**: Filter items by category, size, condition, and search terms
- **Item Details**: View detailed item information with image galleries
- **Swap System**: Request swaps for clothing items
- **Points System**: Redeem items using earned points
- **Admin Panel**: Approve/reject uploaded items
- **User Dashboard**: Manage profile, view items, and track points

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Real-time Feedback**: Toast notifications for user actions
- **Loading States**: Smooth loading indicators throughout
- **Image Handling**: Multiple image upload with previews

### 🔧 Technical Stack
- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT tokens with automatic expiration
- **File Upload**: Multer middleware for image handling
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ODOO_2025
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client/ReWear\ -\ Community\ Clothing\ Exchange
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rewear
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

   Create a `.env` file in the client directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

7. **Start the frontend development server**
   ```bash
   cd client/ReWear\ -\ Community\ Clothing\ Exchange
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Usage Guide

### For Users

1. **Registration/Login**
   - Create an account with email, password, city, and country
   - Login with your credentials

2. **Upload Items**
   - Click "Upload" in the navigation
   - Fill in item details (title, description, category, etc.)
   - Upload up to 5 images
   - Choose between "Swap" or "Points" type
   - Submit for admin approval

3. **Browse Items**
   - Use filters to find specific items
   - Search by title or description
   - Click on items to view details

4. **Swap/Redemption**
   - For swap items: Click "Request Swap"
   - For points items: Click "Redeem with Points" (if you have enough points)

5. **Dashboard**
   - View your profile information
   - See your uploaded items
   - Track your points balance
   - View item approval status

### For Admins

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to `/admin`

2. **Review Items**
   - View pending items awaiting approval
   - See item details and owner information
   - Approve or reject items

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user data

### Items
- `GET /api/items` - Get all approved items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item (authenticated)
- `PUT /api/items/:id` - Update item (authenticated)
- `DELETE /api/items/:id` - Delete item (authenticated)
- `GET /api/items/user/items` - Get user's items (authenticated)
- `POST /api/items/:id/swap` - Request swap (authenticated)
- `POST /api/items/:id/redeem` - Redeem with points (authenticated)

### Admin
- `GET /api/items/pending` - Get pending items (admin)
- `PUT /api/items/:id/approve` - Approve item (admin)
- `PUT /api/items/:id/reject` - Reject item (admin)

## Project Structure

```
ODOO_2025/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── routes/
│   ├── app.js
│   └── package.json
└── client/
    └── ReWear – Community Clothing Exchange/
        ├── src/
        │   ├── components/
        │   ├── context/
        │   ├── pages/
        │   └── App.jsx
        └── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
