# SwiftPick

SwiftPick is a modern delivery platform that connects travelers with people who need to send packages, creating a win-win situation for both parties.

## Features

- 🚀 User Authentication (Login/Signup)
- 📦 Package Delivery Requests
- 🔍 Find Available Deliveries
- 📱 Real-time Delivery Tracking
- 💰 Wallet Management
- 📊 Analytics Dashboard
- 🌓 Dark Mode Support
- 📱 Responsive Design

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React Context
- Chart.js
- Express.js
- MongoDB

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sreevarshan-xenoz/SwiftPick.git
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd swiftpick
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend (.env)
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

4. Run the development servers:
```bash
# Run both frontend and backend
npm run dev:all

# Or run them separately
npm run dev        # Frontend
cd backend && npm run dev  # Backend
```

## Deployment

### Backend Deployment (Express.js)

1. Set up production environment variables:
```bash
# backend/.env.production
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

2. Build and deploy:
```bash
cd backend
npm run build
npm run deploy
```

### Frontend Deployment (Next.js)

1. Update production environment variables:
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

2. Build and export:
```bash
npm run build
```

3. Deploy the `out` directory to your hosting provider.

### Deployment Options

1. **Vercel (Recommended for Frontend)**
   - Connect your GitHub repository
   - Configure environment variables
   - Vercel will automatically build and deploy

2. **Railway/Heroku (Backend)**
   - Connect your GitHub repository
   - Configure environment variables
   - Push to main branch to trigger deployment

3. **MongoDB Atlas**
   - Set up a production MongoDB cluster
   - Configure network access and database user
   - Use the connection string in your backend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 