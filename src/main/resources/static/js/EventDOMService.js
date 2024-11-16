export class EventDOMService {
    getEventDataDuringDragNDrop(info) {
        return  {
            // description: info.event.title,
            finishDate: info.event.startStr,
            // priority: { id: form.priority.value }
        };
    }
}