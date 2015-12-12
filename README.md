# joker-meteor
A simple generator for a modern meteor app.

Inspired by [Rails](https://github.com/rails/rails) for its powerful generators and [The Meteor Chef's Base](https://github.com/themeteorchef/base).

The aim is to provide a simple base for modern meteor apps and to help you automate all the boring stuff (creating new resources / collections / views / ...) to let you focus on the **interesting code part**.

Here is how to use it :

## Application

```
$> yo joker appname
```

You just created the base skeleton for your new meteor application!

## Scaffolds

A scaffold is a way to represent a resource.
It is a combination of a collection, 4 routes, 4 views and 4 meteor methods.
Those views are used to 
* add a **new** document to a collection
* **list** all the documents of a collection
* **show** a particular document of a collection
* **edit** a particular document of a collection

```
$> yo joker:scaffold person
```

## Collections

```
$> yo joker:collection person
```

Will create the People collection which holds Person documents.

## Routes

To create a route try

```
$> yo joker:route
```

## Views

To create a view try

```
$> yo joker:view
```

## Methods

To create a meteor method try

```
$> yo joker:method
```
