const path = require("path");

const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

//console.log(__dirname);
//console.log(__filename);
//console.log(path.join(__dirname, "../public"));
const app = express();

const port = process.env.PORT || 3000;

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
//Customizing views directory
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Gopi"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Gopi"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide address"
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastdata) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          location: location,
          forecast: forecastdata,
          address: req.query.address
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide search term"
    });
  }
  console.log(req.query.search);
  res.send({
    products: "prod"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpmsg: "Help??",
    title: "Help",
    name: "Gopi"
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMessage: "Help article not found",
    name: "Gopi",
    title: "404"
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    errorMessage: "404 Page not Found",
    name: "Gopi",
    title: "404"
  });
});
//app.com
//app.com/about

app.listen(port, () => {
  console.log("Server is started " + port);
});
