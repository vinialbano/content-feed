# Content Feed Application

## Overview

This full-stack application retrieves, processes, and displays data as a content feed, using Next.js for the frontend and Redis for backend data management. It showcases API integration, data processing, dynamic content display with infinite scrolling, and efficient data fetching using Next.js Server Actions.

## Technologies

- Next.js: Utilized for the frontend and Server Actions, Next.js handles server-side operations seamlessly, integrating well with React-based libraries for dynamic content rendering.
- Redis: Employs an in-memory data structure store to enable fast caching and efficient data retrieval, optimizing response times and system performance.
- Axios: Manages HTTP requests efficiently, simplifying the process of integrating with external APIs by offering a promise-based API.
- Docker: Provides a consistent and isolated environment for development by containerizing the application and its dependencies.
- Jest and Testing Library: Used for running tests, these tools help verify the functionality of both React components and server-side logic, ensuring that the application behaves as expected under various conditions.

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Setup and Run

1.  Clone the repository:

    ```bash
    git clone https://github.com/vinialbano/content-feed.git
    ```

2.  Create a .env file in the root directory with the following content:

    ```plaintext
    CONTENT_API_URL=https://stoplight.io/mocks/engine/fullstack-spec/52502230/content
    NUMBER_OF_POSTS_IN_BATCH=10
    ```

3.  Run the application using Docker:

    ```bash
    docker-compose up
    ```

The application will be available at `http://localhost:3000`.

## Features

- API Integration: Fetches data from a configurable external API.
- Data Processing: Normalizes and sorts the data by priority.
- Responsive UI: Implements infinite scrolling to dynamically load more posts as the user scrolls.
- Performance: Leverages Redis for efficient data caching and batch loading to enhance user experience.

## Challenges and Thought Process

### Data Management: Caching and Scalability

Objective: Enhance system performance and scalability through strategic data caching and batch processing.

Challenges and Solutions:

- Efficient Data Handling: Recognized inefficiencies in loading all data directly from the external API. Implemented batch processing to fetch posts only as needed, improving system responsiveness and reducing unnecessary network load.

- Redis for Caching: Chose Redis to cache data fetched in batches. This setup minimizes latency, supports high-performance operations, and maintains a stateless architecture, ensuring system reliability even upon reloads.

### Infinite Scrolling

Objective: Enhance the user experience with seamless content browsing.

Challenges and Solutions:

- Continuous Data Delivery: Implemented infinite scrolling using Next.js Server Actions to dynamically load additional posts, minimizing initial load times and maintaining a fluid UI.

- Performance Under Load: Optimized UI responsiveness by preemptively fetching data using Server Actions to ensure the Redis cache is replenished before depletion, providing uninterrupted content availability.

### Experimentation and Alternative Approaches

- Priority Queue with Bull: Explored using Bull for automated data sorting and prioritization.

  - Limitation: Bull's continuous processing model conflicted with the requirement for discrete batch operations.

- Redis Priority Queue: Tried using Redis's sorted sets for prioritization.

  - Limitation: Inefficient in retrieving and trimming multiple items at once, crucial for effective batch loading.
