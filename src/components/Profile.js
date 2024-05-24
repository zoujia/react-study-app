import Avatar from "./Avatar";

export default function Profile({ person, imageSize }) {
    return (
        <section className="profile">
            <h2>{person.name}</h2>
            <Avatar person={person} size={imageSize} />
            <ul>
                <li>
                    <b>Profession: </b>
                    {person.profession}
                </li>
                <li>
                    <b>Awards: {person.awards.length} </b>
                    {person.awards.join(', ')}
                </li>
                <li>
                    <b>Discovered: </b>
                    {person.discovery}
                </li>
            </ul>
        </section>
    );
}