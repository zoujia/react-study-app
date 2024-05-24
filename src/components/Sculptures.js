import { useState } from "react";
import { sculptureList } from "../utils/mock-data";

export default function Sculptures() {
    const [index, setIndex] = useState(0);
    const [showMore, setShowMore] = useState(false);

    const currentSculpture = sculptureList[index];

    const hasPrev = index > 0;
    const hasNext = index < sculptureList.length - 1;

    function handlePreviousClick() {
        if (hasPrev) {
            setIndex(index - 1);
        }
    }

    function handleNextClick() {
        if (hasNext) {
            setIndex(index + 1);
        }
    }

    function handleMoreClick() {
        setShowMore(!showMore);
    }

    return (
        <>
            <div>
                <button type="button" disabled={!hasPrev} onClick={handlePreviousClick}>Previous</button>
                <button type="button" disabled={!hasNext} onClick={handleNextClick}>Next</button>
            </div>
            <h2>
                <i>{currentSculpture.name}</i>
                by {currentSculpture.artist}
            </h2>
            <h3>
                ({index + 1} of {sculptureList.length})
            </h3>
            <div>
                <button type="button" onClick={handleMoreClick}>
                    {showMore ? 'Hide' : 'Show'} details
                </button>
            </div>
            {showMore && <p>{currentSculpture.description}</p>}
            <div>
                <img
                    src={currentSculpture.url}
                    alt={currentSculpture.name}
                />
            </div>
        </>
    );
}
