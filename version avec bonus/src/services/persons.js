import axios from "axios"



const baseUrl = "//localhost:3001/persons"

const markPersisted = entity => ({ ...entity, status: "persisted" })
const markPending = entity => ({ ...entity, status: "pending" })

const getAll = () => {
  return axios
    .get(baseUrl)
    .then(response => response.data.map(markPersisted))
}

const create = (personPayload) => {
  return axios
    .post(baseUrl, personPayload)
    .then(response => markPersisted(response.data))
    .then(entity => {
      const delayedPromise = new Promise((resolve) => {
        const resolver = () => resolve(entity)
        setTimeout(resolver, 1000)
      })
      return delayedPromise
    })
}

const remove = (person) => {
  const url = `${baseUrl}/${person.id}`
  return axios
    .delete(url)
}

const update = (person, payload) => {
  const url = `${baseUrl}/${person.id}`
  return axios
    .put(url, payload)
    .then(response => markPersisted(response.data))
}

const PersonsAPI = {
  markPending,
  getAll,
  create,
  remove,
  update
}

export default PersonsAPI