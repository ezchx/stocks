# stocks

Free Code Camp stock chart project.

Enter any valid ticker symbol and the program will chart 5 days, 1 month, 3 months, 6 months, or 1 year. The data feed is from the Yahoo API. The tickers are stored in a PostgreSQL database. When any user makes an update, the changes are immediately sent to all active users via Websockets.

The hosting is Heroku which supports Websockets, although the server goes to sleep rather quickly. Refresh the browser to wake it up.

Node.js, PostgreSQL, Websockets, and D3.
