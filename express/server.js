const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.engine( 'ejs', require( 'ejs' ).__express);
app.set( 'view engine', 'ejs' );

app.set( 'views', path.join( __dirname, 'views' ));


app.use( express.static( 'public' ));

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get( '/about', (req, res) => {
  res.send( 'About Us Page!' );
});

// POST request
app.post( '/user', (req, res) => {
  const name = req.query.name;
  res.status( 201 ).send( `Hello ${ name }` );
});

app.put( '/update', (req, res) => {
  const email = req.query.email;
  res.send( `The email has been updated to ${ email }` );
});


// DELETE request
app.delete( '/item/:id', (req, res) => {
  const id = req.params.id;
  res.send( `The item with id ${ id } has been successfully deleted.` );
});


const blogRoutes = require( './routes/blog/blog_routes.js' );
app.use( '/blogs', blogRoutes );


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
