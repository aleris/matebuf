# Create App

## General

A math multiplication game for kids.

## Screens

1. Start screen:
Shows owl_start.png image from src/assets and a start button.
Shows the number of gems collected so far.
Press start to go to game screen.

2. Game screen:
Shows:
- multiplication question and a text input for the answer.
- button to submit the answer.
- progress bar showing the progress of the game. There are 10 questions in total. 
The multiplication question is generated randomly.
Use only single digit numbers for the multiplication question.
If the response is ok, shows owl_happy.png image and a next question button.
If the response is not ok, shows owl_sad.png assets image and a try again button.
After 10 questions, go to the end screen.

3. End screen:
After 10 questions, show the end screen.
Shows a button with the chest_closed.png image from src/assets.
When the button is pressed, show the chest_open.png image 
, a random gem from 'ruby_small', 'topaz_small', 'sapphire_small' and a grab button. 
When pressing the grab button, go back to the start screen.

## Technical Aspects

Save progress in local storage.
Saves the number of gems collected so far for each type.
Use a clean style for the app but with a bit of a game feel.
Use an animation for buttons when pressed.
Use big text and big buttons.
Use modules scss file for the styles.
Each component is in a separate folder with its own scss file.
Use two fonts:
- @fontsource/chewy: for the text (for game like feel) 
- @fontsource-variable/azeret-mono: for the numbers
