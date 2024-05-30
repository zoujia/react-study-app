import { useEffect, useRef, useState } from "react";
import { fetchData } from "../utils/chain-select-api";

// ==

// ==
function sendChatMessage(message) {
    console.log('🔵 You sent: ' + message);
}

function createConnection(serverUrl, roomId) {
    // TODO: A real implementation would actually connect to the server
    return {
        connect () {
            console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
        },
        disconnect () {
            console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
        }
    };
}

const chatServerUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const connection = createConnection(chatServerUrl, roomId);
        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId]);

    function handleSendMessage() {
        sendChatMessage(message);
        setMessage('');
    }

    return (
        <div>
            <h3>Welcome to #{roomId}# room!</h3>
            <div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                /><br/>
                <button disabled={!message} onClick={handleSendMessage}>Send message</button>
            </div>
        </div>
    );
}

function ChatRoomSample() {
    const [roomId, setRoomId] = useState('general');
    const [showChat, setShowChat] = useState(false);

    return (
        <div>
            <h2>Chat room...</h2>
            <div>
                <label>
                    Choose the chat room:{' '}
                    <select
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    >
                        <option value="general">general</option>
                        <option value="travel">travel</option>
                        <option value="music">music</option>
                    </select>
                </label>{' '}
                <button type="button"
                    onClick={() => setShowChat(!showChat)}
                >{showChat ? 'Close' : 'Show'} chat</button>
            </div>
            { showChat && <ChatRoom roomId={roomId} />}
        </div>
    );
}

// ==
function useSelectOption(url) {
    const [list, setList] = useState(null);
    const [selectedId, setSelectedId] = useState('');

    useEffect(() => {
        if (!url) {
            return;
        }

        let ignore = false;
        fetchData(url).then(res => {
            if (!ignore) {
                setList(res);
                setSelectedId(res[0].id);
            }
        });

        return () => ignore = true;
    }, [url]);

    return [list, selectedId, setSelectedId, setList];
}

