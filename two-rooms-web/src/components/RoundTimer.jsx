import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {DateTime} from "luxon";
import {makeStyles} from "@material-ui/core/styles";

const timesUp = "Time's Up!";

export default function RoundTimer(props) {
    const calculateTimeLeft = () => {
        const endTime = DateTime.fromISO(props.endDateTime, { zone: 'utc' });

        const remaining = endTime.diff(DateTime.utc());

        console.log(remaining.toISO(), remaining.minutes, remaining.seconds, remaining);

        return remaining.milliseconds > 0 ? remaining.toFormat("mm:ss") : timesUp;
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000)
    })

    return (<Typography color={timeLeft === timesUp ? 'error' : 'initial'}>{timeLeft}</Typography>)
}