# Basic-ToDoList
This is a Node.js application for managing lists and items. It allows users to create, view, update, and delete lists and items. The application uses MongoDB as its database and is built with Express.js and EJS templating engine. Feel free to use this code as a starting point for your own projects.


## Prerequisites
### MongoDB Atlas Cloud Account and a Personal Cluster
```bash
https://www.mongodb.com/cloud/atlas/register?utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_core_prosp-brand_gic-null_amers-mx_ps-all_desktop_eng_lead&utm_term=mongodb%20atlas%20service&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624326&adgroup=115749706263&cq_cmp=12212624326&gclid=CjwKCAjw5pShBhB_EiwAvmnNVzLGjEWi1ARTWIRC_1sVa_OS1ek9eJC7pZcsWQXog9zCTeXZE_HgExoCP9QQAvD_BwE
```
### Modify line 14 of the app.js file
* Change "process.env.MONGODB_URI" with your personal MongoDB Atlas Cluster
* Support link: https://www.youtube.com/watch?v=bhiEJW5poHU


## Download the dependencies used in this project
Type in the terminal:
```bash
npm i
```

## Run your local server
Type in the terminal:
```bash
nodemon app.js
```

## Use your favorite browser
Type:
```bash
localhost:8080
```

## Instructions
* Hit the '+' button to add a new item.
* Check the box in order to delete an item.
* Type in the navigation bar "/<newList>" in order to create a new list -> "newList" can be anything you want
