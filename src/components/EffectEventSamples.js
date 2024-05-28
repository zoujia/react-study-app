import { useEffect, useState, useRef } from "react";
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { FadeInAnimation } from "../utils/animation";

// TIPS: useEffectEvent is an experimental feature, and not available in stable release,
// so you need to install react@experimental, react-dom@experimental
// to experience this feature.

// ==
function Welcome({ duration }) {
    const welcomeRef = useRef(null);

    const onAppear = useEffectEvent((animation) => {
        animation.start(duration);
    });

    useEffect(() => {
        const animation = new FadeInAnimation(welcomeRef.current);
        onAppear(animation);

        return () => {
            animation.stop();
        };
    }, []);

    return (
        <h2
            ref={welcomeRef}
            style={{
                opacity: 0,
                color: 'white',
                padding: 50,
                textAlign: 'center',
                fontSize: 50,
                backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
            }}
        >
            Welcome
        </h2>
    );
}

function TriggerAnimationSample() {
    const [duration, setDuration] = useState(1000);
    const [show, setShow] = useState(false);

    return (
        <div>
            <div>
                <label>
                    <input
                        type="range"
                        min="100"
                        max="3000"
                        onChange={(e) => setDuration(e.target.value)}
                    /><br/>
                    Fade in duration: {duration}ms
                </label><br/>
                <button type="button" onClick={() => setShow(!show)}>
                    {show ? 'Remove' : 'Show'}
                </button>
            </div>
            { show && <Welcome duration={duration} /> }
        </div>
    );
}

// ==
function AdjustableTimerSample() {
    const [count, setCount] = useState(0);
    const [increment, setIncrement] = useState(1);
    const [delay, setDelay] = useState(100);

    const onTick = useEffectEvent(() => {
        setCount(c => c + increment);
    });

    useEffect(() => {
        const interval = setInterval(() => {
            onTick();
        }, delay);

        return () => clearInterval(interval);
    }, [delay]);

    return (
        <div>
            <h3>Adjustable Timer</h3>
            <div style={{marginBottom: '12px'}}>
                Counter: {count}{' '}
                <button type="button" onClick={() => setCount(0)}>Reset</button>
            </div>
            <div style={{marginBottom: '12px'}}>
                Increment by:{' '}
                <button type="button" disabled={increment <= 1} onClick={() => {
                    setIncrement(increment - 1);
                }}>-</button>{' '}
                {increment}{' '}
                <button type="button" onClick={() => {
                    setIncrement(increment + 1);
                }}>+</button>
            </div>
            <div>
                Increment delay:{' '}
                <button type="button" disabled={delay <= 100} onClick={() => {
                    setDelay(delay - 100);
                }}>- 100ms</button>{' '}
                {delay}{' '}
                <button type="button" onClick={() => {
                    setDelay(delay + 100);
                }}>+ 100ms</button>
            </div>
        </div>
    );
}

// ==
function useTimer(callback, delay, isStop) {
    const onTick = useEffectEvent(() => {
        callback();
    });

    useEffect(() => {
        if (isStop) {
            return;
        }

        const interval = setInterval(() => {
            onTick();
        }, delay);

        return () => clearInterval(interval);
    }, [delay, isStop]);
}

function TimerSample() {
    const [count, setCount] = useState(0);
    const [isStop, setIsStop] = useState(false);

    useTimer(() => {
        setCount(count + 1);
    }, 1000, isStop);

    return (
        <div>
            <h3>Timer: {count}</h3>
            <p>
                <label>
                    <input
                        type="checkbox"
                        checked={isStop}
                        onChange={e => setIsStop(e.target.checked)}
                    />{' '}Stop counting
                </label>
            </p>
        </div>
    );
}

// ==
function showNotification(message, theme) {
    Toastify({
        text: message,
        duration: 2000,
        gravity: 'top',
        position: 'right',
        style: {
            background: theme === 'dark' ? 'black' : 'white',
            color: theme === 'dark' ? 'white' : 'black'
        }
    }).showToast();
}

function createConnection(serverUrl, roomId) {
    // TODO: A real implementation would actually connect to the server
    let connectedCallback;
    let timeout;

    return {
        connect () {
            timeout = setTimeout(() => {
                if (connectedCallback) {
                    connectedCallback();
                }
            }, 100);
        },
        on (event, callback) {
            if (connectedCallback) {
                throw Error('Cannot add the handler twice.');
            }
            if (event !== 'connected') {
                throw Error('Only "connected" event is supported.');
            }

            connectedCallback = callback;
        },
        disconnect() {
            clearTimeout(timeout);
        }
    };
}

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
    const onConnected = useEffectEvent((connectedRoomId) => {
        console.log(`================================= room #${roomId}# connected...`);
        showNotification(`Room #${connectedRoomId}# conncted!`, theme);
    });

    useEffect(() => {
        let timeoutId = null;
        const connection = createConnection(serverUrl, roomId);
        connection.on('connected', () => {
            // onConnected();
            // delay 2s
            timeoutId = setTimeout(() => {
                onConnected(roomId);
            }, 2000);
        });
        connection.connect();

        return () => {
            connection.disconnect();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [roomId]);

    return (
        <h3>Welcome to the #{roomId}# room!</h3>
    );
}

function ChatRoomSample() {
    const [roomId, setRoomId] = useState('general');
    const [isDark, setIsDark] = useState(false);

    return (
        <div>
            <div>
                <label>
                    Choose the chat room: {' '}
                    <select
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    >
                        <option value="general">general</option>
                        <option value="travel">travel</option>
                        <option value="music">music</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        onChange={(e) => setIsDark(e.target.checked)}
                    />{' '}
                    Use dark theme
                </label>
            </div>
            <ChatRoom roomId={roomId} theme={isDark ? 'dark' : 'light'} />
        </div>
    );
}

export default function EffectEventSamples() {
    return (
        <>
            <TriggerAnimationSample />
            <hr />
            <AdjustableTimerSample />
            <hr />
            <TimerSample />
            <hr />
            <ChatRoomSample/>
        </>
    );
}
