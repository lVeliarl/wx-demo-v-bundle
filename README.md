Execute the following command to run the project

1. Yarn

2. yarn build

3. yarn start



Under the src/widgets folder, a component was encapsulated using protoUI webix.ui.jetapp

I want this component to run independently after packaging, and currently my packaging method must introduce jet. umd. js before that

I cannot directly package webix jet and my code together, because if jet is used elsewhere

Report that the jet object is not the same object.

I want to package like filemanager. js, but I see that your packaging is really complicated. May I ask if I use vite

How should I package the components that I package myself using protoUI
