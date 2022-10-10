import React, { useState, useRef, useEffect } from 'react'

import AddPerson from "components/AddPerson/AddPerson"
import Person from "components/Person/Person"
import FilterPersons from 'components/FilterPersons/FilterPersons'
import PersonsAPI from "services/persons"



const App = () => {

  const [persons, setPersons] = useState([])
  const [filterValue, setFilterValue] = useState('')

  const personsRef = useRef(persons);
  personsRef.current = persons

  const initialLoad = () => {
    PersonsAPI
      .getAll()
      .then(persons => setPersons(persons))
      .catch(error => console.warn(error))
  }
  useEffect(initialLoad, [])

  const upsertPerson = payload => {
    const foundPerson = persons.find(person => person.name === payload.name)
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
      .then(() => setPersons(persons.filter(listItem => listItem.id !== person.id)))
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterPersons filterValue={filterValue} changeFilter={setFilterValue} />
      <h2>Add a new</h2>
      <AddPerson upsertPerson={upsertPerson} />
      <h2>Numbers</h2>
      {filteredPersons.map(person => <Person key={person.id} person={person} removePerson={removePerson} />)}
    </div>
  )

}

export default App