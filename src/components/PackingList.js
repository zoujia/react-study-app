
function Item({name, isPacked, importance}) {
    return (
        <li className="item">
            {name} {importance > 0 && (<i>(Importance: {importance})</i>)}
        </li>
    );

    // return (
    //     <li className="item">
    //         { isPacked ? (
    //             <del>
    //                 {name + '✔'}
    //             </del>
    //         ) : (name)}
    //     </li>
    // );
    // return (
    //     <li className="item">
    //         {name} {isPacked && '✔'}
    //     </li>
    // );

    // let itemContent = name + '❌';
    // if (isPacked) {
    //     // itemContent = name + '✔';
    //     itemContent = (
    //         <del>
    //             {name + '✔'}
    //         </del>
    //     );
    // }
    // return (
    //     <li className="item">
    //         {itemContent}
    //     </li>
    // );
}

export default function PackingList() {
    return (
        <section>
            <h1>Sally Ride's Packing List</h1>
            <ul>
                <Item name="Space suit" isPacked={true} importance={9} />
                <Item name="Helmet with a golden leaf" isPacked={true} importance={0} />
                <Item name="Photo of Tam" isPacked={false} importance={6} />
            </ul>
        </section>
    );
}
