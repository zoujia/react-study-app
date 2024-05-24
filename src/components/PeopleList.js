import { getImageUrl } from '../utils';
import { people } from '../utils/mock-data';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
    if (person.profession === 'chemist') {
        chemists.push(person);
    }
    else {
        everyoneElse.push(person);
    }
});

function SectionList({ title, dataList }) {
    return (
        <>
            <h2>{title}</h2>
            <ul>
                {
                    dataList.map(person => 
                        <li key={person.id}>
                            <img
                                src={getImageUrl(person.imageId)}
                                alt={person.name}
                            />
                            <p>
                                <b>{person.name}</b>
                                {' ' + person.profession + ' '}
                                known for {person.accomplishment}
                            </p>
                        </li>
                    )
                }
            </ul>
        </>
    );
}

export default function PeopleList() {
    return (
        <article>
            <h1>Scientists</h1>
            <SectionList title="Chemists" dataList={chemists} />
            <SectionList title="Everyone else" dataList={everyoneElse} />
        </article>
    );
}
