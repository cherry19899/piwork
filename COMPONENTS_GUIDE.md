# React Components Guide

## Button Component (`/src/components/Button.jsx`)

### Props
- `variant`: 'primary' | 'secondary' | 'danger' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `loading`: boolean (default: false)
- `disabled`: boolean (default: false)
- `onClick`: function
- `children`: ReactNode
- `className`: string (additional CSS classes)

### Features
- **Ripple Effect**: Material Design ripple animation on click
- **Loading State**: Spinner replaces children when loading
- **Accessibility**: Focus-visible outlines, proper ARIA attributes
- **Responsive**: Three size options with appropriate padding and font sizes

### Usage
```jsx
import Button from './components/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="danger" loading={isLoading} disabled={isLoading}>
  Delete
</Button>
```

## Feed Component (`/src/screens/Feed.jsx`)

### Features
- **Real-time Subscription**: Subscribes to Firestore 'tasks' collection
- **Status Filtering**: Only displays tasks with status === 'open'
- **Virtual List**: Uses react-window for performance with large lists
- **Pull-to-Refresh**: Implemented via react-pull-to-refresh library
- **Skeleton Loading**: Shows loading placeholders while fetching data
- **Empty State**: Displays helpful message when no tasks available

### State
- `tasks`: array of task objects from Firestore
- `loading`: boolean indicating data fetch in progress
- `displayTasks`: filtered array of open tasks

### Firestore Integration
Subscribes to:
```
db.collection('tasks').where('status', '==', 'open')
```

### Usage
```jsx
import Feed from './screens/Feed';

<Feed />
```

## TaskCard Component (`/src/components/TaskCard.jsx`)

### Props
- `task`: object with properties:
  - `id`: string
  - `title`: string
  - `description`: string
  - `budget`: number (in Pi)
  - `deadline`: Date
  - `creatorName`: string
  - `creatorAvatar`: string (emoji or image URL)

### Features
- **Date Formatting**: Shows 'Today', 'Tomorrow', or formatted date
- **Hover Effects**: Subtle lift effect and border color change
- **Truncation**: Title limited to one line, description to two lines
- **Link Navigation**: Navigates to task detail page on click

### Styling
- Dark theme with violet accent for budget
- 12px creator subtitle
- 2px border with hover effect

## CreateTask Component (`/src/screens/CreateTask.jsx`)

### Form Fields
1. **Title** (string, min 5 chars)
2. **Category** (select dropdown)
3. **Description** (textarea, min 50 chars)
4. **Budget** (number, > 0 Pi)
5. **Deadline** (date, future only)

### Validation Rules
- Title: minimum 5 characters
- Description: minimum 50 characters
- Budget: must be a number greater than 0
- Deadline: cannot be in the past

### Payment Flow
1. Calculates: budget + 5% commission
2. Calls `createPayment()` for total amount
3. On success: Creates task document in Firestore with payment reference
4. On error: Displays error message, doesn't create task

### Features
- **Real-time Character Count**: Shows characters used/limit
- **Commission Display**: Shows calculated 5% commission
- **Field-level Errors**: Red border and error text below invalid fields
- **Auto-error Clear**: Errors clear when user starts typing
- **Success State**: Redirects to task detail after 1.5s

### Firestore Task Schema
```javascript
{
  title: string,
  description: string,
  category: string,
  budget: number,
  commission: number (calculated),
  deadline: Timestamp,
  status: 'open' | 'in-progress' | 'completed' | 'cancelled',
  creatorId: string (from auth),
  creatorName: string,
  creatorAvatar: string,
  paymentId: string (from Pi payments),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Styling System

All components use CSS Modules (`.module.css`) for scoped styling:

### Color Palette
- Primary: #8B5CF6 (Violet)
- Danger: #EF4444 (Red)
- Success: #22C55E (Green)
- Background: #000000 (Black)
- Surface: #1A1A1A (Dark Gray)
- Border: #2A2A2A (Darker Gray)
- Text Primary: #FFFFFF (White)
- Text Secondary: #737373 (Light Gray)

### Spacing
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px

### Border Radius
- 8px (small), 12px (medium), 16px (large)

### Animations
- Ripple effect: 600ms ease-out
- Hover transitions: 200ms ease
- Pulse (loading): 1.5s ease-in-out infinite

## Firestore Collections

### tasks
```
{
  title: string,
  description: string,
  category: string,
  budget: number,
  deadline: timestamp,
  status: 'open',
  creatorId: string,
  creatorName: string,
  creatorAvatar: string,
  paymentId: string,
  createdAt: timestamp
}
```

### users
```
{
  displayName: string,
  email: string,
  photoURL: string,
  piUsername: string,
  walletAddress: string,
  rating: number,
  tasksCompleted: number,
  earnings: number,
  lastLogin: timestamp,
  createdAt: timestamp
}
```

## Dependencies Required

```json
{
  "react-window": "^1.8.10",
  "react-pull-to-refresh": "^1.0.0",
  "react-router-dom": "^6.x.x",
  "firebase": "^10.x.x"
}
```

## Best Practices

1. **Component Organization**: Keep components in appropriate folders (components, screens)
2. **CSS Modules**: Always use CSS modules for scoped styling
3. **Error Handling**: Display user-friendly error messages
4. **Loading States**: Show skeleton or spinner during data fetch
5. **Accessibility**: Include proper labels, ARIA attributes, and keyboard support
6. **Validation**: Validate on change and on submit