function ChainSelectSample() {
    // const [planetList, setPlanetList] = useState([]);
    // const [planetId, setPlanetId] = useState('');
    // const [placeList, setPlaceList] = useState([]);
    // const [placeId, setPlaceId] = useState('');

    // useEffect(() => {
    //     let ignore = false;

    //     fetchData('/planets').then(res => {
    //         if (!ignore) {
    //             console.log('Fetched a list of planets.');

    //             setPlanetList(res);
    //             setPlanetId(res[0].id);
    //         }
    //     });

    //     return () => ignore = true;
    // }, []);

    // useEffect(() => {
    //     if (!planetId) {
    //         return;
    //     }

    //     let ignore = false;

    //     fetchData(`/planets/${planetId}/places`).then(res => {
    //         if (!ignore) {
    //             console.log('Fetched a list of places on "' + planetId + '".');
                
    //             setPlaceList(res);
    //             setPlaceId(res[0].id);
    //         }
    //     });

    //     return () => ignore = true;
    // }, [planetId]);

    // Solution-2: custom hook to extract the repetitive code
    const [planetList, planetId, setPlanetId] = useSelectOption('/planets');
    const [placeList, placeId, setPlaceId, setPlaceList] = useSelectOption(planetId ? `/planets/${planetId}/places` : null);

    return (
        <div>
            <h2>Chain select</h2>
            <div>
                <label>
                    Pick a planet:{' '}
                    <select value={planetId} onChange={(e) => {
                        setPlanetId(e.target.value);
                        setPlaceList(null);
                        setPlaceId('');
                    }}>
                        {planetList?.map(planet => (
                            <option key={planet.id} value={planet.id}>{planet.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Pick a place:{' '}
                    <select value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
                        {placeList?.map(place => (
                            <option key={place.id} value={place.id}>{place.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            <p>
                You are going to: {placeId || '???'} on {planetId || '???'}
            </p>
        </div>
    );
}

// ==
function ToggleMovingDotSample() {
    const [canMove, setCanMove] = useState(false);
    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        // Solution-1:
        // function handleMove(e) {
        //     if (canMove) {
        //         setPosition({x: e.clientX, y: e.clientY});
        //     }
        // }

        // window.addEventListener('pointermove', handleMove);
        // return () => window.removeEventListener('pointermove', handleMove);

        // Solution-2:
        function handleMove(e) {
            setPosition({x: e.clientX, y: e.clientY});
        }

        if (canMove) {
            window.addEventListener('pointermove', handleMove);
            return () => window.removeEventListener('pointermove', handleMove);
        }
    }, [canMove]);

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={canMove}
                    onChange={(e) => setCanMove(e.target.checked)}
                />{' '}
                The dot is allowed to move
            </label>
            <div
                style={{
                    position: 'absolute',
                    backgroundColor: 'pink',
                    borderRadius: '50%',
                    opacity: 0.6,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    pointerEvents: 'none',
                    left: -20,
                    top: -20,
                    width: 40,
                    height: 40
                }}
            ></div>
        </div>
    );
}

// ==
// eslint-disable-next-line no-unused-vars
function fetchMockTodoList() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: 'Watch movie-Alien',
                    done: false
                }
            ]);
        }, 2000);
    });
}
function EffectTwiceSamples() {
    const dialogRef = useRef(null);

    useEffect(() => {
        // demo-1: native dialog usage
        // dialogRef.current.showModal();
        // return () => {
        //     dialogRef.current.close();
        // };

        // demo-2: event
        // console.log('>> useEffect, subscribe event listener...');
        // function handleScroll() {
        //     console.log(`> scrollX: ${window.scrollX}, scrollY: ${window.scrollY}`);
        // }
        // window.addEventListener('scroll', handleScroll);
        // return () => {
        //     console.log('>>>> useEffect, when unmount, unsubscribe event listener...');
        //     window.removeEventListener('scroll', handleScroll)
        // };

        // demo-3: fetching data, clean up using boolean flag
        // let ignore = false;
        // async function startFetching() {
        //     console.log('>> useEffect, start fetching...');
        //     const todos = await fetchMockTodoList();
        //     // TIPS: if ignored, don't make a change to the app,
        //     // for example the ui-update, display the data just fetched
        //     if (!ignore) {
        //         console.log('>>>> ✅ continue biz logic with fetched data: ', todos);
        //     }
        // }
        // startFetching();
        // return () => {
        //     console.log('>>>> ❌ useEffect, ignore previous fetching...');
        //     ignore = true;
        // }

        // demo-4: fetch data, clean up using AbortController
        const abortController = new AbortController();
        const fecthData = async () => {
            console.log('>> useEffect, start fetching...');
            setTimeout(async () => {
                try {
                    const res = await fetch('http://localhost:8080/demos/api/demo-todos.php', {
                        signal: abortController.signal
                    });
                    const jsonRes = await res.json();
                    console.log('>>>> ✅ continue biz logic with fetched data: ', jsonRes);
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('>>>> ❌ useEffect, AbortError...');
                    }
                }
            }, 2000);
        };

        fecthData();

        return () => {
            console.log('>>>> ❌ useEffect, ignore previous fetching, by calling abortController.abort()...');
            abortController.abort();
        };

        // TIPS: more about clean up, read this post:
        // https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect
    });

    return (
        <div>
            <h2>Handle Effect run twice in dev-mode, by adding 'cleanup' logic</h2>
            <div>
                <dialog ref={dialogRef}>
                    <p>Hi, here is a dialog</p>
                    <form method="dialog">
                        <button>Close</button>
                    </form>
                </dialog>
            </div>
        </div>
    );
}

// ==
function CountInfiniteLoopSample() {
    // eslint-disable-next-line no-unused-vars
    const [count, setCount] = useState(1);

    // TIP: in useEffect, set state would cause re-render immediately,
    // and then re-call useEffect, and so on...
    // useEffect(() => {
    //     setCount(count + 1);
    // });

    return (
        <div>Count: {count}</div>
    );
}

// ==
function VideoPlayer({src, isPlaying}) {
    const videoRef = useRef(null);

    useEffect(() => {
        // console.log('>> enter VideoPlayer.useEffect...');
        if (isPlaying) {
            videoRef.current.play();
            // console.log('>>>> play...');
        }
        else {
            videoRef.current.pause();
            // console.log('>>>> pause...');
        }

        return () => {
            // TODO: do something cleaning up
            // console.log('❌ running on unmount...');
        }
    }, [isPlaying]);
    
    return (
        <video loop playsInline width="360"
            ref={videoRef}
            src={src}
        />
    );
}

function VideoPlayerSample() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [text, setText] = useState('');

    function handleClick() {
        setIsPlaying(!isPlaying);
    }

    return (
        <div>
            {/* updating text still re-render videoplayer if without effect-dependency: isPlaying */}
            <div style={{marginBottom: '8px'}}>
                Current Text: {text}<br/>
                <input type="text" onChange={e => setText(e.target.value)} />
            </div>
            <div style={{marginBottom: '8px'}}>
                <button
                    type="button"
                    onClick={handleClick}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
            <VideoPlayer
                isPlaying={isPlaying}
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />
        </div>
    );
}

export default function EffectSamples() {
    return (
        <>
            <ChatRoomSample />
            <hr />
            <ChainSelectSample />
            <hr />
            {/* <ToggleMovingDotSample />
            <hr/> */}
            <EffectTwiceSamples />
            <hr />
            <CountInfiniteLoopSample />
            <hr />
            <VideoPlayerSample />
        </>
    );
}
