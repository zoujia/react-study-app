import { useEffect, useRef, useState } from "react";
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { useFormInput, useOnlineStatus, useOnlineStatus2 } from "../utils/hooks";
import Toastify from 'toastify-js';

// ==
function usePointerPosition() {
    const [position, setPosition] = useState({x: 0, y: 0});
    useEffect(() => {
        function handleMove(e) {
            setPosition({
                x: e.clientX,
                y: e.clientY
            });
        }

        window.addEventListener('pointermove', handleMove);

        return () => window.removeEventListener('pointermove', handleMove);
    }, []);

    return position;
}

function useDelayedValue(value, delay) {
    const [delayedValue, setDelayedValue] = useState(value);

    useEffect(() => {
        setTimeout(() => {
            setDelayedValue(value);
        }, delay);
    }, [value, delay]);

    return delayedValue;
}

function Dot({ position, opacity }) {
    return (
        <div style={{
            position: 'absolute',
            backgroundColor: 'pink',
            borderRadius: '50%',
            opacity,
            transform: `translate(${position.x}px, ${position.y}px)`,
            pointerEvents: 'none',
            left: -20,
            top: -20,
            width: 40,
            height: 40
        }}
        ></div>
    );
}

function StaggeredSample() {
    const pos1 = usePointerPosition();
    const pos2 = useDelayedValue(pos1, 100);
    const pos3 = useDelayedValue(pos2, 200);
    const pos4 = useDelayedValue(pos3, 100);
    const pos5 = useDelayedValue(pos3, 50);

    return (
        <div>
            <h3>Move your cursor to see what happening...</h3>
            <Dot position={pos1} opacity={1} />
            <Dot position={pos2} opacity={0.8} />
            <Dot position={pos3} opacity={0.6} />
            <Dot position={pos4} opacity={0.4} />
            <Dot position={pos5} opacity={0.2} />
        </div>
    );
}

// ==
function useInterval(callback, delay) {
    const onTick = useEffectEvent(callback);
    useEffect(() => {
        const id = setInterval(onTick, delay);
        return () => clearInterval(id);
    }, [delay]);
}

function useCounter(delay) {
    const [count, setCount] = useState(0);

    useInterval(() => {
        setCount(c => c + 1);
    }, delay);

    return count;
}

function IntervalSample() {
    const count = useCounter(1000);
    const headingRef = useRef(null);

    useInterval(() => {
        const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
        headingRef.current.style.backgroundColor = randomColor;
    }, 2000);

    return (
        <h3
            style={{
                padding: '32px 16px',
                borderRadius: '8px',
                border: '2px solid #000'
            }}
            ref={headingRef}
        >Seconds passed: {count}</h3>
    );
}

// ==
function showNotification(message, theme = 'dark') {
    Toastify({
        text: message,
        duration: 2000,
        gravity: 'top',
        position: 'right',
        style: {
            background: theme === 'dark' ? 'black' : 'white',
            color: theme === 'dark' ? 'white' : 'black',
        }
    }).showToast();
}

function createConnection({ serverUrl, roomId }) {
    // A real implementation would actually connect to the server
    if (typeof serverUrl !== 'string') {
        throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
    }
    if (typeof roomId !== 'string') {
        throw Error('Expected roomId to be a string. Received: ' + roomId);
    }

    let intervalId;
    let messageCallback;

    return {
        connect() {
            console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                if (messageCallback) {
                    if (Math.random() > 0.5) {
                        messageCallback('hey')
                    } else {
                        messageCallback('lol');
                    }
                }
            }, 3000);
        },
        disconnect() {
            clearInterval(intervalId);
            messageCallback = null;
            console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
        },
        on(event, callback) {
            if (messageCallback) {
                throw Error('Cannot add the handler twice.');
            }
            if (event !== 'message') {
                throw Error('Only "message" event is supported.');
            }
            messageCallback = callback;
        }
    };
}

function useChatRoom({ roomId, serverUrl, onReceiveMessage }) {
    const onMessage = useEffectEvent(onReceiveMessage);

    useEffect(() => {
        const options = {
            roomId,
            serverUrl
        };

        const connection = createConnection(options);
        connection.on('message', (msg) => {
            onMessage(msg);
        });
        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId, serverUrl]);
}

function ChatRoom({ roomId }) {
    const [serverUrl, setServerUrl] = useState('https://localhost:1234');
    const [isDark, setIsDark] = useState(true);

    useChatRoom({
        roomId: roomId,
        serverUrl: serverUrl,
        onReceiveMessage(newMsg) {
            console.log('>> Received message: ', newMsg);
            showNotification('New message: ' + newMsg, isDark ? 'dark' : 'light');
        }
    });

    return (
        <div>
            <div>
                <label>
                    Server url:{' '}
                    <input
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isDark}
                        onChange={(e) => setIsDark(e.target.checked)}
                    />{' '}
                    Use dark when showing message
                </label>
            </div>
            <h3>Welcome to the #{roomId}# room!</h3>
        </div>
    );
}

function ChatRoomSample() {
    const [roomId, setRoomId] = useState('general');

    return (
        <div>
            <div style={{
                paddingBottom: '8px',
                marginBottom: '16px',
                borderBottom: '1px dashed #ccc'
            }}>
                Choose a chat room:{' '}
                <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                >
                    <option value="general">general</option>
                    <option value="travel">travel</option>
                    <option value="music">music</option>
                </select>
            </div>
            <ChatRoom roomId={roomId} />
        </div>
    );
}

// ==
function FormInputSample() {
    const firstNameProps = useFormInput('Mary');
    const lastNameProps = useFormInput('Poppins');

    return (
        <div>
            <div>
                First Name:{' '}
                <input {...firstNameProps} />
            </div>
            <div>
                Last Name:{' '}
                <input {...lastNameProps} />
            </div>
            <p>
                <strong>Good morning, {firstNameProps.value} {lastNameProps.value}</strong>
            </p>
        </div>
    );
}

// ==

function StatusBar() {
    // const isOnline = useOnlineStatus();
    const isOnline = useOnlineStatus2();
    return <h3>{isOnline ? '✅ Online' : '❌ Disconnected'}</h3>;
}

function SomeSaveButton() {
    // const isOnline = useOnlineStatus();
    const isOnline = useOnlineStatus2();

    function handleSaveClick() {
        console.log('✅ Progress saved');
    }

    return (
        <button
            disabled={!isOnline}
            onClick={handleSaveClick}
        >
            {isOnline ? 'Save progress' : 'Reconnecting...'}
        </button>
    );
}

function OnlineStatusSample() {
    return (
        <div>
            <StatusBar />
            <SomeSaveButton />
        </div>
    );
}

export default function CustomHooksSamples() {
    return (
        <>
            <StaggeredSample />
            <hr />
            <IntervalSample />
            <hr />
            <ChatRoomSample />
            <hr />
            <FormInputSample />
            <hr />
            <OnlineStatusSample />
        </>
    );
}
