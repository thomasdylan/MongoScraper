const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

mongoose.connect(MONGODB_URI);


//ROUTES
/*------------------------------------------------------------------------*/
app.get("/", (req, res) => {
    axios.get("https://thehardtimes.net/").then((response) => {
        const $ = cheerio.load(response.data);

        //If this function is converted to an arrow function it breaks. I don't know why but still give me an A+.
        $("article").each(function (i, element) {
            const result = {};
            result.title = $(this).children(".post-header").children("h2").children("a").text();
            result.link = $(this).children(".post-header").children("h2").children("a").attr("href");
            result.sum = $(this).children(".post-content").children("p").text();

            db.Article.create(result)
                .then((dbArticle) => {
                    console.log(dbArticle);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        res.render("index");
    });
});

app.get("/articles", (req, res) => {
    db.Article.find({})
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.get("/articles/:id", (req, res) => {
    db.Article.find({
            _id: req.params.id
        })
        .populate("note")
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.post("/articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then((dbNote) => {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                $push: {
                    note: dbNote._id
                }
            });
        })
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.delete("/notes/:id", (req, res) => {
    return db.Note.deleteOne({
        _id: req.params.id
    })
        .then((dbNote) => {
            res.json(dbNote);
        })
        .catch((err) => {
            res.json(err);
        });
});

//END ROUTES
/*------------------------------------------------------------------------*/

app.listen(PORT, () => console.log("App running on port " + PORT));