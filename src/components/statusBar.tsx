import React from "../../jsx-compiler/jsx";
import "../styles/status-bar.scss"
import Sentry from "../utils/sentry";

export const StatusBar = () => {

    const updateBattery = () => {
        const nav: any = navigator
        try {
            nav.getBattery().then((bat: any) => {
                const div = document.getElementById('status-battery')
                if (!div) return
                div.innerText = `${Math.round(bat.level * 100)}%`
                bat.addEventListener('levelchange', (x: any) => {
                    console.log(x)
                    div.innerText = `${Math.round(bat.level * 100)}%`
                });
            })
        } catch (error) {
            Sentry.captureException(error)
        }
        
    }

    const updateWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (loc) => {
                const { latitude, longitude } = loc.coords
                try {
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${'35f20df55d8f5a1c451cbf8344b6a4ac'}&units=metric`)
                    const data = await res.json()
                    const div = document.getElementById('status-temp')
                    if (!div) return
                    div.innerText = `${Math.round(data.main.temp)}°C`
    
                    const divWeather = document.getElementById('status-weather')
                    if (!divWeather) return
                    divWeather.innerText = `${data.weather[0].main}`
                    
                } catch (error) {
                    Sentry.captureException(error)
                }
            });
          } else {
          }
    }

    const toggleThemeMode = () => {
        if(document.body) {
            document.body.classList.toggle('darkmode')
            const el = document.getElementById('darkmode')
            if(el) el.innerText = document.body.classList.contains('darkmode') ? "dark: ON" : "dark: OFF"
        }
    } 

    updateBattery()
    updateWeather()



    return (
    <nav className='status'>
        <div id='status-battery'>
            searching...
        </div>
        <div id='status-temp'>
            Fetching...
        </div>
        <div id='status-weather'>
            Fetching...
        </div>
        <div id="darkmode" onClick={toggleThemeMode}>
            dark: OFF
        </div>
    </nav>
    )
}