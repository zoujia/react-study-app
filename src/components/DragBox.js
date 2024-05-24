import { useState } from "react";
import { useImmer } from "use-immer";

function Background({ position }) {
    return (
        <div style={{
            position: 'absolute',
            transform: `translate(
                ${position.x}px,
                ${position.y}px
            )`,
            width: 250,
            height: 250,
            backgroundColor: 'rgba(200, 200, 0, 0.2)'
        }} />
    );
}

function Box({
    children,
    color,
    position,
    onMove
}) {
    const [lastCoordinates, setLastCoordinates] = useState(null);

    function handlePointerDown(e) {
        e.target.setPointerCapture(e.pointerId);
        setLastCoordinates({
            x: e.clientX,
            y: e.clientY
        });
    }
    
    function handlePointerMove(e) {
        if (lastCoordinates) {
            setLastCoordinates({
                x: e.clientX,
                y: e.clientY
            });

            const dx = e.clientX - lastCoordinates.x;
            const dy = e.clientY - lastCoordinates.y;

            onMove(dx, dy);
        }
    }

    function handlePointerUp() {
        setLastCoordinates(null);
    }

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
                width: 100,
                height: 100,
                cursor: 'grab',
                backgroundColor: color,
                position: 'absolute',
                border: '1px solid black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `translate(
                    ${position.x}px,
                    ${position.y}px
                )`
            }}
        >{children}</div>
    );
}

const initialPostion = {
    x: 0,
    y: 0
};

export default function DragBox() {
    // const [shape, setShape] = useState({
    //     color: 'orange',
    //     position: initialPostion
    // });
    const [shape, updateShape] = useImmer({
        color: 'orange',
        position: initialPostion
    });

    function handleColorChange(e) {
        // setShape({
        //     ...shape,
        //     color: e.target.value
        // });
        updateShape(draft => {
            draft.color = e.target.value;
        });
    }

    function handleMove(dx, dy) {
        // setShape({
        //     ...shape,
        //     position: {
        //         x: shape.position.x + dx,
        //         y: shape.position.y + dy
        //     }
        // });
        updateShape(draft => {
            draft.position.x += dx;
            draft.position.y += dy;
        });
    }

    return (
        <div style={{
            height: 300,
            borderWidth: '1px',
            borderColor: '#ccc',
            borderStyle: 'solid',
            padding: '8px'
        }}>
            <div>
                <select
                    onChange={handleColorChange}
                >
                    <option value="orange">orange</option>
                    <option value="lightpink">lightpink</option>
                    <option value="aliceblue">aliceblue</option>
                </select>
            </div>
            <Background position={initialPostion} />
            <Box color={shape.color} position={shape.position} onMove={handleMove} />
        </div>
    );
}
