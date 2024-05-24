
function Button({ onClick, children}) {
    return (
        <button onClick={(e) => {
            // e.stopPropagation();
            onClick();
        }}>{children}</button>
    );
}

export default function Toolbar({ onPlayMovie, onUploadImage }) {
    return (
        <div onClickCapture={() => alert('You clicked on the toolbar!')}>
            <Button onClick={onPlayMovie}>Play Movie</Button>
            <Button onClick={onUploadImage}>Upload Image</Button>
        </div>
    );
}
