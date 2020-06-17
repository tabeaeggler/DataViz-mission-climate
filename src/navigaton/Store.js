import React, { useState } from "react"

export const Context = React.createContext()

const Store = ({ children }) => {
  const [globalNavState, setGlobalNavState] = useState(1)

  return <Context.Provider value={[globalNavState, setGlobalNavState]}>{children}</Context.Provider>
}

export default Store
