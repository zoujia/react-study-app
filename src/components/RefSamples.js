import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { flushSync } from "react-dom";

// ==
let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
    initialTodos.push({
        id: nextId++,
        text: 'Todo #' + (i + 1)
    });
}

function FlushTodoListSample() {
    const [text, setText] = useState('');
    const [todos, setTodos] = useState(initialTodos);
    const listRef = useRef(null);

    function handleClick() {
        const newTodo = {
            id: nextId++,
            text: text
        }
        // flushSync will update the DOM immediately,
        // and then the listRef.current.lastChild 
        // will point to the newly added todo DOM node
        flushSync(() => {
            setText('');
            setTodos([
                ...todos,
                newTodo
            ]);
        });

        // Scroll to the last added tod
        listRef.current.lastChild.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Add todo"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />{' '}
                <button type="button" onClick={handleClick}>Add</button>
            </div>
            <ul ref={listRef}>
                {todos.map(todo => (
                    <li key={todo.id}>{todo.text}</li>
                ))}
            </ul>
        </div>
    );
}

// ==
const MyInput = forwardRef((props, ref) => {
    // Method-1: return the input directly,
    // it could be modified by parent component, not safe
    // return (
    //     <input type="text" ref={ref} />
    // );

    // Method-2: exposed specific props to the parent
    const realInputRef = useRef(null);
    useImperativeHandle(ref, () => ({
        focus () {
            realInputRef.current.focus();
        },
        setBackgroundColor (color) {
            realInputRef.current.style.backgroundColor = color;
        }
    }));

    return <input type="text" ref={realInputRef} />;
});

function ForwardRefSample() {
    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus();
        // not just focus, modify the input styles; not safe
        // use Method-2, 'style' doesn't belong to the input
        // inputRef.current.style.backgroundColor = '#f00';
        // but we can custom any method to modify the input style like below
        inputRef.current.setBackgroundColor('#f00');
        // with the method-2, here 'inputRef' is not the native input dom node,
        // but a custom object with methods 'focus' and 'setBackgroundColor'...
    }

    return (
        <div>
            <MyInput ref={inputRef} />
            <button type="button" onClick={handleClick}>Focus the input</button>
        </div>
    );
}

// ==
function setupCatList() {
    const catList = [];
    for (let i = 0; i < 10; i++) {
        catList.push('https://loremflickr.com/320/240/cat?lock=' + i);
    }

    return catList;
}

function CatFriends() {
    const [catList, setCatList] = useState(setupCatList);
    const itemsRef = useRef(null);

    function scrollToCat(cat) {
        const map = getMap();
        const catNode = map.get(cat);
        if (catNode) {
            catNode.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    function getMap() {
        if (!itemsRef.current) {
            itemsRef.current = new Map();
        }

        return itemsRef.current;
    }

    return (
        <div>
            <nav className="cat-navs">
                <button type="button" onClick={() => scrollToCat(catList[0])}>Tom</button>
                <button type="button" onClick={() => scrollToCat(catList[5])}>Maru</button>
                <button type="button" onClick={() => scrollToCat(catList[9])}>Jellylorum</button>
            </nav>
            <div>
                <ul className="cat-list">
                    {catList.map((cat, index) => (
                        <li className="cat-item"
                            key={cat}
                            ref={(node) => {
                                const map = getMap();
                                if (node) {
                                    map.set(cat, node);
                                }
                                else {
                                    map.delete(cat);
                                }
                            }}
                        >
                            <span>{index}</span>
                            <img alt="" src={cat} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function RefSamples() {
    return (
        <>
            <FlushTodoListSample />
            <hr/>
            <ForwardRefSample />
            <hr />
            <CatFriends />
        </>
    );
}
