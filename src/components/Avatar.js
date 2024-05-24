import { getImageUrl } from "../utils";

const ratio = window.devicePixelRatio;

export default function Avatar({ person, size }) {
    let thumbnailSize = 's';
    if (size * ratio > 90) {
        thumbnailSize = 'b';
    }

    return (
        <img
            className="avatar"
            src={getImageUrl(person.imageId, thumbnailSize)}
            alt={person.name}
            width={size}
            height={size}
        />
    );
}