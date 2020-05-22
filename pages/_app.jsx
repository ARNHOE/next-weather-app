import React from "react"
import App from "next/app"

import '../css/tailwind.css'

class WeatherApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return (
            <Component {...pageProps} />
        );
    }
}

export default WeatherApp;