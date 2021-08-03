'use strict';
let inMemorySave = {};
const { default: axios } = require('axios')
const colorHandler = (req, res) => {
    let color;
    console.log(req.query.searchQuery)
    console.log('laith');
    let searchQuery = req.query.searchQuery;
    // let url =`https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${process.env.WEATHER_BIT_KEY}`;


    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${process.env.WEATHER_BIT_KEY}`;

    

    axios
    .get(url)
    .then(response => {
        color = response.data;
        let colorArray =color.data.map(obj=>{
        // console.log(obj)

            return new Forcast (obj)
        });
        res.send(colorArray)
    })
   
}
class Forcast{
    constructor(obj){
        this.clouds=obj.clouds
        this.wind_cdir=obj.wind_cdir;
        this.description=obj.weather.description
    }
}

module.exports = colorHandler