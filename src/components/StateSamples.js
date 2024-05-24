import { useState } from "react";
import { useImmer } from "use-immer";

function NestedStateWithImmerSample() {
    const [person, updatePerson] = useImmer({
        name: 'Niki de Saint Phalle',
        artwork: {
            title: 'Blue Nana',
            city: 'Hamburg',
            image: 'https://i.imgur.com/Sd1AgUOm.jpg'
        }
    });

    function handleNameChange(e) {
        updatePerson(draft => {
            draft.name = e.target.value;
        });
    }

    function handleTitleChange(e) {
        updatePerson(draft => {
            draft.artwork.title = e.target.value;
        });
    }

    function handleCityChange(e) {
        updatePerson(draft => {
            draft.artwork.city = e.target.value;
        });
    }

    function handleImageChange(e) {
        updatePerson(draft => {
            draft.artwork.image = e.target.value;
        });
    }

    return (
        <>
            <div>
                <label>Name: </label>
                <input
                    value={person.name}
                    onChange={handleNameChange}
                />
            </div>
            <div>
                <label>Title: </label>
                <input
                    value={person.artwork.title}
                    onChange={handleTitleChange}
                />
            </div>
            <div>
                <label>City: </label>
                <input
                    value={person.artwork.city}
                    onChange={handleCityChange}
                />
            </div>
            <div>
                <label>Image: </label>
                <input
                    value={person.artwork.image}
                    onChange={handleImageChange}
                />
            </div>
            <p>
                <i>{person.artwork.title}</i>
                {' by '}
                {person.name}
                <br/>
                (located at {person.artwork.city})
            </p>
            <div>
                <img
                    src={person.artwork.image}
                    alt={person.artwork.title}
                />
            </div>
        </>
    );
}

function NestedStateSample() {
    const [person, setPerson] = useState({
        name: 'Niki de Saint Phalle',
        artwork: {
            title: 'Blue Nana',
            city: 'Hamburg',
            image: 'https://i.imgur.com/Sd1AgUOm.jpg'
        }
    });

    function handleNameChange(e) {
        setPerson({
            ...person,
            name: e.target.value
        });
    }

    function handleTitleChange(e) {
        setPerson({
            ...person,
            artwork: {
                ...person.artwork,
                title: e.target.value
            }
        });
    }

    function handleCityChange(e) {
        setPerson({
            ...person,
            artwork: {
                ...person.artwork,
                city: e.target.value
            }
        });
    }

    function handleImageChange(e) {
        setPerson({
            ...person,
            artwork: {
                ...person.artwork,
                image: e.target.value
            }
        });
    }

    return (
        <>
            <div>
                <label>Name: </label>
                <input
                    value={person.name}
                    onChange={handleNameChange}
                />
            </div>
            <div>
                <label>Title: </label>
                <input
                    value={person.artwork.title}
                    onChange={handleTitleChange}
                />
            </div>
            <div>
                <label>City: </label>
                <input
                    value={person.artwork.city}
                    onChange={handleCityChange}
                />
            </div>
            <div>
                <label>Image: </label>
                <input
                    value={person.artwork.image}
                    onChange={handleImageChange}
                />
            </div>
            <p>
                <i>{person.artwork.title}</i>
                {' by '}
                {person.name}
                <br/>
                (located at {person.artwork.city})
            </p>
            <div>
                <img
                    src={person.artwork.image}
                    alt={person.artwork.title}
                />
            </div>
        </>
    );
}

function ObjectStateSample() {
    const [person, setPerson] = useState({
        firstName: 'Barbara',
        lastName: 'Hepworth',
        email: 'bhepworth@sculpture.com'
    });

    function handleChange(e) {
        setPerson({
            ...person,
            [e.target.name]: e.target.value
        });
    }

    return (
        <>
            <div>
                <label htmlFor="first_name">First name: </label>
                <input
                    name="firstName"
                    id="first_name"
                    value={person.firstName}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="last_name">Last name: </label>
                <input
                    name="lastName"
                    id="last_name"
                    value={person.lastName}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="email">Email: </label>
                <input
                    name="email"
                    id="email"
                    value={person.email}
                    onChange={handleChange}
                />
            </div>
            <p>
                {person.firstName}{' '}
                {person.lastName}{' '}
                {person.email}
            </p>
        </>
    );
}

function ProfileEditor() {
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('Jane');
    const [lastName, setLastName] = useState('Jacobs');

    function handleFormSubmit(e) {
        e.preventDefault();
        setIsEditing(!isEditing);
    }

    return (
        <div>
            <h2>Profile Editor</h2>
            <form onSubmit={(e) => {handleFormSubmit(e)}}>
                <div>
                    <label>First name: </label>
                    {
                        isEditing ? (
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => {setFirstName(e.target.value)}}
                        />)
                        :
                        (<b>{firstName}</b>)
                    }
                </div>
                <div>
                    <label>Last name: </label>
                    {
                        isEditing ? (
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => {setLastName(e.target.value)}}
                        />)
                        :
                        (<b>{lastName}</b>)
                    }
                </div>
                <div>
                    <button type="submit">
                        {isEditing ? 'Save' : 'Edit'} Profile
                    </button>
                </div>
                <p>
                    Hello, {firstName} {lastName}!
                </p>
            </form>
        </div>
    );
}

export default function StateSamples() {
    return (
        <>
            <ProfileEditor />
            <hr />
            <NestedStateSample />
            <hr />
            <NestedStateWithImmerSample />
            <hr />
            <ObjectStateSample />
        </>
    );
}
