import React from "../jsx-compiler/jsx";
import { StatusBar } from "./components/statusBar";
import "./styles/main.scss"
import { AppType } from "./types/application";
import { applications } from "./utils/applications";
import { fileSystem } from "./utils/FileSystem";
import { eventListener } from "./utils/listener";
import Sentry from "./utils/sentry";
import { windowManager } from "./utils/windowManager";

export const App = () => {

  const oldQuerySelector = document.querySelector.bind(document)

  document.querySelector = (selector: string) => {
    try {
      return oldQuerySelector(selector)
    }
    catch (error) {
      console.error("Failed to select: ", selector)
      Sentry.captureException(error)
    }
    return null
  }

  const oldGetElementById = document.getElementById.bind(document)

  document.getElementById = (selector: string) => {
    try {
      return oldGetElementById(selector)
    }
    catch (error) {
      console.error("Failed to select: ", selector)
      Sentry.captureException(error)
    }
    return null
  }


  const onHoverNav = () => {
    eventListener.post('navHover', true)
  }

  const onHoverLeftNav = () => {
    eventListener.post('navHover', false)
  }

  const onApplicationOpen = (app: AppType<any>) => {
    windowManager.createApp(app)
  }

  let isHovered = false
  
  eventListener.subscribe('navHover', (val) => {
    const navbar = document.getElementById('navbar')
    if (!navbar) return
    if (val) {
      isHovered = true
      navbar.classList.add('hover')
    } else {
      setTimeout(() => {
        if (!isHovered) navbar.classList.remove('hover')
      }, 2000)
      isHovered = false

    }
  })

  fileSystem.save('banane', 'Super')
  
  return (<div id="app">
    <StatusBar />
    <div className='hover-listener' onMouseEnter={onHoverNav} onMouseLeave={onHoverLeftNav}></div>
    <nav id='navbar' className='apps' onMouseEnter={onHoverNav} onMouseLeave={onHoverLeftNav}>
      {applications.map((app, index) => <div onClick={() => onApplicationOpen(app)} key={index} className="app-button" style={{ backgroundImage: `url('${app.url}')` }} title={app.name}></div>)}
    </nav>
  </div>);
};
