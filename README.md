Create a React Project in Typescript the animates the following: 

1) On page load, an HTTP request is made to a static URL coding-project.imtlab.io/seed that returns a JSON response 
that seeds the animation. An example of the JSON response is provided in example.json.

2) As per the seed, an m x n grid of cells is to be rendered with every cell assigned a color matching the value
specified in the seed. This sets the initial state for the animation.
    - 0 (dead) = #a3a3a3
    - 1 (sad) = #5daaff
    - 2 (happy) = #2cb48a

3) The animation starts by clicking a "Start" button, which becomes "Pause" after being clicked.

4) The animation is stateful and is performed with discrete steps. To transition from step i to i + 1 each cell is evaluated 
according to the following rules:
    - Any sad or happy cell with two or three sad or happy neighbours survives.
    - Any dead cell with exactly three sad neighbors becomes a sad cell.
    - Any dead cell with exactly two sad neighbors and 1 happy neighbor becomes a sad cell.
    - Any dead cell with exactly one sad neighbor and 2 happy neighbors becomes a happy cell.
    - Any dead cell with exactly 3 happy neighbors becomes a happy cell.
    - All other cells become or remain dead. 

5) The animation proceeds through successive steps updated every second until "Pause" is clicked.

Things to Note

- It is perfectly acceptable (if not encouraged) to leverage public packages or reuse code from online sources e.g. 
StackOverflow. However, anything that you do not author must be attributed.
- Be prepared to discuss your code and possible extensions during an interview.
- The goal is that a draft of this project can be completed in an approximately 4 hour timeframe. However, partial 
submissions may be acceptable especially if you are prepared to discuss what was difficult and how these difficulties 
could be mitigated.
