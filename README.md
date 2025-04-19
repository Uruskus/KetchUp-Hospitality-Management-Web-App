# KetchUp - Hospitality Management Web App

![KetchUp Logo](https://via.placeholder.com/150x150.png?text=KetchUp)

KetchUp is an all-in-one web application for small to medium-sized hospitality businesses, combining employee management, shift planning, inventory management, and other functions in an intuitive interface.

## 🌟 Features

### Employee Management
- Employee profiles with contact details and positions
- Avatar generation for employees
- Clear list view of all employees
- Easy adding, editing, and deleting of employees

### Shift Planning
- macOS-like calendar with drag-and-drop functionality
- Weekly and monthly views
- Context menu for quick actions
- Employee assignment to shifts
- Conflict checking in shift planning

### Inventory Management
- Categorized inventory list (beverages, food, supplies)
- Stock tracking with visual indicators for low stock levels
- Simple inbound and outbound transactions
- Total inventory value calculation
- Reorder notifications

### Dashboard
- Real-time overview of current shifts and present employees
- Inventory status and warnings for low stock levels
- Daily sales and sales statistics
- Customizable widgets for key metrics

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **Lucide Icons**: Modern icon library

### Backend
- **tRPC**: Type-safe API integration
- **Supabase**: Database and authentication
- **PostgreSQL**: Relational database

### Authentication
- **Clerk**: User authentication and management

### Deployment
- **Vercel**: Hosting and deployment
- **GitHub Actions**: CI/CD pipeline

## 📋 Development Progress

### Completed Features

#### Employee Management
- ✅ Employee list with search function
- ✅ Form for adding/editing employees
- ✅ Avatar generation
- ✅ API integration with Supabase

#### Shift Planning
- ✅ Calendar view with drag-and-drop
- ✅ Shift form with employee selection
- ✅ Context menu for shift actions
- ✅ API integration for shift management

#### Dashboard
- ✅ Overview of active shifts
- ✅ Display of present employees
- ✅ Inventory status widget
- ✅ Daily sales widget

#### Inventory Management
- ✅ Basic inventory list
- ✅ Form for adding/editing items
- ✅ Transaction form for inbound/outbound movements
- ✅ Stock calculations and warnings
- ✅ Categorization of inventory items (in development)

### In Development

#### Inventory Management
- 🔄 Advanced categorization with icons
- 🔄 Graphical representation of stock levels over time
- 🔄 Improved user interface with tile view

#### Reporting
- 🔄 Weekly and monthly reports
- 🔄 Export of reports as PDF/CSV

### Planned Features

#### Tip Management
- 📝 Recording and distribution of tips
- 📝 Calculation models for fair distribution

#### Time Tracking
- 📝 Time clock function for employees
- 📝 Automatic working time calculation

#### Payroll
- 📝 Basic payroll calculations
- 📝 Export for accounting systems

## 🚀 Installation and Setup

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Uruskus/KetchUp-Hospitality-Management-Web-App.git
cd ketchup
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Copy the `.env.example` file to `.env.local` and fill in the required values:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Schema

The project uses the following main tables:

- **employees**: Employee data
- **shifts**: Shift information
- **inventory_items**: Inventory items
- **inventory_transactions**: Inbound and outbound movements of inventory items
- **sales**: Sales data

The complete SQL migration scripts can be found in the `supabase/migrations/` folder.

## 🤝 Contributing

Contributions are welcome! If you would like to contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

Niklas Geispitzheim - niklas.geispitzheim3@gmail.com

Project Link: [https://github.com/Uruskus/KetchUp-Hospitality-Management-Web-App](https://github.com/Uruskus/KetchUp-Hospitality-Management-Web-App)
