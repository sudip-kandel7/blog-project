//index.js
import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

let lists = [];

app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home.ejs", {
    year: new Date().getFullYear(),
    lists: lists,
  });
});

app.get("/update", (req, res) => {
  res.render("home.ejs", {
    year: new Date().getFullYear(),
    lists: lists,
    update: true,
  });
});

app.get("/delete", (req, res) => {
  res.render("home.ejs", {
    year: new Date().getFullYear(),
    lists: lists,
    delete: true,
  });
});

app.patch("/update/:index", (req, res) => {
  const blogIndex = parseInt(req.params.index);
  const { author, title, content } = req.body;

  if (blogIndex >= 0 && blogIndex < lists.length) {
    lists[blogIndex].name = author;
    lists[blogIndex].title = title;
    lists[blogIndex].content = content;

    res.redirect("/home");
  } else {
    res.status(404).send("Blog not found");
  }
});

app.delete("/delete/:index", (req, res) => {
  const blogIndex = parseInt(req.params.index);

  if (blogIndex >= 0 && blogIndex < lists.length) {
    lists.splice(blogIndex, 1);

    res.redirect("/home");
  } else {
    res.status(404).send("Blog not found");
  }
});

app.get("/delete/:index", (req, res) => {
  const id = req.params.index;
  if (id >= 0 && id < lists.length) {
    res.render("delete.ejs", {
      blog: lists[id],
      index: id,
      year: new Date().getFullYear(),
    });
  } else {
    res.redirect("/");
  }
});

app.get("/create", (req, res) => {
  res.render("create.ejs", { year: new Date().getFullYear() });
});

app.get("/create/:index", (req, res) => {
  const id = req.params.index;
  if (id >= 0 && id < lists.length) {
    res.render("create.ejs", {
      blog: lists[id],
      index: id,
      year: new Date().getFullYear(),
    });
  } else {
    res.redirect("/");
  }
});

app.post("/submit", (req, res) => {
  lists.push({
    name: req.body["author"],
    title: req.body["title"],
    content: req.body["content"],
  });
  res.redirect("/home");
});

app.listen(port, (req, res) => {
  console.log(`This server is listening port ${port}`);
});
