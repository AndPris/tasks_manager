export function validateForm(form) {
    const description = form.description.value;
    const finishDate = form.finishDate.value;

    if (!description)
        throw "You must enter description!";

    if (!finishDate)
        throw "You must enter finish date!";

    if (finishDate < new Date().setHours(0, 0, 0, 0))
        throw "Finish date must be not earlier than current date!";
}