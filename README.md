# Habit Tracker App AI Claude Code

## Install
### 1- [Rect Native Expo](https://docs.expo.dev/more/create-expo/)
### 2- [Claude Code](https://code.claude.com/docs/en/agent-sdk/migration-guide)
### 3- [Expo/skills](https://github.com/expo/skills)



## Install Claude Code

- CMD
- Cloud Code must be installed manually first.
```
npm install -g @anthropic-ai/claude-code
```
- If it doesn't work open Power Shell اذا مانفع شغل البور شل كمسؤول واكتب الام واضغط نعم yes
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```
- Now you can run the project
```
claude
```
- /models Chosse Opus 4.7
- /btw

## Getting Started Expo Applaction

- Open Cmd -> cd desktop
```
npx create-expo-app habit-tracker
```
```
claude
```
```
npx expo start 
```


## Claude Code

- Add the marketplace:
```
/plugin marketplace add expo/skills
```
- Install the plugin:
```
/plugin install expo
 ```

## Prerequisites

- [Node.js](https://nodejs.org/en) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/)
- iOS Simulator (macOS) or Android Emulator, or a physical device with [Expo Go](https://expo.dev/go)

## Prompt
```
        Build a habit tracker app using expo. We're going to have two tabs:
        
        1. The first tab will be the Today tab. This will show today's habits as a checklist. Each habit has an icon name, a check circle, and a progress bar showing the completed/total.
        2. We will have our Add button in the header to add new habits.
        3. The Streaks tab will show an overall streak counter, a seven-week calendar heat map like GitHub's contribution graph, and pre-habit streak cards. The Add Habit screen will be presented as a form sheet model from the Today tab. It will have:
        
        * Name input
        * Icon icon picker (like SF Symbols grid)
        * Color picker as color swatches
        * Live preview of the habit at the bottom
        * Save button For the libraries, we want to use:
        * expo sqlite local storage for persistence
        * native tabs for a tab bar
        * reanimated for animations
        * expo symbols for icons
        * expo haptics for feedback on iOS
```

## Preview Final Project

##### Page 1
<img src="" style="width:300px;" alt=" Page" />



#### Start Screen




# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

