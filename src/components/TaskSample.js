import { createContext, useContext, useReducer, useState } from "react";

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

let nextId = 3;
const initialTasks = [
    {id: 0, text: 'Visit Kafka Museum', done: true},
    {id: 1, text: 'Watch a puppet show', done: false},
    {id: 2, text: 'Lennon Wall pic', done: false}
];

function useTasks() {
    return useContext(TasksContext);
}

function useTasksDispatch() {
    return useContext(TasksDispatchContext);
}

function AddTask({ onAddTask }) {
    const [text, setText] = useState('');

    return (
        <div>
            <input
                placeholder="Add task"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />{' '}
            <button type="button" onClick={() => {
                if (text) {
                    setText('');
                    onAddTask(text);
                }
            }}>Add</button>
        </div>
    );
}

function AddTaskUsingContext() {
    const [text, setText] = useState('');
    // const dispatch = useContext(TasksDispatchContext);
    // use custom hook that wraps TasksDispatchContext
    const dispatch = useTasksDispatch();

    return (
        <div>
            <input
                placeholder="Add task"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />{' '}
            <button type="button" onClick={() => {
                if (text) {
                    setText('');
                    dispatch({
                        type: 'added',
                        id: nextId++,
                        text: text
                    });
                }
            }}>Add</button>
        </div>
    );
}

function Task({ task, onChange, onDelete }) {
    const [isEdit, setIsEdit] = useState(false);

    return (
        <label>
            <input
                type="checkbox"
                checked={task.done}
                onChange={(e) => onChange({
                    ...task,
                    done: e.target.checked
                })}
            />
            {!isEdit ? (task.text) : (
                <input
                    value={task.text}
                    onChange={(e) => {
                        onChange({
                            ...task,
                            text: e.target.value
                        });
                    }}
                />
            )}{' '}
            <button type="button" onClick={() => setIsEdit(!isEdit)}>{isEdit ? 'Save' : 'Edit'}</button>{' '}
            <button type="button" onClick={() => onDelete(task.id)}>Delete</button>
        </label>
    );
}

function TaskList({ tasks, onChangeTask, onDeleteTask }) {
    return (
        <ul>
            {tasks.map(task => (
                <li key={task.id}>
                    <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
                </li>
            ))}
        </ul>
    );
}

function TaskUsingContext({ task }) {
    const [isEdit, setIsEdit] = useState(false);
    // const dispatch = useContext(TasksDispatchContext);
    const dispatch = useTasksDispatch();

    return (
        <label>
            <input
                type="checkbox"
                checked={task.done}
                onChange={(e) => dispatch({
                    type: 'changed',
                    task: {
                        ...task,
                        done: e.target.checked
                    }
                })}
            />
            {!isEdit ? (task.text) : (
                <input
                    value={task.text}
                    onChange={(e) => dispatch({
                        type: 'changed',
                        task: {
                            ...task,
                            text: e.target.value
                        }
                    })}
                />
            )}{' '}
            <button type="button" onClick={() => setIsEdit(!isEdit)}>{isEdit ? 'Save' : 'Edit'}</button>{' '}
            <button
                type="button"
                onClick={() => dispatch({
                    type: 'deleted',
                    id: task.id
                })}
            >Delete</button>
        </label>
    );
}

function TaskListUsingContext() {
    // const tasks = useContext(TasksContext);
    // use custom hook that wraps the TasksContext
    const tasks = useTasks();

    return (
        <ul>
            {tasks.map(task => (
                <li key={task.id}>
                    <TaskUsingContext task={task} />
                </li>
            ))}
        </ul>
    );
}

function taskReducer(tasks, action) {
    switch (action.type) {
        case 'added': {
            return [
                ...tasks,
                {
                    id: action.id,
                    text: action.text,
                    done: false
                }
            ];
        }
        case 'changed': {
            return tasks.map(task => {
                if (task.id === action.task.id) {
                    return action.task;
                }
                else {
                    return task;
                }
            });
        }
        case 'deleted': {
            return tasks.filter(t => t.id !== action.id);
        }
        default: {
            throw new Error('Unknown action: ' + action.type);
        }
    }
}

function TaskProvider({ children }) {
    const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

    return (
        <TasksContext.Provider value={tasks}>
            <TasksDispatchContext.Provider value={dispatch}>
                {children}
            </TasksDispatchContext.Provider>
        </TasksContext.Provider>
    );
}

export function TaskProviderSample() {
    return (
        <TaskProvider>
            <div>
                <h2>Prague itinerary ( with TaskProvider )</h2>
                <AddTaskUsingContext />
                <TaskListUsingContext />
            </div>
        </TaskProvider>
    );
}

export function TaskReducerAndContextSample() {
    const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

    return (
        <TasksContext.Provider value={tasks}>
            <TasksDispatchContext.Provider value={dispatch}>
                <div>
                    <h2>Prague itinerary ( with Reducer & Context )</h2>
                    <AddTaskUsingContext />
                    <TaskListUsingContext />
                </div>
            </TasksDispatchContext.Provider>
        </TasksContext.Provider>
    );
}

export function TaskReducerSample() {
    const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

    function handleAddTask(task) {
        dispatch({
            type: 'added',
            id: nextId++,
            text: task
        });
    }

    function handleChangeTask(task) {
        dispatch({
            type: 'changed',
            task: task
        });
    }

    function handleDeleteTask(taskId) {
        dispatch({
            type: 'deleted',
            id: taskId
        });
    }

    return (
        <div>
            <h2>Prague itinerary ( with useReducer )</h2>
            <AddTask onAddTask={handleAddTask} />
            <TaskList
                tasks={tasks}
                onChangeTask={handleChangeTask}
                onDeleteTask={handleDeleteTask}
            />
        </div>
    );
}

export default function TaskSample() {
    const [tasks, setTasks] = useState(initialTasks);

    function handleAddTask(task) {
        setTasks([
            ...tasks,
            {
                id: nextId++,
                text: task,
                done: false
            }
        ]);
    }

    function handleChangeTask(task) {
        setTasks(tasks.map(t => {
            if (t.id === task.id) {
                return task;
            }
            else {
                return t;
            }
        }));
    }

    function handleDeleteTask(taskId) {
        setTasks(tasks.filter(t => t.id !== taskId));
    }

    return (
        <div>
            <h2>Prague itinerary</h2>
            <AddTask onAddTask={handleAddTask} />
            <TaskList
                tasks={tasks}
                onChangeTask={handleChangeTask}
                onDeleteTask={handleDeleteTask}
            />
        </div>
    );
}
