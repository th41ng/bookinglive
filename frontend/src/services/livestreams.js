import api from './api'

export async function fetchLivestreams(scope = 'open') {
  const params = scope ? { scope } : undefined
  const { data } = await api.get('/livestreams', { params })
  return data.livestreams
}

export async function fetchLivestream(id) {
  const { data } = await api.get(`/livestreams/${id}`)
  return data
}

export async function createLivestream(payload) {
  const { data } = await api.post('/livestreams', payload)
  return data.livestream
}

export async function updateLivestream(id, payload) {
  const { data } = await api.put(`/livestreams/${id}`, payload)
  return data.livestream
}

export async function openLivestream(id) {
  const { data } = await api.patch(`/livestreams/${id}/open`)
  return data.livestream
}

export async function closeLivestream(id) {
  const { data } = await api.patch(`/livestreams/${id}/close`)
  return data.livestream
}

export async function updateSlots(id, slot_per_match) {
  const { data } = await api.patch(`/livestreams/${id}/slots`, { slot_per_match })
  return data.livestream
}

export async function joinQueue(id) {
  const { data } = await api.post(`/livestreams/${id}/join`)
  return data.entry
}

export async function leaveQueue(id) {
  const { data } = await api.delete(`/livestreams/${id}/leave`)
  return data.entry
}

export async function fetchQueue(id) {
  const { data } = await api.get(`/livestreams/${id}/queue`)
  return data
}

export async function finishMatch(id) {
  const { data } = await api.post(`/livestreams/${id}/finish`)
  return data
}

export async function skipPlayer(id) {
  const { data } = await api.post(`/livestreams/${id}/skip`)
  return data.entry
}

export async function removeQueueEntry(livestreamId, entryId) {
  const { data } = await api.delete(`/livestreams/${livestreamId}/queue/${entryId}`)
  return data.entry
}
