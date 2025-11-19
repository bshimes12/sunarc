import React, { useState, useEffect } from 'react';
import SunCalc from 'suncalc';
import { format, addDays, startOfDay, setHours, setMinutes } from 'date-fns';
import { Sun, Calendar, MapPin, Clock } from 'lucide-react';
import SunArcViz from './SunArcViz';

const SolarCalculator = () => {
    const [date, setDate] = useState(new Date());
    const [lat, setLat] = useState(40.7128); // Default NY
    const [lng, setLng] = useState(-74.0060);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        calculateSolarData();
    }, [date, lat, lng]);

    const handleLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLng(position.coords.longitude);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setLoading(false);
                }
            );
        } else {
            setLoading(false);
        }
    };

    const calculateSolarData = () => {
        // 1. Calculate Solar Noon for selected date
        const times = SunCalc.getTimes(date, lat, lng);
        const solarNoon = times.solarNoon;

        // 2. Get Sun Altitude at that Solar Noon
        // SunCalc returns radians. Convert to degrees.
        const noonPos = SunCalc.getPosition(solarNoon, lat, lng);
        const noonAltitudeDeg = noonPos.altitude * (180 / Math.PI);

        // 3. Calculate Summer Solstice date
        // If lat > 0 (Northern), Summer Solstice is around June 21.
        // If lat < 0 (Southern), Summer Solstice is around Dec 21.
        const year = date.getFullYear();
        const isNorthern = lat > 0;
        const solsticeDate = new Date(year, isNorthern ? 5 : 11, 21); // June is 5, Dec is 11

        // 4. Find matching time on Solstice
        // We iterate from sunrise to sunset on solstice to find when altitude matches.
        const solsticeTimes = SunCalc.getTimes(solsticeDate, lat, lng);
        let matchingTime = null;
        let minDiff = Infinity;

        // Search range: Sunrise to Solar Noon on Solstice
        // We want the morning time as per example "9AM"
        const start = solsticeTimes.sunrise.getTime();
        const end = solsticeTimes.solarNoon.getTime();
        const step = 60 * 1000; // 1 minute steps

        for (let t = start; t <= end; t += step) {
            const checkDate = new Date(t);
            const pos = SunCalc.getPosition(checkDate, lat, lng);
            const altDeg = pos.altitude * (180 / Math.PI);

            const diff = Math.abs(altDeg - noonAltitudeDeg);
            if (diff < minDiff) {
                minDiff = diff;
                matchingTime = checkDate;
            }
        }

        setResult({
            solarNoon,
            noonAltitudeDeg,
            solsticeDate,
            matchingTime,
            solsticeMaxAlt: (SunCalc.getPosition(solsticeTimes.solarNoon, lat, lng).altitude * 180 / Math.PI)
        });
    };

    return (
        <div className="solar-calculator">
            <div className="controls">
                <div className="input-group">
                    <label><Calendar size={16} /> Date</label>
                    <input
                        type="date"
                        value={format(date, 'yyyy-MM-dd')}
                        onChange={(e) => setDate(new Date(e.target.value))}
                    />
                </div>

                <div className="input-group">
                    <label><MapPin size={16} /> Location</label>
                    <div className="lat-long-inputs">
                        <input
                            type="number"
                            value={lat}
                            onChange={(e) => setLat(parseFloat(e.target.value))}
                            placeholder="Lat"
                            step="0.0001"
                        />
                        <input
                            type="number"
                            value={lng}
                            onChange={(e) => setLng(parseFloat(e.target.value))}
                            placeholder="Lng"
                            step="0.0001"
                        />
                    </div>
                    <button onClick={handleLocation} disabled={loading}>
                        {loading ? 'Locating...' : 'Use My Location'}
                    </button>
                </div>
            </div>

            {result && (
                <div className="results">
                    <div className="result-card current">
                        <h3><Sun size={20} /> Solar Noon Today</h3>
                        <div className="time">{format(result.solarNoon, 'h:mm a')}</div>
                        <div className="details">
                            <span>Altitude: {result.noonAltitudeDeg.toFixed(1)}°</span>
                            <span>Date: {format(date, 'MMM do, yyyy')}</span>
                        </div>
                    </div>

                    <div className="result-card comparison">
                        <h3><Clock size={20} /> Solstice Match</h3>
                        <div className="time">{result.matchingTime ? format(result.matchingTime, 'h:mm a') : 'N/A'}</div>
                        <div className="details">
                            <span>On Summer Solstice ({format(result.solsticeDate, 'MMM do')})</span>
                            <span>the sun is at this height at this time.</span>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <SunArcViz
                    lat={lat}
                    lng={lng}
                    date={date}
                    solsticeDate={result.solsticeDate}
                    noonAltitudeDeg={result.noonAltitudeDeg}
                    matchingTime={result.matchingTime}
                />
            )}
        </div>
    );
};

export default SolarCalculator;
