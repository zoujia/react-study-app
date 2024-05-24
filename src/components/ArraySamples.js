import { useState } from "react";
import { useImmer } from "use-immer";

const initialArtists = [
    { id: 0, name: 'Marta Colvin Andrade' },
    { id: 1, name: 'Lamidi Olonade Fakeye'},
    { id: 2, name: 'Louise Nevelson'}
];

function DeleteArtists() {
    const [artists, setArtists]  = useState(initialArtists);

    return (
        <div>
            <h1>Inspiring sculptors:</h1>
            <ul>
                {
                    artists.map(artist => (
                        <li key={artist.id}>
                            {artist.name}{' '}
                            <button
                                onClick={() => {
                                    const filteredArtists = artists.filter(a => a.id !== artist.id);
                                    setArtists(filteredArtists);
                                }}
                            >Delete</button>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

const initialShapes = [
    { id: 0, type: 'circle', x: 50, y: 100 },
    { id: 1, type: 'square', x: 150, y: 100 },
    { id: 2, type: 'circle', x: 250, y: 100 }
];

function ShapeEditor() {
    const [shapes, setShapes] = useState(initialShapes);

    function handleClick() {
        // const newShapes = shapes.slice();
        // newShapes.forEach(shape => {
        //     if (shape.type === 'circle') {
        //         shape.y += 50;
        //     }
        // });
        const newShapes = shapes.map(shape => {
            if (shape.type === 'square') {
                return shape;
            }
            else {
                return {
                    ...shape,
                    y: shape.y + 50
                };
            }
        });

        setShapes(newShapes);
    }

    return (
        <div style={{
            height: 200,
            position:'relative',
            overflow: 'auto',
            backgroundColor: '#f1f1f1',
            padding: '4px'
        }}>
            <button onClick={handleClick}>Move circles down!</button>
            {shapes.map(shape => (
                <div
                    key={shape.id}
                    style={{
                        background: 'purple',
                        position: 'absolute',
                        left: shape.x,
                        top: shape.y,
                        width: 20,
                        height: 20,
                        borderRadius: shape.type === 'circle' ? '50%' : ''
                }} />
            ))}
        </div>
    );
}

const initialCounters = [0, 0, 0];
function CounterList() {
    const [counters, setCounters] = useState(initialCounters);

    function handleIncrementClick(index) {
        const newCounters = counters.map((c, i) => {
            if (i === index) {
                return c + 1;
            }
            else {
                return c;
            }
        });

        setCounters(newCounters);
    }

    return (
        <ul>
            {counters.map((counter, index) => (
                <li key={index}>
                    {counter}{' '}
                    <button onClick={() => handleIncrementClick(index)}>+1</button>
                </li>
            ))}
        </ul>
    );
}

let nextId = 3;
function InsertList() {
    const [name, setName] = useState('');
    const [artists, setArtists] = useState(initialArtists);

    function handleClick() {
        const insertIndex = 1;

        const newArtists = [
            ...artists.slice(0, insertIndex),
            {id: nextId++, name: name},
            ...artists.slice(insertIndex)
        ];

        setArtists(newArtists);
        setName('');
    }

    return (
        <div>
            <div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <button onClick={handleClick}>Insert</button>
            </div>
            <ul>
                {artists.map(a => (
                    <li key={a.id}>{a.name}</li>
                ))}
            </ul>
        </div>
    );
}

const initialArtList = [
    { id: 0, title: 'Big Bellies', seen: false },
    { id: 1, title: 'Lunar Landscape', seen: false },
    { id: 2, title: 'Terracotta Army', seen: true },
];

function ArtItemList({ artworks, onToggle }) {
    return (
        <ul>
            {artworks.map(art => (
                <li key={art.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={art.seen}
                            onChange={e => {
                                onToggle(art.id, e.target.checked);
                            }}
                        />
                        {art.title}
                    </label>
                </li>
            ))}
        </ul>
    );
}

function NestedArtList() {
    // const [myList, setMyList] = useState(initialArtList);
    // const [yourList, setYourList] = useState(initialArtList);
    const [myList, updateMyList] = useImmer(initialArtList);
    const [yourList, updateYourList] = useImmer(initialArtList);

    function handleToggleMyList(artworkId, nextSeen) {
        // Method-1: useState
        // setMyList(myList.map(a => {
        //     if (a.id === artworkId) {
        //         return {...a, seen: nextSeen};
        //     }
        //     else {
        //         return a;
        //     }
        // }));

        // Method-2: useImmer
        updateMyList(draft => {
            const theArt = draft.find(a => a.id === artworkId);
            if (theArt) {
                theArt.seen = nextSeen;
            }
        });
    }

    function handleToggleYourList(artworkId, nextSeen) {
        // setYourList(yourList.map(a => {
        //     if (a.id === artworkId) {
        //         return {...a, seen: nextSeen};
        //     }
        //     else {
        //         return a;
        //     }
        // }));
        updateYourList(draft => {
            const theArt = draft.find(a => a.id === artworkId);
            if (theArt) {
                theArt.seen = nextSeen;
            }
        });
    }

    return (
        <div>
            <h1>Art Bucket List</h1>
            <h2>My list of art to see: </h2>
            <ArtItemList artworks={myList} onToggle={handleToggleMyList} />
            <h2>Your list of art to see: </h2>
            <ArtItemList artworks={yourList} onToggle={handleToggleYourList} />
        </div>
    );
}

export default function ArraySamples() {
    return (
        <div>
            <NestedArtList />
            <hr />
            <InsertList />
            <hr />
            <CounterList />
            <hr />
            <ShapeEditor />
            <hr />
            <DeleteArtists />
        </div>
    );
}
