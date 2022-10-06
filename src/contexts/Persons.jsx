import React, { useEffect, useRef, useState } from 'react'
import PersonsAPI from "services/persons"

const Context = React.createContext(null);


const PersonsProvider = (props) => {
  const [persons, setPersons] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const personsRef = useRef(persons);
  personsRef.current = persons

  const initialLoad = () => {
    PersonsAPI
      .getAll()
      .then((persons) => {
        setPersons(persons)
      })
      .catch((error) => {
        console.warn(error)
      })

  }
  useEffect(initialLoad, [])

  const upsertPerson = (payload) => {
    const foundPerson = persons.find((person) => person.name === payload.name)
    if (foundPerson) {
      return updatePerson(foundPerson, payload)
    }
    createPerson(payload)
  }

  const updatePerson = (existingPerson, payload) => {
    const message = `${existingPerson.number} is already added to phonebook, replace the old number with a new one ?`
    const confirm = window.confirm(message)
    if (!confirm) return

    PersonsAPI
      .update(existingPerson, payload)
      .then(updatedPerson => {
        const newPersons = persons.map((listItem) => {
          if (listItem.id !== existingPerson.id) return listItem
          return updatedPerson
        })
        setPersons(newPersons)
      })
  }

  const createPerson = (payload) => {
    const person = {
      ...payload,
      id: new Date().getTime()
    }
    const pendingPerson = PersonsAPI.markPending(person)
    const newPersonsWithPending = [...persons, pendingPerson]
    setPersons(newPersonsWithPending)

    PersonsAPI
      .create(payload)
      .then(createdPerson => {
        // NOTICE We have to use useRef in order to access a "fresh" version of the persons, not the one accessible 
        // when this callback was generated 
        const newPersons = personsRef.current.map((listItem) => {
          if (listItem.id !== pendingPerson.id) return listItem
          return createdPerson
        })
        setPersons(newPersons)
      })
  }

  const removePerson = (person) => {
    const confirmed = window.confirm("Are you sure ? ")
    if (!confirmed) return

    PersonsAPI
      .remove(person)
      .then(() => {
        const newPersons = persons.filter(listItem => listItem.id !== person.id)
        setPersons(newPersons)
      })
  }

  const changeFilter = (newFilter) => {
    setFilterValue(newFilter);
  }

  const lowerFilter = filterValue.toLowerCase();
  const filteredPersons = persons.filter((person) => {
    const lowerPersonName = person.name.toLowerCase();
    const keep = lowerPersonName.includes(lowerFilter);
    return keep;
  })



  const exposedValue = {
    filteredPersons,
    filterValue,
    upsertPerson,
    changeFilter,
    removePerson,
  }

  return (
    <Context.Provider value={exposedValue}>
      {props.children}
    </Context.Provider>
  )
}

export {
  Context,
  PersonsProvider
}
export default Context
