# What's DCAT for?

DCAT (Dragon City Animations Tool) is a web tool I made to be able to play the animations of most dragons from the game Dragon City. Its as user friendly as possible and has many options to customize the output. It not only lets you play the animations, but also record and save them as videos in the WebM format.
The initial plan was to host it but i wont do it for personal reasons, so Im releasing the source code for it.

## Why?

The current method that most people use to play the animations of this game is inefficient and barely customizable. Not to mention that it can take up to hours for some. My tool lets you do more and better in less time in most cases.

## Cool, but how do I use it?

From what I've seen, not many people in this community is familiar with computers, let alone programming; so here's a more or less detailed guide with images/videos. If you still need help you can always send me a DM at `chark#7066` in Discord.

### Downloading the project

If you have git installed, you can open the command prompt and type in `git clone https://github.com/Feli-Martinez/dcanims/` and then press enter, a folder with the project's files called "dcanims" will be created in the current directory.

If you dont have git, you have to click the button that says `<> Code` right in top of the projects files, and then click the one that says "Download ZIP", a zip file with the project will be downloaded, once it finished you have to extract the file, by right clicking it and selecting "Extract here", the files will be extracted to a folder called "dcanims-main".

![Downloading the file through github](https://github.com/Feli-Martinez/DCAT/blob/main/images/download-github.gif?raw=true)

![Extracting the zip file](https://github.com/Feli-Martinez/DCAT/blob/main/images/extract.gif?raw=true)

### Running it

Now, for it to work properly you'll need a [convertio.co](https://developers.convertio.co/) api key, to get it you have to sign up and copy the api key they give you, it has a maximum of 25 daily uses, though you can add more than 1 api key to get more uses. Once you copied it, go to the "data" folder inside "dcanims" or "dcanims-main" and open the `apiKeys.json` file with any text editor, even notepad will do. Now paste the api key(s) there, surounded by double quotes and separated by commas. Its important that you also delete any other "entries" that are not api keys, just like in the video.

![Adding your api key(s)](https://github.com/Feli-Martinez/DCAT/blob/main/images/apikeys.gif?raw=true)

Now, to start the tool, you'll need to have [Node.js](https://nodejs.org/en) installed. Please watch a tutorial if you dont know how to do it, but roughly the steps are: download the file that has "LTS" next to its number version from the Node.js website, run it, follow the steps in there and restart your computer.

Once you have it installed, go to the "dcanims-main" or "dcanims" folder, click the path at the top and type cmd, a window will pop up, now, type `npm install` and press enter. This command is used to install the necessary dependencies for the project to work.

![Installing the dependencies](https://github.com/Feli-Martinez/DCAT/blob/main/images/dependencies.gif?raw=true)

After that, the last thing you'll need to do is type `node .` and press enter. And that's it, go to your browser of choice (i recommend chrome, you might notice some lag spikes in other browsers) and open `localhost:7272`. Enjoy :)

![Actually starting the app](https://github.com/Feli-Martinez/DCAT/blob/main/images/start.gif?raw=true)

![Opening it in your browser](https://github.com/Feli-Martinez/DCAT/blob/main/images/open.gif?raw=true)