# Architecture Document

## Overview
The Retail Sales Management System is a full-stack web application designed to manage and visualize sales data. It provides search, filtering, sorting, and pagination capabilities over a large dataset.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite (File-based relational database)

## Folder Structure
- `backend/`: Contains the Node.js server, API routes, controllers, and database logic.
- `frontend/`: Contains the React application, components, and API services.
- `docs/`: Documentation files.

## Backend Architecture
- **MVC Pattern**: The backend follows the Model-View-Controller pattern (though "View" is the API response).
- **Controllers**: Handle the business logic and request processing.
- **Routes**: Define the API endpoints.
- **Utils**: Helper functions and database connection.
- **Database**: SQLite is used for data persistence. A seeding script is provided to import data from the provided CSV dataset.

## Frontend Architecture
- **Component-Based**: The UI is built using reusable React components (Header, Filters, SalesTable, Pagination).
- **State Management**: React's `useState` and `useEffect` hooks are used to manage application state (data, filters, pagination).
- **Styling**: Tailwind CSS is used for utility-first styling.
- **API Integration**: Axios is used to communicate with the backend API.

## Data Flow
1.  User interacts with the UI (Search, Filter, Sort, Page Change).
2.  Frontend updates the state (`filters`).
3.  `useEffect` triggers an API call with the new query parameters.
4.  Backend receives the request, constructs a dynamic SQL query.
5.  Database executes the query and returns the results.
6.  Backend sends the data back to the Frontend.
7.  Frontend updates the UI with the new data.

## Module Responsibilities
- **SalesController**: Handles the logic for fetching sales data with various filters.
- **SalesTable**: Displays the data in a tabular format.
- **Filters**: Provides the UI for filtering data.
