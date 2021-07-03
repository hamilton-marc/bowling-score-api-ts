# Bowling API (Typescript)
This is an implementation of a Bowling Score card used as a code exercise.

The rules of bowling represent an excellent use case for a code exercise
as it requires you to consider the rules of the games and the quirky
edge cases that go along with it.

This implementation comes in 2 flavors:
- an API
- a CLI (command line interface)

Both the CLI and API consume the same basic logic for computing the score of
a bowling game. You can easily use the API from the swagger doc UI or by
simply invoking it from the address bar of your browser. Of course, you can
always use a Rest API client such as Postman as well.

## Installing / Getting started

### Prerequisites

Be sure you have Node Package Manager (npm) installed

### Installation

From the project directory, simply run NPM's typical install command.

```shell
npm i
```

NPM will then pull down all of the dependencies into a `node_modules` folder

## Executing the API

To run the API locally, simply run the command below. This will spin up an
express server on port 3000:

```shell
npm run start
```

### API Health Check

To check to make sure the server is up and running, Simply open your browser
to `http://localhost:3000/api`.  You should see simple JSON message indicating
that the service is up and running:

```JSON
{ "status": "pass" }
```

### API Swagger Doc

To see the documentation for the API, navigate to the following URL:

`http://localhost:3000/api-docs`

From the Swagger interface, you can optionally interact with the API.  To
calculate a score from a set of bowling throws, simply enter a comma delimited
set of throws for each frame.  Note that you must enter all throw values for
each frame, even for a strike. You don't have to enter all frames though. The
API will calcuate however many frames you enter (up to a max of 10 frames).

#### Examples

The following will give you the current score after a player knocks down 6 pins
in the first frame:

`http://localhost:3000/api/score?throws=6`

Below is an example where we calculate the score after a player throws 2
strikes in a row in the first and second frames. Note that we must put a zero
in the 2nd throw when a player throws a strike.

`http://localhost:3000/api/score?throws=10,0,10,0`

In this example, the player throws a spare in each of the first 2 frames and then
knocks down a total of 9 (4+5) in the third frame.

`http://localhost:3000/api/score?throws=3,7,8,2,5,4`

## Executing the Command Line Application

This project includes a very rudimentary command line interface to provide a
friendlier way to exercise the underlying scoring functionality.  You can run
this using the following command:

```shell
npm run start:cli
```

You will be presented with a series of questions. First, you'll be asked if
you want to start a new game. Choosing "New Game" then begins a series of
questions asking you how many pins were knocked down for each throw of each
frame.

Once you're done entering in all of the throws, you'll be presented with a
visual representation of the score card for that game.

If you want to end the game early at any point, simply choose hit `ESC`.

## Executing the Tests

This application was developed with both Unit Test and Behavioral Tests.

### Executing the Unit Tests

The unit tests were developed using Jest and can be executed with the following
command.

```shell
npm run test
```

### Executing the Behavioral Tests

The behavioral tests execute against the API. Running the following command will spin
up an instance of the web service, execute the tests and then shut down the server.

```shell
npm run test:bdd
```

## Licensing

"The code in this project is licensed under MIT license."
