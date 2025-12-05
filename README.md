# MyWeekly - Week Reports  📊
A beautiful, full-stack application for creating, managing, and exporting weekly work reports.

## ✨ Features

### 🎯 **Core Features**
- **User Authentication** - Secure login/register with JWT
- **Weekly Report Creation** - Structured templates for consistent reporting
- **Dark/Light Theme** - Eye-friendly interface with theme toggle
- **Export Options** - Download reports as PDF or Word documents
- **Dashboard Analytics** - Visualize your reporting history and progress
- **Mobile Responsive** - Works perfectly on all devices

### 📝 **Report Sections**
1. **Tasks Completed** - Track accomplishments with time spent and priority
2. **Work in Progress** - Monitor ongoing tasks
3. **Challenges Faced** - Document problems and solutions
4. **Improvements & Learnings** - Record personal growth
5. **Next Week Plan** - Set goals and priorities
6. **Overall Summary** - Quick weekly overview

### 🚀 **Tech Stack**
- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS 3, Custom CSS with dark mode
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcryptjs
- **PDF Export**: jsPDF, jspdf-autotable
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/bayanlulu/myweekly.git
cd myweekly
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env.local` file in root directory:
```env
MONGODB_URI=mongodb://localhost:27017/myweekly
JWT_SECRET=your_super_secret_jwt_key_here
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Visit `http://localhost:3000`


## 🎨 UI/UX Features

### **Design System**
- **Color Palette**: Purple/Pink gradient theme
- **Typography**: Clean, readable font stack
- **Components**: Custom card, button, form styles
- **Animations**: Smooth transitions and hover effects
- **Glassmorphism**: Modern glass effect components

### **Responsive Design**
- **Mobile First**: Optimized for all screen sizes
- **Breakpoints**: Tailwind responsive utilities
- **Touch Friendly**: Large touch targets for mobile

## 🔐 Authentication

### **Security Features**
- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Secure session management

### **User Flow**
1. Register with name, email, password
2. Login with credentials
3. Access protected dashboard
4. Automatic session management

## 📊 Database Schema

### **User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  department: String,
  createdAt: Date
}
```

### **Report Model**
```javascript
{
  userId: ObjectId,
  weekStartDate: Date,
  weekEndDate: Date,
  tasksCompleted: [{
    title: String,
    timeSpent: Number,
    priority: String
  }],
  workInProgress: [...],
  challenges: [{
    description: String,
    solution: String
  }],
  improvements: String,
  nextWeekPlan: String,
  summary: String,
  status: String ('draft' | 'submitted'),
  createdAt: Date,
  submittedAt: Date
}
```

## 📄 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### **Reports Endpoints**
- `GET /api/reports` - Get all user reports
- `POST /api/reports` - Create new report
- `GET /api/reports/[id]` - Get single report
- `PUT /api/reports/[id]` - Update report
- `DELETE /api/reports/[id]` - Delete report

## 🚀 Deployment

### **Vercel **
```bash
npm install -g vercel
vercel
```

### **Environment Variables for Production**
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret_key
NEXTAUTH_URL=https://yourdomain.com
```

### **Build for Production**
```bash
npm run build
npm start
```

## 📱 Mobile App (Future)
- React Native version planned
- Offline report creation
- Push notifications for deadlines
- Camera integration for document upload

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design
- Write comprehensive tests
- Document new features

## 🐛 Troubleshooting

### **Common Issues**

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Ensure network access to MongoDB

2. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `npm install`
   - Check TypeScript errors

3. **Dark Mode Not Working**
   - Ensure `darkMode: 'class'` in tailwind.config.js
   - Check ThemeProvider setup
   - Verify localStorage permissions

### **Debug Mode**
```bash
DEBUG=myweekly:* npm run dev
```

## 📈 Future Roadmap

### **Planned Features**
- [ ] AI-powered report suggestions
- [ ] Team collaboration features
- [ ] Report templates library
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Chrome extension for quick notes
- [ ] Slack/Teams integration

### **Performance Optimizations**
- [ ] Image optimization
- [ ] Code splitting
- [ ] Server-side rendering improvements
- [ ] Database indexing
- [ ] CDN for static assets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [MongoDB](https://www.mongodb.com/) - Database
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [jsPDF](https://parall.ax/products/jspdf) - PDF generation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/bayanlulu/myweekly/issues)
- **Email**: bayanazzam4@gmail.com


---

<div align="center">
  
**Made with ❤️ for people like me from everywhere**

*"Track your progress, celebrate your wins, plan your success"*

- [GitHub stars](https://github.com/bayanlulu/myweekly/stargazers)
- [GitHub forks](https://github.com/bayanlulu/myweekly/network/members)

</div>