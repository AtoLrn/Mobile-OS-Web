import compilerDOM from "../../jsx-compiler/dom";
import React from "../../jsx-compiler/jsx";
import { generateId } from "../utils/idGenerator";
import { windowManager } from "../utils/windowManager";

export class Application {
    id: string
    appWindow: any
    name = 'applicationTemplate'
    url = 'https://logo.com'

    holded = false

    offset = [ 0, 0]

    moveListener = null
    fullScreen = false

    constructor() {
        this.id = generateId()
    }

    render (args: any) {
        const doc = document.getElementById(this.id)
        if (!doc) return
        const main = doc.getElementsByTagName('main')
        main[0].remove()

        this.appWindow.render(<main>{args}</main>)

    }

    build (args: any) {
        setTimeout(() => {
            const appWindow = document.getElementById(this.id)
            if (!appWindow) return
            this.appWindow = compilerDOM.createHtml(appWindow);
        }, 1)

        const onClose = () => {
            this.onClose()
            windowManager.closingWindow(this.id)
        }
        
        const handleMove = (event: any) => {
            event.preventDefault();
            const elem = document.getElementById(this.id)
            if (!elem || !this.holded) return 
            elem.style.left = `${event.clientX + this.offset[0] }px`
            elem.style.top = `${event.clientY + this.offset[1]}px`
        }

        const onHandle = (event: any) => {
            event.preventDefault();
            const elem = document.getElementById(this.id)
            if (!elem) return
            document.addEventListener('mousemove', handleMove.bind(this))

            this.offset = [ elem.offsetLeft - event.clientX,  elem.offsetTop - event.clientY ]
            this.holded = true
        }

        const onLossHandle = () => {
            this.holded = false
        }

        const onClick = () => [
            windowManager.top(this.id)
        ]

        return (
        <div id={this.id} className='application-window' onMouseDown={() => onClick()}>
             <nav onMouseDown={onHandle} onMouseUp={() => onLossHandle()} > 
                <span className='close' onClick={() => onClose()}></span>
                <span className='mini' onClick={() => this.onHide()}></span>
                <span className='resize' onClick={() => this.onFullScreen()}></span>
             </nav>
             <main>
             {args}
             </main>
        </div>
        )
    }

    onClose () {
        console.log('CLOSING', this.id)
    }

    onHide () {
        windowManager.hideWindow(this.id)
    }

    onFullScreen () {
        this.fullScreen ? windowManager.fullExitScreen(this.id) : windowManager.fullScreen(this.id)
        this.fullScreen = !this.fullScreen

    }
}