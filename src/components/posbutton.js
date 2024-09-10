export default function PosButton({ active, stationName, onClick }) {
    return <>
        {active ? <span className="posbtn-here">(Here)</span>
            : <button className="posbtn-go" onClick={onClick}>Go Here</button>
        }

    </>
    
}