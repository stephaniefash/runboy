import ReactStopwatch from "react-stopwatch";
import React from "react";

export const  Stopwatch = () => (
    <ReactStopwatch
        seconds={0}
        limit="00:01:00"
        onCallback={() => {}}
        render={({ seconds }) => {
            return (
                <div>
                    <p>
                        {seconds * 5}
                    </p>
                </div>
            );
        }}
    />
);
