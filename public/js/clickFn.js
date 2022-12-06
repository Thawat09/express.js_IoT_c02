function clickFn(event) {
    const checkbox = event.currentTarget;
    checkbox.value = checkbox.checked ? 'true' : 'false';
    event.currentTarget.closest('form').submit()
}