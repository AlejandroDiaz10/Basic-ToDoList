const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const port = 8080;
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// --------------------------------------------------------------- Connect to Mongo DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successful connection")
    app.listen(port, function () {
      console.log(`Server started on -> localhost:${port}`);
    });
  })
  .catch(err => console.log(err));

// --------------------------------------------------------------- Create item schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// --------------------------------------------------------------- Create item model
const Item = mongoose.model("Item", itemSchema);

// --------------------------------------------------------------- Mongoose - CREATE
const newItem1 = new Item({
  name: "Welcome to your To Do List!"
});
const newItem2 = new Item({
  name: "Hit the '+' button to add a new item."
});
const newItem3 = new Item({
  name: "<-- Hit this to delete item."
});

const defaultItems = [newItem1, newItem2, newItem3];

// --------------------------------------------------------------- List schema for dynamic content
const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);


// --------------------------------------------------------------- Loading main page
app.get("/", async function (req, res) {
  // Loading the list of items saved in the BD
  try {
    let items = await Item.find({});

    // If list is empty, aggregate the default items
    if (items.length === 0) {
      await Item.insertMany(defaultItems)
        .then(console.log("Items have been added successfully"))
        .catch(err => console.log(err));

      // Redirect to the main page
      // items = await Item.find({});
      return res.redirect("/");
    }

    res.render("list", { listTitle: "Today", newListItems: items });

  } catch (err) {
    console.log(err);
  }
});

// --------------------------------------------------------------- Inserting new items in lists
app.post("/", async function (req, res) {
  const item = req.body.newItem;
  const listName = req.body.list;

  // Creating a new document
  const newItem = new Item({
    name: item
  });

  if (listName === "Today") {
    // Inserting new document to default DB and redirecting to main page
    await newItem.save()
      .then(() => {
        console.log("Item added successfully");
        return res.redirect("/");
      })
      .catch(err => console.log(err));
  } else {
    // Inserting new document to corresponding DB and redirecting to the corresponding page
    const foundedList = await List.findOne({ name: listName }).exec();
    foundedList.items.push(newItem);

    await foundedList.save()
      .then(() => {
        console.log("New item successfully added in corresponding list!");
        return res.redirect("/" + listName);
      })
      .catch(err => console.log(err));
  }
});

// --------------------------------------------------------------- Deleting items from list
app.post("/delete", async function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    // Deleting items from default list
    await Item.findByIdAndDelete(checkedItemId)
      .then(() => {
        console.log("Item has been successfully deleted");
        return res.redirect("/");
      })
      .catch(err => console.log(err));
  } else {
    // Deleting items from custom lists
    await List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
      .then(() => {
        console.log("Item form custom list has been deleted");
        return res.redirect("/" + listName);
      })
      .catch(err => console.log(err));
  }
});

// --------------------------------------------------------------- Dynamic routes
app.get("/:categoryList", async function (req, res) {
  const categoryName = _.capitalize(req.params.categoryList);

  try {
    // find method gives as a result a matrix (2d array)
    // findOne method returns a 1d array
    // const foundedList = await List.find({ name: categoryName }).exec();
    const foundedList = await List.findOne({ name: categoryName }).exec();

    // if (foundedList.length === 0) {
    if (!foundedList) {
      // If list doesn't exists, create it
      const newList = new List({
        name: categoryName,
        items: defaultItems
      });

      await newList.save()
        .then(console.log("New list successfully created!"))
        .catch(err => console.log(err));

      return res.redirect("/" + categoryName);

    } else {
      // Show existing list
      // res.render("list", { listTitle: foundedList[0].name, newListItems: foundedList[0].items });
      res.render("list", { listTitle: foundedList.name, newListItems: foundedList.items });
    }
  } catch (err) {
    console.log(err);
  }
});
