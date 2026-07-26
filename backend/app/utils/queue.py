ACTIVE_QUEUE_STATUSES = {"waiting", "playing"}


def normalize_queue_entries(entries, slot_per_match: int):
    active_entries = [entry for entry in entries if entry.status in ACTIVE_QUEUE_STATUSES]
    active_entries.sort(key=lambda entry: (entry.joined_at, entry.id))

    for index, entry in enumerate(active_entries, start=1):
        entry.position = index
        entry.status = "playing" if index <= slot_per_match else "waiting"

    for entry in entries:
        if entry.status not in ACTIVE_QUEUE_STATUSES:
            entry.position = entry.position or len(active_entries) + 1

    return entries


def queue_snapshot(entries):
    active_entries = [entry for entry in entries if entry.status in ACTIVE_QUEUE_STATUSES]
    playing = [entry for entry in active_entries if entry.status == "playing"]
    waiting = [entry for entry in active_entries if entry.status == "waiting"]
    return {
        "entries": entries,
        "playing": playing,
        "waiting": waiting,
    }
