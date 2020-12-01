const express = require("express");
const app = express();
const path = require("path");
// importing the URL  from DB
const URL = require("./dbConfig");

// configuring nonoid
const { customAlphabet } = require("nanoid");
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 8);

const PORT = process.env.PORT || 1337;
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => console.log(`app listening on port: ${PORT}`));

// index or '/' route
app.get("/", (req, res) => {
  res.render("index", { shrinkedUrl: "" });
});

app.post("/", async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + "/";
  // console.log(fullUrl);
  // console.log(req.body.urlInput);
  try {
    // generate nanoid
    const id = await nanoid();
    // console.log(id, typeof id);
    // check if the id already exists

    // if id not in DB add url and id to the DB

    const url = new URL({
      url: req.body.urlInput,
      slug: id,
    });
    const flag = await url.save();
    // console.log("flag:", flag);

    res.render("index", { shrinkedUrl: fullUrl + id });
  } catch (error) {
    console.log(error);
  }
});

app.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const results = await URL.find({ slug: slug });
    if (!results.length) {
      return res.send("<h1>URL not found/expired");
    }
    res.redirect(results[0].url);
  } catch (error) {
    console.log(error);
    res.send("<h1>404 Internal error");
  }
});
