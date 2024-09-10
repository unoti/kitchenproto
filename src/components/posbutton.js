export default function PosButton({ occupiedBy, onClick }) {
    return <>
        {occupiedBy ? <span className="posbtn-here">{occupiedBy.name}</span>
            : <button className="posbtn-go" onClick={onClick}>Go Here</button>
        }

    </>
    
}