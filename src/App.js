import { InputManager } from "./InputManager";

export class App {
    scene;
    start = 0;
    previous = 0;
    ctx;
    inputManager;
    static app;
    constructor(canvasId,scene){
        App.app = this;
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById(canvasId);
        canvas.focus();
        this.inputManager = new InputManager(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d');

        this.scene = scene;
        
        window.requestAnimationFrame(this.step);
    }

    step = timestamp => {
            
        if(this.start == 0){
            this.start = timestamp;
        }
        
        const delta = timestamp - this.previous;
        this.scene.clear(this.ctx);
        this.scene.input(this.inputManager.keys, this.inputManager.mouse);
        this.scene.update(delta);
        this.scene.draw(this.ctx);
        

        this.previous = timestamp;
        window.requestAnimationFrame(this.step);
    }
   
    
    
}