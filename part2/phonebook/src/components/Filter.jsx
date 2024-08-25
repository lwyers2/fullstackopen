const Filter = (props) => {
    return (
        <div>
        filter shown with <input
        value={props.searchName}
        onChange={props.handleSearch}/>
        </div>
    )
}

export default Filter 