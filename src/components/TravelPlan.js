import { useState } from "react";
import { initialTravelPlan } from "../utils/mock-data";
import { useImmer } from "use-immer";

function PlaceTree({ id, parentId, placesById, onComplete }) {
    const place = placesById[id];
    const childIds = place.childIds;

    return (
        <li>
            {place.title}{' '}
            <button type="button"
                onClick={() => {
                    onComplete(parentId, id);
                }}
            >Complete</button>
            {childIds.length > 0 && (
                <ol>
                    {childIds.map(childId => (
                        <PlaceTree
                            key={childId}
                            id={childId}
                            parentId={id}
                            placesById={placesById}
                            onComplete={onComplete}
                        />
                    ))}
                </ol>
            )}
        </li>
    );
}

export default function TravelPlan() {
    const [plan, setPlan] = useState(initialTravelPlan);

    const root = plan[0];
    const planetIds = root.childIds;

    function handleComplete(parentId, childId) {
        const parent = plan[parentId];
        const newParent = {
            ...parent,
            childIds: parent.childIds.filter(c => c !== childId)
        };
        setPlan({
            ...plan,
            [parentId]: newParent
        });
    }

    return (
        <div>
            <h2>Places to visit</h2>
            <ol>
                {planetIds.map(id => (
                    <PlaceTree
                        key={id}
                        id={id}
                        parentId={0}
                        placesById={plan}
                        onComplete={handleComplete}
                    />
                ))}
            </ol>
        </div>
    );
}

export function TravelPlanWithImmer() {
    const [plan, updatePlan] = useImmer(initialTravelPlan);

    const root = plan[0];
    const planetIds = root.childIds;

    function handleComplete(parentId, childId) {
        updatePlan(draft => {
            const parent = draft[parentId];
            parent.childIds = parent.childIds.filter(c => c !== childId);

            deleteAllChildren(childId);
            function deleteAllChildren(id) {
                const childIds = draft[id].childIds;
                childIds.forEach(deleteAllChildren);

                delete(draft[id]);
            }
        });
    }

    return (
        <div>
            <h2>Places to visit(with Immer & improve memory usage)</h2>
            <ol>
                {planetIds.map(id => (
                    <PlaceTree
                        key={id}
                        id={id}
                        parentId={0}
                        placesById={plan}
                        onComplete={handleComplete}
                    />
                ))}
            </ol>
        </div>
    );
}
