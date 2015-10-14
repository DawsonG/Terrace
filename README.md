# Terrace Blog and CMS

__Still early in development.  This repo is for ongoing work.  No stable builds have been released.__

## Philosophy
* Lightweight - Everyone says their application is going to be lightweight.  We're saying it too.  Terrace has few dependencies and allows you to install only what you need for your project.  See more in the Layered section.
* Cool - Using React.js for the frontend allows us to build an application with an awesomely slick admin end that bloggers, clients, and even the non-techy will love.
* Fast - Terrace uses a Node.js backend optimised for performance.
* Layered - Terrace is layered so that someone can add just the API to an existing project and build their own backend.  Or maybe they want the backend and API but already have a frontend.  We can do that too.  Above those layers we have a plugin and theming layer allowing anyone to install the functionality they need.
* Simple Datasources - Instead of a sprawling database, Terrace keeps things simple.  All content for readers is stored as "posts" which can be ordered chronologically like a blog or manually like a website.  You can even have a mix of both thanks to tagging.

## Configure environment

## Running Tests
1. Install jasmine-node with `npm install -g jasmine-node`
2. Run the tests with `npm test`
