import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {DateTime} from "luxon";

const notStartedYet = "Not Started Yet";
const timesUp = "Time's Up!";

export default function RoundTimer(props) {
    const calculateTimeLeft = () => {
        if(!props.endDateTime) return notStartedYet;
        const endTime = DateTime.fromISO(props.endDateTime, { zone: 'utc' });

        const remaining = endTime.diffNow();

        return remaining.milliseconds > 0 ? remaining.toFormat("mm:ss") : timesUp;
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
            if(timeLeft === timesUp) {
                props.onRoundEnd(true);
            }
        }, 1000)
    })

    return (<Typography color={timeLeft === timesUp ? 'error' : 'initial'}>{timeLeft}</Typography>)
}