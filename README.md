# Retail Sales Management System

## Overview
A full-stack application for managing retail sales data. It supports advanced search, multi-select filtering, sorting, and pagination. Built with React and Node.js.

## Tech Stack
- Frontend: React, Tailwind CSS, Vite
- Backend: Node.js, Express, SQLite

## Search Implementation Summary
Full-text search is implemented on Customer Name and Phone Number using SQL `LIKE` operator. It works in conjunction with all active filters.

## Filter Implementation Summary
Multi-select and range-based filters are supported for Region, Gender, Age, Category, Payment Method, and Date Range. Filters are applied dynamically in the SQL query.

## Sorting Implementation Summary
Sorting is supported for Date, Quantity, and Customer Name. It preserves the current search and filter state.

## Pagination Implementation Summary
Server-side pagination is implemented with a default page size of 10. It calculates total pages based on the filtered result set.

## Setup Instructions
1.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    npm run seed
    npm run dev
    ```

2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  Open `http://localhost:5173` in your browser.
