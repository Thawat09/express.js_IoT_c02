function clickFn(event) {
    const checkbox = event.currentTarget;
    checkbox.value = checkbox.checked ? 'on' : 'off';
    event.currentTarget.closest('form').submit()
}