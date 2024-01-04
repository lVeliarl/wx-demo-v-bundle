import { JetApp, JetView } from "webix-jet";

class sub extends JetView{
    config() {
        return {
            rows:[
                {
                    view:"text"
                },
                {
                    view:"switchinput",
                    name:"vv",
                    showInput:{
                    view:"text",
                    label:"show",
                    required:true
                    },
                    hiddenInput:{
                    view:"datepicker",
                    label:"hidden",
                    required:true
                    }
                }
            ]
        }
    }
}

class Test extends JetView{
    config() {
        return  {
            rows:[
                {
                    view:"switchinput",
                    height:60,
                    name:"vv",
                    showInput:{
                    view:"text",
                    label:"show",
                    required:true
                    },
                    hiddenInput:{
                    view:"datepicker",
                    label:"hidden",
                    required:true
                    }
                },
                {
                    view:"switchinput1",
                    height:60,
                    name:"vv",
                    showInput:{
                    view:"text",
                    label:"show",
                    required:true
                    },
                    hiddenInput:{
                    view:"datepicker",
                    label:"hidden",
                    required:true
                    }
                },
                {
                    view:"button",
                    value:"show",
                    click:()=>{
                        this.show("sub")
                    }
                },
                {
                    view:"filemanager",
                    url: "https://docs.webix.com/filemanager-backend/"
                }
            ]
          }
    }
}

new JetApp({
    webix,
    debug:true,
    views: {
      home: Test,
      sub:sub
    },
  }).render();
  