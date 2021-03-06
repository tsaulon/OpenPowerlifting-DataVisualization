const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const Chart = require("chart.js");
const data_service = require("./data_service.js");

app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/views", express.static(path.join(__dirname, "/views")));
app.use("/css", express.static(path.join(__dirname, "/node_modules/bulma/css")))
app.use("/chartjs", express.static(path.join(__dirname, "/node_modules/chart.js/dist")));
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs({extname: ".hbs", defaultLayout: "filters"}));
app.set("view engine", ".hbs");



app.get("/", (req, res) => {

    data_service.getCompetitors("Canada").then(data =>
        res.render(path.join(__dirname, "/views/visual.hbs"), {points: data})
    ).catch(data => console.log(data));
});

app.get("/test", (req, res) => {

    data_service.test();
})

app.listen(HTTP_PORT, () => {
    console.log("Server started! listening on port " + HTTP_PORT);
});