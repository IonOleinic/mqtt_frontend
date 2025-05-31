function useOptionTemplate() {
  const selectedOptionTemplate = (option, props) => {
    if (option) {
      return (
        <div className='dropdown-template'>
          {option.icon}
          <div className='dropdown-template-name'>{option.name}</div>
        </div>
      )
    }
    return <span>{props.placeholder}</span>
  }

  const optionTemplate = (option) => {
    return (
      <div className='dropdown-template'>
        {option.icon}
        <div className='dropdown-template-name'>{option.name}</div>
      </div>
    )
  }
  return { selectedOptionTemplate, optionTemplate }
}

export default useOptionTemplate
