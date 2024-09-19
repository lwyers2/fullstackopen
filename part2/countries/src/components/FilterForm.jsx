const FilterForm = (props) => {
return (
    <form>
        <div>
          find countries 
          <input 
          value={props.search}
          onChange={props.handleChange}/> 
        </div>
      </form>
)
}

export default FilterForm