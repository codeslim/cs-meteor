# cs-meteor

A CodeSlim generator for a modern meteor app.

How to use it :

## Application

```
$> yo cs-meteor appname
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
$> yo cs-meteor:scaffold post
```

## Collections

```
$> yo cs-meteor:collection post
```

Will create the Posts collection which holds post documents.

## Routes

To create a route try

```
$> yo cs-meteor:route
```

## Views

To create a view try

```
$> yo cs-meteor:view
```

## Methods

To create a meteor method try

```
$> yo cs-meteor:method
```
