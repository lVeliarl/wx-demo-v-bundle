import { JetView ,JetApp ,EmptyRouter} from "webix-jet";
import "./styles/_.css";  
/**
 * combo 和text 切换组件
 */
class SwitchInput extends JetView{

    public name:string = "switchinput";

    public _config:any;

    constructor(app:any){
        super(app,null); 
        if(app.config.view == this.name){
            this._setConfig(app.config);  
        }
    }
    private _setConfig(config:any){
        this._config = config; 
    }
    ready(_$view: any) {
        const _showRef = _$view.queryView({ localId: "switch1" });
        const _showview = _showRef.config.view;
        if(_showview === 'combo'){
            const _listData = (_showRef.getList().serialize() || []).map((i: any) => i.id);
            if(_listData.length === 0){
                _$view.queryView({ localId: "switch_btn" }).setValue(1);
                return;
            }
            if(_showRef.getValue()){
                if(_listData.includes(_showRef.getValue())){
                    _$view.queryView({ localId: "switch_btn" }).setValue(0);
                } else {
                    _$view.queryView({ localId: "switch_btn" }).setValue(1);
                }
            } else {
                _$view.queryView({ localId: "switch_btn" }).setValue(0);
            }
        } else {
            const _comboRef = _$view.queryView({ localId: "switch2" });
            const _listData = (_comboRef.getList().serialize() || []).map((i: any) => i.id);
            if(_listData.length === 0){
                _$view.queryView({ localId: "switch_btn" }).setValue(0);
                return;
            }
            if(_showRef.getValue()){
                if(_listData.includes(_showRef.getValue())){
                    _$view.queryView({ localId: "switch_btn" }).setValue(1);
                } else {
                    _$view.queryView({ localId: "switch_btn" }).setValue(0);
                }
            } else {
                _$view.queryView({ localId: "switch_btn" }).setValue(1);
            }
        }
    }
    config() {
        const _onLabel = this._config.showInput.view === 'combo' ? "选择": "输入";
        const _offLabel = this._config.showInput.view === 'combo' ? "输入": "选择";
        return {
             cols:[ 
                this._createShowInput(this._config.showInput),
                this._createHiddenInput(this._config.hiddenInput),
                {
                    view:"switch",
                    localId: "switch_btn",
                    width:76,
                    css:{"margin-left" : "10px"},
                    onLabel: _onLabel, 
                    offLabel: _offLabel,
                    on:{
                        onChange:function(this:webix.ui.switchButton,newValue:number){
                              if(newValue == 1){
                                (this.$scope.$$("switch1") as webix.ui.text).hide();
                                (this.$scope.$$("switch2") as webix.ui.text).show();
                              }else{
                                (this.$scope.$$("switch1") as webix.ui.text).show();
                                (this.$scope.$$("switch2") as webix.ui.text).hide();
                              }
                        }
                    }                    
                }
             ]
        }
    }

    private _createShowInput(config:any){
        if(config){ 
            config.id = undefined;
            config.localId = "switch1";
            config.name = "switch1";
            config.labelPosition = this._config.labelPosition;
            config.labelAlign =  this._config.labelAlign;
            config.labelWidth =   this._config.labelWidth;
        }
        return config;
    }

    private _createHiddenInput(config:any){
        if(config){
            config.localId = "switch2";
            config.hidden = true,
            config.name = "switch2";
            config.labelPosition = this._config.labelPosition;
            config.labelAlign =  this._config.labelAlign;
            config.labelWidth =   this._config.labelWidth;
        }
        return config;
    }
}


class SwitchInputApp extends JetApp {
    constructor(config:any){  
        const defaults = { 
            start	: "SwitchInput",
            router:EmptyRouter,
            views:{
                SwitchInput:SwitchInput
            }
        };
        super({ ...defaults, ...config });
    } 
}

webix.protoUI({
    name:"switchinput",
    app:SwitchInputApp,
    $init:function(){  
        let className = this.$view.className;
        this.$view.className = className + "  " + "webix-form-border-hide"; 
    },
    getValue:function(){ 
        try{
            let s = this.$app.$$("switch1");
            let h = this.$app.$$("switch2");  
            if(s.isVisible()){
                return s.getValue();
            }else{
                return h.getValue();
            } 
            
        }catch{
           return "";
        } 
   }, 
   setValue(data:any){
        let s = this.$app.$$("switch1");
        let h = this.$app.$$("switch2"); 
        s.setValue(data);
        h.setValue(data);
   },
   validate:function(){ 
        let s = this.$app.$$("switch1");
        let h = this.$app.$$("switch2");    
        if(s.isVisible() && s.config.required){ 
            s.validate() == true ? s.$view.className = "webix_control webix_el_text" :   s.$view.className = "webix_el_text webix_control  webix_invalid"; 
            return s.validate();
        }else if(h.isVisible() && h.config.required){ 
            h.validate() == true ? h.$view.className = "webix_control webix_el_text" :  h.$view.className = "webix_el_text webix_control  webix_invalid"; 
            return h.validate();
        }else{
            return  true;
        }
   }, 
   disable(){
    this.$app.$$("switch1").disable();
    this.$app.$$("switch2").disable();
   }
},webix.ui.jetapp,webix.Values);