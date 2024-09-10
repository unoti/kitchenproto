import Station from "./station"

export default function Kitchen() {
    return <>
        <div className="kitchen">
            <h3>Kitchen</h3>
            <div className="station-container">
                <Station />
                <Station />
                <Station />
            </div>
        </div>
    </>
}