
  

# URL Shortener

  

This is a simple URL shortener project using Node.js, Express, and MongoDB. It allows users to create shortened versions of long URLs that are easier to share and remember.

  

## Getting Started

  

To get started with the project, follow these steps:

  

1. Clone the repository `git clone https://github.com/DinooSaaw/URLShorter.git`

  

2. Install the required dependencies: `npm install`

  

3. Create a new .env file in the root of the project folder and set the following environment variables:

  

	-  `MONGODB_URI=<your mongodb uri>`

	-  `PORT=<your server port>`

	-  `BASE_URL=<your base url>`

  

4. Start the server: `npm start`

  

## Usage

  

To use the URL shortener, follow these steps:

  

1. Navigate to `http://localhost:<your server port>/api/shorten?url=<your long url>` in your browser.

2. You should receive a JSON response with the shortened URL and other details.

3. Navigate to the shortened URL in your browser to access the original long URL.

  

## API Endpoints

  

The URL shortener provides the following API endpoints:

  

`GET /api/shorten?url=<your long url>`: Create a new shortened URL for the given long URL.

  

`GET /<short code>`: Redirect to the original long URL corresponding to the given short code.

  

## Technologies Used

  

- Node.js

- Express

- MongoDB

- shortid

- dotenv

  

## Contributing

  

If you would like to contribute to the project, you can:

  

- Fork the repository.

- Create a new branch for your feature: `git checkout -b my-feature`

- Make your changes and commit them: `git commit -am 'Add new feature'`

- Push to the branch: `git push origin my-feature`

- Create a pull request.