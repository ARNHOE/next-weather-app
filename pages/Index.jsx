import React from "react";
import axios from "axios";
import Head from "next/head";

const ACCUWEATHER_API_KEY = process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY;
const ACCUWEATHER_API_URL = process.env.NEXT_PUBLIC_ACCUWEATHER_API_URL;

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationId: null,
            temperature: {
                value: null,
                text: '',
                icon: null,
            },
            errorMessage: '',
            searchText: '',
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.autocomplete = this.autocomplete.bind(this);
        this.fetchCurrentTemperature = this.fetchCurrentTemperature.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            searchText: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.searchText) {
            this.setState({ errorMessage: "Please fill out a city" })
        } else {
            this.autocomplete();
        }

    }

    async autocomplete() {
        if (this.state.loading) return;

        this.setState({ loading: true })

        try {
            const { data } = await axios.get(`${ACCUWEATHER_API_URL}locations/v1/cities/autocomplete?q=${this.state.searchText}&apikey=${ACCUWEATHER_API_KEY}`)

            if (data.length > 0) {
                this.state.locationId = data[0].Key;
                this.fetchCurrentTemperature();
            } else {
                this.setState({ errorMessage: "Sorry, we couldn't find this city" })
            }
        } catch (error) {
            this.setState({ errorMessage: "Sorry, we couldn't find this city" })
        } finally {
            this.setState({ loading: false })
        }
    }

    async fetchCurrentTemperature() {
        try {
            const { data } = await axios.get(`${ACCUWEATHER_API_URL}currentconditions/v1/${this.state.locationId}?apikey=${ACCUWEATHER_API_KEY}`)

            this.setState({
                temperature: {
                    value: data[0].Temperature.Metric.Value,
                    text: data[0].WeatherText,
                    icon: data[0].WeatherIcon,
                }
            })
        } catch (error) {
            this.setState({ errorMessage: "Sorry, we find the temperature for this city" })
        }
    }

    render() {
        return (
            <div>
                <Head>
                    <title>Weather</title>
                </Head>
                <div className="bg-gray-200 max-w-2xl mx-auto my-12 p-6 rounded-lg shadow-lg">
                    <form className="w-full" onSubmit={this.handleSubmit}>
                        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                placeholder="Search by city"
                                aria-label="Search by city"
                                onChange={this.handleChange}
                                value={this.state.searchText}
                            />
                            <button
                                type="button"
                                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                                disabled={this.state.loading}
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {this.state.errorMessage &&
                        <div className="py-4">
                            <p>{this.state.errorMessage}</p>
                        </div>
                    }

                    {this.state.temperature.value &&
                        <div className="py-4">
                            <div className="flex items-center">
                                <span className="text-3xl font-bold">{this.state.temperature.text}</span>
                                <img src={`/images/${this.state.temperature.icon}.png`} alt="" className="ml-1 w-12" />
                            </div>
                            <span className="text-xl">{this.state.temperature.value}°C</span>
                        </div>
                    }
                </div>
            </div>
        );
    }
}