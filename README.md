# Photon Image Viewer

Classic light-mode image viewer for macOS.

<img width="640" alt="screenshot" src="https://user-images.githubusercontent.com/52094761/208785316-1e757cbc-c61b-43b7-a137-b9570092bfcc.png">

## :green_book: Usage

### :keyboard: Keyboard Shortcuts

|                                Key                                 | Function         |
| :----------------------------------------------------------------: | :--------------- |
| <kbd>J</kbd>, <kbd>⌃</kbd>+<kbd>N</kbd>, <kbd>⌘</kbd>+<kbd>→</kbd> | Next Image       |
| <kbd>K</kbd>, <kbd>⌃</kbd>+<kbd>P</kbd>, <kbd>⌘</kbd>+<kbd>←</kbd> | Previous Image   |
|                            <kbd>+</kbd>                            | Zoom In          |
|                            <kbd>-</kbd>                            | Zoom Out         |
|                            <kbd>0</kbd>                            | Reset Zoom       |
|        <kbd>←</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>→</kbd>         | Pan              |
|                  <kbd>Fn</kbd>+<kbd>Delete</kbd>                   | Move to Trash    |
|              <kbd>H</kbd>, <kbd>⌃</kbd>+<kbd>G</kbd>               | Toggle Grid View |

### :computer_mouse: Mouse Operations

|    Mouse     | Function    |
| :----------: | :---------- |
|     Drag     | Pan         |
|    Wheel     | Zoom in/out |
| Double click | Reset zoom  |

## :hammer_and_wrench: How to build?

You will need to have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed.

```sh
# 1. Clone this repo.
git clone https://github.com/sprout2000/photon-image-viewer.git

# 2. Install dependencies.
cd photon-image-viewer
npm install

# 3. Build the app and create an installer.
npm run build && npm run package
```

And then, you will find the installer in the `release` directory.

## :copyright: Copyright

Copyright (c) 2024 sprout2000
