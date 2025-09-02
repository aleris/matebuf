# Add Timer to Game

Add a timer to the game. The timer counts how long it takes for a game.

## Show Timer in Game Screen

Show a timer beside the progress bar in the game screen. 
The timer starts at 0 and counts up.
It shows minutes:seconds. 
The timer updates every second and uses the current time to calculate the difference since the game started.

## Best Time

Show the best time in the end screen. 
If the current game time is better than the best time, show a new best time message.
Save the best time in local storage.
The best time is also shown in the start screen.

## Technical Aspects

Use a state variable to keep track of the start time.
The start time is saved in the game state in local storage.
