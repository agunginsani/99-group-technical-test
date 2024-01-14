# Installation

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- pnpm: [Install pnpm](https://pnpm.io/installation)

## Installation steps

1. Install Dependencies with pnpm

   Run the following command to install project dependencies using pnpm:

   ```
   pnpm install
   ```
2. Start the Development Server

   To start the Remix development server, run the following command:

   ```
   pnpm run dev
   ```

   This will launch your Remix application in development mode. You can access it at http://localhost:3000.

# Notes

## My Choice for SSR: Remix

I chose Remix for its emphasis on standard web APIs, enhancing user accessibility and experience. The Remix router's API, with its ability to easily collocate related files, aligns well with my development preferences. While my experience with Remix is limited to this challenge, the framework's unique characteristics posed some challenges.

## Infinite Scrolling Challenge

During the implementation of infinite scrolling, I encountered issues with the initial value for `useState` not behaving as expected. As a newcomer to Remix, this unexpected behavior took me by surprise. However, I've documented my approach to infinite scrolling [here](https://github.com/agunginsani/99-group-technical-test/blob/d562a8056c8e762bbfd105a008ca50c59ac88831/app/routes/r.%24subreddit.%24sort.jsx#L41C1-L79). I utilized the `IntersectionObserver` to identify the last item in the list. Upon intersection, I updated the pagination, and a `useEffect` call fetched data from a dummy API and concatenated it with the previous list.

## Redux Integration Setback

Regrettably, time constraints prevented the successful integration of Remix with Redux. While I'm familiar with Redux and have utilized it in the past, my recent preference lies with [Zustand](https://github.com/pmndrs/zustand) due to its reduced boilerplate. I intend to explore Redux integration when time permits.

## Upvoting Post Synchronization

The use of a dummy API, due to unavailability of Reddit/Kaskus APIs, resulted in a lack of synchronization for upvotes across pages. A potential solution involves using global state shared between pages. However, handling page refresh poses complications. If Redux integration becomes feasible, I plan to store data in the Redux store and persist it in `localStorage` to prevent data loss after refresh. Nevertheless, syncing with server data in a real-world scenario might introduce complexities.
