import { useEffect, useRef, useState } from "react";

// ==
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
            <h2>Hanle Effect run twice in dev-mode, by adding 'cleanup' logic</h2>
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
            <EffectTwiceSamples />
            <hr />
            <CountInfiniteLoopSample />
            <hr />
            <VideoPlayerSample />
        </>
    );
}
