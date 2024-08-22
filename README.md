# Brawl Stars Node.js Server

This is a Node.js server for the BrawlStars application. It provides endpoints to fetch player stats and all stats from a personal MySQL database and Brawl Stars API.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine. You can download Node.js [here](https://nodejs.org/en/download/) and npm is included in the installation.

### Installing

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repository.git

2. Navigate into the project directory:
cd your-repository

3. Install the dependencies:
npm install

4. Running the Server
To start the server, run:
node server.js

The server will start on localhost:5500.

Endpoints
GET /stats/:playerId: Fetches the stats for a player with the given ID.
GET /stats/all: Fetches all stats from the stats table in the database.

Built With
Node.js - The runtime used
Express.js - The web application framework used
Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.
