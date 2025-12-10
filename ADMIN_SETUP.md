# Admin Setup Guide

## Making a User an Admin

There are three ways to make a user an admin:

### Method 1: Using the Script (Recommended)

1. Make sure you have a registered user account
2. Run the admin script:
   ```bash
   node scripts/makeAdmin.js your-email@example.com
   ```
3. Restart your development server
4. Sign in with that account
5. You'll now see the "⚙️ Admin" link in the header

### Method 2: MongoDB Compass/Atlas

1. Open MongoDB Compass or MongoDB Atlas
2. Connect to your database
3. Navigate to the `users` collection
4. Find your user by email
5. Edit the document and change `"role": "user"` to `"role": "admin"`
6. Save the changes
7. Sign out and sign back in

### Method 3: MongoDB Shell

```javascript
// Connect to your database
use your-database-name

// Update user role
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Admin Dashboard Features

Once you have admin access, you can:

### 📊 Dashboard Tab

- View total tours, bookings, users, and revenue
- See recent bookings with customer details
- Monitor overall statistics

### 🗺️ Tours Tab

- Create new tours
- Edit existing tours
- Delete tours
- View all tour details

### 📅 Bookings Tab

- View all bookings
- Filter by status (pending, confirmed, cancelled)
- Confirm or cancel bookings
- See customer and payment information

### 👥 Users Tab

- View all registered users
- See user statistics (bookings count, total spent)
- Toggle user roles between "user" and "admin"
- Monitor user activity

## Security Notes

- Only users with the "admin" role can access `/admin` routes
- All admin API routes check for admin authorization
- Non-admin users will be redirected to the home page
- The admin link only appears in the header for admin users
