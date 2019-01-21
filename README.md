## To-Do List

* Add score to Splash screen; consider hiding instructions and splash-details
* Add back min-height for definition-text and term-text; tweak for it looks nice in single line
* Another pass at term and definition elements and text children
   * Vertical centering
   * Line-height
   * Truncate
   * Overflow on hover, click, touch, over, etc.
* Code canDrag functionality and reshuffle end of game to deal with Preview bug, etc.
* Find places in code where hardcode style is used and augment with browser-specific prefixes, etc. 
* Figure out a cross browser-compatible way to vertically center the scoreboard text
* Add title to game somewhere
* Consider replacing white text with a complementary gray; possibly change logo?
* Adjust game tiles in each form factor; experiment with % vs. using viewport width, etc.
* Make another star constellation based upon the computer stars, but with no gaps; add to full bleed on bottom left

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
