import { useState } from 'react';


const useInput = (initial, required) => {

    const [value, setValue] = useState(initial)
    const [error, setError] = useState(null)


    return {
        value,
        error,
        onChange: e => setValue(e.target.value),
        reset: () => setValue(initial),
        onBlur: e => {
            if (!e.target.value && required) setError('Required Field')
            else setError(null)
        }
    }

}

export default useInput