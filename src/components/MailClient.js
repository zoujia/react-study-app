import { useState } from "react";

const letters = [{
        id: 0,
        subject: 'Ready for adventure?',
        isStarred: true,
    }, {
        id: 1,
        subject: 'Time to check in!',
        isStarred: false,
    }, {
        id: 2,
        subject: 'Festival Begins in Just SEVEN Days!',
        isStarred: false,
    }
];

function Letter({letter, isSelected, onToggle}) {
    return (
        <li className={
            isSelected ? 'selected' : ''
        }>
            <label>
                <input
                    type="checkbox"
                    value={letter.id}
                    checked={isSelected}
                    onChange={() => onToggle(letter.id)}
                />
                {letter.subject}
            </label>
        </li>
    );
}

export default function MailClient() {
    // Solution-1: using Array
    // const [selectedIds, setSelectedIds] = useState([]);
    // const selectedCount = selectedIds.length;
    
    // Solution-2: using Set
    const [selectedIds, setSelectedIds] = useState(new Set());
    const selectedCount = selectedIds.size;

    function handleToggle(toggleId) {
        // Solution-1: using Array
        // if (selectedIds.includes(toggleId)) {
        //     // delete already exists
        //     setSelectedIds(selectedIds.filter(id => id !== toggleId));
        // }
        // else {
        //     // append new selected
        //     setSelectedIds([
        //         ...selectedIds,
        //         toggleId
        //     ]);
        // }

        // Solution-2: using Set
        const newIds = new Set(selectedIds);
        if (newIds.has(toggleId)) {
            newIds.delete(toggleId);
        }
        else {
            newIds.add(toggleId);
        }
        setSelectedIds(newIds);
    }

    return (
        <div>
            <h2>Inbox</h2>
            <ul>
                {letters.map(letter => (
                    <Letter
                        key={letter.id}
                        letter={letter}
                        isSelected={
                            // selectedIds.includes(letter.id)
                            selectedIds.has(letter.id)
                        }
                        onToggle={handleToggle}
                    />
                ))}
            </ul>
            <p>
                <strong>
                    You selected {selectedCount} letters
                </strong>
            </p>
        </div>
    );
}
