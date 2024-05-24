import { useState } from "react";

function Panel({ title, children, onToggle, isActive }) {
    return (
        <section className="panel">
            <h3>{title}</h3>
            {isActive ? (
                <p>{children}</p>
            ) : (<button type="button" onClick={onToggle}>Show</button>)}
        </section>
    );
}

export default function Accordion() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <h2>Almaty, Kazakhstan</h2>
            <Panel
                title="About"
                isActive={activeIndex === 0}
                onToggle={() => setActiveIndex(0) }
            >
                With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
            </Panel>
            <Panel
                title="Etymology"
                isActive={activeIndex === 1}
                onToggle={() => setActiveIndex(1) }
            >
                The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
            </Panel>
        </div>
    );
}
